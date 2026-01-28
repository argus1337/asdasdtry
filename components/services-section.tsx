import Link from "next/link";

export function ServicesSection() {
  return (
    <section id="services" className="py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Left Column - Visual */}
          <div className="flex-1 w-full">
            <div className="relative aspect-[4/3] max-w-lg mx-auto lg:mx-0">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 rounded-3xl" />
              <div className="absolute inset-4 bg-card/50 backdrop-blur-sm rounded-2xl border border-border flex items-center justify-center">
                <div className="grid grid-cols-2 gap-4 p-6">
                  <div className="bg-primary/10 rounded-xl p-4 text-center">
                    <div className="text-3xl mb-2">📊</div>
                    <div className="text-sm text-white/80">Analytics</div>
                  </div>
                  <div className="bg-secondary/10 rounded-xl p-4 text-center">
                    <div className="text-3xl mb-2">🎯</div>
                    <div className="text-sm text-white/80">Targeting</div>
                  </div>
                  <div className="bg-accent/10 rounded-xl p-4 text-center">
                    <div className="text-3xl mb-2">🤝</div>
                    <div className="text-sm text-white/80">Matching</div>
                  </div>
                  <div className="bg-primary/10 rounded-xl p-4 text-center">
                    <div className="text-3xl mb-2">📈</div>
                    <div className="text-sm text-white/80">Growth</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Content */}
          <div className="flex-1 text-center lg:text-left">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-6 text-balance">
              A <span className="gradient-text">full-service influencer marketing agency</span> with end-to-end campaign management.
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              From strategy development to creator sourcing, content creation oversight, 
              campaign execution, and performance analysis—we handle everything so you can 
              focus on what matters most: growing your brand.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <Link
                href="#contact"
                className="inline-block px-8 py-4 text-lg font-semibold text-white gradient-button rounded-xl transition-all whitespace-nowrap"
              >
                Collaborations
              </Link>
              <Link
                href="#how-it-works"
                className="text-primary hover:text-primary/80 font-medium underline underline-offset-4 transition-colors"
              >
                {"Here's the full breakdown of how it works"}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
