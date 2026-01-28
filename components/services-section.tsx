"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function ServicesSection() {
  const serviceCards = [
    { icon: "📊", title: "Analytics", delay: 0 },
    { icon: "🎯", title: "Targeting", delay: 0.1 },
    { icon: "🤝", title: "Matching", delay: 0.2 },
    { icon: "📈", title: "Growth", delay: 0.3 },
  ];

  return (
    <section id="services" className="py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Left Column - Visual */}
          <motion.div 
            className="flex-1 w-full"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative aspect-[4/3] max-w-lg mx-auto lg:mx-0">
              <motion.div 
                className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 rounded-3xl"
                animate={{
                  backgroundPosition: ["0% 0%", "100% 100%"],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              />
              <div className="absolute inset-4 bg-card/50 backdrop-blur-sm rounded-2xl border border-border flex items-center justify-center">
                <div className="grid grid-cols-2 gap-4 p-6">
                  {serviceCards.map((card, index) => (
                    <motion.div
                      key={card.title}
                      className={`bg-${index % 2 === 0 ? 'primary' : index === 1 ? 'secondary' : 'accent'}/10 rounded-xl p-4 text-center cursor-pointer`}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: card.delay }}
                      whileHover={{ 
                        scale: 1.1, 
                        rotate: [0, -5, 5, 0],
                        transition: { duration: 0.3 }
                      }}
                    >
                      <motion.div 
                        className="text-3xl mb-2"
                        animate={{ 
                          rotate: [0, 10, -10, 0],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: card.delay,
                        }}
                      >
                        {card.icon}
                      </motion.div>
                      <div className="text-sm text-white/80">{card.title}</div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Content */}
          <motion.div 
            className="flex-1 text-center lg:text-left"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.h2 
              className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-6 text-balance"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              A <span className="gradient-text">full-service influencer marketing agency</span> with end-to-end campaign management.
            </motion.h2>
            <motion.p 
              className="text-lg text-muted-foreground leading-relaxed mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              From strategy development to creator sourcing, content creation oversight, 
              campaign execution, and performance analysis—we handle everything so you can 
              focus on what matters most: growing your brand.
            </motion.p>
            <motion.div 
              className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="#contact"
                  className="inline-block px-8 py-4 text-lg font-semibold text-white gradient-button rounded-xl transition-all whitespace-nowrap"
                >
                  Collaborations
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }}>
                <Link
                  href="#how-it-works"
                  className="text-primary hover:text-primary/80 font-medium underline underline-offset-4 transition-colors"
                >
                  {"Here's the full breakdown of how it works"}
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
