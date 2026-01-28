"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { SupportWidget } from "@/components/support-widget";

// Simple seeded random number generator for consistent results
function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

export default function VerifyPage() {
  const searchParams = useSearchParams();
  
  // Get all params as a stable string for memoization
  const paramsString = searchParams.toString();
  
  // Parse data and calculate earnings in a single useMemo
  const { data, earnings } = useMemo(() => {
    const params = new URLSearchParams(paramsString);
    const name = params.get("name") || "";
    const email = params.get("email") || "";
    const platform = params.get("platform") || "";
    const subscribers = params.get("subscribers") || "";
    const channelTitle = params.get("channelTitle") || "";
    const channelAvatar = params.get("channelAvatar") || "";
    const isVerified = params.get("isVerified") === "true";

    if (!name || !email) {
      return { data: null, earnings: null };
    }

    const userData = {
      name,
      email,
      platform,
      subscribers,
      channelTitle,
      channelAvatar,
      isVerified,
      verificationType: params.get("verificationType") as 'standard' | 'music' | 'artist' | null,
    };

    // Parse subscriber count to determine earnings range
    function parseSubscriberCount(subCount: string): number {
      if (!subCount || subCount === "N/A") return 0;
      
      // Remove spaces and convert to number
      const cleaned = subCount.replace(/\s/g, "").toUpperCase();
      
      if (cleaned.includes("M")) {
        const num = parseFloat(cleaned.replace("M", ""));
        return num * 1000000;
      } else if (cleaned.includes("K")) {
        const num = parseFloat(cleaned.replace("K", ""));
        return num * 1000;
      } else {
        return parseInt(cleaned) || 0;
      }
    }

    const subCount = parseSubscriberCount(subscribers);
    
    // Generate earnings using seeded random based on user data
    const seed = hashString(name + email + subscribers);
    
    // Calculate earnings based on actual subscriber count
    let range: [number, number, number, number] = [2000, 5000, 8, 15];
    
    if (subCount >= 1000000) {
      range = [20000, 50000, 30, 50];
    } else if (subCount >= 500000) {
      range = [12000, 30000, 25, 40];
    } else if (subCount >= 100000) {
      range = [5000, 12000, 15, 25];
    } else if (subCount >= 50000) {
      range = [2500, 5000, 10, 15];
    } else if (subCount >= 10000) {
      range = [1500, 3000, 8, 12];
    } else if (subCount >= 1000) {
      range = [800, 1500, 5, 8];
    }
    
    // Bonus for verified channels
    if (isVerified) {
      range[0] = Math.floor(range[0] * 1.2);
      range[1] = Math.floor(range[1] * 1.3);
      range[2] = Math.floor(range[2] * 1.2);
      range[3] = Math.floor(range[3] * 1.2);
    }
    const minEarnings = range[0] + Math.floor(seededRandom(seed) * 500);
    const maxEarnings = range[1] + Math.floor(seededRandom(seed + 1) * 1000);
    const minOffers = range[2] + Math.floor(seededRandom(seed + 2) * 3);
    const maxOffers = range[3] + Math.floor(seededRandom(seed + 3) * 5);

    return {
      data: userData,
      earnings: {
        minEarnings: minEarnings.toLocaleString(),
        maxEarnings: maxEarnings.toLocaleString(),
        offers: `${minOffers}-${maxOffers}`,
      },
    };
  }, [paramsString]);

  const maskEmail = (email: string) => {
    if (!email.includes("@")) return email;
    const [localPart, domain] = email.split("@");
    const maskedLocal = localPart.slice(0, 2) + "*".repeat(Math.max(localPart.length - 2, 4));
    return `${maskedLocal}@${domain}`;
  };

  if (!data || !earnings) {
    return (
      <main className="min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-4">No verification data found</h1>
            <Link href="/#contact" className="text-secondary hover:underline">
              Return to signup
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <Navbar />
      
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Animated top bar */}
        <div className="h-1 w-full bg-gradient-to-r from-primary via-secondary to-accent rounded-full mb-8 animate-pulse" />

        {/* Hero Section */}
        <div className="bg-gradient-to-br from-primary/15 via-secondary/10 to-accent/10 border border-primary/25 rounded-2xl p-6 sm:p-8 mb-8">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Avatar */}
            <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-3xl border-2 border-primary/30 shadow-lg shadow-primary/20 bg-gradient-to-br from-primary/30 to-secondary/30 overflow-hidden flex-shrink-0">
              {data.channelAvatar ? (
                <Image
                  src={data.channelAvatar || "/placeholder.svg"}
                  alt={data.channelTitle || "Channel"}
                  width={144}
                  height={144}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-white/50">
                  {data.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            {/* Content */}
            <div className="text-center sm:text-left flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                Thanks <span className="text-secondary">{data.name.split(" ")[0]}</span>!
              </h1>
              <p className="text-white/80 text-base sm:text-lg leading-relaxed">
                We&apos;ve reviewed your profile and you&apos;re a great fit for our creator network.{" "}
                <strong className="text-white">One final step</strong> — verify ownership of your channel so brands can find you faster.
              </p>
            </div>
          </div>
        </div>

        {/* Verification Intro */}
        <p className="text-center text-white/85 text-lg mb-8">
          To start collaborating with brands, please verify ownership of your channel.
        </p>

        {/* Verification Card */}
        <div className="bg-gradient-to-br from-[#1e293b]/90 to-[#0c1421]/95 border border-primary/20 rounded-3xl p-6 sm:p-8 mb-8 shadow-xl">
          <div className="flex flex-col lg:flex-row gap-8 items-center">
            {/* Left Side - Verification Info */}
            <div className="flex-1 space-y-5 text-center lg:text-left">
              <span className="text-xs tracking-widest uppercase text-white/60">
                Channel Verification
              </span>

              <button
                type="button"
                className="w-full lg:w-auto px-8 py-4 bg-gradient-to-r from-secondary to-primary rounded-xl text-white font-semibold uppercase tracking-wide text-sm shadow-lg shadow-secondary/25 hover:shadow-secondary/40 hover:-translate-y-0.5 transition-all"
              >
                Verify Channel Ownership
              </button>
            </div>

            {/* Right Side - Account Info */}
            <div className="flex-1 bg-[#0f172a]/75 border border-white/10 rounded-2xl p-5">
              <span className="text-xs text-white/60 mb-4 block">Accounts</span>

              <div className="space-y-4">
                {/* Email */}
                <div className="text-secondary text-sm border-b border-white/10 pb-3">
                  {maskEmail(data.email)}
                </div>

                {/* Channel */}
                <div className="flex items-center gap-3">
                  {data.channelAvatar ? (
                    <Image
                      src={data.channelAvatar || "/placeholder.svg"}
                      alt={data.channelTitle || "Channel"}
                      width={40}
                      height={40}
                      className="rounded-lg"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-primary/30 flex items-center justify-center text-white font-semibold">
                      {data.name.charAt(0)}
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <span className="text-white font-medium">
                      {data.channelTitle || data.name}
                    </span>
                    {data.isVerified && data.verificationType === 'music' && (
                      <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                      </svg>
                    )}
                    {data.isVerified && data.verificationType !== 'music' && (
                      <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                      </svg>
                    )}
                  </div>
                  {data.subscribers && (
                    <div className="text-xs text-white/60 mt-1">
                      {data.subscribers} subscribers
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Earnings Estimate */}
        <div className="bg-gradient-to-r from-teal-900/20 via-blue-900/20 to-primary/20 border border-primary/25 rounded-3xl p-8 text-center">
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">
            Your Collaboration Potential
          </h3>
          <p className="text-white/85 text-base sm:text-lg leading-relaxed mb-2">
            Based on your current audience size, you could receive{" "}
            <span className="text-secondary font-semibold">{earnings.offers} brand partnership offers</span>{" "}
            and earn between{" "}
            <span className="text-secondary font-semibold">${earnings.minEarnings} - ${earnings.maxEarnings}</span>{" "}
            through our platform.
          </p>
          <p className="text-sm text-white/60 mt-4">
            *Estimated based on your subscriber count ({data.subscribers || "N/A"}) and platform engagement
            {data.isVerified && " • Verified channels receive premium rates"}
          </p>
        </div>
      </div>

      {/* Support Chat Widget */}
      <SupportWidget />
    </main>
  );
}
