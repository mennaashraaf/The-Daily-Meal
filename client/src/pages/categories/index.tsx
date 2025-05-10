import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { categoryAPI } from "@/lib/api";
import { Category, Kitchen } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";

export default function CategoriesPage() {
  const { data: categories, isLoading } = useQuery({
    queryKey: ['/api/categories'],
    queryFn: categoryAPI.getCategories
  });

  const { data: kitchens, isLoading: kitchensLoading } = useQuery({
    queryKey: ['/api/kitchens'],
    queryFn: categoryAPI.getKitchens
  });

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-heading font-bold mb-8 text-center">Categories</h1>
        
        {/* Meal Categories */}
        <div className="mb-16">
          <h2 className="text-2xl font-heading font-bold mb-6 border-b pb-2">Meal Categories</h2>
          
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl overflow-hidden shadow-md">
                  <div className="h-40 overflow-hidden">
                    <Skeleton className="w-full h-full" />
                  </div>
                  <div className="p-4 text-center">
                    <Skeleton className="h-6 w-32 mx-auto mb-2" />
                    <Skeleton className="h-4 w-20 mx-auto" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {categories?.map((category: Category) => (
                <Link key={category.id} href={`/recipes?category=${category.id}`}>
                  <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                    <div className="h-40 overflow-hidden bg-muted">
                      {category.image_url ? (
                        <img 
                          src={category.image_url} 
                          alt={category.name} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          <span className="text-4xl">🍽️</span>
                        </div>
                      )}
                    </div>
                    <div className="p-4 text-center">
                      <h3 className="font-heading font-semibold text-lg">{category.name}</h3>
                      <p className="text-sm text-muted-foreground">{category.recipe_count} Recipes</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
        
        {/* Cuisines / Kitchens */}
        <div>
          <h2 className="text-2xl font-heading font-bold mb-6 border-b pb-2">Cuisines</h2>
          
          {kitchensLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl overflow-hidden shadow-md">
                  <div className="h-40 overflow-hidden">
                    <Skeleton className="w-full h-full" />
                  </div>
                  <div className="p-4 text-center">
                    <Skeleton className="h-6 w-32 mx-auto" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {kitchens?.map((kitchen) => (
                <Link key={kitchen.id} href={`/recipes?kitchen=${kitchen.id}`}>
                  <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                    <div className="h-40 overflow-hidden bg-muted">
                      {kitchen.image_url ? (
                        <img 
                          src={kitchen.image_url} 
                          alt={kitchen.name} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          <span className="text-4xl">🌎</span>
                        </div>
                      )}
                    </div>
                    <div className="p-4 text-center">
                      <h3 className="font-heading font-semibold text-lg">{kitchen.name}</h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}