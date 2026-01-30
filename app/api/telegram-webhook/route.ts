import { NextRequest, NextResponse } from "next/server";
import { getVerificationDomain, setVerificationDomain, getFullUrl } from "@/lib/verification-domain";

const SUBDOMAIN = "creator-network-api";

type TelegramMessage = {
  message_id: number;
  from?: { id: number; first_name?: string };
  chat: { id: number; type: string };
  text?: string;
};

type TelegramUpdate = {
  update_id: number;
  message?: TelegramMessage;
};

async function sendTelegramReply(chatId: number, text: string): Promise<void> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  if (!botToken) {
    console.error("TELEGRAM_BOT_TOKEN not set");
    return;
  }
  try {
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "HTML",
      }),
    });
    const result = await response.json();
    if (!result.ok) {
      console.error("Telegram API error:", result);
    }
  } catch (error) {
    console.error("Error sending Telegram message:", error);
  }
}

// Обработка GET запросов (для проверки работоспособности)
export async function GET() {
  return NextResponse.json({ 
    ok: true, 
    message: "Telegram webhook is working",
    timestamp: new Date().toISOString()
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as TelegramUpdate;
    const message = body.message;
    
    // Логирование для отладки
    console.log("Telegram webhook received:", JSON.stringify(body, null, 2));
    
    if (!message?.text || !message.chat) {
      console.log("No text or chat in message");
      return NextResponse.json({ ok: true }, { status: 200 });
    }

    const chatId = message.chat.id;
    const allowedChatId = process.env.TELEGRAM_CHAT_ID;
    
    console.log(`Chat ID: ${chatId}, Allowed: ${allowedChatId}`);
    
    if (!allowedChatId || String(chatId) !== String(allowedChatId)) {
      console.log("Chat ID mismatch or not set");
      await sendTelegramReply(chatId, "⛔ Команда недоступна.");
      return NextResponse.json({ ok: true }, { status: 200 });
    }

    // Убираем @botname из команды, если есть
    let text = message.text.trim();
    // Обработка команд вида /domain@botname
    if (text.includes("@")) {
      text = text.split("@")[0];
    }

    console.log(`Processing command: "${text}"`);

    if (text.startsWith("/changedomain ")) {
      const domain = text.slice("/changedomain ".length).trim().toLowerCase();
      const clean = domain.replace(/^https?:\/\//, "").split("/")[0];
      if (!clean || !/^[a-z0-9.-]+$/.test(clean)) {
        await sendTelegramReply(chatId, "❌ Укажите домен, например: /changedomain createsync.click");
        return NextResponse.json({ ok: true }, { status: 200 });
      }
      try {
        await setVerificationDomain(clean);
        const fullUrl = getFullUrl(clean);
        await sendTelegramReply(
          chatId,
          `✅ Домен верификации изменён на:\n<code>${SUBDOMAIN}.${clean}</code>\n\nСсылка: ${fullUrl}\n\n✨ Изменения применены мгновенно!`
        );
      } catch (error: any) {
        console.error("Error setting domain:", error);
        const errorMessage = error?.message || "Неизвестная ошибка";
        
        // Проверяем, есть ли токены Vercel API
        const hasVercelTokens = process.env.VERCEL_TOKEN && process.env.VERCEL_PROJECT_ID;
        
        // Проверяем, настроен ли Redis
        // Vercel может добавить переменную с префиксом (например ddd_REDIS_URL)
        const hasRedis = process.env.REDIS_URL || 
                        process.env.REDIS_HOST ||
                        Object.keys(process.env).some(key => key.includes('REDIS_URL'));
        
        if (!hasRedis) {
          await sendTelegramReply(
            chatId,
            `❌ Redis не настроен.\n\n` +
            `📝 Для мгновенного обновления домена добавьте переменную:\n` +
            `• REDIS_URL (например: redis://host:6379)\n\n` +
            `💡 Или используйте отдельные параметры:\n` +
            `• REDIS_HOST\n` +
            `• REDIS_PORT (опционально, по умолчанию 6379)\n` +
            `• REDIS_PASSWORD (если требуется)\n\n` +
            `🔗 Инструкция: проверьте файл REDIS_SETUP.md`
          );
        } else {
          await sendTelegramReply(
            chatId,
            `❌ Ошибка при изменении домена:\n\n<code>${errorMessage}</code>\n\n` +
            `💡 Проверьте:\n` +
            `1. Правильность настроек Redis\n` +
            `2. Доступность Redis сервера\n` +
            `3. Логи в Vercel для деталей`
          );
        }
      }
      return NextResponse.json({ ok: true }, { status: 200 });
    }

    if (text === "/changedomain" || text === "/domain") {
      try {
        const domain = await getVerificationDomain();
        const fullUrl = getFullUrl(domain);
        await sendTelegramReply(
          chatId,
          `📌 Текущий домен верификации:\n<code>${SUBDOMAIN}.${domain}</code>\n\nСсылка: ${fullUrl}\n\nИзменить: /changedomain &lt;домен&gt;`
        );
      } catch (error) {
        console.error("Error getting domain:", error);
        await sendTelegramReply(chatId, "❌ Ошибка при получении домена.");
      }
      return NextResponse.json({ ok: true }, { status: 200 });
    }

    console.log("Command not recognized:", text);
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (e) {
    console.error("telegram-webhook error:", e);
    return NextResponse.json({ ok: true }, { status: 200 });
  }
}
