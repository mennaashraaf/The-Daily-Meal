import { Link } from "wouter";

export default function Hero() {
  return (
    <section className="relative bg-cover bg-center h-[70vh] flex items-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1498837167922-ddd27525d352?ixlib=rb-4.0.3')" }}>
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl">
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            Discover the Joy of Cooking
          </h1>
          <p className="text-white text-xl mb-8">
            Find, create, and share delicious recipes with our AI-powered chef assistant
          </p>
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
            <Link href="/recipes">
              <a className="bg-primary hover:bg-primary/90 text-white font-bold py-3 px-6 rounded-full text-center transition block">
                Explore Recipes
              </a>
            </Link>
            <Link href="/ai-chef">
              <a className="bg-white hover:bg-gray-100 text-neutral-800 font-bold py-3 px-6 rounded-full text-center transition block">
                Ask Chef Rania
              </a>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
