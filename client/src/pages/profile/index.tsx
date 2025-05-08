import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { recipeAPI } from "@/lib/api";
import { useAuth } from "@/providers/AuthProvider";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { User, Settings, BookOpen, Heart } from "lucide-react";
import RecipeCard from "@/components/recipes/RecipeCard";
import { Helmet } from "react-helmet";

export default function ProfilePage() {
  const [, navigate] = useLocation();
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("my-recipes");
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/auth/login?redirect=/profile");
    }
  }, [isAuthenticated, isLoading, navigate]);
  
  // Fetch user's recipes
  const { data: userRecipes, isLoading: recipesLoading } = useQuery({
    queryKey: ['/api/recipes', { author: user?.id }],
    queryFn: () => recipeAPI.getRecipes({ author: user?.id }),
    enabled: !!user
  });
  
  // Fetch user's favorites
  const { data: userFavorites, isLoading: favoritesLoading } = useQuery({
    queryKey: ['/api/profile/favorites'],
    queryFn: async () => {
      const recipes = await Promise.all(
        userRecipes?.filter(recipe => recipe.favorites_count > 0).map(async recipe => {
          const { isFavorite } = await recipeAPI.isFavorite(recipe.id);
          return { ...recipe, isFavorite };
        }) || []
      );
      return recipes.filter(recipe => recipe.isFavorite);
    },
    enabled: !!userRecipes
  });
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }
  
  if (!isAuthenticated || !user) {
    return null; // Will redirect to login
  }
  
  return (
    <>
      <Helmet>
        <title>My Profile | The Daily Meal</title>
        <meta name="description" content="Manage your recipes, favorites, and account settings on The Daily Meal." />
      </Helmet>
      
      <div className="bg-neutral-50 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          {/* Profile Header */}
          <div className="bg-white rounded-xl shadow-sm mb-8 p-6">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={user.avatar_url} alt={user.username} />
                <AvatarFallback>{user.username?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
              </Avatar>
              
              <div className="flex-grow text-center md:text-left">
                <h1 className="font-heading text-2xl font-bold mb-1">{user.name || user.username}</h1>
                <p className="text-gray-600 mb-4">@{user.username}</p>
                
                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                  <div>
                    <span className="text-gray-500">Recipes</span>
                    <p className="font-bold">{userRecipes?.length || 0}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Favorites</span>
                    <p className="font-bold">{userFavorites?.length || 0}</p>
                  </div>
                  {user.role === "admin" && (
                    <div>
                      <span className="text-gray-500">Role</span>
                      <p className="font-bold text-primary">Admin</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex flex-col gap-2">
                <Button
                  variant="outline"
                  className="flex items-center"
                  onClick={() => navigate("/profile/settings")}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
                
                {user.role === "admin" && (
                  <Button
                    variant="outline"
                    className="flex items-center"
                    onClick={() => navigate("/admin")}
                  >
                    <User className="h-4 w-4 mr-2" />
                    Admin Dashboard
                  </Button>
                )}
                
                <Button
                  variant="ghost"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={() => logout()}
                >
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
          
          {/* Tabs Section */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="my-recipes" className="flex items-center">
                <BookOpen className="h-4 w-4 mr-2" />
                My Recipes
              </TabsTrigger>
              <TabsTrigger value="favorites" className="flex items-center">
                <Heart className="h-4 w-4 mr-2" />
                Favorites
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="my-recipes">
              {recipesLoading ? (
                <div className="text-center py-12">
                  <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading your recipes...</p>
                </div>
              ) : userRecipes && userRecipes.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {userRecipes.map((recipe) => (
                    <RecipeCard key={recipe.id} recipe={recipe} />
                  ))}
                </div>
              ) : (
                <Card className="p-12 text-center">
                  <h3 className="font-heading font-bold text-xl mb-2">You haven't created any recipes yet</h3>
                  <p className="text-gray-600 mb-6">
                    Share your favorite recipes with the Daily Meal community
                  </p>
                  <Button onClick={() => navigate("/recipes/new")}>
                    Create Your First Recipe
                  </Button>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="favorites">
              {favoritesLoading ? (
                <div className="text-center py-12">
                  <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading your favorites...</p>
                </div>
              ) : userFavorites && userFavorites.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {userFavorites.map((recipe) => (
                    <RecipeCard key={recipe.id} recipe={recipe} isFavorite={true} />
                  ))}
                </div>
              ) : (
                <Card className="p-12 text-center">
                  <h3 className="font-heading font-bold text-xl mb-2">No favorite recipes yet</h3>
                  <p className="text-gray-600 mb-6">
                    Save recipes you love to find them easily later
                  </p>
                  <Button onClick={() => navigate("/recipes")}>
                    Browse Recipes
                  </Button>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
