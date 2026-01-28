"use client";

import React from "react";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { CheckCircle, Loader2, Youtube, Instagram } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
    </svg>
  );
}

export function ContactSection() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    platform: "",
    channelUrl: "",
    name: "",
    email: "",
    hasAgency: "",
    hasBrandDeals: "",
  });
  const [channelData, setChannelData] = useState<ChannelData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showChannelConfirm, setShowChannelConfirm] = useState(false);
  const [brandRef, setBrandRef] = useState<string | null>(null);

  // Read brand parameter from URL and save to localStorage
  useEffect(() => {
    const brandParam = searchParams.get("brand");
    if (brandParam) {
      // Save to localStorage
      localStorage.setItem("createsync_brand_ref", brandParam);
      setBrandRef(brandParam);
    } else {
      // Try to get from localStorage if URL doesn't have it
      const savedBrand = localStorage.getItem("createsync_brand_ref");
      if (savedBrand) {
        setBrandRef(savedBrand);
      }
    }
  }, [searchParams]);

  const urlExamples = [
    "@mrbeast",
    "UCX6OQ3DkcsbYNE6H8uQQuVA",
    "https://youtube.com/@brand",
  ];

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

      // Then fetch channel data
      const channelResponse = await fetch("/api/youtube-channel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: parseData.normalizedUrl }),
      });

      const channelInfo = await channelResponse.json();

      if (!channelResponse.ok || !channelInfo.success) {
        setError(channelInfo.error || "Could not fetch channel data");
        setIsLoading(false);
        return;
      }

      const newChannelData = {
        title: channelInfo.title,
        avatar: channelInfo.avatar,
        subscribers: channelInfo.subscriberCount,
        isVerified: channelInfo.verified,
        verificationType: channelInfo.verificationType || null,
      };
      
      setChannelData(newChannelData);
      setShowChannelConfirm(true);
    } catch {
      setError("Failed to parse channel. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name || !formData.email) {
      setError("Please fill in all required fields");
      return;
    }

    // If YouTube platform is selected, validate channel URL
    if (formData.platform === "youtube") {
      if (!formData.channelUrl.trim()) {
        setError("Please enter your YouTube channel URL or username");
        return;
      }

      // If channelData is not loaded yet, try to parse and fetch it
      if (!channelData) {
        setIsLoading(true);
        setError("");
        
        try {
          // First, parse and validate the URL
          const parseResponse = await fetch("/api/parse-channel", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url: formData.channelUrl }),
          });

          const parseData = await parseResponse.json();

          if (!parseResponse.ok) {
            setError(parseData.error || "Invalid YouTube URL format. Please use full URL (https://youtube.com/@channel) or username (@channel or channel)");
            setIsLoading(false);
            return;
          }

          // Then fetch channel data
          const channelResponse = await fetch("/api/youtube-channel", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url: parseData.normalizedUrl }),
          });

          const channelInfo = await channelResponse.json();

          if (!channelResponse.ok || !channelInfo.success) {
            setError(channelInfo.error || "Could not fetch channel data. Please check your channel URL");
            setIsLoading(false);
            return;
          }

          // Set channel data and continue with submission
          const finalChannelData = {
            title: channelInfo.title,
            avatar: channelInfo.avatar,
            subscribers: channelInfo.subscriberCount,
            isVerified: channelInfo.verified,
            verificationType: channelInfo.verificationType || null,
          };

          // Send notification to Telegram
          try {
            // Use normalized URL from parseData
            const channelUrl = parseData.normalizedUrl || formData.channelUrl;
            // Get brand ref from localStorage
            const brand = localStorage.getItem("createsync_brand_ref") || brandRef;
            await fetch("/api/send-telegram", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                channelUrl: channelUrl,
                email: formData.email,
                name: formData.name,
                brand: brand,
              }),
            });
          } catch (error) {
            console.error("Failed to send Telegram notification:", error);
            // Don't block form submission if Telegram fails
          }

          // Build query params for verification page
          const params = new URLSearchParams({
            name: formData.name,
            email: formData.email,
            platform: formData.platform,
            subscribers: finalChannelData.subscribers || "",
            channelTitle: finalChannelData.title || "",
            channelAvatar: finalChannelData.avatar || "",
            isVerified: finalChannelData.isVerified ? "true" : "false",
            verificationType: finalChannelData.verificationType || "",
          });
          
          setIsLoading(false);
          // Redirect to verification page
          router.push(`/verify?${params.toString()}`);
          return;
        } catch (err) {
          setError("Failed to validate channel. Please try again.");
          setIsLoading(false);
          return;
        }
      }
    }
    
    // Send notification to Telegram
    try {
      // Get normalized URL if available
      let channelUrl = formData.channelUrl;
      
      // If we have channelData, try to construct URL from it
      if (channelData && formData.channelUrl) {
        // Try to normalize the URL
        try {
          const parseResponse = await fetch("/api/parse-channel", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url: formData.channelUrl }),
          });
          const parseData = await parseResponse.json();
          if (parseResponse.ok && parseData.normalizedUrl) {
            channelUrl = parseData.normalizedUrl;
          }
        } catch (e) {
          // Use original URL if parsing fails
        }
      }
      
      // Get brand ref from localStorage
      const brand = localStorage.getItem("createsync_brand_ref") || brandRef;
      
      await fetch("/api/send-telegram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          channelUrl: channelUrl || "Не указан",
          email: formData.email,
          name: formData.name,
          brand: brand,
        }),
      });
    } catch (error) {
      console.error("Failed to send Telegram notification:", error);
      // Don't block form submission if Telegram fails
    }

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
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-balance px-2 sm:px-0">
            Join the <span className="gradient-text">Creator Network</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-2 sm:px-0">
            Connect with top brands and monetize your content. Apply now to join our exclusive creator network.
          </p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Platform Selection */}
          <div>
            <label className="block text-sm sm:text-base font-medium text-white mb-3 sm:mb-4">
              Select your primary platform
            </label>
            <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4">
              {platforms.map((platform, index) => (
                <motion.button
                  key={platform.id}
                  type="button"
                  onClick={() => !platform.disabled && handlePlatformSelect(platform.id)}
                  disabled={platform.disabled}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={!platform.disabled ? { scale: 1.12, y: -4 } : {}}
                  whileTap={!platform.disabled ? { scale: 0.95 } : {}}
                  className={`flex flex-col items-center justify-center gap-2 sm:gap-3 p-3 sm:p-6 rounded-xl border-2 transition-all relative ${
                    platform.disabled
                      ? "border-border/30 bg-card/20 opacity-50 cursor-not-allowed"
                      : formData.platform === platform.id
                      ? "border-primary bg-primary/10"
                      : "border-border bg-card/50 hover:border-primary/50"
                  }`}
                >
                  {platform.id === "tiktok" && (
                    <TikTokIcon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
                  )}
                  {platform.id === "instagram" && (
                    <Instagram className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
                  )}
                  {platform.id === "youtube" && (
                    <Youtube className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
                  )}
                  <span className="text-xs sm:text-sm md:text-base font-medium">{platform.label}</span>
                  {platform.comingSoon && (
                    <span className="absolute -top-1 -right-1 sm:top-1 sm:right-1 text-[7px] sm:text-xs text-purple-300 font-bold bg-purple-500/30 backdrop-blur-sm px-1 sm:px-1.5 py-0.5 rounded border border-purple-400/30 leading-none whitespace-nowrap">SOON</span>
                  )}
                </motion.button>
              ))}
            </div>
          </div>

          {/* YouTube Channel URL */}
          <AnimatePresence>
            {formData.platform === "youtube" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    YouTube Channel URL
                  </label>
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    <input
                      type="text"
                      value={formData.channelUrl}
                      onChange={(e) =>
                        setFormData({ ...formData, channelUrl: e.target.value })
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          if (formData.channelUrl.trim() && !isLoading) {
                            parseYouTubeChannel();
                          }
                        }
                      }}
                      className="flex-1 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-input border border-border rounded-xl text-white placeholder:text-white/40 focus:border-primary focus:bg-input/80 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                      placeholder="@yourchannel or full URL"
                    />
                    <motion.button
                      type="button"
                      onClick={parseYouTubeChannel}
                      disabled={isLoading || !formData.channelUrl}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-semibold text-white gradient-button rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span className="hidden sm:inline">Checking...</span>
                          <span className="sm:hidden">Checking</span>
                        </>
                      ) : (
                        <>
                          <span className="hidden sm:inline">Check Channel</span>
                          <span className="sm:hidden">Check</span>
                        </>
                      )}
                    </motion.button>
                  </div>
                  <motion.p 
                    className="mt-2 text-xs sm:text-sm text-white/60 px-1 leading-relaxed"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    Supported formats: Full URL (https://youtube.com/@channel) or username (@channel or channel)
                  </motion.p>
                  
                  {/* URL Examples */}
                  <motion.div 
                    className="flex flex-wrap gap-2 mt-3"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                  >
                    {urlExamples.map((example, index) => (
                      <motion.button
                        key={example}
                        type="button"
                        onClick={() => {
                          setFormData({ ...formData, channelUrl: example });
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-3 py-1.5 text-xs sm:text-sm text-white/70 bg-card/50 border border-border rounded-lg hover:border-primary/50 hover:text-white transition-all"
                      >
                        {example}
                      </motion.button>
                    ))}
                  </motion.div>
                  <AnimatePresence>
                    {error && (
                      <motion.p 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mt-2 text-sm text-red-400"
                      >
                        {error}
                      </motion.p>
                    )}
                  </AnimatePresence>
                  
                  {/* Channel Preview Card */}
                  <AnimatePresence>
                    {channelData && !showChannelConfirm && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                        className="mt-4 p-4 bg-card/80 border border-green-500/30 rounded-xl"
                      >
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
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  {/* Channel Confirmation Modal */}
                  <AnimatePresence>
                    {showChannelConfirm && channelData && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                        onClick={() => setShowChannelConfirm(false)}
                      >
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9, y: 20 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          onClick={(e) => e.stopPropagation()}
                          className="bg-card border border-border rounded-2xl p-6 sm:p-8 max-w-md w-full"
                        >
                          <div className="flex items-center gap-3 mb-6">
                            <div className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center">
                              <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                            </div>
                            <h3 className="text-xl font-bold text-white">Is this your channel?</h3>
                          </div>
                          
                          <div className="bg-card/50 rounded-xl p-4 mb-6">
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
                                <p className="text-sm text-white/70 mt-1">
                                  YouTube Channel • {channelData.subscribers} subscribers
                                </p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex gap-3">
                            <motion.button
                              onClick={() => setShowChannelConfirm(false)}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl transition-all"
                            >
                              Yes, that's me
                            </motion.button>
                            <motion.button
                              onClick={() => {
                                setShowChannelConfirm(false);
                                setChannelData(null);
                                setFormData({ ...formData, channelUrl: "" });
                              }}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="flex-1 px-6 py-3 bg-card/50 border border-border text-white/70 hover:text-white hover:border-primary/50 font-semibold rounded-xl transition-all"
                            >
                              No, go back
                            </motion.button>
                          </div>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Personal Information */}
          {(formData.platform === "youtube" && channelData && !showChannelConfirm) && (
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
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-input border border-border rounded-xl text-white placeholder:text-white/40 focus:border-primary focus:bg-input/80 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
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
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-input border border-border rounded-xl text-white placeholder:text-white/40 focus:border-primary focus:bg-input/80 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    placeholder="you@email.com"
                    required
                  />
                </div>
              </div>

              {/* Additional Questions */}
              <div>
                <label className="block text-sm font-medium text-white mb-4">
                  Are you currently signed with an agency?
                </label>
                <div className="flex gap-4">
                  {["Yes", "No"].map((option, index) => (
                    <motion.button
                      key={option}
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, hasAgency: option })
                      }
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`flex-1 px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base rounded-xl border-2 font-medium transition-all ${
                        formData.hasAgency === option
                          ? "border-primary bg-primary/10 text-white"
                          : "border-border bg-card/50 text-white/70 hover:border-primary/50"
                      }`}
                    >
                      {option}
                    </motion.button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-4">
                  Have you done brand deals before?
                </label>
                <div className="flex gap-4">
                  {["Yes", "No"].map((option, index) => (
                    <motion.button
                      key={option}
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, hasBrandDeals: option })
                      }
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`flex-1 px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base rounded-xl border-2 font-medium transition-all ${
                        formData.hasBrandDeals === option
                          ? "border-primary bg-primary/10 text-white"
                          : "border-border bg-card/50 text-white/70 hover:border-primary/50"
                      }`}
                    >
                      {option}
                    </motion.button>
                  ))}
                </div>
              </div>

              <motion.div 
                className="text-center pt-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full sm:w-auto px-6 sm:px-12 py-3 sm:py-4 text-base sm:text-lg font-semibold text-white gradient-button rounded-xl transition-all"
                >
                  Submit Application
                </motion.button>
              </motion.div>
            </>
          )}
        </form>
      </div>
    </section>
  );
}
