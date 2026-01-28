import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export default function YouTubePage() {
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
                YOUTUBE INFLUENCER MARKETING
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                Unlike any Youtube Influencer Marketing agency.
              </h1>
              <p className="text-lg text-white/80 mb-8">
                Every day people are looking to YouTube influencer content that <span className="text-pink-400">solves problems</span> and <span className="text-pink-400">entertains the hell</span> out of them.
              </p>
              <p className="text-lg text-white/80 mb-8">
                Our 2,000+ creator network loves to do just that! We've deployed over 8 figures in spending to a network of 4 billion followers and taken brands from off the map to leading the charge on YouTube.
              </p>
              <Link href="/contact">
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-6 text-lg">
                  Collaborations
                </Button>
              </Link>
            </div>
            <div className="relative">
              <div className="w-full h-96 bg-gradient-to-br from-red-500/20 to-pink-500/20 rounded-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Full Service */}
      <section className="py-20">
        <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-white mb-6">
                Full-service YouTube Influencer Marketing
              </h2>
              <div className="prose prose-invert max-w-none text-white/80 space-y-4">
                <p>
                  YouTube is the OG influencer platform. It's been around the longest and flaunts the most robust content on the internet. Hell, you can pretty much find anything and everything there.
                </p>
                <p>
                  Everything, except your brand.
                </p>
                <p>
                  Luckily for you, our team of marketing mavens is ready to jump in and work. From campaign strategy and planning to managing content production and delivery, we offer a full-service, in-house creative team that will get you on the path to success.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 opacity-60">
              <div className="text-white/60 text-sm text-center">Disney</div>
              <div className="text-white/60 text-sm text-center">Amazon</div>
              <div className="text-white/60 text-sm text-center">Netflix</div>
              <div className="text-white/60 text-sm text-center">Adobe</div>
              <div className="text-white/60 text-sm text-center">Aerie</div>
            </div>
          </div>
        </div>
      </section>

      {/* How We Do It */}
      <section className="py-20">
        <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              How we do YouTube Influencer Marketing
            </h2>
            <p className="text-white/80 max-w-2xl mx-auto">
              Like all successful YouTube influencer campaigns, we build a plan from the ground up and support you through our tailored process that includes:
            </p>
          </div>
          
          <div className="space-y-16">
            {[
              {
                title: "Building a testing roadmap for your YouTube campaign",
                side: "left"
              },
              {
                title: "Choosing the best-fit YouTube creators to work with.",
                side: "right"
              },
              {
                title: "Crafting a strategy based on your specific goals.",
                side: "left"
              },
              {
                title: "Executing the entire YouTube campaign from start to finish, including quality control.",
                side: "right"
              },
              {
                title: "Sharing real-time performance metrics with your team.",
                side: "left"
              },
              {
                title: "Optimizing and building upon your success to develop a long-term strategy for your YouTube influencer marketing channel.",
                side: "right"
              }
            ].map((item, index) => (
              <div
                key={index}
                className={`grid grid-cols-1 md:grid-cols-2 gap-8 items-center ${
                  item.side === "right" ? "md:flex-row-reverse" : ""
                }`}
              >
                {item.side === "left" && (
                  <>
                    <div>
                      <h3 className="text-2xl font-semibold text-white mb-4">
                        {item.title}
                      </h3>
                    </div>
                    <div className="w-full h-48 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl" />
                  </>
                )}
                {item.side === "right" && (
                  <>
                    <div className="w-full h-48 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl md:order-2" />
                    <div className="md:order-1">
                      <h3 className="text-2xl font-semibold text-white mb-4">
                        {item.title}
                      </h3>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What Makes Us Different */}
      <section className="py-20">
        <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-4xl font-bold text-white mb-8">
                What makes us different from everyone else
              </h2>
            </div>
            <div className="space-y-8">
              <div>
                <Check className="w-8 h-8 text-pink-400 mb-4" />
                <h5 className="text-xl font-semibold text-white mb-2">
                  We see the big picture clearly
                </h5>
                <p className="text-white/80">
                  While YouTube has one of the highest CPMs in the game, we've seen the enormous amount of value it brings to the table. As seasoned pros, we walk you through the process and help you avoid the pitfalls that plague most.
                </p>
              </div>
              
              <div>
                <Check className="w-8 h-8 text-pink-400 mb-4" />
                <h5 className="text-xl font-semibold text-white mb-2">
                  We push the creative boundaries
                </h5>
                <p className="text-white/80">
                  We believe that creators should be empowered to make what they want. That's why we craft custom creative briefs for each creator that outlines the campaign and includes "creative thought starters" to spawn new ideas.
                </p>
              </div>
              
              <div>
                <Check className="w-8 h-8 text-pink-400 mb-4" />
                <h5 className="text-xl font-semibold text-white mb-2">
                  We are creator-first all the time
                </h5>
                <p className="text-white/80">
                  We love our creators—seriously, they mean everything to us. As such, we encourage them to bring their best to the table, and they know that we—and our brand partners—will do the same. The results of this are truly mind-blowing!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

