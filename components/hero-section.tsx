"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function HeroSection() {
  return (
    <section className="relative py-16 lg:py-24 overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div 
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Left Column - Content */}
          <motion.div 
            className="flex-1 text-center lg:text-left"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-primary mb-4">
              Influencer Marketing Agency
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4 sm:mb-6 text-balance px-2 sm:px-0">
              <span className="gradient-text">Accelerate</span> your influencer
              marketing machine
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-6 sm:mb-8 max-w-xl mx-auto lg:mx-0 px-2 sm:px-0">
              We connect brands with the perfect creators to build authentic
              partnerships that drive real results. From TikTok to Instagram to
              YouTube, we manage every aspect of your influencer campaigns.
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-2 sm:px-0"
            >
              <Link
                href="/contact"
                className="inline-block w-full sm:w-auto text-center px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold text-white gradient-button rounded-xl transition-all"
              >
                Get started!
              </Link>
            </motion.div>
          </motion.div>

          {/* Right Column - Visual */}
          <motion.div 
            className="flex-1 relative"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="relative max-w-lg mx-auto lg:max-w-none">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4 sm:gap-6">
                {[
                  { value: "13K+", label: "Creators", color: "from-purple-500 to-pink-500" },
                  { value: "27B+", label: "Followers", color: "from-blue-500 to-cyan-500" },
                  { value: "$1B+", label: "Managed", color: "from-pink-500 to-rose-500" },
                  { value: "500+", label: "Brands", color: "from-purple-500 to-indigo-500" },
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    className="relative p-6 sm:p-8 bg-gradient-to-br from-card/50 to-card/30 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden group"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                    whileHover={{ scale: 1.05, borderColor: "rgba(139, 92, 246, 0.5)" }}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
                    <div className="relative">
                      <div className={`text-3xl sm:text-4xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2`}>
                        {stat.value}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-sm sm:text-base text-white/70 font-medium">
                          {stat.label}
                        </div>
                        <motion.svg
                          width="40"
                          height="16"
                          viewBox="0 0 40 16"
                          fill="none"
                          className="text-green-400 opacity-60"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 0.6 }}
                          transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                        >
                          <motion.path
                            d={
                              index === 0 ? "M2 12L8 6L14 8L20 4L26 5L32 3L38 2" : // Creators - steep growth
                              index === 1 ? "M2 14L8 10L14 8L20 6L26 4L32 3L38 2" : // Followers - steady growth
                              index === 2 ? "M2 13L8 9L14 7L20 5L26 4L32 3L38 2" : // Managed - consistent growth
                              "M2 12L8 8L14 7L20 5L26 4L32 3L38 2" // Brands - gradual growth
                            }
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 1, delay: 0.8 + index * 0.1 }}
                          />
                        </motion.svg>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              {/* Platform badges */}
              <div className="flex items-center justify-center gap-4 mt-8">
                {[
                  { name: "YouTube", color: "bg-red-500" },
                  { name: "Instagram", color: "bg-gradient-to-br from-pink-500 to-rose-500" },
                  { name: "TikTok", color: "bg-black border border-white/20" },
                ].map((platform, index) => (
                  <motion.div
                    key={platform.name}
                    className={`${platform.color} px-4 py-2 rounded-full text-white text-xs sm:text-sm font-semibold shadow-lg`}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.7 + index * 0.1, type: "spring" }}
                    whileHover={{ scale: 1.1 }}
                  >
                    {platform.name}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
