import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Recipe, Rating } from "@/lib/types";
import { recipeAPI } from "@/lib/api";
import { useAuth } from "@/providers/AuthProvider";
import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Clock,
  UtensilsCrossed,
  Flame,
  Medal,
  Heart,
  Share2,
  Star,
  Youtube,
  ArrowLeft,
} from "lucide-react";

interface RecipeDetailProps {
  recipe: Recipe;
}

export default function RecipeDetail({ recipe }: RecipeDetailProps) {
  const [location, navigate] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isRatingDialogOpen, setIsRatingDialogOpen] = useState(false);
  
  // Get isFavorite status
  const { data: favoriteData } = useQuery({
    queryKey: [`/api/recipes/${recipe.id}/is-favorite`],
    queryFn: () => recipeAPI.isFavorite(recipe.id),
    enabled: isAuthenticated
  });
  
  const isFavorite = favoriteData?.isFavorite || false;
  
  // Get ratings
  const { data: ratings } = useQuery({
    queryKey: [`/api/recipes/${recipe.id}/ratings`],
    queryFn: () => recipeAPI.getRatings(recipe.id)
  });
  
  // Mutations
  const favoriteRecipeMutation = useMutation({
    mutationFn: () => recipeAPI.favoriteRecipe(recipe.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/recipes/${recipe.id}/is-favorite`] });
      toast({
        title: "Recipe saved",
        description: "This recipe has been added to your favorites",
      });
    }
  });
  
  const unfavoriteRecipeMutation = useMutation({
    mutationFn: () => recipeAPI.unfavoriteRecipe(recipe.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/recipes/${recipe.id}/is-favorite`] });
      toast({
        title: "Recipe removed",
        description: "This recipe has been removed from your favorites",
      });
    }
  });
  
  const rateRecipeMutation = useMutation({
    mutationFn: (data: { rating: number; comment?: string }) => 
      recipeAPI.rateRecipe(recipe.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/recipes/${recipe.id}/ratings`] });
      toast({
        title: "Thank you for rating",
        description: "Your review has been submitted successfully",
      });
      setIsRatingDialogOpen(false);
      setComment("");
    }
  });
  
  // Helper functions
  const getCategoryName = (categoryId: number) => {
    const categories = ["Breakfast", "Lunch", "Dinner", "Desserts", "Salads", "Pasta", "Vegetarian"];
    if (categoryId >= 1 && categoryId <= categories.length) {
      return categories[categoryId - 1];
    }
    return "Other";
  };
  
  const getKitchenName = (kitchenId: number) => {
    const kitchens = ["Italian", "Thai", "Mexican", "Indian", "American"];
    if (kitchenId >= 1 && kitchenId <= kitchens.length) {
      return kitchens[kitchenId - 1];
    }
    return "Other";
  };
  
  const handleFavoriteClick = () => {
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please login to save recipes to your favorites",
        variant: "default"
      });
      return;
    }
    
    if (isFavorite) {
      unfavoriteRecipeMutation.mutate();
    } else {
      favoriteRecipeMutation.mutate();
    }
  };
  
  const handleRatingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please login to rate recipes",
        variant: "default"
      });
      return;
    }
    
    rateRecipeMutation.mutate({ rating, comment });
  };
  
  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: recipe.title,
          text: recipe.description,
          url: window.location.href
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link copied",
          description: "Recipe link copied to clipboard",
        });
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };
  
  // Calculate average rating
  const averageRating = ratings && ratings.length > 0
    ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
    : 0;
  
  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 py-6">
        {/* Back button and navigation */}
        <div className="mb-6">
          <Button 
            variant="ghost" 
            className="flex items-center text-gray-600 hover:text-primary" 
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to recipes
          </Button>
        </div>
        
        {/* Recipe header */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-semibold">
              {getCategoryName(recipe.category_id)}
            </span>
            <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-semibold">
              {getKitchenName(recipe.kitchen_id)}
            </span>
            <div className="ml-auto flex items-center">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={16}
                    className={star <= Math.round(averageRating) ? "text-amber-400 fill-amber-400" : "text-gray-300"}
                  />
                ))}
              </div>
              <span className="ml-2 text-sm text-gray-600">
                ({ratings?.length || 0} {ratings?.length === 1 ? 'review' : 'reviews'})
              </span>
            </div>
          </div>
          
          <h1 className="font-heading text-3xl md:text-4xl font-bold mb-4">{recipe.title}</h1>
          <p className="text-gray-700 text-lg mb-6">{recipe.description}</p>
          
          <div className="flex flex-wrap gap-6 mb-6">
            <div className="flex items-center">
              <Clock className="text-primary mr-2 h-5 w-5" />
              <span>Prep: {recipe.prep_time} mins</span>
            </div>
            <div className="flex items-center">
              <UtensilsCrossed className="text-primary mr-2 h-5 w-5" />
              <span>Cook: {recipe.cook_time} mins</span>
            </div>
            <div className="flex items-center">
              <UtensilsCrossed className="text-primary mr-2 h-5 w-5" />
              <span>{recipe.servings} servings</span>
            </div>
            {recipe.calories && (
              <div className="flex items-center">
                <Flame className="text-primary mr-2 h-5 w-5" />
                <span>{recipe.calories} cal</span>
              </div>
            )}
            <div className="flex items-center">
              <Medal className="text-primary mr-2 h-5 w-5" />
              <span>{recipe.difficulty}</span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <Button
              variant={isFavorite ? "default" : "outline"}
              className={isFavorite ? "bg-primary text-white" : ""}
              onClick={handleFavoriteClick}
            >
              <Heart className={`mr-2 h-4 w-4 ${isFavorite ? "fill-white" : ""}`} />
              {isFavorite ? "Saved" : "Save Recipe"}
            </Button>
            
            <Button variant="outline" onClick={handleShare}>
              <Share2 className="mr-2 h-4 w-4" />
              Share Recipe
            </Button>
            
            <Dialog open={isRatingDialogOpen} onOpenChange={setIsRatingDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Star className="mr-2 h-4 w-4" />
                  Rate Recipe
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Rate this Recipe</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleRatingSubmit} className="mt-4 space-y-4">
                  <div>
                    <div className="flex justify-center mb-4">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="p-1"
                        >
                          <Star
                            size={32}
                            className={star <= rating ? "text-amber-400 fill-amber-400" : "text-gray-300"}
                          />
                        </button>
                      ))}
                    </div>
                    <Textarea
                      placeholder="Share your experience with this recipe (optional)"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="min-h-[100px]"
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button type="submit">Submit Rating</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
            
            {recipe.youtube_url && (
              <a
                href={recipe.youtube_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
              >
                <Youtube className="mr-2 h-4 w-4 text-red-600" />
                Watch Video
              </a>
            )}
          </div>
        </div>
        
        {/* Recipe image */}
        <div className="mb-10">
          <img
            src={recipe.image_url || `https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600`}
            alt={recipe.title}
            className="w-full h-96 object-cover rounded-xl"
          />
        </div>
        
        {/* Recipe content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Ingredients */}
          <div className="lg:col-span-1">
            <h2 className="font-heading text-2xl font-bold mb-4">Ingredients</h2>
            <div className="bg-neutral-50 p-6 rounded-xl">
              <ul className="space-y-3">
                {Array.isArray(recipe.ingredients) ? recipe.ingredients.map((ingredient, index) => (
                  <li key={index} className="flex items-start">
                    <span className="inline-block w-2 h-2 rounded-full bg-primary mt-2 mr-3"></span>
                    <span>{ingredient}</span>
                  </li>
                )) : (
                  <li>No ingredients available</li>
                )}
              </ul>
            </div>
          </div>
          
          {/* Instructions */}
          <div className="lg:col-span-2">
            <h2 className="font-heading text-2xl font-bold mb-4">Instructions</h2>
            <div className="space-y-6">
              {Array.isArray(recipe.steps) ? recipe.steps.map((step, index) => (
                <div key={index} className="flex">
                  <div className="mr-4 flex-shrink-0">
                    <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-700">{step}</p>
                  </div>
                </div>
              )) : (
                <p>No instructions available</p>
              )}
            </div>
          </div>
        </div>
        
        {/* Reviews section */}
        <div className="mt-16">
          <h2 className="font-heading text-2xl font-bold mb-6">Reviews</h2>
          
          {(!ratings || ratings.length === 0) ? (
            <div className="bg-neutral-50 p-6 rounded-xl text-center">
              <p className="text-gray-600">No reviews yet. Be the first to rate this recipe!</p>
              <Button 
                className="mt-4" 
                onClick={() => setIsRatingDialogOpen(true)}
                disabled={!isAuthenticated}
              >
                Write a Review
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {ratings.map((rating: Rating) => (
                <div key={rating.id} className="border-b border-gray-200 pb-6">
                  <div className="flex items-center mb-2">
                    <div className="flex mr-3">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={16}
                          className={star <= rating.rating ? "text-amber-400 fill-amber-400" : "text-gray-300"}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">
                      {formatDate(rating.created_at)}
                    </span>
                  </div>
                  {rating.comment && (
                    <p className="text-gray-700">{rating.comment}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
