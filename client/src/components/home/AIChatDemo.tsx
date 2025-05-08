import { ChefHat, Camera, HelpCircle } from "lucide-react";

export default function AIChatDemo() {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="font-heading text-3xl font-bold text-neutral-800 text-center mb-10">
          How Chef Rania Can Help You
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-neutral-100 p-6 rounded-xl">
            <div className="w-16 h-16 bg-primary/20 text-primary rounded-full flex items-center justify-center mb-4 text-2xl">
              <ChefHat size={28} />
            </div>
            <h3 className="font-heading font-bold text-xl mb-3">Recipe Suggestions</h3>
            <p className="text-gray-700 mb-3">
              Ask Chef Rania for recipe ideas based on ingredients you have, dietary restrictions, or cuisine preferences.
            </p>
            <p className="font-accent text-primary text-lg">
              "What can I make with chicken, bell peppers, and rice?"
            </p>
          </div>
          
          <div className="bg-neutral-100 p-6 rounded-xl">
            <div className="w-16 h-16 bg-primary/20 text-primary rounded-full flex items-center justify-center mb-4 text-2xl">
              <Camera size={28} />
            </div>
            <h3 className="font-heading font-bold text-xl mb-3">Ingredient Recognition</h3>
            <p className="text-gray-700 mb-3">
              Upload a photo of ingredients in your fridge, and Chef Rania will suggest recipes you can make with them.
            </p>
            <p className="font-accent text-primary text-lg">
              "I'll analyze what you have and create something delicious!"
            </p>
          </div>
          
          <div className="bg-neutral-100 p-6 rounded-xl">
            <div className="w-16 h-16 bg-primary/20 text-primary rounded-full flex items-center justify-center mb-4 text-2xl">
              <HelpCircle size={28} />
            </div>
            <h3 className="font-heading font-bold text-xl mb-3">Cooking Guidance</h3>
            <p className="text-gray-700 mb-3">
              Get step-by-step instructions, substitution ideas, and troubleshooting help while you cook.
            </p>
            <p className="font-accent text-primary text-lg">
              "What can I use instead of heavy cream in this recipe?"
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
