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
  // Prioritize patterns that target the main channel, not recommended/related channels
  const patterns = [
    // Main channel metadata - most reliable
    /"channelMetadataRenderer":\s*{\s*"title":\s*"([^"]+)"/,
    // OG meta tag - usually refers to main channel
    /<meta\s+property="og:title"\s+content="([^"]+)"\s*\/?>/,
    // Title tag - extract channel name before " - YouTube"
    /<title>([^<]+)\s*-\s*YouTube<\/title>/,
    // ytInitialData patterns - look for main channel
    /"channelName":\s*"([^"]+)"/,
    // Fallback - but be careful with this one as it might match related channels
    /"name":\s*"([^"]+)"/,
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match && match[1]) {
      const title = match[1].trim();
      // Filter out common non-channel titles
      if (!title.includes('YouTube') && !title.includes('Watch') && title.length > 0) {
        return title;
      }
    }
  }

  return null;
}

function extractSubscriberCount(html: string): string | null {
  // Try multiple patterns to find subscriber count - prioritize main channel data
  const patterns = [
    // Main channel metadata patterns - most reliable
    /"channelMetadataRenderer":\s*\{[^}]*"subscriberCountText":\s*\{\s*"simpleText":\s*"([^"]+)"/,
    /"channelMetadataRenderer":\s*\{[^}]*"subscriberCountText":\s*\{\s*"runs":\s*\[\s*\{\s*"text":\s*"([^"]+)"/,
    
    // JSON patterns with escaped quotes - but prioritize those near channelMetadataRenderer
    /"subscriberCountText":\s*\{\s*"simpleText":\s*"([^"]+)"/,
    /"subscriberCountText":\s*\{\s*"runs":\s*\[\s*\{\s*"text":\s*"([^"]+)"/,
    /subscriberCountText["\s]*:\s*\{[^}]*simpleText["\s]*:\s*"([^"]+)"/,
    /subscriberCountText["\s]*:\s*\{[^}]*runs["\s]*:\s*\[[^\]]*\{[^}]*text["\s]*:\s*"([^"]+)"/,
    
    // Direct JSON value patterns
    /"subscriberCountText":\s*"([^"]+)"/,
    /"subscriberCount":\s*"([^"]+)"/,
    
    // English patterns - but only if near channel header
    /(\d+(?:[.,]\d+)?[KMB]?)\s*subscribers/i,
    /(\d+(?:[.,]\d+)?[KMB]?)\s*subscriber/i,
    
    // Russian patterns (тыс = thousand, млн = million)
    /(\d+(?:\s+\d+)?)\s*тыс\.?\s*подписчик/i,
    /(\d+(?:[.,]\d+)?)\s*тыс\.?\s*подписчик/i,
    /(\d+(?:[.,]\d+)?)\s*млн\.?\s*подписчик/i,
    /(\d+)\s*млн\.?\s*подписчик/i,
    
    // Pattern with space separator (41 тыс, 2 млн)
    /(\d+)\s+тыс/i,
    /(\d+)\s+млн/i,
    // More specific patterns for "2 млн подписчиков"
    /(\d+)\s*млн/i,
  ];

  for (const pattern of patterns) {
    const matches = html.matchAll(new RegExp(pattern.source, 'gi'));
    for (const match of matches) {
      if (match && match[1]) {
        let count = match[1].trim();
        
        // Clean up the count - remove all non-numeric except K/M/B and decimal point
        count = count.replace(/\s+/g, ""); // Remove spaces
        
        // Handle Russian format "41 тыс" -> "41K" and "2 млн" -> "2M"
        // Check if there's "тыс" or "млн" nearby in the original match context
        const matchContext = match[0];
        if (matchContext.includes("млн") && !count.includes("M")) {
          // Handle millions first (2 млн -> 2M)
          const numOnly = count.replace(/[^\d.]/g, "");
          count = numOnly + "M";
        } else if (matchContext.includes("тыс") && !count.includes("K") && !count.includes("M")) {
          // Handle thousands (41 тыс -> 41K)
          const numOnly = count.replace(/[^\d.]/g, "");
          count = numOnly + "K";
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
        /(\d+)\s*млн/i,  // Check for миллионов first
        /(\d+)\s*тыс/i,
        /(\d+(?:[.,]\d+)?)\s*млн/i,
        /(\d+(?:[.,]\d+)?)\s*тыс/i,
        /(\d+(?:[.,]\d+)?[KMB]?)/,
      ];
      
      for (const numPattern of numberPatterns) {
        const numMatch = context.match(numPattern);
        if (numMatch && numMatch[1]) {
          let count = numMatch[1].trim();
          // Prioritize миллионов over тысяч
          if (context.includes("млн") && !count.includes("M")) {
            count = count.replace(/[^\d.]/g, "") + "M";
          } else if (context.includes("тыс") && !count.includes("K") && !count.includes("M")) {
            count = count.replace(/[^\d.]/g, "") + "K";
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
  // Focus on main channel verification, not recommended channels
  // Look for verification badges specifically in channelMetadataRenderer context
  
  // 1. Музыкальная верификация (нотка) - проверяем первым, так как это более специфичный тип
  const musicPatterns = [
    // Main channel music verification
    /"channelMetadataRenderer":\s*\{[^}]*"BADGE_STYLE_TYPE_VERIFIED_MUSIC"/,
    /"channelMetadataRenderer":\s*\{[^}]*"musicVerifiedBadge"/,
    // General music patterns
    /"BADGE_STYLE_TYPE_VERIFIED_MUSIC"/,
    /"musicVerifiedBadge"/,
    /verified_music/i,
    /VERIFIED_MUSIC/,
    /"badgeStyle":"BADGE_STYLE_TYPE_VERIFIED_MUSIC"/,
  ];
  
  for (const pattern of musicPatterns) {
    if (pattern.test(html)) {
      return { verified: true, type: 'music' };
    }
  }
  
  // 2. Верификация артиста
  const artistPatterns = [
    /"channelMetadataRenderer":\s*\{[^}]*"BADGE_STYLE_TYPE_VERIFIED_ARTIST"/,
    /"BADGE_STYLE_TYPE_VERIFIED_ARTIST"/,
    /"BADGE_STYLE_TYPE_VERIFIED_ARTIST_MUSIC"/,
    /"artistVerifiedBadge"/,
    /verified_artist/i,
    /VERIFIED_ARTIST/,
  ];
  
  for (const pattern of artistPatterns) {
    if (pattern.test(html)) {
      return { verified: true, type: 'artist' };
    }
  }
  
  // 3. Стандартная верификация (галка) - проверяем только если нет музыкальной
  // Prioritize main channel verification patterns
  const standardPatterns = [
    // Main channel standard verification - most reliable
    /"channelMetadataRenderer":\s*\{[^}]*"isVerified":\s*true/,
    /"channelMetadataRenderer":\s*\{[^}]*"badgeStyle":"BADGE_STYLE_TYPE_VERIFIED"/,
    /"channelMetadataRenderer":\s*\{[^}]*"BADGE_STYLE_TYPE_VERIFIED"/,
    // General patterns
    /"isVerified":\s*true/,
    /"badgeStyle":"BADGE_STYLE_TYPE_VERIFIED"/,
    /"BADGE_STYLE_TYPE_VERIFIED"/,
  ];
  
  // Check for standard verification
  for (const pattern of standardPatterns) {
    if (pattern.test(html)) {
      // Make sure it's not music or artist
      let isMusicOrArtist = false;
      for (const musicPattern of musicPatterns) {
        if (musicPattern.test(html)) {
          isMusicOrArtist = true;
          break;
        }
      }
      if (!isMusicOrArtist) {
        for (const artistPattern of artistPatterns) {
          if (artistPattern.test(html)) {
            isMusicOrArtist = true;
            break;
          }
        }
      }
      if (!isMusicOrArtist) {
        return { verified: true, type: 'standard' };
      }
    }
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
