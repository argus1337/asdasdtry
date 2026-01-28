import { NextRequest, NextResponse } from "next/server";

// Simple in-memory rate limiting (for production, use Redis or similar)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 3; // Max 3 requests per minute per IP

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }

  record.count++;
  return true;
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidYouTubeUrl(url: string): boolean {
  if (!url || url === "Не указан") return true; // Allow empty/placeholder
  
  const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/i;
  return youtubeRegex.test(url);
}

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
    // Check origin/referer to prevent direct API calls
    const origin = request.headers.get("origin");
    const referer = request.headers.get("referer");
    const allowedOrigins = [
      process.env.NEXT_PUBLIC_SITE_URL,
      "http://localhost:3000",
      "https://localhost:3000",
    ].filter(Boolean);

    // Allow requests from same origin or if origin is not set (same-site request)
    const isAllowedOrigin = !origin || allowedOrigins.some(allowed => origin.includes(allowed));
    const isAllowedReferer = !referer || allowedOrigins.some(allowed => referer.includes(allowed));

    if (!isAllowedOrigin && !isAllowedReferer) {
      console.warn("Blocked request from unauthorized origin:", origin, referer);
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { channelUrl, email, name } = body;

    // Validate required fields
    if (!email || !name) {
      return NextResponse.json(
        { error: "Email and name are required" },
        { status: 400 }
      );
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Validate YouTube URL if provided
    if (channelUrl && !isValidYouTubeUrl(channelUrl)) {
      return NextResponse.json(
        { error: "Invalid YouTube URL format" },
        { status: 400 }
      );
    }

    // Validate input length to prevent abuse
    if (email.length > 255 || name.length > 100 || (channelUrl && channelUrl.length > 500)) {
      return NextResponse.json(
        { error: "Input too long" },
        { status: 400 }
      );
    }

    // Get IP address from headers
    const forwarded = request.headers.get("x-forwarded-for");
    const realIp = request.headers.get("x-real-ip");
    const ip = forwarded?.split(",")[0] || realIp || "Unknown";

    // Rate limiting
    if (!checkRateLimit(ip)) {
      console.warn("Rate limit exceeded for IP:", ip);
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

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
    const channelText = channelUrl && channelUrl !== "Не указан"
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
