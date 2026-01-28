import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export default function CreatorsPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-pink-900/20 blur-3xl" />
        <div className="container relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="text-sm font-semibold text-purple-400 uppercase tracking-wider mb-4">
                CREATORS
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                Join the premiere creator network.
              </h1>
              <p className="text-lg text-white/80 mb-8">
                Partner with CreateSync and get the best brand deals on the market.
              </p>
              <Link href="/contact">
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-6 text-lg">
                  Let's talk
                </Button>
              </Link>
            </div>
            <div className="relative">
              <Image
                src="/images/656e15f62d0649eeebdd2a88_art.png"
                alt="Creators"
                width={600}
                height={400}
                className="w-full h-auto rounded-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Client Logos */}
      <section className="py-12">
        <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-8 items-center opacity-60">
            <Image src="/images/62833b96aef969eb76b8faf7_Disney_wordmark_1.svg" alt="Disney" width={100} height={40} className="h-8 w-auto object-contain mx-auto" />
            <Image src="/images/62833b9627cc9965e37886e9_Amazon_logo_1.svg" alt="Amazon" width={100} height={40} className="h-8 w-auto object-contain mx-auto" />
            <Image src="/images/6658a24915de1e79bf4cac2a_gnc.png" alt="GNC" width={100} height={40} className="h-8 w-auto object-contain mx-auto" />
            <Image src="/images/6418996a19486aace8d5e835_lyft-logo_1.svg" alt="Lyft" width={100} height={40} className="h-8 w-auto object-contain mx-auto" />
            <Image src="/images/6658a289fff29b1650697847_crocs.png" alt="Crocs" width={100} height={40} className="h-8 w-auto object-contain mx-auto" />
            <Image src="/images/6658a0ed71d87a6d8bc6e551_bluechew.png" alt="BlueChew" width={100} height={40} className="h-8 w-auto object-contain mx-auto" />
          </div>
        </div>
      </section>

      {/* What We Know */}
      <section className="py-20">
        <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-4xl font-bold text-white mb-8">
                CreateSync knows creators.
              </h2>
            </div>
            <div className="space-y-6">
              <div className="flex gap-4">
                <Check className="w-6 h-6 text-pink-400 flex-shrink-0 mt-1" />
                <p className="text-white/80">
                  We typically work with creators who have 50K+ followers on all social media.
                </p>
              </div>
              <div className="flex gap-4">
                <Check className="w-6 h-6 text-pink-400 flex-shrink-0 mt-1" />
                <p className="text-white/80">
                  CreateSync knows what's important to you: money, transparency, creative control, non-exclusivity, accessibility, and personalization.
                </p>
              </div>
              <div className="flex gap-4">
                <Check className="w-6 h-6 text-pink-400 flex-shrink-0 mt-1" />
                <p className="text-white/80">
                  Our mission is to help you land brand deals that match your authentic voice while making you lots and lots of money.
                </p>
              </div>
              <div className="flex gap-4">
                <Check className="w-6 h-6 text-pink-400 flex-shrink-0 mt-1" />
                <p className="text-white/80">
                  Our expert team has controlled over $1B in marketing spend throughout our careers - we know what works for you and for brands.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Offer */}
      <section className="py-20">
        <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-white mb-8">
                What we offer creators
              </h2>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <Check className="w-6 h-6 text-pink-400 flex-shrink-0 mt-1" />
                  <p className="text-white/80">Marketing expertise for deal negotiation</p>
                </div>
                <div className="flex gap-4">
                  <Check className="w-6 h-6 text-pink-400 flex-shrink-0 mt-1" />
                  <p className="text-white/80">An entire team to help you execute campaigns</p>
                </div>
                <div className="flex gap-4">
                  <Check className="w-6 h-6 text-pink-400 flex-shrink-0 mt-1" />
                  <p className="text-white/80">Average Creator Payout Time: 15 days</p>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-3xl font-bold text-white mb-8">
                Our promise to creators
              </h2>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <Check className="w-6 h-6 text-pink-400 flex-shrink-0 mt-1" />
                  <p className="text-white/80">100% Non-Exclusive</p>
                </div>
                <div className="flex gap-4">
                  <Check className="w-6 h-6 text-pink-400 flex-shrink-0 mt-1" />
                  <p className="text-white/80">Direct payment within 30 days of completion</p>
                </div>
                <div className="flex gap-4">
                  <Check className="w-6 h-6 text-pink-400 flex-shrink-0 mt-1" />
                  <p className="text-white/80">24/7 Direct Support from a Campaign Manager</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who We Are */}
      <section className="py-20">
        <div className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Who we are
          </h2>
          <div className="prose prose-invert max-w-none text-white/80 space-y-6">
            <p>
              CreateSync is an influencer marketing company that acts as an intermediary between brands and creators. Brands come to us with budgets and campaign ideas. We build the campaigns and creative for them, then match creators on our roster to fulfill their needs.
            </p>
            <p>
              We believe in transparency and over communication with our creators. When you work with CreateSync, you have a dedicated campaign manager whose mission is to support you throughout the length of a campaign. Our campaign managers will stay in touch with you via your preferred method of contact (text, email, call) before, during, and after each campaign.
            </p>
            <p>
              We are also completely non-exclusive, meaning you are free to negotiate your own deals and see your own additional partnerships with other agencies. There are no contracts. No costs or fees to work with us. You maintain full creative control over your career. We just bring you deals and help you make as much money as possible.
            </p>
          </div>
        </div>
      </section>

      {/* Why Work With Us */}
      <section className="py-20 bg-gradient-to-r from-purple-900/30 via-pink-900/30 to-blue-900/30">
        <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-12 text-center">
            Why you should work with CreateSync
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <Check className="w-8 h-8 text-pink-400 mx-auto mb-4" />
              <p className="text-white font-semibold">No Contracts</p>
            </div>
            <div className="text-center">
              <Check className="w-8 h-8 text-pink-400 mx-auto mb-4" />
              <p className="text-white font-semibold">Dedicated Campaign Manager</p>
            </div>
            <div className="text-center">
              <Check className="w-8 h-8 text-pink-400 mx-auto mb-4" />
              <p className="text-white font-semibold">Non-Exclusive Partnership</p>
            </div>
            <div className="text-center">
              <Check className="w-8 h-8 text-pink-400 mx-auto mb-4" />
              <p className="text-white font-semibold">No Costs or Fees</p>
            </div>
          </div>
        </div>
      </section>

      {/* How We Do It */}
      <section className="py-20">
        <div className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6 text-center">
            How we do it
          </h2>
          <p className="text-white/80 mb-12 text-center">
            You give us the goals, we make them happen. Our seasoned marketing team will work with you from day one to do the following…
          </p>
          
          <div className="space-y-6">
            {[
              "We receive a brand budget and campaign request.",
              "We pull creators that match the brand.",
              "The brand approves or denies the creators.",
              "We present you an offer with expected deliverables and payout.",
              "You choose to accept or deny the offer.",
              "Once you accept, a campaign coordinator will be assigned to you.",
              "You execute the expected deliverables with the help of your coordinator.",
              "You get paid via direct deposit into your bank account!",
            ].map((step, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                  {index + 1}
                </div>
                <p className="text-white/80 pt-2">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-purple-900/30 via-pink-900/30 to-blue-900/30">
        <div className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to get started?
          </h2>
          <p className="text-white/80 mb-8">Join our Creator Network</p>
          <Link href="/contact">
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-6 text-lg">
              I'm sold
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}

