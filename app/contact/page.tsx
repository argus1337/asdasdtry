import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ContactSection } from "@/components/contact-section";

export default function ContactPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-pink-900/20 blur-3xl" />
        <div className="container relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-sm font-semibold text-purple-400 uppercase tracking-wider mb-4">
            CONTACT US
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Let's make some <span className="text-pink-400">magic</span> together
          </h1>
          <p className="text-lg text-white/80 mb-8 max-w-3xl mx-auto">
            Ready to launch your next influencer marketing campaign? Get in touch with our team and let's discuss how we can help you achieve your goals.
          </p>
        </div>
      </section>

      {/* Contact Form */}
      <ContactSection />

      <Footer />
    </main>
  );
}

