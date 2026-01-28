import Link from "next/link";
import Image from "next/image";

const trustedClients = [
  { name: "Lyft", logo: "/images/6418996a19486aace8d5e835_lyft-logo_1.svg" },
  { name: "Samsung", logo: "/images/62bbcb8a72e59cd3afc29496_Samsung_wordmark.svg.png" },
  { name: "Netflix", logo: "/images/64189ad736481a26d5793180_Netflix_2015_logo_1.svg" },
  { name: "Doritos", logo: "/images/62bbca44e02d27f37c08208b_doritos_PNG37.png" },
  { name: "Amazon", logo: "/images/62833b9627cc9965e37886e9_Amazon_logo_1.svg" },
  { name: "TurboTax", logo: "/images/62bbca4317573e92e2392746_TurboTax-Logo.png" },
  { name: "McDonald's", logo: "/images/62bbcb2961e2f315ef92b0e4_McDonald's_Golden_Arches.svg.png" },
  { name: "Target", logo: "/images/62bbca43fb74e1e7e26aa8dd_Target.png" },
  { name: "J.Crew", logo: "/images/655d2edc32fa44f902b50909_jcrewlogo.svg" },
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
              key={client.name}
              className="flex items-center justify-center p-4 sm:p-6 bg-background/50 rounded-xl border border-border logo-grayscale"
            >
              <Image
                src={client.logo}
                alt={client.name}
                width={120}
                height={60}
                className="h-10 w-auto object-contain opacity-60 hover:opacity-100 transition-opacity"
              />
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/clients"
            className="inline-block px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-xl transition-all"
          >
            See all clients
          </Link>
        </div>
      </div>
    </section>
  );
}
