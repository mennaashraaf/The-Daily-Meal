import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { categoryAPI } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

export default function Categories() {
  const { data: categories, isLoading, error } = useQuery({
    queryKey: ['/api/categories'],
    queryFn: categoryAPI.getCategories
  });

  if (isLoading) {
    return (
      <section className="py-12 bg-neutral-100">
        <div className="container mx-auto px-4">
          <Skeleton className="h-10 w-64 mb-8" />
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl overflow-hidden shadow-md">
                <div className="h-36 overflow-hidden">
                  <Skeleton className="w-full h-full" />
                </div>
                <div className="p-4 text-center">
                  <Skeleton className="h-6 w-24 mx-auto mb-2" />
                  <Skeleton className="h-4 w-16 mx-auto" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error || !categories) {
    return (
      <section className="py-12 bg-neutral-100">
        <div className="container mx-auto px-4">
          <h2 className="font-heading text-3xl font-bold text-neutral-800 mb-8">Popular Categories</h2>
          <div className="bg-white rounded-xl p-8 text-center">
            <p className="text-gray-600">Could not load categories. Please try again later.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-neutral-100">
      <div className="container mx-auto px-4">
        <h2 className="font-heading text-3xl font-bold text-neutral-800 mb-8">Popular Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {categories.map((category) => (
            <Link 
              key={category.id} 
              to={`/recipes?category=${category.id}`}
              className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition cursor-pointer"
            >
              <div className="h-36 overflow-hidden">
                <img 
                  src={category.image_url || `https://images.unsplash.com/photo-1495521821757-a1efb6729352?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300`} 
                  alt={`${category.name} category`} 
                  className="w-full h-full object-cover hover:scale-110 transition"
                />
              </div>
              <div className="p-4 text-center">
                <h3 className="font-heading font-medium">{category.name}</h3>
                <p className="text-sm text-gray-600">{category.recipe_count} recipes</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
