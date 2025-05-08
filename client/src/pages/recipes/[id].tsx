import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { recipeAPI } from "@/lib/api";
import RecipeDetail from "@/components/recipes/RecipeDetail";
import { Helmet } from "react-helmet";

export default function RecipeDetailPage() {
  // Get recipe ID from URL
  const [, params] = useRoute("/recipes/:id");
  const recipeId = params?.id ? parseInt(params.id) : undefined;
  
  // Fetch recipe data
  const { data: recipe, isLoading, error } = useQuery({
    queryKey: [`/api/recipes/${recipeId}`],
    queryFn: () => recipeId ? recipeAPI.getRecipe(recipeId) : Promise.reject("No recipe ID"),
    enabled: !!recipeId
  });
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading recipe...</p>
          </div>
        </div>
      </div>
    );
  }
  
  if (error || !recipe) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <h1 className="font-heading text-2xl font-bold text-red-600 mb-4">Recipe Not Found</h1>
          <p className="text-gray-600 mb-6">
            The recipe you're looking for doesn't exist or has been removed.
          </p>
          <a
            href="/recipes"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-white hover:bg-primary/90 h-10 px-4 py-2"
          >
            Browse Recipes
          </a>
        </div>
      </div>
    );
  }
  
  return (
    <>
      <Helmet>
        <title>{recipe.title} | The Daily Meal</title>
        <meta name="description" content={recipe.description} />
        <meta property="og:title" content={`${recipe.title} | The Daily Meal`} />
        <meta property="og:description" content={recipe.description} />
        <meta property="og:image" content={recipe.image_url} />
        <meta property="og:type" content="article" />
      </Helmet>
      
      <RecipeDetail recipe={recipe} />
    </>
  );
}
