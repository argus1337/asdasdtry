"use client";

import { motion } from "framer-motion";
import Image from "next/image";

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
          className="relative max-w-5xl mx-auto mb-12"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {/* Brand Side */}
            <motion.div 
              className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 rounded-2xl border border-blue-500/20 p-6 sm:p-8 text-center"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ scale: 1.02, borderColor: "rgba(59, 130, 246, 0.4)" }}
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 mx-auto shadow-lg">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2">Brands</h3>
              <p className="text-sm text-white/70">Find the perfect creators for your campaigns</p>
            </motion.div>

            {/* Center - CreateSync */}
            <motion.div 
              className="bg-gradient-to-br from-purple-500/20 to-pink-500/10 rounded-2xl border-2 border-purple-500/30 p-6 sm:p-8 text-center flex flex-col items-center justify-center"
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4, type: "spring" }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4 shadow-lg p-3">
                <Image
                  src="/images/createsync-logo-icon.png"
                  alt="CreateSync"
                  width={80}
                  height={80}
                  className="w-full h-full object-contain"
                />
              </div>
              <h3 className="text-lg sm:text-xl font-bold gradient-text mb-2">CreateSync</h3>
              <p className="text-xs sm:text-sm text-white/70">The perfect match</p>
            </motion.div>

            {/* Creator Side */}
            <motion.div 
              className="bg-gradient-to-br from-cyan-500/10 to-cyan-600/5 rounded-2xl border border-cyan-500/20 p-6 sm:p-8 text-center"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ scale: 1.02, borderColor: "rgba(6, 182, 212, 0.4)" }}
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl flex items-center justify-center mb-4 mx-auto shadow-lg">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2">Creators</h3>
              <p className="text-sm text-white/70">Get matched with top brands</p>
            </motion.div>
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
