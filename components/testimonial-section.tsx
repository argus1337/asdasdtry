"use client";

import { Quote } from "lucide-react";
import { motion } from "framer-motion";

export function TestimonialSection() {
  return (
    <section className="py-16 lg:py-24 bg-card/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="relative"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            animate={{ 
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Quote className="absolute -top-4 -left-4 w-12 h-12 text-primary/30" />
          </motion.div>
          <motion.blockquote 
            className="text-xl sm:text-2xl lg:text-3xl font-medium leading-relaxed text-white text-center mb-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {`"CreateSync transformed our influencer marketing strategy. Their team's expertise in matching us with the perfect creators resulted in a 340% increase in engagement and a significant boost in brand awareness."`}
          </motion.blockquote>
          <motion.div 
            className="flex items-center justify-center gap-4"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <motion.div 
              className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-xl"
              animate={{ 
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              whileHover={{ scale: 1.1 }}
            >
              SM
            </motion.div>
            <div className="text-left">
              <div className="font-semibold text-white">Sarah Mitchell</div>
              <div className="text-sm text-muted-foreground">
                VP of Marketing, TechBrand Inc.
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
