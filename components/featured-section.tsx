import Image from "next/image";

const pressLogos = [
  { name: "Business Insider", logo: "/images/6760831d67abf4e09f92f4d9_bi-logo.png" },
  { name: "Fox News", logo: "/images/6760a409a9a1d5a4841c00d4_Fox-News-Channel-Emblem.png" },
  { name: "CNN", logo: "/images/6760858177db164afc00a8c2_CNN-Logo.wine.png" },
  { name: "New York Post", logo: "/images/6760a45132e8d3772b62ce1a_New_York_Post_logo.png" },
  { name: "GQ", logo: "/images/67604d697d9edf61c7e32779_real-gq-logo.png" },
  { name: "TechCrunch", logo: "/images/676085d8cd10f56711bb3706_techchrunch.svg" },
  { name: "Newsweek", logo: "/images/6760a5732afef9cabb408770_newsweek-assets2.png" },
  { name: "Clutch", logo: "/images/67604bce5a477be84cf62e69_clutch-vector.png" },
];

export function FeaturedSection() {
  return (
    <section className="py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-semibold text-muted-foreground">
            Featured in:
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8">
          {pressLogos.map((logo) => (
            <div
              key={logo.name}
              className="flex items-center justify-center p-4 sm:p-6 logo-grayscale"
            >
              <Image
                src={logo.logo}
                alt={logo.name}
                width={150}
                height={60}
                className="h-10 w-auto object-contain opacity-40 hover:opacity-80 transition-opacity"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
