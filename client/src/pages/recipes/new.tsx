import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/providers/AuthProvider";
import RecipeForm from "@/components/recipes/RecipeForm";
import { Helmet } from "react-helmet";

export default function NewRecipePage() {
  const [, navigate] = useLocation();
  const { isAuthenticated, isLoading } = useAuth();
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/auth/login?redirect=/recipes/new");
    }
  }, [isAuthenticated, isLoading, navigate]);
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return null; // Will redirect to login
  }
  
  return (
    <>
      <Helmet>
        <title>Submit a Recipe | The Daily Meal</title>
        <meta name="description" content="Share your favorite recipe with the Daily Meal community. Submit your ingredients, instructions, and photos to showcase your culinary creation." />
      </Helmet>
      
      <div className="bg-neutral-50 min-h-screen py-8">
        <div className="container mx-auto px-4">
          <h1 className="font-heading text-3xl font-bold text-neutral-800 mb-6">Submit a Recipe</h1>
          <p className="text-gray-600 mb-8">
            Share your culinary creation with the Daily Meal community
          </p>
          
          <RecipeForm />
        </div>
      </div>
    </>
  );
}
