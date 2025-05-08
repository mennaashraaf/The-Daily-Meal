import { useEffect } from "react";
import { useLocation, Link } from "wouter";
import { useAuth } from "@/providers/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import { recipeAPI, categoryAPI } from "@/lib/api";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FileText,
  ChefHat,
  Bookmark,
  Users,
  Star,
  BarChart,
  ClipboardList,
  ArrowRight,
  Clock,
  Bell,
} from "lucide-react";
import { Helmet } from "react-helmet";

export default function AdminPage() {
  const [, navigate] = useLocation();
  const { user, isAuthenticated, isLoading } = useAuth();

  // Redirect if not admin
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || (user && user.role !== "admin"))) {
      navigate("/");
    }
  }, [isAuthenticated, isLoading, navigate, user]);

  // Fetch recipes needing moderation
  const { data: pendingRecipes, isLoading: pendingLoading } = useQuery({
    queryKey: ['/api/recipes', { status: 'pending' }],
    queryFn: () => recipeAPI.getRecipes({ status: 'pending' }),
    enabled: isAuthenticated && user?.role === "admin"
  });

  // Fetch categories
  const { data: categories } = useQuery({
    queryKey: ['/api/categories'],
    queryFn: categoryAPI.getCategories,
    enabled: isAuthenticated && user?.role === "admin"
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading admin dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || (user && user.role !== "admin")) {
    return null; // Will redirect
  }

  return (
    <>
      <Helmet>
        <title>Admin Dashboard | The Daily Meal</title>
        <meta name="description" content="Administration dashboard for The Daily Meal application. Manage recipes, users, and settings." />
      </Helmet>
      
      <div className="bg-neutral-50 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
            <div>
              <h1 className="font-heading text-3xl font-bold text-neutral-800 mb-2">
                Admin Dashboard
              </h1>
              <p className="text-gray-600">
                Manage recipes, users, and settings
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <Button onClick={() => navigate("/")}>
                Back to Site
              </Button>
            </div>
          </div>

          {/* Notifications / Pending Items */}
          <div className="mb-8">
            <Card className={pendingRecipes?.length ? "border-amber-500 bg-amber-50/40" : ""}>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-medium flex items-center">
                  <Bell className="h-5 w-5 mr-2 text-amber-500" />
                  Pending Items
                </CardTitle>
              </CardHeader>
              <CardContent>
                {pendingLoading ? (
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-gray-400 animate-spin mr-2" />
                    <p>Loading pending items...</p>
                  </div>
                ) : pendingRecipes?.length ? (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center text-amber-800">
                        <FileText className="h-5 w-5 mr-2 text-amber-600" />
                        <span>{pendingRecipes.length} recipe submissions pending approval</span>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => navigate("/admin/recipes")}>
                        Review Now
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-600">No pending items requiring your attention.</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Admin Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-primary" />
                  Recipes
                </CardTitle>
                <CardDescription>Manage recipe submissions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-4">{pendingRecipes?.length || 0}</div>
                <Button variant="outline" className="w-full" onClick={() => navigate("/admin/recipes")}>
                  <span className="mr-2">Manage Recipes</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium flex items-center">
                  <Users className="h-5 w-5 mr-2 text-secondary" />
                  Users
                </CardTitle>
                <CardDescription>Manage user accounts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-4">2</div>
                <Button variant="outline" className="w-full" onClick={() => navigate("/admin/users")}>
                  <span className="mr-2">Manage Users</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium flex items-center">
                  <ChefHat className="h-5 w-5 mr-2 text-accent" />
                  Categories
                </CardTitle>
                <CardDescription>Manage recipe categories</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-4">{categories?.length || 0}</div>
                <Button variant="outline" className="w-full" onClick={() => navigate("/admin/categories")}>
                  <span className="mr-2">Manage Categories</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <h2 className="font-heading text-xl font-bold text-neutral-800 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Button variant="outline" className="h-auto py-6 flex flex-col items-center justify-center" onClick={() => navigate("/recipes/new")}>
              <FileText className="h-8 w-8 mb-2" />
              <span>Add New Recipe</span>
            </Button>
            
            <Button variant="outline" className="h-auto py-6 flex flex-col items-center justify-center" onClick={() => navigate("/admin/recipes")}>
              <ClipboardList className="h-8 w-8 mb-2" />
              <span>Review Submissions</span>
            </Button>
            
            <Button variant="outline" className="h-auto py-6 flex flex-col items-center justify-center" onClick={() => navigate("/admin/featured")}>
              <Star className="h-8 w-8 mb-2" />
              <span>Set Featured Recipes</span>
            </Button>
            
            <Button variant="outline" className="h-auto py-6 flex flex-col items-center justify-center" onClick={() => navigate("/admin/reports")}>
              <BarChart className="h-8 w-8 mb-2" />
              <span>View Reports</span>
            </Button>
          </div>

          {/* System Information */}
          <h2 className="font-heading text-xl font-bold text-neutral-800 mb-4">
            System Information
          </h2>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-2">
                  <span className="font-medium">Application Version</span>
                  <span>1.0.0</span>
                </div>
                <div className="flex items-center justify-between border-b pb-2">
                  <span className="font-medium">Logged in as</span>
                  <span>{user?.name || user?.username} (Admin)</span>
                </div>
                <div className="flex items-center justify-between border-b pb-2">
                  <span className="font-medium">Database Status</span>
                  <span className="text-green-600 flex items-center">
                    <div className="h-2 w-2 bg-green-600 rounded-full mr-2"></div>
                    Connected
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Last Login</span>
                  <span>{new Date().toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
