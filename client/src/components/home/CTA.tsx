import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/AuthProvider";

export default function CTA() {
  const { isAuthenticated } = useAuth();
  
  return (
    <section className="py-16 bg-primary">
      <div className="container mx-auto px-4 text-center">
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-6">
          Ready to start your culinary journey?
        </h2>
        <p className="text-white/90 text-lg max-w-2xl mx-auto mb-10">
          Join thousands of home cooks who are discovering new recipes, sharing their creations, and improving their cooking skills with The Daily Meal.
        </p>
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
          {!isAuthenticated ? (
            <Link href="/auth/register">
              <Button className="bg-white hover:bg-gray-100 text-primary font-bold py-3 px-8 rounded-full text-lg w-full sm:w-auto">
                Sign Up for Free
              </Button>
            </Link>
          ) : (
            <Link href="/recipes/new">
              <Button className="bg-white hover:bg-gray-100 text-primary font-bold py-3 px-8 rounded-full text-lg w-full sm:w-auto">
                Share Your Recipe
              </Button>
            </Link>
          )}
          <Link href="/ai-chef">
            <Button variant="outline" className="bg-transparent hover:bg-white/10 border-2 border-white text-white font-bold py-3 px-8 rounded-full text-lg w-full sm:w-auto">
              Ask Chef Rania
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
