import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { recipeAPI } from "@/lib/api";
import RecipeCard from "@/components/recipes/RecipeCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

type RecipeFilterType = "featured" | "popular" | "new";

export default function FeaturedRecipes() {
  const [filter, setFilter] = useState<RecipeFilterType>("featured");
  
  const { data: recipes, isLoading, error } = useQuery({
    queryKey: [`/api/recipes/${filter}`],
    queryFn: () => {
      switch (filter) {
        case "featured":
          return recipeAPI.getFeaturedRecipes(6);
        case "popular":
          return recipeAPI.getPopularRecipes(6);
        case "new":
          return recipeAPI.getNewRecipes(6);
        default:
          return recipeAPI.getFeaturedRecipes(6);
      }
    }
  });

  if (isLoading) {
    return (
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
            <Skeleton className="h-10 w-64" />
            <div className="mt-4 md:mt-0 flex space-x-3">
              <Skeleton className="h-10 w-28" />
              <Skeleton className="h-10 w-28" />
              <Skeleton className="h-10 w-28" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl overflow-hidden shadow-md">
                <div className="h-56">
                  <Skeleton className="w-full h-full" />
                </div>
                <div className="p-5">
                  <div className="flex items-center mb-3">
                    <Skeleton className="h-6 w-20" />
                    <div className="ml-auto flex items-center">
                      <Skeleton className="h-4 w-12" />
                    </div>
                  </div>
                  <Skeleton className="h-6 w-4/5 mb-2" />
                  <Skeleton className="h-16 w-full mb-4" />
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-5 w-24" />
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-10 text-center">
            <Skeleton className="h-10 w-40 mx-auto" />
          </div>
        </div>
      </section>
    );
  }

  if (error || !recipes) {
    return (
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="font-heading text-3xl font-bold text-neutral-800 mb-8">Featured Recipes</h2>
          <div className="bg-neutral-100 rounded-xl p-8 text-center">
            <p className="text-gray-600">Could not load recipes. Please try again later.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          <h2 className="font-heading text-3xl font-bold text-neutral-800">Featured Recipes</h2>
          <div className="mt-4 md:mt-0 flex space-x-3">
            <Button 
              variant={filter === "featured" ? "default" : "outline"} 
              onClick={() => setFilter("featured")}
              className="rounded-full"
            >
              Featured
            </Button>
            <Button 
              variant={filter === "popular" ? "default" : "outline"} 
              onClick={() => setFilter("popular")}
              className="rounded-full"
            >
              Most Popular
            </Button>
            <Button 
              variant={filter === "new" ? "default" : "outline"} 
              onClick={() => setFilter("new")}
              className="rounded-full"
            >
              New
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
        
        <div className="mt-10 text-center">
          <Link 
            to="/recipes" 
            className="inline-flex items-center font-bold text-primary hover:text-primary/80"
          >
            View All Recipes
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
