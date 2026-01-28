import { Suspense } from "react";
import { Navbar } from "@/components/navbar";
import { HeroSection } from "@/components/hero-section";
import { ClientLogos } from "@/components/client-logos";
import { ServicesSection } from "@/components/services-section";
import { TrustSection } from "@/components/trust-section";
import { FeaturedSection } from "@/components/featured-section";
import { TestimonialSection } from "@/components/testimonial-section";
import { CEOStorySection } from "@/components/ceo-story-section";
import { CEOMessageSection } from "@/components/ceo-message-section";
import { FAQSection } from "@/components/faq-section";
import { Footer } from "@/components/footer";
import { BrandTracker } from "@/components/brand-tracker";

function BrandTrackerWrapper() {
  return (
    <Suspense fallback={null}>
      <BrandTracker />
    </Suspense>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen">
      <BrandTrackerWrapper />
      <Navbar />
      <HeroSection />
      <ClientLogos />
      <ServicesSection />
      <TrustSection />
      <FeaturedSection />
      <TestimonialSection />
      <CEOStorySection />
      <CEOMessageSection />
      <FAQSection />
      <Footer />
    </main>
  );
}
