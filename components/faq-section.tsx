"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";

const faqs = [
  {
    question: "Which social media platforms does CreateSync specialize in?",
    answer:
      "We specialize in TikTok, Instagram, and YouTube, but we also work with creators across other platforms including Twitter/X, Twitch, LinkedIn, and podcasts. Our team stays on top of emerging platforms to ensure your brand reaches audiences wherever they are.",
  },
  {
    question: "What industries do you run influencer marketing for?",
    answer:
      "We work across virtually every industry including tech, beauty, fashion, food & beverage, health & wellness, finance, travel, gaming, and more. Our diverse experience means we understand the unique nuances and compliance requirements of different sectors.",
  },
  {
    question: "How does CreateSync select influencers for campaigns?",
    answer:
      "We use a combination of proprietary data analysis, audience demographics, engagement metrics, content quality assessment, and brand alignment scoring. Every creator goes through our vetting process to ensure authenticity and fit with your brand values.",
  },
  {
    question: "What type of brands has CreateSync worked with?",
    answer:
      "We've worked with brands of all sizes—from startups to Fortune 500 companies. Our client roster includes names like Disney, Amazon, Samsung, Netflix, McDonald's, and hundreds of innovative DTC brands.",
  },
  {
    question: "How does CreateSync measure campaign success?",
    answer:
      "We track comprehensive metrics including reach, impressions, engagement rate, click-through rate, conversions, and ROI. We provide detailed reporting dashboards and post-campaign analysis to help you understand the full impact of your campaigns.",
  },
  {
    question:
      "Does CreateSync only work with large brands, or do you help smaller brands too?",
    answer:
      "We work with brands at every stage of growth. Whether you're a startup launching your first influencer campaign or an enterprise brand scaling your creator partnerships, we have solutions tailored to your budget and goals.",
  },
  {
    question: "Can CreateSync help me run paid ads?",
    answer:
      "Yes! We offer paid amplification services to boost your influencer content. This includes whitelisted ads (running ads from creator accounts), spark ads on TikTok, and creator content repurposing for paid social campaigns.",
  },
  {
    question: "What services does CreateSync offer?",
    answer:
      "Our services include influencer discovery and vetting, campaign strategy, creator outreach and negotiation, content briefing and oversight, campaign management, performance tracking, and detailed reporting. We offer full-service packages or can support specific aspects of your campaigns.",
  },
  {
    question: "Do you only run campaigns on TikTok?",
    answer:
      "Not at all! While TikTok is one of our strongest platforms, we run successful campaigns across Instagram, YouTube, Twitter/X, Twitch, podcasts, and more. Many of our campaigns are multi-platform to maximize reach and engagement.",
  },
];

export function FAQSection() {
  return (
    <section className="py-16 lg:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold gradient-text">
            Frequently Asked Questions
          </h2>
        </motion.div>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <AccordionItem
                value={`item-${index}`}
                className="bg-card border border-border rounded-xl px-6 data-[state=open]:bg-card/80 transition-all hover:border-primary/50"
              >
                <AccordionTrigger className="text-left text-white hover:text-primary py-5 text-base sm:text-lg font-medium [&[data-state=open]>svg]:rotate-180 transition-all">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            </motion.div>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
