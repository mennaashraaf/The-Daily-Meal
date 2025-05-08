import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { recipeAPI, categoryAPI } from "@/lib/api";
import RecipeCard from "@/components/recipes/RecipeCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Slider
} from "@/components/ui/slider";
import { Search, Filter, Clock, X } from "lucide-react";
import { Helmet } from "react-helmet";

export default function RecipesPage() {
  const [location, setLocation] = useLocation();
  const [searchParams, setSearchParams] = useState(new URLSearchParams(window.location.search));
  
  // Form state
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "");
  const [selectedKitchen, setSelectedKitchen] = useState(searchParams.get("kitchen") || "");
  const [timeRange, setTimeRange] = useState<number[]>([0, 180]);
  const [showFilters, setShowFilters] = useState(false);
  
  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("search", searchQuery);
    if (selectedCategory) params.set("category", selectedCategory);
    if (selectedKitchen) params.set("kitchen", selectedKitchen);
    
    const url = `/recipes${params.toString() ? `?${params.toString()}` : ''}`;
    setLocation(url, { replace: true });
    setSearchParams(params);
  }, [searchQuery, selectedCategory, selectedKitchen, setLocation]);
  
  // Fetch recipes
  const { data: recipes, isLoading: recipesLoading } = useQuery({
    queryKey: ['/api/recipes', searchParams.toString()],
    queryFn: () => recipeAPI.getRecipes({
      search: searchParams.get("search") || undefined,
      category: searchParams.get("category") ? Number(searchParams.get("category")) : undefined,
      kitchen: searchParams.get("kitchen") ? Number(searchParams.get("kitchen")) : undefined,
    })
  });
  
  // Fetch categories
  const { data: categories } = useQuery({
    queryKey: ['/api/categories'],
    queryFn: categoryAPI.getCategories
  });
  
  // Fetch kitchens
  const { data: kitchens } = useQuery({
    queryKey: ['/api/categories/kitchens'],
    queryFn: categoryAPI.getKitchens
  });
  
  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      if (searchQuery) {
        params.set("search", searchQuery);
      } else {
        params.delete("search");
      }
      return params;
    });
  };
  
  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setSelectedKitchen("");
    setTimeRange([0, 180]);
    setSearchParams(new URLSearchParams());
    setLocation("/recipes", { replace: true });
  };
  
  // Apply time filter (not implemented in backend yet)
  const handleTimeFilter = (values: number[]) => {
    setTimeRange(values);
  };
  
  // Filter recipes by time (client-side filtering as example)
  const filteredRecipes = recipes?.filter(recipe => {
    const totalTime = recipe.prep_time + recipe.cook_time;
    return totalTime >= timeRange[0] && totalTime <= timeRange[1];
  });
  
  return (
    <>
      <Helmet>
        <title>Recipes | The Daily Meal</title>
        <meta name="description" content="Browse our collection of delicious recipes. Filter by category, cuisine, or preparation time to find the perfect meal for any occasion." />
      </Helmet>
      
      <div className="bg-neutral-50 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="font-heading text-3xl font-bold text-neutral-800 mb-2">
              Explore Recipes
            </h1>
            <p className="text-gray-600">
              Discover delicious recipes for every occasion
            </p>
          </div>
          
          {/* Search and Filters */}
          <div className="bg-white rounded-xl shadow-sm mb-8 p-6">
            <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-grow relative">
                <Search className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Search recipes, ingredients..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button type="submit" className="md:w-auto">
                Search
              </Button>
              <Button
                type="button"
                variant="outline"
                className="md:w-auto"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </form>
            
            {showFilters && (
              <div className="space-y-6 border-t pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Category
                    </label>
                    <Select
                      value={selectedCategory}
                      onValueChange={setSelectedCategory}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All categories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All categories</SelectItem>
                        {categories?.map((category) => (
                          <SelectItem
                            key={category.id}
                            value={category.id.toString()}
                          >
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Cuisine
                    </label>
                    <Select
                      value={selectedKitchen}
                      onValueChange={setSelectedKitchen}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All cuisines" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All cuisines</SelectItem>
                        {kitchens?.map((kitchen) => (
                          <SelectItem
                            key={kitchen.id}
                            value={kitchen.id.toString()}
                          >
                            {kitchen.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium">
                      Total Time
                    </label>
                    <span className="text-sm text-gray-600">
                      {timeRange[0]} - {timeRange[1]} mins
                    </span>
                  </div>
                  <Slider
                    defaultValue={[0, 180]}
                    max={180}
                    step={15}
                    value={timeRange}
                    onValueChange={handleTimeFilter}
                  />
                </div>
                
                <div className="flex justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={clearFilters}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Clear Filters
                  </Button>
                </div>
              </div>
            )}
            
            {/* Active filters */}
            {(searchQuery || selectedCategory || selectedKitchen) && (
              <div className="flex flex-wrap gap-2 mt-4">
                {searchQuery && (
                  <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm flex items-center">
                    <span>Search: {searchQuery}</span>
                    <button
                      onClick={() => setSearchQuery("")}
                      className="ml-2"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}
                
                {selectedCategory && categories && (
                  <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm flex items-center">
                    <span>
                      Category: {categories.find(c => c.id.toString() === selectedCategory)?.name}
                    </span>
                    <button
                      onClick={() => setSelectedCategory("")}
                      className="ml-2"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}
                
                {selectedKitchen && kitchens && (
                  <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm flex items-center">
                    <span>
                      Cuisine: {kitchens.find(k => k.id.toString() === selectedKitchen)?.name}
                    </span>
                    <button
                      onClick={() => setSelectedKitchen("")}
                      className="ml-2"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}
                
                {(timeRange[0] > 0 || timeRange[1] < 180) && (
                  <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm flex items-center">
                    <span>
                      Time: {timeRange[0]} - {timeRange[1]} mins
                    </span>
                    <button
                      onClick={() => setTimeRange([0, 180])}
                      className="ml-2"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Recipe Grid */}
          {recipesLoading ? (
            <div className="text-center py-12">
              <Clock className="animate-spin h-8 w-8 mx-auto text-primary mb-4" />
              <p>Loading recipes...</p>
            </div>
          ) : filteredRecipes && filteredRecipes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRecipes.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm">
              <h3 className="font-heading font-bold text-xl mb-2">No recipes found</h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your filters or search criteria.
              </p>
              <Button onClick={clearFilters}>Clear All Filters</Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
