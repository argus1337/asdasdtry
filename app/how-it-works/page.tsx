import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export default function HowItWorksPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-pink-900/20 blur-3xl" />
        <div className="container relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-sm font-semibold text-purple-400 uppercase tracking-wider mb-4">
            HOW IT WORKS
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Deploy world-class influencer marketing campaigns with <span className="text-pink-400">CreateSync</span>.
          </h1>
          <p className="text-lg text-white/80 mb-8 max-w-3xl mx-auto">
            We help you exceed your goals using our ecosystem of 13K+ creators with 27B+ combined followers, proprietary real-time data platform, and proven methodologies for launching impactful campaigns.
          </p>
          <Link href="/contact">
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-6 text-lg">
              Sold? Let's talk
            </Button>
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20">
        <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div>
              <h1 className="text-5xl font-bold text-pink-400 mb-2">1.4B</h1>
              <p className="text-white/70">impressions generated</p>
            </div>
            <div>
              <h1 className="text-5xl font-bold text-pink-400 mb-2">35B</h1>
              <p className="text-white/70">total followers for our creator network</p>
            </div>
            <div>
              <h1 className="text-5xl font-bold text-pink-400 mb-2">65.6K</h1>
              <p className="text-white/70">unique pieces of content created</p>
            </div>
          </div>
        </div>
      </section>

      {/* How We Work */}
      <section className="py-20">
        <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-4xl font-bold text-white mb-4">
                Here's how we make your business mediasync.
              </h2>
              <p className="text-white/80 mb-8">
                If you choose the <span className="text-pink-400 font-semibold">Full-Service option</span>, running scalable influencer marketing campaigns with CreateSync is as easy as 1-2-3 (4).
              </p>
            </div>
            
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-xl">
                  1
                </div>
                <div>
                  <h5 className="text-xl font-semibold text-white mb-2">
                    Choose Your Campaign Goals
                  </h5>
                  <p className="text-white/80">
                    You'll collaborate with our team of experienced strategists to fully define your target audience, key objectives, preferred social channels, and whatever else equals success for your campaign.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-xl">
                  2
                </div>
                <div>
                  <h5 className="text-xl font-semibold text-white mb-2">
                    Relax, We'll Build Your Strategy
                  </h5>
                  <p className="text-white/80">
                    We use our proprietary methods to map out a full menu of strategies we can deploy to execute your campaign. From there, our team of veteran strategists will review and revise with you, then get final approval for launch.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-xl">
                  3
                </div>
                <div>
                  <h5 className="text-xl font-semibold text-white mb-2">
                    Save Countless Hours on Creator Management
                  </h5>
                  <p className="text-white/80">
                    We handle all creator outreach, negotiations, and correspondence needed to launch your campaign and see it through to success. Give us your budget, and we'll take care of the rest.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-xl">
                  4
                </div>
                <div>
                  <h5 className="text-xl font-semibold text-white mb-2">
                    See Real-Time Results
                  </h5>
                  <p className="text-white/80">
                    Visualize progress on your key metrics in real-time as your campaign takes flight. You'll always know how your campaign is performing in real-time with hard data.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Case Study */}
      <section className="py-20 bg-gradient-to-r from-purple-900/30 via-pink-900/30 to-blue-900/30">
        <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="text-2xl font-bold text-white mb-4">Bloom Nutrition</div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <div className="text-3xl font-bold text-pink-400">5.5M</div>
                    <div className="text-white/70 text-sm">views</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-pink-400">$1.47</div>
                    <div className="text-white/70 text-sm">CPM</div>
                  </div>
                </div>
              </div>
              <div className="text-white/80">
                <p>Our campaign with Bloom Nutrition generated incredible results, showcasing the power of strategic influencer partnerships.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

