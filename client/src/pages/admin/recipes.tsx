import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/providers/AuthProvider";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { recipeAPI } from "@/lib/api";
import { Recipe } from "@/lib/types";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  CheckCircle,
  XCircle,
  MoreVertical,
  Search,
  Eye,
  Filter,
  ArrowLeft,
  Clock,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Helmet } from "react-helmet";

export default function AdminRecipesPage() {
  const [, navigate] = useLocation();
  const { user, isAuthenticated, isLoading } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  // State for filtering and viewing
  const [activeTab, setActiveTab] = useState("pending");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(null);
  
  // Redirect if not admin
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || (user && user.role !== "admin"))) {
      navigate("/");
    }
  }, [isAuthenticated, isLoading, navigate, user]);
  
  // Fetch recipes based on status
  const { data: recipes, isLoading: recipesLoading, refetch } = useQuery({
    queryKey: ['/api/recipes', { status: activeTab }],
    queryFn: () => recipeAPI.getRecipes({ status: activeTab }),
    enabled: isAuthenticated && user?.role === "admin"
  });
  
  // Update recipe status mutation
  const updateRecipeStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: 'pending' | 'approved' | 'rejected' }) => 
      recipeAPI.updateRecipeStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/recipes'] });
      setActionDialogOpen(false);
      setSelectedRecipe(null);
      
      toast({
        title: `Recipe ${actionType === 'approve' ? 'approved' : 'rejected'}`,
        description: `The recipe has been successfully ${actionType === 'approve' ? 'approved' : 'rejected'}.`,
      });
      
      refetch();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || `Failed to ${actionType} recipe`,
        variant: "destructive"
      });
    }
  });
  
  // Filter recipes by search query
  const filteredRecipes = recipes?.filter(recipe => 
    recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    recipe.description.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];
  
  // Handle recipe action (approve/reject)
  const handleRecipeAction = () => {
    if (!selectedRecipe || !actionType) return;
    
    updateRecipeStatusMutation.mutate({
      id: selectedRecipe.id,
      status: actionType === 'approve' ? 'approved' : 'rejected'
    });
  };
  
  // Format date string
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Render status badge
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">Approved</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
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
  
  if (!isAuthenticated || (user && user.role !== "admin")) {
    return null; // Will redirect
  }
  
  return (
    <>
      <Helmet>
        <title>Manage Recipes | Admin Dashboard | The Daily Meal</title>
        <meta name="description" content="Administrative interface for managing and moderating recipe submissions on The Daily Meal." />
      </Helmet>
      
      <div className="bg-neutral-50 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <Button 
              variant="ghost" 
              className="mb-4"
              onClick={() => navigate("/admin")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h1 className="font-heading text-3xl font-bold text-neutral-800 mb-2">
                  Manage Recipes
                </h1>
                <p className="text-gray-600">
                  Review, approve, or reject recipe submissions
                </p>
              </div>
            </div>
          </div>
          
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <CardTitle>Recipe Management</CardTitle>
                <div className="mt-4 md:mt-0 flex items-center">
                  <div className="relative mr-2">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input 
                      type="search" 
                      placeholder="Search recipes..." 
                      className="pl-8 w-full md:w-64"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Button variant="outline" size="icon" onClick={() => refetch()}>
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-2">
                <TabsList className="mb-4">
                  <TabsTrigger value="pending" className="flex items-center">
                    <Clock className="mr-2 h-4 w-4" />
                    Pending
                  </TabsTrigger>
                  <TabsTrigger value="approved" className="flex items-center">
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Approved
                  </TabsTrigger>
                  <TabsTrigger value="rejected" className="flex items-center">
                    <AlertTriangle className="mr-2 h-4 w-4" />
                    Rejected
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value={activeTab}>
                  {recipesLoading ? (
                    <div className="text-center py-12">
                      <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                      <p className="text-gray-600">Loading recipes...</p>
                    </div>
                  ) : filteredRecipes.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-md">
                      <p className="text-gray-600 mb-2">No {activeTab} recipes found</p>
                      {searchQuery && (
                        <Button variant="ghost" onClick={() => setSearchQuery("")}>
                          Clear Search
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Author</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredRecipes.map((recipe) => (
                            <TableRow key={recipe.id}>
                              <TableCell className="font-medium">{recipe.title}</TableCell>
                              <TableCell>{recipe.author_id === 1 ? "Admin" : recipe.author_id === 2 ? "Chef Rania" : `User #${recipe.author_id}`}</TableCell>
                              <TableCell>
                                {recipe.category_id === 1 ? "Breakfast" : 
                                recipe.category_id === 2 ? "Lunch" : 
                                recipe.category_id === 3 ? "Dinner" : 
                                recipe.category_id === 4 ? "Desserts" : 
                                recipe.category_id === 5 ? "Salads" : 
                                recipe.category_id === 6 ? "Pasta" : 
                                recipe.category_id === 7 ? "Vegetarian" : "Other"}
                              </TableCell>
                              <TableCell>{formatDate(recipe.created_at)}</TableCell>
                              <TableCell>{renderStatusBadge(recipe.status)}</TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end items-center space-x-1">
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    onClick={() => {
                                      setSelectedRecipe(recipe);
                                      setViewDialogOpen(true);
                                    }}
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  
                                  {recipe.status === 'pending' && (
                                    <>
                                      <Button 
                                        variant="ghost" 
                                        size="icon"
                                        className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                        onClick={() => {
                                          setSelectedRecipe(recipe);
                                          setActionType('approve');
                                          setActionDialogOpen(true);
                                        }}
                                      >
                                        <CheckCircle className="h-4 w-4" />
                                      </Button>
                                      
                                      <Button 
                                        variant="ghost" 
                                        size="icon"
                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                        onClick={() => {
                                          setSelectedRecipe(recipe);
                                          setActionType('reject');
                                          setActionDialogOpen(true);
                                        }}
                                      >
                                        <XCircle className="h-4 w-4" />
                                      </Button>
                                    </>
                                  )}
                                  
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="icon">
                                        <MoreVertical className="h-4 w-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuItem onClick={() => navigate(`/recipes/${recipe.id}`)}>
                                        View Live
                                      </DropdownMenuItem>
                                      <DropdownMenuItem onClick={() => navigate(`/recipes/edit/${recipe.id}`)}>
                                        Edit
                                      </DropdownMenuItem>
                                      {recipe.status !== 'pending' && (
                                        <DropdownMenuItem 
                                          onClick={() => {
                                            setSelectedRecipe(recipe);
                                            setActionType('pending');
                                            updateRecipeStatusMutation.mutate({
                                              id: recipe.id,
                                              status: 'pending'
                                            });
                                          }}
                                        >
                                          Return to Pending
                                        </DropdownMenuItem>
                                      )}
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          
          {/* View Recipe Dialog */}
          {selectedRecipe && (
            <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
              <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Recipe Details</DialogTitle>
                </DialogHeader>
                
                <div className="space-y-4 mt-4">
                  <div className="flex justify-between">
                    <h3 className="font-heading text-xl font-bold">{selectedRecipe.title}</h3>
                    {renderStatusBadge(selectedRecipe.status)}
                  </div>
                  
                  {selectedRecipe.image_url && (
                    <div className="rounded-md overflow-hidden h-64">
                      <img 
                        src={selectedRecipe.image_url} 
                        alt={selectedRecipe.title} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  <div>
                    <h4 className="font-medium mb-1">Description</h4>
                    <p className="text-gray-700">{selectedRecipe.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-1">Ingredients</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {Array.isArray(selectedRecipe.ingredients) ? selectedRecipe.ingredients.map((ingredient, index) => (
                          <li key={index} className="text-gray-700">{ingredient}</li>
                        )) : (
                          <li>No ingredients available</li>
                        )}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-1">Details</h4>
                      <ul className="space-y-1">
                        <li><span className="font-medium">Prep Time:</span> {selectedRecipe.prep_time} minutes</li>
                        <li><span className="font-medium">Cook Time:</span> {selectedRecipe.cook_time} minutes</li>
                        <li><span className="font-medium">Servings:</span> {selectedRecipe.servings}</li>
                        <li><span className="font-medium">Difficulty:</span> {selectedRecipe.difficulty}</li>
                        <li><span className="font-medium">Submitted:</span> {formatDate(selectedRecipe.created_at)}</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-1">Instructions</h4>
                    <ol className="list-decimal list-inside space-y-2">
                      {Array.isArray(selectedRecipe.steps) ? selectedRecipe.steps.map((step, index) => (
                        <li key={index} className="text-gray-700">{step}</li>
                      )) : (
                        <li>No instructions available</li>
                      )}
                    </ol>
                  </div>
                </div>
                
                <DialogFooter className="mt-6">
                  {selectedRecipe.status === 'pending' && (
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        className="bg-green-50 text-green-700 hover:bg-green-100 border-green-200"
                        onClick={() => {
                          setViewDialogOpen(false);
                          setActionType('approve');
                          setActionDialogOpen(true);
                        }}
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Approve
                      </Button>
                      
                      <Button
                        variant="outline"
                        className="bg-red-50 text-red-700 hover:bg-red-100 border-red-200"
                        onClick={() => {
                          setViewDialogOpen(false);
                          setActionType('reject');
                          setActionDialogOpen(true);
                        }}
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        Reject
                      </Button>
                    </div>
                  )}
                  
                  <Button 
                    variant="outline" 
                    onClick={() => navigate(`/recipes/${selectedRecipe.id}`)}
                  >
                    View Live
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
          
          {/* Confirm Action Dialog */}
          {selectedRecipe && actionType && (
            <Dialog open={actionDialogOpen} onOpenChange={setActionDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {actionType === 'approve' ? 'Approve Recipe' : 'Reject Recipe'}
                  </DialogTitle>
                  <DialogDescription>
                    {actionType === 'approve'
                      ? 'Are you sure you want to approve this recipe? It will be published on the site.'
                      : 'Are you sure you want to reject this recipe? It will not be visible to users.'}
                  </DialogDescription>
                </DialogHeader>
                
                <div className="py-4">
                  <h3 className="font-medium">{selectedRecipe.title}</h3>
                  <p className="text-gray-600 text-sm mt-1">{selectedRecipe.description.substring(0, 100)}...</p>
                </div>
                
                <DialogFooter>
                  <Button variant="ghost" onClick={() => setActionDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    variant={actionType === 'approve' ? 'default' : 'destructive'}
                    onClick={handleRecipeAction}
                    disabled={updateRecipeStatusMutation.isPending}
                  >
                    {updateRecipeStatusMutation.isPending && (
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {actionType === 'approve' ? 'Approve' : 'Reject'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
    </>
  );
}
