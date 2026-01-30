import { NextResponse } from "next/server";
import { getVerificationDomain, getFullUrl } from "@/lib/verification-domain";

export async function GET() {
  try {
    const domain = await getVerificationDomain();
    const fullUrl = getFullUrl(domain);
    return NextResponse.json({ domain, fullUrl });
  } catch (e) {
    console.error("verification-domain GET:", e);
    return NextResponse.json(
      { error: "Failed to read domain" },
      { status: 500 }
    );
  }
}
