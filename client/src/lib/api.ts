import { apiRequest } from "./queryClient";
import {
  Recipe,
  Category,
  Kitchen,
  User,
  Rating,
  RatingFormData,
  RecipeFormData,
  LoginData,
  RegisterData,
  AITextRequest,
  AIImageRequest,
  AITextResponse,
  AIImageResponse,
  AIInteraction
} from "./types";

// Auth API
export const authAPI = {
  login: async (loginData: LoginData): Promise<User> => {
    const res = await apiRequest("POST", "/api/auth/login", loginData);
    return res.json();
  },
  
  register: async (registerData: RegisterData): Promise<User> => {
    const res = await apiRequest("POST", "/api/auth/signup", registerData);
    return res.json();
  },
  
  logout: async (): Promise<void> => {
    await apiRequest("POST", "/api/auth/logout");
  },
  
  getCurrentUser: async (): Promise<User> => {
    const res = await apiRequest("GET", "/api/auth/me");
    return res.json();
  }
};

// Recipe API
export const recipeAPI = {
  getRecipes: async (params?: {
    limit?: number;
    offset?: number;
    category?: number;
    kitchen?: number;
    author?: number;
    search?: string;
    status?: string;
  }): Promise<Recipe[]> => {
    const queryParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value));
        }
      });
    }
    
    const url = `/api/recipes${queryParams.toString() ? `?${queryParams}` : ''}`;
    const res = await apiRequest("GET", url);
    return res.json();
  },
  
  getRecipe: async (id: number): Promise<Recipe> => {
    const res = await apiRequest("GET", `/api/recipes/${id}`);
    return res.json();
  },
  
  getRecipeOfTheDay: async (): Promise<Recipe> => {
    const res = await apiRequest("GET", "/api/recipes/daily");
    return res.json();
  },
  
  getFeaturedRecipes: async (limit?: number): Promise<Recipe[]> => {
    const url = limit ? `/api/recipes/featured?limit=${limit}` : "/api/recipes/featured";
    const res = await apiRequest("GET", url);
    return res.json();
  },
  
  getPopularRecipes: async (limit?: number): Promise<Recipe[]> => {
    const url = limit ? `/api/recipes/popular?limit=${limit}` : "/api/recipes/popular";
    const res = await apiRequest("GET", url);
    return res.json();
  },
  
  getNewRecipes: async (limit?: number): Promise<Recipe[]> => {
    const url = limit ? `/api/recipes/new?limit=${limit}` : "/api/recipes/new";
    const res = await apiRequest("GET", url);
    return res.json();
  },
  
  createRecipe: async (recipeData: RecipeFormData): Promise<Recipe> => {
    const res = await apiRequest("POST", "/api/recipes", recipeData);
    return res.json();
  },
  
  updateRecipe: async (id: number, recipeData: Partial<RecipeFormData>): Promise<Recipe> => {
    const res = await apiRequest("PUT", `/api/recipes/${id}`, recipeData);
    return res.json();
  },
  
  deleteRecipe: async (id: number): Promise<void> => {
    await apiRequest("DELETE", `/api/recipes/${id}`);
  },
  
  updateRecipeStatus: async (id: number, status: 'pending' | 'approved' | 'rejected'): Promise<Recipe> => {
    const res = await apiRequest("PUT", `/api/recipes/${id}/status`, { status });
    return res.json();
  },
  
  getRatings: async (recipeId: number): Promise<Rating[]> => {
    const res = await apiRequest("GET", `/api/recipes/${recipeId}/ratings`);
    return res.json();
  },
  
  getAverageRating: async (recipeId: number): Promise<{ average: number }> => {
    const res = await apiRequest("GET", `/api/recipes/${recipeId}/average-rating`);
    return res.json();
  },
  
  rateRecipe: async (recipeId: number, ratingData: RatingFormData): Promise<Rating> => {
    const res = await apiRequest("POST", `/api/recipes/${recipeId}/rate`, ratingData);
    return res.json();
  },
  
  favoriteRecipe: async (recipeId: number): Promise<{ id: number }> => {
    const res = await apiRequest("POST", `/api/recipes/${recipeId}/favorite`);
    return res.json();
  },
  
  unfavoriteRecipe: async (recipeId: number): Promise<void> => {
    await apiRequest("DELETE", `/api/recipes/${recipeId}/favorite`);
  },
  
  isFavorite: async (recipeId: number): Promise<{ isFavorite: boolean }> => {
    const res = await apiRequest("GET", `/api/recipes/${recipeId}/is-favorite`);
    return res.json();
  }
};

// Category API
export const categoryAPI = {
  getCategories: async (): Promise<Category[]> => {
    const res = await apiRequest("GET", "/api/categories");
    return res.json();
  },
  
  getCategory: async (id: number): Promise<Category> => {
    const res = await apiRequest("GET", `/api/categories/${id}`);
    return res.json();
  },
  
  createCategory: async (categoryData: Omit<Category, 'id' | 'recipe_count'>): Promise<Category> => {
    const res = await apiRequest("POST", "/api/categories", categoryData);
    return res.json();
  },
  
  updateCategory: async (id: number, categoryData: Partial<Omit<Category, 'id' | 'recipe_count'>>): Promise<Category> => {
    const res = await apiRequest("PUT", `/api/categories/${id}`, categoryData);
    return res.json();
  },
  
  getKitchens: async (): Promise<Kitchen[]> => {
    const res = await apiRequest("GET", "/api/kitchens");
    return res.json();
  },
  
  getKitchen: async (id: number): Promise<Kitchen> => {
    const res = await apiRequest("GET", `/api/kitchens/${id}`);
    return res.json();
  },
  
  createKitchen: async (kitchenData: Omit<Kitchen, 'id'>): Promise<Kitchen> => {
    const res = await apiRequest("POST", "/api/kitchens", kitchenData);
    return res.json();
  }
};

// AI Chat API
export const aiAPI = {
  sendMessage: async (message: string): Promise<AITextResponse> => {
    const res = await apiRequest("POST", "/api/ai/chat", { message });
    return res.json();
  },
  
  analyzeImage: async (imageData: AIImageRequest): Promise<AIImageResponse> => {
    const res = await apiRequest("POST", "/api/ai/image", imageData);
    return res.json();
  },
  
  getHistory: async (limit?: number): Promise<AIInteraction[]> => {
    const url = limit ? `/api/ai/history?limit=${limit}` : "/api/ai/history";
    const res = await apiRequest("GET", url);
    return res.json();
  }
};
