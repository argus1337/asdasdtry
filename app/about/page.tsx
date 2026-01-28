"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { motion } from "framer-motion";

export default function AboutPage() {
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
        <div className="container relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-left"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div 
              className="text-sm font-semibold text-purple-400 uppercase tracking-wider mb-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              ABOUT US
            </motion.div>
            <motion.h1 
              className="text-5xl md:text-6xl font-bold text-white mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Hi. We're <span className="text-pink-400">CreateSync</span>. We are influencer marketing.
            </motion.h1>
            <motion.p 
              className="text-lg text-white/80 mb-8 max-w-3xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              CreateSync has been in the influencer marketing game since 2021, but our team of social media professionals, marketing executives, developers, designers, and influencers have a collective multiple decades of experience.
            </motion.p>
            <div className="h-px bg-gradient-to-r from-purple-500/50 via-pink-500/50 to-transparent my-12" />
            
            <motion.h4 
              className="text-xl font-semibold text-white mb-6 mt-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              If we look familiar, you might have seen us on:
            </motion.h4>
            <motion.div 
              className="flex flex-wrap gap-8 items-center opacity-60 mb-12"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 0.6 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              {["G2", "Clutch", "DesignRush"].map((item, index) => (
                <motion.div
                  key={item}
                  className="text-white/60 text-sm"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                  whileHover={{ scale: 1.1 }}
                >
                  {item}
                </motion.div>
              ))}
            </motion.div>
            <div className="h-px bg-gradient-to-r from-purple-500/50 via-pink-500/50 to-transparent my-12" />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-left"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.h2 
              className="text-4xl font-bold text-white mb-6 mt-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              This is the new frontier of marketing.
            </motion.h2>
            <motion.div 
              className="prose prose-invert max-w-none text-white/80 space-y-6"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <p>
                On platforms like <Link href="/services/tiktok" className="text-pink-400 hover:text-pink-300">TikTok</Link>, <Link href="/services/instagram" className="text-pink-400 hover:text-pink-300">Instagram</Link>, and <Link href="/services/youtube" className="text-pink-400 hover:text-pink-300">YouTube</Link>, a new generation of creators are enhancing brand awareness, perception, and adoption of products and services.
              </p>
              <p>
                For brands, the cost of entry is getting lower. Influencer marketing is now just as accessible to startups and small businesses as it is to Fortune 1000s.
              </p>
              <p>
                We believe that the best influencer marketing strategies are mutually beneficial for brands and creators, helping brands accomplish their goals while providing a valuable income stream for hard-working creators everywhere.
              </p>
              <p>
                Here at CreateSync, our goal is to be the long-term partner for both brands and creators, working hand-in-hand with both sides of the market to make magic happen each time we ink a new partnership or launch a campaign.
              </p>
              <p>
                Our mission is to change the world of influencer marketing for the better, one campaign at a time.
              </p>
              <motion.p 
                className="text-xl font-semibold text-pink-400"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                We are CreateSync.
              </motion.p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Testimonial CTA */}
      <section className="py-20 bg-gradient-to-r from-purple-900/30 via-pink-900/30 to-blue-900/30">
        <div className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Don't take it from us, take it from them.
          </h2>
          <p className="text-xl text-white/90 italic mb-4 max-w-2xl mx-auto">
            "Putting money into TikTok is complex, time-consuming, and requires countless hours of coordination and effort, but the CreateSync team simplifies the process and executes with excellence."
          </p>
          <div className="text-white/70 mb-8">- Aly Treuhaft, Triller</div>
          <Link href="/contact">
            <Button className="gradient-button">Let's talk</Button>
          </Link>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20">
        <div className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-left">
            <div className="text-sm font-semibold text-purple-400 uppercase tracking-wider mb-4">
              OUR STORY
            </div>
            <h3 className="text-3xl font-bold text-white mb-6">
              Here's how we got here.
            </h3>
            <div className="prose prose-invert max-w-none text-white/80 space-y-6">
              <p>
                It's 2020. Jess Flack is leading the performance marketing team at a rapidly-growing startup called Bellhop that's changing the way folks move from one home to another.
              </p>
              <p>
                Her job is simple… in theory. She's tasked with making Bellhop as much dough as possible while spending as little dough as possible.
              </p>
              <p>
                Exploring opportunities to do just this, she hears of a new social media platform that's expected to be…
              </p>
              <h5 className="text-xl font-semibold text-pink-400 mt-12 mb-4">
                "The next Vine…"
              </h5>
              <p>
                She's skeptical, at first, and so rather than allocating Bellhop's budget and valuable resources testing the channel, she sets about doing her own reconnaissance off-the-clock.
              </p>
              <p>
                It takes Jess nearly 100 hours and a whole lot of late nights to find, chat with and negotiate rates with something like 200 influencers.
              </p>
              <h5 className="text-xl font-semibold text-pink-400 mt-12 mb-4">
                Then, she waits…
              </h5>
              <p>
                Fortunately, Jess doesn't have to wait long. The data is staggering: CPM's are 75% cheaper than Instagram and 85% cheaper than YouTube.
              </p>
              <p>
                Jess immediately looks for ways she can leverage this exercise for Bellhop in a scalable way. She knocks on the doors of several self-proclaimed Influencer Marketing Agencies, only to find that… well… they all suck.
              </p>
              <h5 className="text-xl font-semibold text-pink-400 mt-12 mb-4">
                Knock. Knock.
              </h5>
              <p>
                Jess decides to take her TikTok influencer marketing efforts in-house, teaching her team to do what she has done. And, it works. It works so well, in fact, that she quits her job and starts her own agency called CreateSync; the very agency whose site you're thumbing through now.
              </p>
              <p>
                In the past year alone, Jess and her team have on-boarded over 300 businesses and have partnered with more than 4,000 influencers all while managing tens of millions of dollars in ad spend.
              </p>
              <p>
                The result? Magic ✨ Which, speaking of…
              </p>
              <div className="mt-8">
                <Link href="/contact">
                  <Button className="gradient-button">Let's make some magic together</Button>
                </Link>
              </div>
              <div className="h-px bg-gradient-to-r from-purple-500/50 via-pink-500/50 to-transparent my-12" />
            </div>
          </div>
        </div>
      </section>

      {/* Clients Logos */}
      <section className="py-20">
        <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-white mb-12 text-left">
            We've worked wonders for more brands than you can shake a wand at.
          </h3>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 opacity-60">
            <div className="flex items-center justify-center h-12 px-4">
              <Image src="/images/62833b96aef969eb76b8faf7_Disney_wordmark_1.svg" alt="Disney" width={120} height={48} className="h-10 w-auto object-contain" />
            </div>
            <div className="flex items-center justify-center h-12 px-4">
              <Image src="/images/62833b9627cc9965e37886e9_Amazon_logo_1.svg" alt="Amazon" width={120} height={48} className="h-10 w-auto object-contain" />
            </div>
            <div className="flex items-center justify-center h-12 px-4">
              <Image src="/images/64189ad736481a26d5793180_Netflix_2015_logo_1.svg" alt="Netflix" width={120} height={48} className="h-10 w-auto object-contain" />
            </div>
            <div className="flex items-center justify-center h-12 px-4">
              <Image src="/images/62bbca1f33f884151ec446a8_Adobe_Corporate_Logo.png" alt="Adobe" width={120} height={48} className="h-10 w-auto object-contain" />
            </div>
            <div className="flex items-center justify-center h-12 px-4">
              <Image src="/images/62833b968d2bbbab27a34d29_aerie-seeklogo.com_2_1.svg" alt="Aerie" width={120} height={48} className="h-10 w-auto object-contain" />
            </div>
          </div>
          <div className="mt-12">
            <Link href="/clients">
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                See all our clients
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20">
        <div className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-left">
            <h3 className="text-3xl font-bold text-white mb-6">
              Our Core Values
            </h3>
            <p className="text-white/80 mb-12">
              Some brands call it a manifesto. Others, a mission statement. For us, this is what we care about and seek to embody as we navigate this world as entrepreneurs, creatives and marketers.
            </p>
            
            <div className="space-y-12">
              <div>
                <h5 className="text-xl font-semibold text-pink-400 mb-4">
                  Diversity isn't stumbled upon.
                </h5>
                <p className="text-white/80">
                  We believe in the power of diversity. It fuels creativity, fosters innovation, and enriches our brand. We embrace unique perspectives and backgrounds.
                </p>
              </div>
              
              <div>
                <h5 className="text-xl font-semibold text-pink-400 mb-4">
                  Curiosity keeps companies out of trouble.
                </h5>
                <p className="text-white/80">
                  Companies should follow their curiosities. We encourage our people to question everything until they get to the heart of why they are doing what they're doing.
                </p>
              </div>
              
              <div>
                <h5 className="text-xl font-semibold text-pink-400 mb-4">
                  Not customer-focused, customer-obsessed.
                </h5>
                <p className="text-white/80">
                  We're not just focused on our customers. We're obsessed with them. We want to understand their problems deeply, so we can provide them with solutions that can solve those problems for a lifetime.
                </p>
              </div>
              
              <div>
                <h5 className="text-xl font-semibold text-pink-400 mb-4">
                  We don't employ vampires.
                </h5>
                <p className="text-white/80">
                  We don't hire blood-thirsty, energy-sucking vampires. Every teammate at CreateSync is expected to be a fountain not a drain; to bring more energy than they take.
                </p>
              </div>
              
              <div>
                <h5 className="text-xl font-semibold text-pink-400 mb-4">
                  Let's get to the finish line.
                </h5>
                <p className="text-white/80">
                  Sure, we focus on the present but we go about this focus with the future in mind. In other words, we're goal-oriented. We create meaningful, achievable milestones to accelerate ourselves towards our grand vision.
                </p>
              </div>
            </div>
            
            <div className="h-px bg-gradient-to-r from-purple-500/50 via-pink-500/50 to-transparent my-12" />
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20">
        <div className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-left">
            <h3 className="text-3xl font-bold text-white mb-12">
              Who's in charge around here?
            </h3>
            
            <div className="space-y-12">
              <div className="flex gap-6">
                <Image
                  src="/images/6323aa1bf0aabc841be85f74_jess-3.png"
                  alt="Jess Flack"
                  width={128}
                  height={128}
                  className="w-32 h-32 rounded-full object-cover flex-shrink-0"
                />
                <div>
                  <p className="text-xl font-semibold text-white mb-2">
                    Jess Flack, <span className="text-pink-400">CEO & Cofounder</span>
                  </p>
                  <p className="text-white/80">
                    Cinephile. Fell in love with marketing. Watched less movies. Made brands money. Killed the game at several ad agencies. Left for Bellhop to own their performance marketing division where she 5x'd paid channel revenue quicker than you can say "CAC." Now she's running CreateSync and finding it's more thrilling than any movie she's ever watched.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-6">
                <Image
                  src="/images/6323aa56b7ef37e2cbc77022_Jesse-serious.jpg"
                  alt="Jesse Gambucci"
                  width={128}
                  height={128}
                  className="w-32 h-32 rounded-full object-cover flex-shrink-0"
                />
                <div>
                  <p className="text-xl font-semibold text-white mb-2">
                    Jesse Gambucci, <span className="text-pink-400">EVP of Sales & Strategy</span>
                  </p>
                  <p className="text-white/80">
                    Cool last name. Spent over 15 years at Verizon in Sales & Sales Leadership, managing over $100 million book of business then 3 years at Oracle as an account executive overseeing one of their largest accounts. He loves to golf, travel, infiltrate Speak Easies, collect sneakers, be a dad and rewatch movies like Goodfellas and Gladiator.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="h-px bg-gradient-to-r from-purple-500/50 via-pink-500/50 to-transparent my-12" />
          </div>
        </div>
      </section>

      {/* What We Handle */}
      <section className="py-20">
        <div className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-left">
            <h3 className="text-3xl font-bold text-white mb-6">
              We're the one-stop shop for all things influencer marketing.
            </h3>
            <div className="space-y-4 text-white/80">
              <p>
                Sifting through thousands of influencers to find the ones you're willing to bet your brand on? <strong className="text-pink-400 italic">We handle that</strong>.
              </p>
              <p>
                Juggling a hundred different email threads selling skeptical influencers? <strong className="text-pink-400 italic">We handle that</strong>.
              </p>
              <p>
                Bartering and haggling and negotiating a deal everyone is happy with? <strong className="text-pink-400 italic">We handle that</strong>.
              </p>
              <p>
                Brainstorming creative campaigns and ideas that standout and stop thumbs? <strong className="text-pink-400 italic">We handle that</strong>.
              </p>
              <p>
                Ensuring influencers are getting paid and on-time and without all the hassle? <strong className="text-pink-400 italic">We handle that.</strong>
              </p>
              <p className="text-xl mt-8">
                In other words, Influencer Marketing…<br />
                <strong className="text-pink-400 italic">We handle that.</strong>
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

