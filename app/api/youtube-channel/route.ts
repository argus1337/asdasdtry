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
  console.log("=== extractSubscriberCount START ===");
  // Try multiple patterns to find subscriber count - prioritize main channel data
  // IMPORTANT: Look for patterns that are specifically in the main channel header, not in recommended channels
  const patterns = [
    // Main channel header patterns - most reliable (c4TabbedHeaderRenderer)
    /"c4TabbedHeaderRenderer":\s*\{[^}]*"subscriberCountText":\s*\{\s*"simpleText":\s*"([^"]+)"/,
    /"c4TabbedHeaderRenderer":\s*\{[^}]*"subscriberCountText":\s*\{\s*"runs":\s*\[\s*\{\s*"text":\s*"([^"]+)"/,
    
    // Main channel metadata patterns
    /"channelMetadataRenderer":\s*\{[^}]*"subscriberCountText":\s*\{\s*"simpleText":\s*"([^"]+)"/,
    /"channelMetadataRenderer":\s*\{[^}]*"subscriberCountText":\s*\{\s*"runs":\s*\[\s*\{\s*"text":\s*"([^"]+)"/,
    
    // contentMetadataViewModel structure (from API response)
    /"contentMetadataViewModel":\s*\{[^}]*"metadataParts":\s*\[[^\]]*"text":\s*\{\s*"content":\s*"([^"]*подписчик[^"]+)"/,
    
    // JSON patterns with escaped quotes - but prioritize those near channelMetadataRenderer or c4TabbedHeaderRenderer
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

  for (let i = 0; i < patterns.length; i++) {
    const pattern = patterns[i];
    const matches = html.matchAll(new RegExp(pattern.source, 'gi'));
    for (const match of matches) {
      if (match && match[1]) {
        console.log(`Pattern ${i} matched:`, match[0].substring(0, 100));
        let count = match[1].trim();
        console.log("Extracted count:", count);
        
        // Clean up the count - remove all non-numeric except K/M/B and decimal point
        count = count.replace(/\s+/g, ""); // Remove spaces
        
        // Handle Russian format "41,1 тыс" -> "41.1K" and "2 млн" -> "2M"
        // Check if there's "тыс" or "млн" nearby in the original match context
        const matchContext = match[0];
        console.log("Match context:", matchContext.substring(0, 150));
        
        // Normalize Russian comma separator to dot first
        count = count.replace(",", ".");
        
        if (matchContext.includes("млн") && !count.includes("M")) {
          // Handle millions first (2 млн -> 2M)
          const numOnly = count.replace(/[^\d.]/g, "");
          count = numOnly + "M";
          console.log("Converted to millions:", count);
        } else if (matchContext.includes("тыс") && !count.includes("K") && !count.includes("M")) {
          // Handle thousands (41,1 тыс -> 41.1K)
          const numOnly = count.replace(/[^\d.]/g, "");
          count = numOnly + "K";
          console.log("Converted to thousands:", count);
        }
        
        // Remove text suffixes
        count = count.replace(/подписчик.*/i, "");
        count = count.replace(/subscriber.*/i, "");
        count = count.replace(/тыс.*/gi, "");
        count = count.replace(/млн.*/gi, "");
        
        // Validate we have a number
        if (count.match(/^\d+(\.\d+)?[KMB]?$/i)) {
          console.log("=== extractSubscriberCount RESULT ===", count);
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
  console.log("=== checkVerified START ===");
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
  
  for (let i = 0; i < musicPatterns.length; i++) {
    if (musicPatterns[i].test(html)) {
      console.log(`Music pattern ${i} matched`);
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
  
  for (let i = 0; i < artistPatterns.length; i++) {
    if (artistPatterns[i].test(html)) {
      console.log(`Artist pattern ${i} matched`);
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
  for (let i = 0; i < standardPatterns.length; i++) {
    if (standardPatterns[i].test(html)) {
      console.log(`Standard pattern ${i} matched`);
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
        console.log("=== checkVerified RESULT: STANDARD ===");
        return { verified: true, type: 'standard' };
      }
    }
  }
  
  console.log("=== checkVerified RESULT: NOT VERIFIED ===");
  return { verified: false, type: null };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, debug } = body;
    const debugMode = debug === true;
    const debugInfo: any = {};

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

    // Try to extract ytInitialData JSON first for more accurate parsing
    let ytInitialData: any = null;
    const ytInitialDataMatch = html.match(/var ytInitialData = ({.+?});/s) || 
                               html.match(/window\["ytInitialData"\] = ({.+?});/s) ||
                               html.match(/"ytInitialData":({.+?})/s);
    
    if (ytInitialDataMatch && ytInitialDataMatch[1]) {
      try {
        ytInitialData = JSON.parse(ytInitialDataMatch[1]);
        if (debugMode) {
          debugInfo.ytInitialDataFound = true;
          debugInfo.hasHeader = !!ytInitialData?.header?.c4TabbedHeaderRenderer;
          debugInfo.hasMetadata = !!ytInitialData?.metadata?.channelMetadataRenderer;
        }
        console.log("=== ytInitialData extracted ===");
        console.log("Header exists:", !!ytInitialData?.header?.c4TabbedHeaderRenderer);
        console.log("Metadata exists:", !!ytInitialData?.metadata?.channelMetadataRenderer);
      } catch (e) {
        // If JSON parsing fails, continue with HTML parsing
        if (debugMode) {
          debugInfo.ytInitialDataParseError = String(e);
        }
        console.log("Failed to parse ytInitialData, falling back to HTML parsing");
      }
    } else {
      if (debugMode) {
        debugInfo.ytInitialDataFound = false;
      }
      console.log("=== ytInitialData NOT found in HTML ===");
    }

    // Extract channel data - prioritize ytInitialData if available
    let title: string | null = null;
    let avatar: string | null = null;
    let subscriberCount: string | null = null;
    let verification: { verified: boolean; type: 'standard' | 'music' | 'artist' | null } = { verified: false, type: null };

    if (ytInitialData) {
      // Extract from ytInitialData structure - prioritize main channel header
      try {
        // Extract title from metadata (most reliable)
        if (ytInitialData?.metadata?.channelMetadataRenderer?.title) {
          title = ytInitialData.metadata.channelMetadataRenderer.title;
          console.log("=== Title from ytInitialData.metadata ===", title);
        }
        
        // Extract subscriber count from header (main channel only)
        const header = ytInitialData?.header?.c4TabbedHeaderRenderer;
        if (header) {
          if (debugMode) {
            debugInfo.headerFound = true;
            debugInfo.subscriberCountText = header.subscriberCountText;
            debugInfo.badges = header.badges;
            debugInfo.contentMetadataViewModel = header.contentMetadataViewModel;
          }
          console.log("=== Header found ===");
          console.log("SubscriberCountText:", JSON.stringify(header.subscriberCountText));
          console.log("Badges:", JSON.stringify(header.badges));
          
          // Subscriber count - check multiple possible structures
          if (header.subscriberCountText?.simpleText) {
            subscriberCount = header.subscriberCountText.simpleText;
            if (debugMode) debugInfo.subscriberSource = "simpleText";
            console.log("Subscriber count (simpleText):", subscriberCount);
          } else if (header.subscriberCountText?.runs?.[0]?.text) {
            subscriberCount = header.subscriberCountText.runs[0].text;
            if (debugMode) debugInfo.subscriberSource = "runs";
            console.log("Subscriber count (runs):", subscriberCount);
          } else if (header.contentMetadataViewModel?.metadataParts) {
            // Try contentMetadataViewModel structure (from API response)
            const metadataParts = header.contentMetadataViewModel.metadataParts;
            if (debugMode) debugInfo.metadataParts = metadataParts;
            for (const part of metadataParts) {
              if (part.text?.content && part.text.content.includes("подписчик")) {
                subscriberCount = part.text.content;
                if (debugMode) debugInfo.subscriberSource = "contentMetadataViewModel";
                console.log("Subscriber count (contentMetadataViewModel):", subscriberCount);
                break;
              }
            }
          }
          
          // Avatar
          if (header.avatar?.thumbnails?.[0]?.url) {
            avatar = header.avatar.thumbnails[0].url;
            console.log("Avatar found");
          }
          
          // Verification badges (only from main channel header)
          if (header.badges && Array.isArray(header.badges)) {
            if (debugMode) debugInfo.badgesFound = header.badges.length;
            console.log("Badges array length:", header.badges.length);
            for (const badge of header.badges) {
              const style = badge?.metadataBadgeRenderer?.style;
              if (debugMode) debugInfo.badgeStyles = debugInfo.badgeStyles || [];
              debugInfo.badgeStyles.push(style);
              console.log("Badge style:", style);
              if (style === "BADGE_STYLE_TYPE_VERIFIED_MUSIC") {
                verification = { verified: true, type: 'music' };
                console.log("Verification: MUSIC");
                break;
              } else if (style === "BADGE_STYLE_TYPE_VERIFIED_ARTIST") {
                verification = { verified: true, type: 'artist' };
                console.log("Verification: ARTIST");
                break;
              } else if (style === "BADGE_STYLE_TYPE_VERIFIED") {
                verification = { verified: true, type: 'standard' };
                console.log("Verification: STANDARD");
                break;
              }
            }
          } else {
            if (debugMode) debugInfo.badgesFound = 0;
            console.log("No badges array found in header");
          }
        } else {
          if (debugMode) debugInfo.headerFound = false;
          console.log("=== Header NOT found ===");
        }
      } catch (e) {
        console.log("Error extracting from ytInitialData:", e);
      }
    }

    // Fallback to HTML parsing if ytInitialData extraction failed
    // Only use HTML parsing if we didn't get data from ytInitialData
    if (!title) {
      title = extractChannelTitle(html);
      console.log("=== Title from HTML ===", title);
    }
    if (!avatar) {
      avatar = extractAvatarUrl(html);
      console.log("=== Avatar from HTML ===", avatar ? "Found" : "Not found");
    }
    if (!subscriberCount) {
      subscriberCount = extractSubscriberCount(html);
      console.log("=== Subscriber count from HTML ===", subscriberCount);
    }
    // Only check verification from HTML if we didn't get it from ytInitialData
    if (!verification.verified) {
      verification = checkVerified(html);
      console.log("=== Verification from HTML ===", verification);
    }
    
    console.log("=== FINAL RESULT ===");
    console.log("Title:", title);
    console.log("SubscriberCount:", subscriberCount);
    console.log("Verification:", verification);
    console.log("Avatar:", avatar ? "Found" : "Not found");
    
    // Normalize subscriber count format (handle Russian comma separator)
    if (subscriberCount) {
      // Replace comma with dot for decimal separator
      subscriberCount = subscriberCount.replace(/,/g, ".");
      // Handle Russian format conversion
      if (subscriberCount.includes("тыс") && !subscriberCount.includes("K") && !subscriberCount.includes("M")) {
        const numMatch = subscriberCount.match(/(\d+(?:\.\d+)?)/);
        if (numMatch) {
          subscriberCount = numMatch[1] + "K";
        }
      } else if (subscriberCount.includes("млн") && !subscriberCount.includes("M")) {
        const numMatch = subscriberCount.match(/(\d+(?:\.\d+)?)/);
        if (numMatch) {
          subscriberCount = numMatch[1] + "M";
        }
      }
      // Clean up any remaining text
      subscriberCount = subscriberCount.replace(/[^\d.KMB]/g, "");
    }

    if (!title) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Unable to parse channel data",
          ...(debugMode && { debug: debugInfo })
        },
        { status: 500 }
      );
    }

    const apiResponse: any = {
      success: true,
      title,
      avatar: avatar || "/placeholder-avatar.png",
      subscriberCount: subscriberCount || "N/A",
      verified: verification.verified,
      verificationType: verification.type,
    };

    if (debugMode) {
      apiResponse.debug = {
        ...debugInfo,
        finalTitle: title,
        finalSubscriberCount: subscriberCount,
        finalVerification: verification,
        finalAvatar: avatar ? "Found" : "Not found",
      };
    }

    return NextResponse.json(apiResponse);
  } catch (error) {
    console.error("Error fetching YouTube channel:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch channel data" },
      { status: 500 }
    );
  }
}
