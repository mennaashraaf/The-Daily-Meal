import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { recipeAPI } from "@/lib/api";
import { Star } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function RecipeOfTheDay() {
  const { data: recipe, isLoading, error } = useQuery({
    queryKey: ['/api/recipes/daily'],
    queryFn: recipeAPI.getRecipeOfTheDay
  });

  if (isLoading) {
    return (
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between mb-8">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-8 w-48 mt-2 md:mt-0" />
          </div>
          <div className="bg-neutral-100 rounded-xl overflow-hidden shadow-lg">
            <div className="flex flex-col lg:flex-row">
              <div className="lg:w-1/2 h-80 lg:h-auto">
                <Skeleton className="w-full h-full" />
              </div>
              <div className="lg:w-1/2 p-6 lg:p-10">
                <div className="flex items-center mb-3">
                  <Skeleton className="h-6 w-24" />
                  <div className="ml-auto flex items-center">
                    <Skeleton className="h-5 w-24" />
                  </div>
                </div>
                <Skeleton className="h-8 w-4/5 mb-3" />
                <Skeleton className="h-20 w-full mb-6" />
                <div className="flex flex-wrap gap-6 mb-6">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-28" />
                </div>
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                  <Skeleton className="h-10 w-32" />
                  <Skeleton className="h-10 w-24" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error || !recipe) {
    return (
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between mb-8">
            <h2 className="font-heading text-3xl font-bold text-neutral-800">Recipe of the Day</h2>
          </div>
          <div className="bg-neutral-100 rounded-xl overflow-hidden shadow-lg p-8 text-center">
            <p className="text-gray-600">Could not load today's featured recipe. Please try again later.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between mb-8">
          <h2 className="font-heading text-3xl font-bold text-neutral-800">Recipe of the Day</h2>
          <p className="font-accent text-xl text-primary">Handpicked by Chef Rania</p>
        </div>
        <div className="bg-neutral-100 rounded-xl overflow-hidden shadow-lg">
          <div className="flex flex-col lg:flex-row">
            {/* Recipe Image */}
            <div className="lg:w-1/2 h-80 lg:h-auto">
              <img 
                src={recipe.image_url || "https://images.unsplash.com/photo-1518492104633-130d0cc84637"} 
                alt={recipe.title} 
                className="w-full h-full object-cover"
              />
            </div>
            {/* Recipe Details */}
            <div className="lg:w-1/2 p-6 lg:p-10">
              <div className="flex items-center mb-3">
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-semibold">
                  {recipe.category_id === 1 ? "Breakfast" : 
                  recipe.category_id === 2 ? "Lunch" : 
                  recipe.category_id === 3 ? "Dinner" : 
                  recipe.category_id === 4 ? "Desserts" : 
                  recipe.category_id === 5 ? "Salads" : 
                  recipe.category_id === 6 ? "Pasta" : 
                  recipe.category_id === 7 ? "Vegetarian" : "Other"}
                </span>
                <div className="ml-auto flex items-center">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={16}
                        className={star <= 4 ? "text-amber-400 fill-amber-400" : "text-gray-300"}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-600">(128)</span>
                </div>
              </div>
              
              <h3 className="font-heading text-2xl lg:text-3xl font-bold mb-3">{recipe.title}</h3>
              <p className="text-gray-600 mb-6">{recipe.description}</p>
              
              <div className="flex flex-wrap gap-6 mb-6">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary mr-2 h-5 w-5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  <span>{recipe.prep_time + recipe.cook_time} mins</span>
                </div>
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary mr-2 h-5 w-5"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg>
                  <span>{recipe.servings} servings</span>
                </div>
                {recipe.calories && (
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary mr-2 h-5 w-5"><path d="M12 2v20"/><path d="m6 12 6-6 6 6"/><path d="M8 18h8"/></svg>
                    <span>{recipe.calories} cal</span>
                  </div>
                )}
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary mr-2 h-5 w-5"><path d="M12 8a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h0a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2Z"/><path d="M18.4 14.8a7.2 7.2 0 1 0-12.8 0"/><path d="M8.5 14.2a5.2 5.2 0 1 0 7 0"/></svg>
                  <span>{recipe.difficulty}</span>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                <Link href={`/recipes/${recipe.id}`}>
                  <a className="bg-primary hover:bg-primary/90 text-white font-bold py-2 px-6 rounded-full text-center transition block">
                    View Recipe
                  </a>
                </Link>
                <button className="flex items-center justify-center bg-white border border-gray-300 hover:bg-gray-50 text-neutral-800 font-bold py-2 px-6 rounded-full text-center transition">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-5 w-5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
