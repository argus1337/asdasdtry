"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { motion } from "framer-motion";

export default function HowItWorksPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-pink-900/20 blur-3xl"
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%"],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        <div className="container relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div 
              className="text-sm font-semibold text-purple-400 uppercase tracking-wider mb-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              HOW IT WORKS
            </motion.div>
            <motion.h1 
              className="text-5xl md:text-6xl font-bold text-white mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Deploy world-class influencer marketing campaigns with <span className="text-pink-400">CreateSync</span>.
            </motion.h1>
            <motion.p 
              className="text-lg text-white/80 mb-8 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              We help you exceed your goals using our ecosystem of 13K+ creators with 27B+ combined followers, proprietary real-time data platform, and proven methodologies for launching impactful campaigns.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href="/contact">
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-6 text-lg">
                  Sold? Let's talk
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20">
        <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            {[
              { value: "1.4B", label: "impressions generated" },
              { value: "35B", label: "total followers for our creator network" },
              { value: "65.6K", label: "unique pieces of content created" },
            ].map((stat, index) => (
              <motion.div
                key={stat.value}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <motion.h1 
                  className="text-5xl font-bold text-pink-400 mb-2"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 + 0.2, type: "spring" }}
                >
                  {stat.value}
                </motion.h1>
                <p className="text-white/70">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How We Work */}
      <section className="py-20">
        <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl font-bold text-white mb-4">
                Here's how we make your business mediasync.
              </h2>
              <p className="text-white/80 mb-8">
                If you choose the <span className="text-pink-400 font-semibold">Full-Service option</span>, running scalable influencer marketing campaigns with CreateSync is as easy as 1-2-3 (4).
              </p>
            </motion.div>
            
            <div className="space-y-8">
              {[
                {
                  number: "1",
                  title: "Choose Your Campaign Goals",
                  description: "You'll collaborate with our team of experienced strategists to fully define your target audience, key objectives, preferred social channels, and whatever else equals success for your campaign."
                },
                {
                  number: "2",
                  title: "Relax, We'll Build Your Strategy",
                  description: "We use our proprietary methods to map out a full menu of strategies we can deploy to execute your campaign. From there, our team of veteran strategists will review and revise with you, then get final approval for launch."
                },
                {
                  number: "3",
                  title: "Save Countless Hours on Creator Management",
                  description: "We handle all creator outreach, negotiations, and correspondence needed to launch your campaign and see it through to success. Give us your budget, and we'll take care of the rest."
                },
                {
                  number: "4",
                  title: "See Real-Time Results",
                  description: "Visualize progress on your key metrics in real-time as your campaign takes flight. You'll always know how your campaign is performing in real-time with hard data."
                },
              ].map((step, index) => (
                <motion.div
                  key={step.number}
                  className="flex gap-4"
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ x: -5 }}
                >
                  <motion.div 
                    className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-xl"
                    initial={{ scale: 0, rotate: -180 }}
                    whileInView={{ scale: 1, rotate: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 + 0.2, type: "spring" }}
                    whileHover={{ scale: 1.1, rotate: 360 }}
                  >
                    {step.number}
                  </motion.div>
                  <div>
                    <h5 className="text-xl font-semibold text-white mb-2">
                      {step.title}
                    </h5>
                    <p className="text-white/80">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Case Study */}
      <section className="py-20 bg-gradient-to-r from-purple-900/30 via-pink-900/30 to-blue-900/30">
        <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            whileHover={{ scale: 1.01 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                >
                  <Image
                    src="/images/655d33256b285fb696c7605a_bloomlogo.jpeg"
                    alt="Bloom Nutrition"
                    width={200}
                    height={80}
                    className="mb-4 h-12 w-auto object-contain"
                  />
                </motion.div>
                <div className="grid grid-cols-2 gap-6">
                  {[
                    { value: "5.5M", label: "views" },
                    { value: "$1.47", label: "CPM" },
                  ].map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                    >
                      <motion.div 
                        className="text-3xl font-bold text-pink-400"
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: 0.5 + index * 0.1, type: "spring" }}
                      >
                        {stat.value}
                      </motion.div>
                      <div className="text-white/70 text-sm">{stat.label}</div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
              <motion.div 
                className="text-white/80"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <p>Our campaign with Bloom Nutrition generated incredible results, showcasing the power of strategic influencer partnerships.</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

