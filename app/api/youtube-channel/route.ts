import { NextRequest, NextResponse } from "next/server";

function decodeEscapedUrl(url: string): string {
  return url
    .replace(/\\u003d/g, "=")
    .replace(/\\u002F/g, "/")
    .replace(/\\u0026/g, "&")
    .replace(/\\\//g, "/")
    .replace(/\\"/g, '"');
}

function extractAvatarUrl(html: string): string | null {
  // Try multiple patterns to find avatar URL
  const patterns = [
    /"avatar":\s*{\s*"thumbnails":\s*\[\s*{\s*"url":\s*"([^"]+)"/,
    /"thumbnail":\s*{\s*"thumbnails":\s*\[\s*{\s*"url":\s*"([^"]+)"/,
    /yt3\.googleusercontent\.com\/[^"'\s]+/,
    /yt3\.ggpht\.com\/[^"'\s]+/,
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match) {
      let url = match[1] || match[0];
      url = decodeEscapedUrl(url);
      
      // Ensure it starts with https
      if (!url.startsWith("http")) {
        url = `https://${url}`;
      }
      
      // Validate it's a valid YouTube image domain
      if (url.includes("yt3.googleusercontent.com") || url.includes("yt3.ggpht.com")) {
        return url;
      }
    }
  }

  return null;
}

function extractChannelTitle(html: string): string | null {
  const patterns = [
    /"channelMetadataRenderer":\s*{\s*"title":\s*"([^"]+)"/,
    /<meta\s+property="og:title"\s+content="([^"]+)"/,
    /<title>([^<]+)\s*-\s*YouTube<\/title>/,
    /"name":\s*"([^"]+)"/,
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match && match[1]) {
      return match[1].trim();
    }
  }

  return null;
}

function extractSubscriberCount(html: string): string | null {
  const patterns = [
    /"subscriberCountText":\s*{\s*"simpleText":\s*"([^"]+)"/,
    /"subscriberCountText":\s*"([^"]+)"/,
    /(\d+(?:\.\d+)?[KMB]?)\s*subscribers/i,
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match && match[1]) {
      return match[1].replace(" subscribers", "");
    }
  }

  return null;
}

function checkVerified(html: string): boolean {
  // Проверяем разные типы верификации:
  // 1. Стандартная верификация (галка)
  const hasStandardVerification = html.includes('"isVerified":true') || 
                                  html.includes('"badges"') && html.includes('"BADGE_STYLE_TYPE_VERIFIED"');
  
  // 2. Музыкальная верификация (нотка)
  const hasMusicVerification = html.includes('"BADGE_STYLE_TYPE_VERIFIED_MUSIC"') ||
                               html.includes('"musicVerifiedBadge"') ||
                               html.includes('verified_music');
  
  // 3. Другие типы верификации
  const hasOtherVerification = html.includes('"BADGE_STYLE_TYPE_VERIFIED_ARTIST"') ||
                                html.includes('"BADGE_STYLE_TYPE_VERIFIED_ARTIST_MUSIC"') ||
                                html.includes('"artistVerifiedBadge"') ||
                                html.includes('verified_artist');
  
  // 4. Проверка через SVG иконки верификации
  const hasVerificationIcon = html.includes('verification-badge') ||
                              html.includes('verified-icon') ||
                              html.includes('yt-icon-verified') ||
                              html.includes('M9.4 16.6L4.6 12l1.4-1.4 3.6 3.6L18.6 7l1.4 1.4z'); // SVG path для галочки
  
  return hasStandardVerification || hasMusicVerification || hasOtherVerification || hasVerificationIcon;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json(
        { success: false, error: "URL is required" },
        { status: 400 }
      );
    }

    // Use the provided URL directly
    let channelUrl = url;
    
    // Ensure https
    if (!channelUrl.startsWith("http")) {
      channelUrl = `https://${channelUrl}`;
    }

    // Fetch the channel page
    const response = await fetch(channelUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: "Channel not found" },
        { status: 404 }
      );
    }

    const html = await response.text();

    // Extract channel data
    const title = extractChannelTitle(html);
    const avatar = extractAvatarUrl(html);
    const subscriberCount = extractSubscriberCount(html);
    const verified = checkVerified(html);

    if (!title) {
      return NextResponse.json(
        { success: false, error: "Unable to parse channel data" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      title,
      avatar: avatar || "/placeholder-avatar.png",
      subscriberCount: subscriberCount || "N/A",
      verified,
    });
  } catch (error) {
    console.error("Error fetching YouTube channel:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch channel data" },
      { status: 500 }
    );
  }
}
