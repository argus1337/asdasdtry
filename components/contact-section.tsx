"use client";

import React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { CheckCircle, Loader2, Youtube, Instagram } from "lucide-react";

interface ChannelData {
  title: string;
  avatar: string;
  subscribers: string;
  isVerified: boolean;
  verificationType: 'standard' | 'music' | 'artist' | null;
}

const platforms = [
  { id: "tiktok", label: "TikTok", icon: "tiktok", disabled: true, comingSoon: true },
  { id: "instagram", label: "Instagram", icon: "instagram", disabled: true, comingSoon: true },
  { id: "youtube", label: "YouTube", icon: "youtube", disabled: false },
];


function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  );
}

export function ContactSection() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    platform: "",
    channelUrl: "",
    name: "",
    email: "",
    phone: "",
    hasAgency: "",
    hasBrandDeals: "",
  });
  const [channelData, setChannelData] = useState<ChannelData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handlePlatformSelect = (platform: string) => {
    setFormData({ ...formData, platform, channelUrl: "" });
    setChannelData(null);
    setError("");
  };

  const parseYouTubeChannel = async () => {
    if (!formData.channelUrl.trim()) return;

    setIsLoading(true);
    setError("");
    setChannelData(null);

    try {
      // First, parse and validate the URL
      const parseResponse = await fetch("/api/parse-channel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: formData.channelUrl }),
      });

      const parseData = await parseResponse.json();

      if (!parseResponse.ok) {
        setError(parseData.error || "Invalid YouTube URL");
        setIsLoading(false);
        return;
      }

      // Then fetch channel data (add debug=true to see parsing details)
      const channelResponse = await fetch("/api/youtube-channel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: parseData.normalizedUrl, debug: true }),
      });

      const channelInfo = await channelResponse.json();

      if (!channelResponse.ok || !channelInfo.success) {
        setError(channelInfo.error || "Could not fetch channel data");
        setIsLoading(false);
        // Log debug info if available
        if (channelInfo.debug) {
          console.log("=== DEBUG INFO (Error) ===", JSON.stringify(channelInfo.debug, null, 2));
        }
        return;
      }

      // Log debug info if available
      if (channelInfo.debug) {
        console.log("=== DEBUG INFO ===", JSON.stringify(channelInfo.debug, null, 2));
        // Also show in alert for easy viewing on Vercel
        alert("Debug info logged to console. Check browser console (F12) for details.\n\n" + 
              "Subscriber source: " + (channelInfo.debug.subscriberSource || "unknown") + "\n" +
              "Header found: " + (channelInfo.debug.headerFound ? "yes" : "no") + "\n" +
              "Badges found: " + (channelInfo.debug.badgesFound || 0));
      }

      setChannelData({
        title: channelInfo.title,
        avatar: channelInfo.avatar,
        subscribers: channelInfo.subscriberCount,
        isVerified: channelInfo.verified,
        verificationType: channelInfo.verificationType || null,
      });
    } catch {
      setError("Failed to parse channel. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Build query params for verification page
    const params = new URLSearchParams({
      name: formData.name,
      email: formData.email,
      platform: formData.platform,
      subscribers: channelData?.subscribers || "",
      channelTitle: channelData?.title || "",
      channelAvatar: channelData?.avatar || "",
      isVerified: channelData?.isVerified ? "true" : "false",
      verificationType: channelData?.verificationType || "",
    });
    
    // Redirect to verification page
    router.push(`/verify?${params.toString()}`);
  };

  return (
    <section id="contact" className="py-16 lg:py-24 bg-card/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-balance">
            Join the <span className="gradient-text">Creator Network</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Connect with top brands and monetize your content. Apply now to join our exclusive creator network.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Platform Selection */}
          <div>
            <label className="block text-sm font-medium text-white mb-4">
              Select your primary platform
            </label>
            <div className="grid grid-cols-3 gap-4">
              {platforms.map((platform) => (
                <button
                  key={platform.id}
                  type="button"
                  onClick={() => !platform.disabled && handlePlatformSelect(platform.id)}
                  disabled={platform.disabled}
                  className={`flex flex-col items-center justify-center gap-3 p-6 rounded-xl border-2 transition-all relative ${
                    platform.disabled
                      ? "border-border/30 bg-card/20 opacity-50 cursor-not-allowed"
                      : formData.platform === platform.id
                      ? "border-primary bg-primary/10"
                      : "border-border bg-card/50 hover:border-primary/50"
                  }`}
                >
                  {platform.id === "tiktok" && (
                    <TikTokIcon className="w-8 h-8" />
                  )}
                  {platform.id === "instagram" && (
                    <Instagram className="w-8 h-8" />
                  )}
                  {platform.id === "youtube" && (
                    <Youtube className="w-8 h-8" />
                  )}
                  <span className="font-medium">{platform.label}</span>
                  {platform.comingSoon && (
                    <span className="absolute top-2 right-2 text-xs text-purple-400 font-semibold">Coming Soon</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* YouTube Channel URL */}
          {formData.platform === "youtube" && (
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                YouTube Channel URL
              </label>
              <div className="flex gap-3">
                <input
                  type="url"
                  value={formData.channelUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, channelUrl: e.target.value })
                  }
                  className="flex-1 px-4 py-3 bg-input border border-border rounded-xl text-white placeholder:text-white/40 focus:border-primary focus:bg-input/80 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  placeholder="https://youtube.com/@yourchannel"
                />
                <button
                  type="button"
                  onClick={parseYouTubeChannel}
                  disabled={isLoading || !formData.channelUrl}
                  className="px-6 py-3 font-semibold text-white gradient-button rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Checking...
                    </>
                  ) : (
                    "Check Channel"
                  )}
                </button>
              </div>
              {error && (
                <p className="mt-2 text-sm text-red-400">{error}</p>
              )}
              
              {/* Channel Preview Card */}
              {channelData && (
                <div className="mt-4 p-4 bg-card/80 border border-green-500/30 rounded-xl">
                  <div className="flex items-center gap-4">
                    <Image
                      src={channelData.avatar || "/placeholder.svg"}
                      alt={channelData.title}
                      width={64}
                      height={64}
                      className="rounded-full"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-semibold text-white">
                          {channelData.title}
                        </h4>
                        {channelData.isVerified && (
                          <>
                            {(channelData.verificationType === 'music' || channelData.verificationType === 'artist') ? (
                              <svg className="w-4 h-4 text-blue-400 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                              </svg>
                            ) : (
                              <CheckCircle className="w-4 h-4 text-blue-400 flex-shrink-0" />
                            )}
                          </>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {channelData.subscribers} subscribers
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Personal Information */}
          {(formData.platform === "youtube" && channelData) && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-white mb-2"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-input border border-border rounded-xl text-white placeholder:text-white/40 focus:border-primary focus:bg-input/80 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    placeholder="Your full name"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-white mb-2"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-input border border-border rounded-xl text-white placeholder:text-white/40 focus:border-primary focus:bg-input/80 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    placeholder="you@email.com"
                    required
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-white mb-2"
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-input border border-border rounded-xl text-white placeholder:text-white/40 focus:border-primary focus:bg-input/80 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  placeholder="+1 (555) 000-0000"
                  required
                />
              </div>

              {/* Additional Questions */}
              <div>
                <label className="block text-sm font-medium text-white mb-4">
                  Are you currently signed with an agency?
                </label>
                <div className="flex gap-4">
                  {["Yes", "No"].map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, hasAgency: option })
                      }
                      className={`flex-1 px-6 py-3 rounded-xl border-2 font-medium transition-all ${
                        formData.hasAgency === option
                          ? "border-primary bg-primary/10 text-white"
                          : "border-border bg-card/50 text-white/70 hover:border-primary/50"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-4">
                  Have you done brand deals before?
                </label>
                <div className="flex gap-4">
                  {["Yes", "No"].map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, hasBrandDeals: option })
                      }
                      className={`flex-1 px-6 py-3 rounded-xl border-2 font-medium transition-all ${
                        formData.hasBrandDeals === option
                          ? "border-primary bg-primary/10 text-white"
                          : "border-border bg-card/50 text-white/70 hover:border-primary/50"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <div className="text-center pt-4">
                <button
                  type="submit"
                  className="px-12 py-4 text-lg font-semibold text-white gradient-button rounded-xl transition-all"
                >
                  Submit Application
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </section>
  );
}
