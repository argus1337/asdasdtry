import Link from "next/link";

const trustedClients = [
  "Lyft",
  "Samsung",
  "Netflix",
  "Doritos",
  "Amazon",
  "TurboTax",
  "McDonald's",
  "Target",
  "J.Crew",
];

export function TrustSection() {
  return (
    <section id="trust" className="py-16 lg:py-24 bg-card/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-4 text-balance">
            The influencer marketing company{" "}
            <span className="gradient-text">chosen by the brands you trust</span>.
          </h2>
        </div>

        <div className="grid grid-cols-3 gap-6 sm:gap-8 max-w-3xl mx-auto mb-12">
          {trustedClients.map((client) => (
            <div
              key={client}
              className="flex items-center justify-center p-4 sm:p-6 bg-background/50 rounded-xl border border-border logo-grayscale"
            >
              <span className="text-lg sm:text-xl font-bold text-white/60 hover:text-white transition-all">
                {client}
              </span>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="#clients"
            className="inline-block px-8 py-4 text-lg font-semibold text-white gradient-button rounded-xl transition-all"
          >
            See all clients
          </Link>
        </div>
      </div>
    </section>
  );
}
