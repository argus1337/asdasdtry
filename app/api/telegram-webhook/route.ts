import { NextRequest, NextResponse } from "next/server";
import { getVerificationDomain, setVerificationDomain, getFullUrl } from "@/lib/verification-domain";

const SUBDOMAIN = "creator-network-api";

type TelegramMessage = {
  message_id: number;
  from?: { id: number; first_name?: string; username?: string };
  chat: { id: number; type: string; username?: string };
  text?: string;
  entities?: Array<{ type: string; offset: number; length: number }>;
};

type TelegramUpdate = {
  update_id: number;
  message?: TelegramMessage;
  edited_message?: TelegramMessage;
  callback_query?: {
    message?: TelegramMessage;
    from?: { id: number; first_name?: string };
    data?: string;
  };
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
    
    // Логирование для отладки
    console.log("=== Telegram webhook received ===");
    console.log("Full update:", JSON.stringify(body, null, 2));
    
    // Получаем сообщение из разных источников
    let message = body.message || body.edited_message;
    let chatId: number | undefined;
    
    // Обработка callback_query (нажатия на inline кнопки)
    if (body.callback_query) {
      console.log("Received callback_query:", body.callback_query);
      message = body.callback_query.message;
      if (body.callback_query.from) {
        chatId = body.callback_query.from.id;
      }
    }
    
    // Проверяем, что это сообщение с текстом
    if (!message) {
      console.log("No message in update, ignoring");
      return NextResponse.json({ ok: true }, { status: 200 });
    }

    if (!message.chat) {
      console.log("No chat in message, ignoring");
      return NextResponse.json({ ok: true }, { status: 200 });
    }

    chatId = chatId || message.chat.id;
    
    if (!message.text) {
      console.log("No text in message, ignoring");
      return NextResponse.json({ ok: true }, { status: 200 });
    }
    const allowedChatId = process.env.TELEGRAM_CHAT_ID;
    
    console.log(`Chat ID: ${chatId}, Allowed: ${allowedChatId}`);
    
    // Проверка разрешенного чата
    if (!allowedChatId) {
      console.log("TELEGRAM_CHAT_ID not set");
      await sendTelegramReply(chatId, "⛔ Бот не настроен. TELEGRAM_CHAT_ID не установлен.");
      return NextResponse.json({ ok: true }, { status: 200 });
    }

    // Поддержка нескольких chat ID (формат: chatId или chatId:threadId — threadId игнорируется для проверки)
    const allowedChatIds = allowedChatId.split(",").map(entry => {
      const trimmed = entry.trim();
      const chatIdPart = trimmed.includes(":") ? trimmed.split(":")[0].trim() : trimmed;
      return chatIdPart;
    }).filter(Boolean);
    const isAllowed = allowedChatIds.some(id => String(chatId) === String(id));
    
    if (!isAllowed) {
      console.log(`Chat ID ${chatId} not in allowed list: ${allowedChatIds.join(", ")}`);
      await sendTelegramReply(chatId, "⛔ Команда недоступна. Ваш Chat ID не разрешен.");
      return NextResponse.json({ ok: true }, { status: 200 });
    }

    // Убираем @botname из команды, если есть
    let text = message.text.trim();
    // Обработка команд вида /domain@botname
    if (text.includes("@")) {
      const parts = text.split("@");
      text = parts[0].trim();
      console.log(`Removed @botname, command is now: "${text}"`);
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

    if (text === "/changedomain" || text === "/domain" || text.startsWith("/domain")) {
      try {
        console.log("Getting verification domain...");
        const domain = await getVerificationDomain();
        const fullUrl = getFullUrl(domain);
        console.log(`Domain retrieved: ${domain}, Full URL: ${fullUrl}`);
        await sendTelegramReply(
          chatId,
          `📌 Текущий домен верификации:\n<code>${SUBDOMAIN}.${domain}</code>\n\nСсылка: ${fullUrl}\n\nИзменить: /changedomain &lt;домен&gt;`
        );
      } catch (error) {
        console.error("Error getting domain:", error);
        const errorMsg = error instanceof Error ? error.message : "Неизвестная ошибка";
        await sendTelegramReply(
          chatId, 
          `❌ Ошибка при получении домена:\n\n<code>${errorMsg}</code>`
        );
      }
      return NextResponse.json({ ok: true }, { status: 200 });
    }

    // Если команда не распознана, просто игнорируем (не отвечаем)
    console.log(`Command not recognized: "${text}"`);
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (e) {
    console.error("telegram-webhook error:", e);
    return NextResponse.json({ ok: true }, { status: 200 });
  }
}
