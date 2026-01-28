"use client";

import { motion } from "framer-motion";

export function CEOStorySection() {
  return (
    <section id="ceo-story" className="py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Story */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-4 text-balance">
            A match made in{" "}
            <span className="gradient-text">influencer marketing heaven</span>.
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
            {`We're basically Hinge* but for brands and social media influencers (we call them creators.)`}
          </p>
        </motion.div>

        {/* Visual */}
        <motion.div 
          className="relative max-w-4xl mx-auto mb-12"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="aspect-[16/9] bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 rounded-3xl border border-border overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex items-center gap-8 sm:gap-16">
                {/* Brand Side */}
                <motion.div 
                  className="text-center"
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  whileHover={{ scale: 1.1 }}
                >
                  <motion.div 
                    className="w-20 h-20 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-br from-secondary/30 to-secondary/10 flex items-center justify-center mb-3 mx-auto border border-secondary/30"
                    animate={{ 
                      boxShadow: [
                        "0 0 0px rgba(59, 130, 246, 0)",
                        "0 0 20px rgba(59, 130, 246, 0.3)",
                        "0 0 0px rgba(59, 130, 246, 0)",
                      ],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <span className="text-3xl sm:text-4xl">🏢</span>
                  </motion.div>
                  <span className="text-sm sm:text-base font-medium text-white/80">
                    Brands
                  </span>
                </motion.div>

                {/* Connection */}
                <motion.div 
                  className="flex flex-col items-center gap-2"
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <motion.svg
                    className="w-16 sm:w-24 h-8"
                    viewBox="0 0 100 30"
                    fill="none"
                    animate={{ 
                      pathLength: [0, 1],
                    }}
                    transition={{ duration: 1, delay: 0.5 }}
                  >
                    <path
                      d="M0 15 H40 M60 15 H100"
                      stroke="url(#connectionGradient)"
                      strokeWidth="2"
                      strokeDasharray="4 4"
                    />
                    <motion.circle 
                      cx="50" 
                      cy="15" 
                      r="12" 
                      fill="url(#connectionGradient)"
                      animate={{ 
                        scale: [1, 1.2, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                    <text
                      x="50"
                      y="19"
                      textAnchor="middle"
                      fill="white"
                      fontSize="12"
                    >
                      ❤️
                    </text>
                    <defs>
                      <linearGradient
                        id="connectionGradient"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="0%"
                      >
                        <stop offset="0%" stopColor="#8b5cf6" />
                        <stop offset="50%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#06b6d4" />
                      </linearGradient>
                    </defs>
                  </motion.svg>
                  <span className="text-xs sm:text-sm font-medium gradient-text">
                    CreateSync
                  </span>
                </motion.div>

                {/* Creator Side */}
                <motion.div 
                  className="text-center"
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  whileHover={{ scale: 1.1 }}
                >
                  <motion.div 
                    className="w-20 h-20 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-br from-accent/30 to-accent/10 flex items-center justify-center mb-3 mx-auto border border-accent/30"
                    animate={{ 
                      boxShadow: [
                        "0 0 0px rgba(6, 182, 212, 0)",
                        "0 0 20px rgba(6, 182, 212, 0.3)",
                        "0 0 0px rgba(6, 182, 212, 0)",
                      ],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 1,
                    }}
                  >
                    <span className="text-3xl sm:text-4xl">🎬</span>
                  </motion.div>
                  <span className="text-sm sm:text-base font-medium text-white/80">
                    Creators
                  </span>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Footnote */}
        <p className="text-center text-sm text-muted-foreground italic max-w-2xl mx-auto">
          * Minus the ghosting, the no-show first dates, and the uncomfortable
          getting-to-know-you questions.
        </p>
      </div>
    </section>
  );
}
