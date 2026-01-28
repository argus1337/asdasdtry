"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const clients = [
  { name: "Disney", logo: "/images/62833b96aef969eb76b8faf7_Disney_wordmark_1.svg" },
  { name: "Amazon", logo: "/images/62833b9627cc9965e37886e9_Amazon_logo_1.svg" },
  { name: "GNC", logo: "/images/6658a24915de1e79bf4cac2a_gnc.png" },
  { name: "Lyft", logo: "/images/6418996a19486aace8d5e835_lyft-logo_1.svg" },
  { name: "Crocs", logo: "/images/6658a289fff29b1650697847_crocs.png" },
];

export function ClientLogos() {
  return (
    <section className="py-12 lg:py-16 border-y border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 items-center">
          {clients.map((client, index) => (
            <motion.div
              key={client.name}
              className="flex items-center justify-center p-4 logo-grayscale"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ 
                scale: 1.1,
                transition: { duration: 0.2 }
              }}
            >
              <Image
                src={client.logo}
                alt={client.name}
                width={120}
                height={60}
                className="h-8 w-auto object-contain opacity-60 hover:opacity-100 transition-opacity"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
