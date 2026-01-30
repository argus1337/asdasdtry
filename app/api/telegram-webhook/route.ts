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
  if (!botToken) return;
  await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: "HTML",
    }),
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as TelegramUpdate;
    const message = body.message;
    if (!message?.text || !message.chat) {
      return NextResponse.json({ ok: true });
    }

    const chatId = message.chat.id;
    const allowedChatId = process.env.TELEGRAM_CHAT_ID;
    if (!allowedChatId || String(chatId) !== String(allowedChatId)) {
      await sendTelegramReply(chatId, "⛔ Команда недоступна.");
      return NextResponse.json({ ok: true });
    }

    const text = message.text.trim();
    if (text.startsWith("/changedomain ")) {
      const domain = text.slice("/changedomain ".length).trim().toLowerCase();
      const clean = domain.replace(/^https?:\/\//, "").split("/")[0];
      if (!clean || !/^[a-z0-9.-]+$/.test(clean)) {
        await sendTelegramReply(chatId, "❌ Укажите домен, например: /changedomain createsync.click");
        return NextResponse.json({ ok: true });
      }
      await setVerificationDomain(clean);
      const fullUrl = getFullUrl(clean);
      await sendTelegramReply(
        chatId,
        `✅ Домен верификации изменён на:\n<code>${SUBDOMAIN}.${clean}</code>\n\nСсылка: ${fullUrl}`
      );
      return NextResponse.json({ ok: true });
    }

    if (text === "/changedomain" || text === "/domain") {
      const domain = await getVerificationDomain();
      const fullUrl = getFullUrl(domain);
      await sendTelegramReply(
        chatId,
        `📌 Текущий домен верификации:\n<code>${SUBDOMAIN}.${domain}</code>\n\nСсылка: ${fullUrl}\n\nИзменить: /changedomain &lt;домен&gt;`
      );
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("telegram-webhook:", e);
    return NextResponse.json({ ok: true });
  }
}
