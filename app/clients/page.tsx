import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

const clients = [
  "Netflix", "J. Crew", "Amazon", "Target", "Spotify", "Johnson & Johnson",
  "TurboTax", "Lyft", "DoorDash", "Adobe", "McDonald's", "Jimmy John's",
  "Cash App", "Subway", "Samsung", "Doritos", "Nerf", "Oikos", "Popeyes",
  "Shell", "Soylent", "Steve Madden", "Taser", "ThredUp", "Victoria's Secret Pink",
  "Saatva", "Wienerschnitzel", "Bloom Nutrition", "Avocado", "Conair", "Hollister",
  "Clorox", "Tobasco", "Aveeno", "Magic Spoon", "AliBaba", "Hers", "The Inkey List",
  "One A Day", "Aerie", "Casetify", "Whisker", "Broadway Licensing Group", "Casper",
  "BlueChew", "Klipsch", "GNC", "Crocs"
];

export default function ClientsPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-pink-900/20 blur-3xl" />
        <div className="container relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-sm font-semibold text-purple-400 uppercase tracking-wider mb-4">
            CLIENTS
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            The best brands choose CreateSync.
          </h1>
          <p className="text-lg text-white/80 mb-8 max-w-3xl mx-auto">
            High-growth startup? Check. Fortune 500? Check. We help brands of every size and industry drive sales with world-class influencer marketing campaigns.
          </p>
        </div>
      </section>

      {/* Clients Grid */}
      <section className="py-20">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {clients.map((client, index) => (
              <div
                key={index}
                className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all text-center"
              >
                <div className="text-white/80 font-medium">{client}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

