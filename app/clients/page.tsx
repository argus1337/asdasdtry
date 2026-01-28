"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import Image from "next/image";
import { motion } from "framer-motion";

const clients = [
  { name: "Netflix", logo: "/images/64189ad736481a26d5793180_Netflix_2015_logo_1.svg" },
  { name: "J. Crew", logo: "/images/655d2edc32fa44f902b50909_jcrewlogo.svg" },
  { name: "Amazon", logo: "/images/62833b9627cc9965e37886e9_Amazon_logo_1.svg" },
  { name: "Target", logo: "/images/62bbca43fb74e1e7e26aa8dd_Target.png" },
  { name: "Spotify", logo: "/images/6578dbb331aefb3477afd811_Spotifylogo.webp" },
  { name: "Johnson & Johnson", logo: "/images/6578dda72d5753e2307f7a5e_jnjlogo.png" },
  { name: "TurboTax", logo: "/images/62bbca4317573e92e2392746_TurboTax-Logo.png" },
  { name: "Lyft", logo: "/images/6418996a19486aace8d5e835_lyft-logo_1.svg" },
  { name: "DoorDash", logo: "/images/6578dad8aefd785df4d87113_doordashlogo.png" },
  { name: "Adobe", logo: "/images/62bbca1f33f884151ec446a8_Adobe_Corporate_Logo.png" },
  { name: "McDonald's", logo: "/images/62bbcb2961e2f315ef92b0e4_McDonald's_Golden_Arches.svg.png" },
  { name: "Jimmy John's", logo: "/images/6578dc6cda110cb662db84fc_jjlogo.png" },
  { name: "Cash App", logo: "/images/62bbca444300bae3c84ed13b_Cash_App-Full-Logo.wine.svg" },
  { name: "Subway", logo: "/images/62bbca43912d9c32645bdd8a_SUBWAY_LOGO_jpeg_0.png" },
  { name: "Samsung", logo: "/images/62bbcb8a72e59cd3afc29496_Samsung_wordmark.svg.png" },
  { name: "Doritos", logo: "/images/62bbca44e02d27f37c08208b_doritos_PNG37.png" },
  { name: "Nerf", logo: "/images/62bbca44dc163507e43fd12a_300px-Nerf_logo.svg.png" },
  { name: "Oikos", logo: "/images/62bbca712c12178fcbbcaf86_oikos.png" },
  { name: "Popeyes", logo: "/images/62bbcb6d2c12172d40bcb2c2_download.png" },
  { name: "Shell", logo: "/images/62bbca4308398d96499d6c25_Shell-Logo-1971-1995.png" },
  { name: "Soylent", logo: "/images/62bbca434300badc144ed13a_Soylent.svg.png" },
  { name: "Steve Madden", logo: "/images/62bbca4483fd9c5c93e8180b_steve-madden-logo-png-transparent.png" },
  { name: "Taser", logo: "/images/62bbca4388aa27a54abfab77_Taser_International_logo.svg.png" },
  { name: "ThredUp", logo: "/images/62bbca4317573e526e392747_ThredUp.png" },
  { name: "Victoria's Secret Pink", logo: "/images/62bbca4333f884cdd4c4475c_Victoria's_Secret_PINK_logo.png" },
  { name: "Saatva", logo: "/images/655d2f1fbb0b87e82dc6a879_saatvalogo.png" },
  { name: "Wienerschnitzel", logo: "/images/655d2faaa3267c013c3f8d64_wienerlogo.png" },
  { name: "Bloom Nutrition", logo: "/images/655d33256b285fb696c7605a_bloomlogo.jpeg" },
  { name: "Avocado", logo: "/images/655d346092297adf21e35046_avocadologo.jpeg" },
  { name: "Conair", logo: "/images/655e3145c2f3bd8a79ddd163_conair2.png" },
  { name: "Hollister", logo: "/images/62bbca44a1ccdb0a106148a7_1024px-Hollister_logo.svg.png" },
  { name: "Clorox", logo: "/images/6578db6f3f63dba5263921c6_cloroxlogo.png" },
  { name: "Tobasco", logo: "/images/6578dc01da110cb662db54df_tobasco_logo.svg" },
  { name: "Aveeno", logo: "/images/6578dfc31aadf83292385fde_Aveenologo.png" },
  { name: "Magic Spoon", logo: "/images/6578e029aa931c24ab548dcd_magicspoonlogo.png" },
  { name: "AliBaba", logo: "/images/6578e06e70350d52feb49fda_Alibabalogo.png" },
  { name: "Hers", logo: "/images/6578e0b2545c7661e81d49a4_herslogo.png" },
  { name: "The Inkey List", logo: "/images/6578e0ebc28b709d276e91de_inkeylistlogo.png" },
  { name: "One A Day", logo: "/images/6578e13440a1a9cd83795e6a_oneadaylogo.png" },
  { name: "Aerie", logo: "/images/6578e19557fb5f0e06076de1_aerielogo.png" },
  { name: "Casetify", logo: "/images/6578e1ce98d0a204dcaa9613_Casetify_logo.png" },
  { name: "Whisker", logo: "/images/6578e223bab5d6c00f2c68b8_whiskerlogo.png" },
  { name: "Broadway Licensing Group", logo: "/images/6578e287c5f333385d97cb37_broadwaylogo.webp" },
  { name: "Casper", logo: "/images/62bbca4451c61c93a13686d2_Casper_Sleep_logo.svg.png" },
  { name: "BlueChew", logo: "/images/6658a0ed71d87a6d8bc6e551_bluechew.png" },
  { name: "Klipsch", logo: "/images/6658a1275c86d2f19d2c8dcd_klipsch.png" },
  { name: "GNC", logo: "/images/6658a24915de1e79bf4cac2a_gnc.png" },
  { name: "Crocs", logo: "/images/6658a289fff29b1650697847_crocs.png" },
];

export default function ClientsPage() {
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
              CLIENTS
            </motion.div>
            <motion.h1 
              className="text-5xl md:text-6xl font-bold text-white mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              The best brands choose CreateSync.
            </motion.h1>
            <motion.p 
              className="text-lg text-white/80 mb-8 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              High-growth startup? Check. Fortune 500? Check. We help brands of every size and industry drive sales with world-class influencer marketing campaigns.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Clients Grid */}
      <section className="py-20">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {clients.map((client, index) => (
              <motion.div
                key={index}
                className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all flex items-center justify-center"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                whileHover={{ scale: 1.1, rotate: [0, -2, 2, 0] }}
              >
                <Image
                  src={client.logo}
                  alt={client.name}
                  width={140}
                  height={80}
                  className="h-12 w-auto object-contain opacity-60 hover:opacity-100 transition-opacity"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
