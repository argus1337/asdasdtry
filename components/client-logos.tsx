import Image from "next/image";

const clients = [
  { name: "Disney", logo: "/images/62833b96aef969eb76b8faf7_Disney_wordmark_1.svg" },
  { name: "Amazon", logo: "/images/62833b9627cc9965e37886e9_Amazon_logo_1.svg" },
  { name: "GNC", logo: "/images/6658a24915de1e79bf4cac2a_gnc.png" },
  { name: "Lyft", logo: "/images/6418996a19486aace8d5e835_lyft-logo_1.svg" },
  { name: "Crocs", logo: "/images/6658a289fff29b1650697847_crocs.png" },
  { name: "BlueChew", logo: "/images/6658a0ed71d87a6d8bc6e551_bluechew.png" },
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
              <Image
                src={client.logo}
                alt={client.name}
                width={120}
                height={60}
                className="h-8 w-auto object-contain opacity-60 hover:opacity-100 transition-opacity"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
