// User types
export interface User {
  id: number;
  username: string;
  email: string;
  name?: string;
  avatar_url?: string;
  bio?: string;
  role: string;
  created_at: string;
}

// Recipe types
export interface Recipe {
  id: number;
  title: string;
  description: string;
  ingredients: string[];
  steps: string[];
  image_url?: string;
  youtube_url?: string;
  prep_time: number;
  cook_time: number;
  servings: number;
  calories?: number;
  difficulty: string;
  category_id: number;
  kitchen_id: number;
  author_id: number;
  favorites_count: number;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
}

export interface RecipeFormData {
  title: string;
  description: string;
  ingredients: string[];
  steps: string[];
  image_url?: string;
  youtube_url?: string;
  prep_time: number;
  cook_time: number;
  servings: number;
  calories?: number;
  difficulty: string;
  category_id: number;
  kitchen_id: number;
}

// Category types
export interface Category {
  id: number;
  name: string;
  description?: string;
  image_url?: string;
  recipe_count: number;
}

// Kitchen types
export interface Kitchen {
  id: number;
  name: string;
  description?: string;
  image_url?: string;
}

// Rating types
export interface Rating {
  id: number;
  user_id: number;
  recipe_id: number;
  rating: number;
  comment?: string;
  created_at: string;
}

export interface RatingFormData {
  rating: number;
  comment?: string;
}

// AI Chat types
export interface AITextRequest {
  message: string;
}

export interface AIImageRequest {
  image_url: string;
  message?: string;
}

export interface AITextResponse {
  content: string;
  citations: string[];
}

export interface AIImageResponse {
  detected_ingredients: string[];
  content: string;
  citations: string[];
}

export interface AIInteraction {
  id: number;
  user_id: number;
  type: 'text' | 'image';
  query: string;
  response: AITextResponse | AIImageResponse;
  created_at: string;
}

// Auth types
export interface LoginData {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  name?: string;
}
