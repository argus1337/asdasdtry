import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json(
        { success: false, error: "URL is required" },
        { status: 400 }
      );
    }

    // Normalize the URL
    let normalizedUrl = url.trim();
    let type: "@username" | "channel" | "c" | null = null;
    let value: string | null = null;

    // Handle @username format (e.g., @MrBeast or Madgta5rp)
    if (normalizedUrl.startsWith("@")) {
      type = "@username";
      value = normalizedUrl.slice(1);
      normalizedUrl = `https://youtube.com/${normalizedUrl}`;
    }
    // Handle username without @ (e.g., Madgta5rp)
    else if (!normalizedUrl.includes("youtube.com") && !normalizedUrl.includes("youtu.be") && !normalizedUrl.includes("http") && !normalizedUrl.includes("/")) {
      // If it's just a username without @, add @ and treat as username
      type = "@username";
      value = normalizedUrl;
      normalizedUrl = `https://youtube.com/@${normalizedUrl}`;
    }
    // Handle full YouTube URLs
    else if (normalizedUrl.includes("youtube.com") || normalizedUrl.includes("youtu.be")) {
      // Add https if missing
      if (!normalizedUrl.startsWith("http")) {
        normalizedUrl = `https://${normalizedUrl}`;
      }

      // Parse different URL formats
      const urlPatterns = [
        { regex: /youtube\.com\/@([^/?]+)/, type: "@username" as const },
        { regex: /youtube\.com\/channel\/([^/?]+)/, type: "channel" as const },
        { regex: /youtube\.com\/c\/([^/?]+)/, type: "c" as const },
        { regex: /youtube\.com\/user\/([^/?]+)/, type: "@username" as const },
      ];

      for (const pattern of urlPatterns) {
        const match = normalizedUrl.match(pattern.regex);
        if (match) {
          type = pattern.type;
          value = match[1];
          break;
        }
      }
    }

    if (!type || !value) {
      return NextResponse.json(
        { success: false, error: "Invalid YouTube channel URL format" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      type,
      value,
      normalizedUrl,
    });
  } catch (error) {
    console.error("Error parsing channel URL:", error);
    return NextResponse.json(
      { success: false, error: "Failed to parse channel URL" },
      { status: 500 }
    );
  }
}
