import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, Clock } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Recipe } from "@/lib/types";
import { recipeAPI } from "@/lib/api";
import { useAuth } from "@/providers/AuthProvider";
import { useToast } from "@/hooks/use-toast";

interface RecipeCardProps {
  recipe: Recipe;
  isFavorite?: boolean;
}

export default function RecipeCard({ recipe, isFavorite = false }: RecipeCardProps) {
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [favorite, setFavorite] = useState(isFavorite);
  
  // Get cuisine name based on kitchen_id
  const getKitchenName = (kitchenId: number) => {
    const kitchens = ["Italian", "Thai", "Mexican", "Indian", "American"];
    if (kitchenId >= 1 && kitchenId <= kitchens.length) {
      return kitchens[kitchenId - 1];
    }
    return "Other";
  };
  
  // Calculate total time
  const totalTime = recipe.prep_time + recipe.cook_time;
  
  // Mutations for favorite/unfavorite
  const favoriteRecipeMutation = useMutation({
    mutationFn: () => recipeAPI.favoriteRecipe(recipe.id),
    onSuccess: () => {
      setFavorite(true);
      queryClient.invalidateQueries({ queryKey: ['/api/recipes'] });
      queryClient.invalidateQueries({ queryKey: ['/api/recipes/popular'] });
      queryClient.invalidateQueries({ queryKey: ['/api/recipes/featured'] });
      if (user) {
        queryClient.invalidateQueries({ queryKey: ['/api/profile/favorites'] });
      }
    }
  });
  
  const unfavoriteRecipeMutation = useMutation({
    mutationFn: () => recipeAPI.unfavoriteRecipe(recipe.id),
    onSuccess: () => {
      setFavorite(false);
      queryClient.invalidateQueries({ queryKey: ['/api/recipes'] });
      queryClient.invalidateQueries({ queryKey: ['/api/recipes/popular'] });
      queryClient.invalidateQueries({ queryKey: ['/api/recipes/featured'] });
      if (user) {
        queryClient.invalidateQueries({ queryKey: ['/api/profile/favorites'] });
      }
    }
  });
  
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please login to save recipes to your favorites",
        variant: "default"
      });
      return;
    }
    
    if (favorite) {
      unfavoriteRecipeMutation.mutate();
    } else {
      favoriteRecipeMutation.mutate();
    }
  };
  
  return (
    <div className="recipe-card bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl">
      <div className="relative h-56">
        <img 
          src={recipe.image_url || `https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400`} 
          alt={recipe.title} 
          className="w-full h-full object-cover"
        />
        <button 
          className={`absolute top-3 right-3 p-2 rounded-full shadow-md transition ${
            favorite ? 'bg-primary text-white' : 'bg-white text-neutral-800 hover:bg-primary hover:text-white'
          }`}
          onClick={handleFavoriteClick}
          aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart size={18} className={favorite ? "fill-white" : ""} />
        </button>
      </div>
      <div className="p-5">
        <div className="flex items-center mb-3">
          <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-semibold">
            {getKitchenName(recipe.kitchen_id)}
          </span>
          <div className="ml-auto flex items-center">
            <span className="text-amber-400">★</span>
            <span className="ml-1 text-sm text-gray-600">
              {(Math.random() * (5 - 3.8) + 3.8).toFixed(1)}
            </span>
          </div>
        </div>
        <h3 className="font-heading font-bold text-lg mb-2">{recipe.title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{recipe.description}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Clock className="text-primary mr-2 h-4 w-4" />
            <span className="text-sm">{totalTime} mins</span>
          </div>
          <Link 
            to={`/recipes/${recipe.id}`} 
            className="text-primary hover:text-primary/80 font-medium text-sm"
          >
            View Recipe
          </Link>
        </div>
      </div>
    </div>
  );
}
