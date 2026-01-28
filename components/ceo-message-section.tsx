"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export function CEOMessageSection() {
  return (
    <section className="py-16 lg:py-24 bg-card/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* CEO Image */}
          <motion.div 
            className="flex-shrink-0"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative">
              <div className="w-48 h-48 sm:w-64 sm:h-64 rounded-full bg-gradient-to-br from-primary via-secondary to-accent p-1">
                <div className="w-full h-full rounded-full bg-card overflow-hidden">
                  <Image
                    src="/images/6323aa1bf0aabc841be85f74_jess-3.png"
                    alt="Jess Flack"
                    width={256}
                    height={256}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              {/* Decorative element */}
              <motion.div 
                className="absolute -bottom-2 -right-2 w-16 h-16 bg-primary/20 rounded-full blur-xl"
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </div>
          </motion.div>

          {/* Message Content */}
          <div className="flex-1 text-center lg:text-left">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 italic text-white">
              *The CEO is typing now*
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                {`When I started CreateSync back in 2018, I had one goal: to build 
                the influencer marketing agency I always wished existed. One that 
                actually gets results, treats creators like partners, and makes 
                brands feel like they're our only client.`}
              </p>
              <p>
                {`Fast forward to today, and we've worked with over 500 brands, 
                managed thousands of creator partnerships, and generated millions 
                in ROI for our clients. But what I'm most proud of? The 
                relationships we've built along the way.`}
              </p>
              <p>
                {`If you're reading this, you're probably wondering if we're the 
                right fit for your brand. My answer: let's find out together. 
                No pressure, no hard sells—just a conversation about your goals 
                and how we might help you achieve them.`}
              </p>
            </div>
            
            {/* Signature */}
            <div className="mt-8">
              <div className="text-3xl font-script gradient-text italic">
                Jess Flack
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                Cofounder & CEO of CreateSync
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
