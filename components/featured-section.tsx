const pressLogos = [
  "Business Insider",
  "Fox News",
  "CNN",
  "New York Post",
  "GQ",
  "TechCrunch",
  "Newsweek",
  "Clutch",
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
              key={logo}
              className="flex items-center justify-center p-4 sm:p-6 logo-grayscale"
            >
              <span className="text-sm sm:text-base font-medium text-white/40 hover:text-white/80 transition-all text-center">
                {logo}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
