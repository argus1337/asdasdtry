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
  // Try multiple patterns to find subscriber count - more comprehensive approach
  const patterns = [
    // JSON patterns with escaped quotes
    /"subscriberCountText":\s*\{\s*"simpleText":\s*"([^"]+)"/,
    /"subscriberCountText":\s*\{\s*"runs":\s*\[\s*\{\s*"text":\s*"([^"]+)"/,
    /subscriberCountText["\s]*:\s*\{[^}]*simpleText["\s]*:\s*"([^"]+)"/,
    /subscriberCountText["\s]*:\s*\{[^}]*runs["\s]*:\s*\[[^\]]*\{[^}]*text["\s]*:\s*"([^"]+)"/,
    
    // Direct JSON value patterns
    /"subscriberCountText":\s*"([^"]+)"/,
    /"subscriberCount":\s*"([^"]+)"/,
    
    // English patterns
    /(\d+(?:[.,]\d+)?[KMB]?)\s*subscribers/i,
    /(\d+(?:[.,]\d+)?[KMB]?)\s*subscriber/i,
    
    // Russian patterns (тыс = thousand, млн = million)
    /(\d+(?:\s+\d+)?)\s*тыс\.?\s*подписчик/i,
    /(\d+(?:[.,]\d+)?)\s*тыс\.?\s*подписчик/i,
    /(\d+(?:[.,]\d+)?)\s*млн\.?\s*подписчик/i,
    
    // Pattern with space separator (41 тыс)
    /(\d+)\s+тыс/i,
    /(\d+)\s+млн/i,
  ];

  for (const pattern of patterns) {
    const matches = html.matchAll(new RegExp(pattern.source, 'gi'));
    for (const match of matches) {
      if (match && match[1]) {
        let count = match[1].trim();
        
        // Clean up the count - remove all non-numeric except K/M/B and decimal point
        count = count.replace(/\s+/g, ""); // Remove spaces
        
        // Handle Russian format "41 тыс" -> "41K"
        if (html.includes("тыс") && !count.includes("K") && !count.includes("M")) {
          // Check if there's "тыс" nearby in the original match
          const context = match[0];
          if (context.includes("тыс")) {
            count = count + "K";
          }
        }
        
        // Handle Russian format "млн" -> "M"
        if (html.includes("млн") && !count.includes("M")) {
          const context = match[0];
          if (context.includes("млн")) {
            count = count.replace(/[^\d.]/g, "") + "M";
          }
        }
        
        // Remove text suffixes
        count = count.replace(/подписчик.*/i, "");
        count = count.replace(/subscriber.*/i, "");
        count = count.replace(/тыс.*/gi, "");
        count = count.replace(/млн.*/gi, "");
        
        // Normalize decimal separator
        count = count.replace(",", ".");
        
        // Validate we have a number
        if (count.match(/^\d+(\.\d+)?[KMB]?$/i)) {
          return count;
        }
      }
    }
  }

  // More aggressive fallback: search for numbers near subscriber-related text
  const subscriberKeywords = [
    /подписчик/i,
    /subscriber/i,
    /subscriberCount/i,
  ];
  
  for (const keyword of subscriberKeywords) {
    const keywordMatches = Array.from(html.matchAll(keyword));
    for (const keywordMatch of keywordMatches) {
      const startPos = keywordMatch.index || 0;
      const context = html.substring(Math.max(0, startPos - 100), Math.min(html.length, startPos + 200));
      
      // Look for numbers in the context
      const numberPatterns = [
        /(\d+)\s*тыс/i,
        /(\d+(?:[.,]\d+)?)\s*тыс/i,
        /(\d+(?:[.,]\d+)?[KMB]?)/,
      ];
      
      for (const numPattern of numberPatterns) {
        const numMatch = context.match(numPattern);
        if (numMatch && numMatch[1]) {
          let count = numMatch[1].trim();
          if (context.includes("тыс") && !count.includes("K") && !count.includes("M")) {
            count = count.replace(/[^\d.]/g, "") + "K";
          } else if (context.includes("млн") && !count.includes("M")) {
            count = count.replace(/[^\d.]/g, "") + "M";
          }
          count = count.replace(",", ".");
          if (count.match(/^\d+(\.\d+)?[KMB]?$/i)) {
            return count;
          }
        }
      }
    }
  }

  return null;
}

function checkVerified(html: string): { verified: boolean; type: 'standard' | 'music' | 'artist' | null } {
  // 1. Музыкальная верификация (нотка) - проверяем первым, так как это более специфичный тип
  const hasMusicVerification = html.includes('"BADGE_STYLE_TYPE_VERIFIED_MUSIC"') ||
                               html.includes('"musicVerifiedBadge"') ||
                               html.includes('verified_music') ||
                               html.includes('VERIFIED_MUSIC');
  
  if (hasMusicVerification) {
    return { verified: true, type: 'music' };
  }
  
  // 2. Верификация артиста
  const hasArtistVerification = html.includes('"BADGE_STYLE_TYPE_VERIFIED_ARTIST"') ||
                                html.includes('"BADGE_STYLE_TYPE_VERIFIED_ARTIST_MUSIC"') ||
                                html.includes('"artistVerifiedBadge"') ||
                                html.includes('verified_artist') ||
                                html.includes('VERIFIED_ARTIST');
  
  if (hasArtistVerification) {
    return { verified: true, type: 'artist' };
  }
  
  // 3. Стандартная верификация (галка)
  const hasStandardVerification = html.includes('"isVerified":true') || 
                                  (html.includes('"badges"') && html.includes('"BADGE_STYLE_TYPE_VERIFIED"')) ||
                                  html.includes('verification-badge') ||
                                  html.includes('verified-icon') ||
                                  html.includes('yt-icon-verified') ||
                                  html.includes('M9.4 16.6L4.6 12l1.4-1.4 3.6 3.6L18.6 7l1.4 1.4z'); // SVG path для галочки
  
  if (hasStandardVerification) {
    return { verified: true, type: 'standard' };
  }
  
  return { verified: false, type: null };
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
    const verification = checkVerified(html);

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
      verified: verification.verified,
      verificationType: verification.type,
    });
  } catch (error) {
    console.error("Error fetching YouTube channel:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch channel data" },
      { status: 500 }
    );
  }
}
