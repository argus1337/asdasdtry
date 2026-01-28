const clients = [
  { name: "Disney", logo: "Disney" },
  { name: "Amazon", logo: "Amazon" },
  { name: "GNC", logo: "GNC" },
  { name: "Lyft", logo: "Lyft" },
  { name: "Crocs", logo: "Crocs" },
  { name: "Blue Chew", logo: "BlueChew" },
];

export function ClientLogos() {
  return (
    <section className="py-12 lg:py-16 border-y border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
          {clients.map((client) => (
            <div
              key={client.name}
              className="flex items-center justify-center p-4 logo-grayscale"
            >
              <div className="text-xl sm:text-2xl font-bold text-white/60 hover:text-white transition-all">
                {client.logo}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
