import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Recipe, RecipeFormData } from "@/lib/types";
import { recipeAPI, categoryAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { X, Plus, Loader2 } from "lucide-react";

// Validation schema for the recipe form
const recipeFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  ingredients: z.array(z.string()).min(1, "Add at least one ingredient"),
  steps: z.array(z.string()).min(1, "Add at least one step"),
  image_url: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  youtube_url: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  prep_time: z.number().min(1, "Prep time is required"),
  cook_time: z.number().min(0, "Cook time cannot be negative"),
  servings: z.number().min(1, "Must serve at least 1 person"),
  calories: z.number().optional(),
  difficulty: z.string(),
  category_id: z.number(),
  kitchen_id: z.number(),
});

interface RecipeFormProps {
  recipeToEdit?: Recipe;
}

export default function RecipeForm({ recipeToEdit }: RecipeFormProps) {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [currentIngredient, setCurrentIngredient] = useState("");
  const [currentStep, setCurrentStep] = useState("");
  
  // Fetch categories
  const { data: categories } = useQuery({
    queryKey: ['/api/categories'],
    queryFn: categoryAPI.getCategories
  });
  
  // Fetch kitchens/cuisines
  const { data: kitchens } = useQuery({
    queryKey: ['/api/categories/kitchens'],
    queryFn: categoryAPI.getKitchens
  });
  
  // Create form with default values
  const form = useForm<z.infer<typeof recipeFormSchema>>({
    resolver: zodResolver(recipeFormSchema),
    defaultValues: {
      title: "",
      description: "",
      ingredients: [],
      steps: [],
      image_url: "",
      youtube_url: "",
      prep_time: 10,
      cook_time: 20,
      servings: 4,
      calories: undefined,
      difficulty: "Easy",
      category_id: 1,
      kitchen_id: 1,
    }
  });
  
  // Set form values when editing
  useEffect(() => {
    if (recipeToEdit) {
      const editValues = {
        ...recipeToEdit,
        category_id: Number(recipeToEdit.category_id),
        kitchen_id: Number(recipeToEdit.kitchen_id),
        prep_time: Number(recipeToEdit.prep_time),
        cook_time: Number(recipeToEdit.cook_time),
        servings: Number(recipeToEdit.servings),
        calories: recipeToEdit.calories ? Number(recipeToEdit.calories) : undefined,
        ingredients: Array.isArray(recipeToEdit.ingredients) ? recipeToEdit.ingredients : [],
        steps: Array.isArray(recipeToEdit.steps) ? recipeToEdit.steps : []
      };
      
      form.reset(editValues);
    }
  }, [recipeToEdit, form]);
  
  // Create recipe mutation
  const createRecipeMutation = useMutation({
    mutationFn: recipeAPI.createRecipe,
    onSuccess: (newRecipe) => {
      toast({
        title: "Recipe created",
        description: "Your recipe has been created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/recipes'] });
      navigate(`/recipes/${newRecipe.id}`);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create recipe",
        variant: "destructive"
      });
    }
  });
  
  // Update recipe mutation
  const updateRecipeMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: RecipeFormData }) => 
      recipeAPI.updateRecipe(id, data),
    onSuccess: (updatedRecipe) => {
      toast({
        title: "Recipe updated",
        description: "Your recipe has been updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/recipes'] });
      queryClient.invalidateQueries({ queryKey: [`/api/recipes/${updatedRecipe.id}`] });
      navigate(`/recipes/${updatedRecipe.id}`);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update recipe",
        variant: "destructive"
      });
    }
  });
  
  // Handle form submission
  const onSubmit = (data: z.infer<typeof recipeFormSchema>) => {
    if (recipeToEdit) {
      updateRecipeMutation.mutate({ id: recipeToEdit.id, data });
    } else {
      createRecipeMutation.mutate(data);
    }
  };
  
  // Add ingredient
  const addIngredient = () => {
    if (currentIngredient.trim()) {
      const currentIngredients = form.getValues("ingredients") || [];
      form.setValue("ingredients", [...currentIngredients, currentIngredient.trim()]);
      setCurrentIngredient("");
    }
  };
  
  // Remove ingredient
  const removeIngredient = (index: number) => {
    const currentIngredients = form.getValues("ingredients") || [];
    form.setValue(
      "ingredients",
      currentIngredients.filter((_, i) => i !== index)
    );
  };
  
  // Add step
  const addStep = () => {
    if (currentStep.trim()) {
      const currentSteps = form.getValues("steps") || [];
      form.setValue("steps", [...currentSteps, currentStep.trim()]);
      setCurrentStep("");
    }
  };
  
  // Remove step
  const removeStep = (index: number) => {
    const currentSteps = form.getValues("steps") || [];
    form.setValue(
      "steps",
      currentSteps.filter((_, i) => i !== index)
    );
  };
  
  // Handle ingredient input enter key
  const handleIngredientKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addIngredient();
    }
  };
  
  // Handle step input enter key
  const handleStepKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addStep();
    }
  };
  
  // Loading state
  const isSubmitting = createRecipeMutation.isPending || updateRecipeMutation.isPending;
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-heading text-xl font-bold mb-4">Basic Information</h3>
              
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel>Recipe Title</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g. Classic Chocolate Chip Cookies" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        placeholder="Brief description of your recipe" 
                        className="min-h-[100px]" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="category_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select 
                        onValueChange={(value) => field.onChange(Number(value))}
                        defaultValue={field.value?.toString()}
                        value={field.value?.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories?.map((category) => (
                            <SelectItem key={category.id} value={category.id.toString()}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="kitchen_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cuisine</FormLabel>
                      <Select 
                        onValueChange={(value) => field.onChange(Number(value))}
                        defaultValue={field.value?.toString()}
                        value={field.value?.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select cuisine" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {kitchens?.map((kitchen) => (
                            <SelectItem key={kitchen.id} value={kitchen.id.toString()}>
                              {kitchen.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>
          
          {/* Recipe Details */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-heading text-xl font-bold mb-4">Recipe Details</h3>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <FormField
                  control={form.control}
                  name="prep_time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prep Time (mins)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field} 
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="cook_time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cook Time (mins)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field} 
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <FormField
                  control={form.control}
                  name="servings"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Servings</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field} 
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="calories"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Calories (optional)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field} 
                          value={field.value || ""} 
                          onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="difficulty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Difficulty</FormLabel>
                    <Select 
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select difficulty" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Easy">Easy</SelectItem>
                        <SelectItem value="Intermediate">Intermediate</SelectItem>
                        <SelectItem value="Advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
          
          {/* Images and Video */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-heading text-xl font-bold mb-4">Images & Video</h3>
              
              <FormField
                control={form.control}
                name="image_url"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel>Image URL</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="https://example.com/image.jpg" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="youtube_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>YouTube URL (optional)</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="https://youtube.com/watch?v=..." />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
          
          {/* Ingredients */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-heading text-xl font-bold mb-4">Ingredients</h3>
              
              <div className="flex mb-4">
                <Input
                  value={currentIngredient}
                  onChange={(e) => setCurrentIngredient(e.target.value)}
                  onKeyDown={handleIngredientKeyDown}
                  placeholder="Add an ingredient"
                  className="mr-2"
                />
                <Button type="button" onClick={addIngredient}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              <FormField
                control={form.control}
                name="ingredients"
                render={({ field }) => (
                  <FormItem>
                    <div className="space-y-2">
                      {field.value.length === 0 ? (
                        <p className="text-sm text-gray-500">No ingredients added yet</p>
                      ) : (
                        field.value.map((ingredient, index) => (
                          <div key={index} className="flex items-center bg-neutral-50 p-2 rounded">
                            <span className="flex-grow">{ingredient}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeIngredient(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))
                      )}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
          
          {/* Steps */}
          <Card className="md:col-span-2">
            <CardContent className="pt-6">
              <h3 className="font-heading text-xl font-bold mb-4">Instructions</h3>
              
              <div className="flex mb-4">
                <Textarea
                  value={currentStep}
                  onChange={(e) => setCurrentStep(e.target.value)}
                  onKeyDown={handleStepKeyDown}
                  placeholder="Add a step"
                  className="mr-2"
                />
                <Button type="button" onClick={addStep} className="h-full">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              <FormField
                control={form.control}
                name="steps"
                render={({ field }) => (
                  <FormItem>
                    <div className="space-y-4">
                      {field.value.length === 0 ? (
                        <p className="text-sm text-gray-500">No steps added yet</p>
                      ) : (
                        field.value.map((step, index) => (
                          <div key={index} className="flex items-start bg-neutral-50 p-3 rounded">
                            <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold mr-3">
                              {index + 1}
                            </div>
                            <div className="flex-grow">
                              <p>{step}</p>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeStep(index)}
                              className="flex-shrink-0 ml-2"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))
                      )}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        </div>
        
        <div className="flex justify-end">
          <Button
            type="button"
            variant="outline"
            className="mr-4"
            onClick={() => navigate("/recipes")}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {recipeToEdit ? "Update Recipe" : "Create Recipe"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
