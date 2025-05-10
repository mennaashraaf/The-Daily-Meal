import { 
  User, InsertUser, Recipe, InsertRecipe, Category, InsertCategory, 
  Kitchen, InsertKitchen, Rating, InsertRating, Favorite, InsertFavorite,
  AIInteraction, InsertAIInteraction
} from "@shared/schema";

// Interface for all storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<User>): Promise<User | undefined>;
  
  // Recipe operations
  getRecipe(id: number): Promise<Recipe | undefined>;
  getRecipes(options?: { 
    limit?: number, 
    offset?: number,
    categoryId?: number,
    kitchenId?: number,
    authorId?: number,
    status?: string,
    search?: string
  }): Promise<Recipe[]>;
  createRecipe(recipe: InsertRecipe): Promise<Recipe>;
  updateRecipe(id: number, recipe: Partial<Recipe>): Promise<Recipe | undefined>;
  deleteRecipe(id: number): Promise<boolean>;
  getRecipeOfTheDay(): Promise<Recipe | undefined>;
  getFeaturedRecipes(limit?: number): Promise<Recipe[]>;
  getPopularRecipes(limit?: number): Promise<Recipe[]>;
  getNewRecipes(limit?: number): Promise<Recipe[]>;
  
  // Category operations
  getCategory(id: number): Promise<Category | undefined>;
  getCategories(): Promise<Category[]>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: number, category: Partial<Category>): Promise<Category | undefined>;
  
  // Kitchen operations
  getKitchen(id: number): Promise<Kitchen | undefined>;
  getKitchens(): Promise<Kitchen[]>;
  createKitchen(kitchen: InsertKitchen): Promise<Kitchen>;
  
  // Rating operations
  createRating(rating: InsertRating): Promise<Rating>;
  getRecipeRatings(recipeId: number): Promise<Rating[]>;
  getAverageRating(recipeId: number): Promise<number>;
  
  // Favorite operations
  createFavorite(favorite: InsertFavorite): Promise<Favorite>;
  deleteFavorite(userId: number, recipeId: number): Promise<boolean>;
  getUserFavorites(userId: number): Promise<Recipe[]>;
  isFavorite(userId: number, recipeId: number): Promise<boolean>;
  
  // AI Interaction operations
  createAIInteraction(interaction: InsertAIInteraction): Promise<AIInteraction>;
  getUserAIInteractions(userId: number, limit?: number): Promise<AIInteraction[]>;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private recipes: Map<number, Recipe>;
  private categories: Map<number, Category>;
  private kitchens: Map<number, Kitchen>;
  private ratings: Map<number, Rating>;
  private favorites: Map<number, Favorite>;
  private aiInteractions: Map<number, AIInteraction>;
  
  private userIdCounter = 1;
  private recipeIdCounter = 1;
  private categoryIdCounter = 1;
  private kitchenIdCounter = 1;
  private ratingIdCounter = 1;
  private favoriteIdCounter = 1;
  private aiInteractionIdCounter = 1;
  
  constructor() {
    this.users = new Map();
    this.recipes = new Map();
    this.categories = new Map();
    this.kitchens = new Map();
    this.ratings = new Map();
    this.favorites = new Map();
    this.aiInteractions = new Map();
    
    // Seed initial data
    this.seedData();
  }
  
  private seedData() {
    // Seed categories - Expanded with more options
    const categories = [
      { name: "Breakfast", description: "Start your day right", image_url: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666" },
      { name: "Lunch", description: "Midday meals", image_url: "https://images.unsplash.com/photo-1547496502-affa22d38842" },
      { name: "Dinner", description: "Evening feasts", image_url: "https://images.unsplash.com/photo-1576866209830-589e1bfbaa4d" },
      { name: "Desserts", description: "Sweet treats", image_url: "https://images.unsplash.com/photo-1488477304112-4944851de03d" },
      { name: "Salads", description: "Fresh and healthy", image_url: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd" },
      { name: "Pasta", description: "Italian comfort", image_url: "https://images.unsplash.com/photo-1567608285969-48e4bbe0d399" },
      { name: "Vegetarian", description: "Meat-free options", image_url: "https://images.unsplash.com/photo-1540420773420-3366772f4999" },
      { name: "Soups", description: "Warm and comforting", image_url: "https://images.unsplash.com/photo-1547592166-23ac45744acd" },
      { name: "Grilled", description: "Charred perfection", image_url: "https://images.unsplash.com/photo-1558030006-450675393462" },
      { name: "Seafood", description: "Treasures from the ocean", image_url: "https://images.unsplash.com/photo-1579164401270-2c67013e7ad8" },
      { name: "Appetizers", description: "Start your meal right", image_url: "https://images.unsplash.com/photo-1541529086526-db283c563270" },
      { name: "Quick & Easy", description: "For busy weeknights", image_url: "https://images.unsplash.com/photo-1505253149613-112d21d9f6a9" },
      { name: "Baking", description: "Oven-made delights", image_url: "https://images.unsplash.com/photo-1486427944299-d1955d23e34d" },
      { name: "Healthy", description: "Nutritious and delicious", image_url: "https://images.unsplash.com/photo-1490645935967-10de6ba17061" },
      { name: "Slow Cooker", description: "Set it and forget it", image_url: "https://images.unsplash.com/photo-1620486443824-1983359e68d3" },
      { name: "Snacks", description: "Bite-sized treats", image_url: "https://images.unsplash.com/photo-1566478989037-eec170784d0b" }
    ];
    
    categories.forEach(category => {
      this.createCategory({
        name: category.name,
        description: category.description,
        image_url: category.image_url
      });
    });
    
    // Seed kitchens/cuisines - Expanded with more cuisines
    const kitchens = [
      { name: "Italian", description: "Mediterranean classics", image_url: "https://images.unsplash.com/photo-1498579150354-977475b7ea0b" },
      { name: "Thai", description: "Aromatic and spicy", image_url: "https://images.unsplash.com/photo-1559314809-0d155014e29e" },
      { name: "Mexican", description: "Bold and vibrant", image_url: "https://images.unsplash.com/photo-1464219551459-ac14ae01fbe0" },
      { name: "Indian", description: "Rich and flavorful", image_url: "https://images.unsplash.com/photo-1505253758473-96b7015fcd40" },
      { name: "American", description: "Comfort classics", image_url: "https://images.unsplash.com/photo-1550317138-10000687a72b" },
      { name: "Chinese", description: "Ancient culinary traditions", image_url: "https://images.unsplash.com/photo-1563245372-f21724e3856d" },
      { name: "Japanese", description: "Precise and artistic", image_url: "https://images.unsplash.com/photo-1553621042-f6e147245754" },
      { name: "Mediterranean", description: "Coastal flavors", image_url: "https://images.unsplash.com/photo-1544025162-d76694265947" },
      { name: "French", description: "Sophisticated techniques", image_url: "https://images.unsplash.com/photo-1551218808-94e220e084d2" },
      { name: "Middle Eastern", description: "Ancient spice routes", image_url: "https://images.unsplash.com/photo-1554998171-89445e31c52b" },
      { name: "Greek", description: "Olive oil and herbs", image_url: "https://images.unsplash.com/photo-1559742811-822873691df8" },
      { name: "Spanish", description: "Tapas and paella", image_url: "https://images.unsplash.com/photo-1515443961218-a51367888e4b" },
      { name: "Korean", description: "Bold and fermented", image_url: "https://images.unsplash.com/photo-1532347231146-80afc9e3df2b" },
      { name: "Vietnamese", description: "Fresh and balanced", image_url: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43" },
      { name: "Caribbean", description: "Tropical fusion", image_url: "https://images.unsplash.com/photo-1610832958506-aa56368176cf" },
      { name: "Brazilian", description: "South American flair", image_url: "https://images.unsplash.com/photo-1551892374-ecf8754cf8b0" }
    ];
    
    kitchens.forEach(kitchen => {
      this.createKitchen({
        name: kitchen.name,
        description: kitchen.description,
        image_url: kitchen.image_url
      });
    });
    
    // Create admin user
    this.createUser({
      username: "admin",
      password: "password123",
      email: "admin@dailymeal.com",
      name: "Admin User",
      role: "admin",
      avatar_url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80"
    } as InsertUser);
    
    // Create Chef Rania user
    this.createUser({
      username: "chefrania",
      password: "chef123",
      email: "chef@dailymeal.com",
      name: "Chef Rania",
      role: "admin",
      avatar_url: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c"
    } as InsertUser);
    
    // Create sample recipes
    const recipes = [
      {
        title: "Lemon Herb Roasted Chicken",
        description: "A perfect weeknight dinner that's both impressive and easy to make. This aromatic roasted chicken is infused with lemon, garlic, and fresh herbs.",
        ingredients: JSON.stringify([
          "1 whole chicken (about 4-5 pounds)",
          "2 lemons, 1 sliced and 1 juiced",
          "4 cloves garlic, minced",
          "2 tablespoons olive oil",
          "1 tablespoon fresh rosemary, chopped",
          "1 tablespoon fresh thyme, chopped",
          "1 teaspoon salt",
          "1/2 teaspoon black pepper"
        ]),
        steps: JSON.stringify([
          "Preheat oven to 425°F (220°C).",
          "Remove giblets from chicken cavity and pat dry with paper towels.",
          "In a small bowl, mix olive oil, lemon juice, garlic, herbs, salt, and pepper.",
          "Rub mixture all over the chicken and under the skin.",
          "Place lemon slices inside the cavity and tie legs together with kitchen twine.",
          "Roast for 1 hour and 15 minutes or until juices run clear.",
          "Let rest for 10 minutes before carving."
        ]),
        image_url: "https://images.unsplash.com/photo-1518492104633-130d0cc84637",
        prep_time: 15,
        cook_time: 75,
        servings: 4,
        calories: 480,
        difficulty: "Intermediate",
        category_id: 3, // Dinner
        kitchen_id: 1, // Italian
        author_id: 2, // Chef Rania
        status: "approved"
      },
      {
        title: "Classic Margherita Pizza",
        description: "A simple yet delicious traditional pizza with fresh mozzarella, tomatoes, and basil on a perfect crust.",
        ingredients: JSON.stringify([
          "1 pizza dough",
          "3 tablespoons olive oil",
          "2 cloves garlic, minced",
          "8 oz fresh mozzarella, sliced",
          "2 large tomatoes, sliced",
          "Fresh basil leaves",
          "Salt and pepper to taste"
        ]),
        steps: JSON.stringify([
          "Preheat oven to 475°F (245°C) with a pizza stone if available.",
          "Roll out dough on floured surface to desired thickness.",
          "Mix olive oil with minced garlic and brush over dough.",
          "Arrange mozzarella and tomato slices evenly.",
          "Bake for 10-12 minutes until crust is golden.",
          "Top with fresh basil leaves, salt, and pepper before serving."
        ]),
        image_url: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3",
        prep_time: 20,
        cook_time: 12,
        servings: 4,
        calories: 350,
        difficulty: "Easy",
        category_id: 3, // Dinner
        kitchen_id: 1, // Italian
        author_id: 1, // Admin
        status: "approved"
      },
      {
        title: "Creamy Mushroom Risotto",
        description: "Rich and creamy risotto with sautéed mushrooms, white wine, and fresh herbs topped with parmesan.",
        ingredients: JSON.stringify([
          "1 1/2 cups arborio rice",
          "8 oz mushrooms, sliced",
          "1 onion, finely diced",
          "2 cloves garlic, minced",
          "1/2 cup white wine",
          "4 cups vegetable broth, heated",
          "1/2 cup grated parmesan",
          "2 tbsp butter",
          "2 tbsp olive oil",
          "Fresh thyme leaves",
          "Salt and pepper to taste"
        ]),
        steps: JSON.stringify([
          "In a large pan, heat olive oil and 1 tbsp butter, then sauté mushrooms until golden. Set aside.",
          "In the same pan, sauté onion until translucent, then add garlic and cook for 1 minute.",
          "Add rice and stir for 2 minutes until translucent at edges.",
          "Pour in wine and stir until absorbed.",
          "Add hot broth 1/2 cup at a time, stirring until absorbed before adding more.",
          "When rice is creamy and al dente (about 20 minutes), stir in mushrooms, remaining butter, and parmesan.",
          "Season with salt, pepper, and garnish with thyme."
        ]),
        image_url: "https://images.unsplash.com/photo-1476124369491-e7addf5db371",
        prep_time: 10,
        cook_time: 30,
        servings: 4,
        calories: 420,
        difficulty: "Intermediate",
        category_id: 3, // Dinner
        kitchen_id: 1, // Italian
        author_id: 2, // Chef Rania
        status: "approved"
      },
      {
        title: "Thai Green Curry",
        description: "Aromatic green curry with coconut milk, vegetables, and your choice of protein. Perfect with jasmine rice.",
        ingredients: JSON.stringify([
          "2 tbsp green curry paste",
          "1 can (14 oz) coconut milk",
          "1 lb chicken, tofu, or shrimp",
          "1 bell pepper, sliced",
          "1 zucchini, sliced",
          "1 cup snap peas",
          "1 tbsp fish sauce (or soy sauce)",
          "1 tbsp brown sugar",
          "Fresh basil leaves",
          "Lime wedges for serving",
          "Jasmine rice for serving"
        ]),
        steps: JSON.stringify([
          "In a large pot, heat 2 tbsp of coconut milk and curry paste, stirring until fragrant.",
          "Add protein and cook until nearly done.",
          "Pour in remaining coconut milk, fish sauce, and sugar. Bring to simmer.",
          "Add vegetables and cook until tender-crisp, about 5 minutes.",
          "Stir in basil leaves just before serving.",
          "Serve with jasmine rice and lime wedges."
        ]),
        image_url: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd",
        prep_time: 15,
        cook_time: 20,
        servings: 4,
        calories: 380,
        difficulty: "Easy",
        category_id: 3, // Dinner
        kitchen_id: 2, // Thai
        author_id: 2, // Chef Rania
        status: "approved"
      }
    ];
    
    recipes.forEach(recipe => {
      this.createRecipe(recipe as any);
    });
  }
  
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username.toLowerCase() === username.toLowerCase()
    );
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email.toLowerCase() === email.toLowerCase()
    );
  }
  
  async createUser(user: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const now = new Date();
    const newUser: User = {
      ...user,
      id,
      role: user.role || "user",
      created_at: now
    };
    this.users.set(id, newUser);
    return newUser;
  }
  
  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const user = await this.getUser(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  
  // Recipe operations
  async getRecipe(id: number): Promise<Recipe | undefined> {
    return this.recipes.get(id);
  }
  
  async getRecipes(options: { 
    limit?: number, 
    offset?: number,
    categoryId?: number,
    kitchenId?: number,
    authorId?: number,
    status?: string,
    search?: string
  } = {}): Promise<Recipe[]> {
    let recipes = Array.from(this.recipes.values());
    
    // Apply filters
    if (options.categoryId) {
      recipes = recipes.filter(recipe => recipe.category_id === options.categoryId);
    }
    
    if (options.kitchenId) {
      recipes = recipes.filter(recipe => recipe.kitchen_id === options.kitchenId);
    }
    
    if (options.authorId) {
      recipes = recipes.filter(recipe => recipe.author_id === options.authorId);
    }
    
    if (options.status) {
      recipes = recipes.filter(recipe => recipe.status === options.status);
    } else {
      // By default, only show approved recipes
      recipes = recipes.filter(recipe => recipe.status === "approved");
    }
    
    if (options.search) {
      const searchLower = options.search.toLowerCase();
      recipes = recipes.filter(recipe => 
        recipe.title.toLowerCase().includes(searchLower) ||
        recipe.description.toLowerCase().includes(searchLower)
      );
    }
    
    // Sort by newest first
    recipes.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    
    // Apply pagination
    const offset = options.offset || 0;
    const limit = options.limit || recipes.length;
    
    return recipes.slice(offset, offset + limit);
  }
  
  async createRecipe(recipe: InsertRecipe): Promise<Recipe> {
    const id = this.recipeIdCounter++;
    const now = new Date();
    
    // Ensure JSON data
    const ingredients = typeof recipe.ingredients === 'string' 
      ? JSON.parse(recipe.ingredients) 
      : recipe.ingredients;
      
    const steps = typeof recipe.steps === 'string'
      ? JSON.parse(recipe.steps)
      : recipe.steps;
    
    const newRecipe: Recipe = {
      ...recipe,
      id,
      ingredients,
      steps,
      favorites_count: 0,
      status: recipe.status || "pending",
      created_at: now,
      updated_at: now
    };
    
    this.recipes.set(id, newRecipe);
    
    // Update category recipe count
    const category = await this.getCategory(recipe.category_id);
    if (category) {
      this.updateCategory(category.id, {
        recipe_count: category.recipe_count + 1
      });
    }
    
    return newRecipe;
  }
  
  async updateRecipe(id: number, updates: Partial<Recipe>): Promise<Recipe | undefined> {
    const recipe = await this.getRecipe(id);
    if (!recipe) return undefined;
    
    const now = new Date();
    
    // Handle JSON fields
    if (updates.ingredients && typeof updates.ingredients === 'string') {
      updates.ingredients = JSON.parse(updates.ingredients);
    }
    
    if (updates.steps && typeof updates.steps === 'string') {
      updates.steps = JSON.parse(updates.steps);
    }
    
    const updatedRecipe = { 
      ...recipe, 
      ...updates,
      updated_at: now
    };
    
    this.recipes.set(id, updatedRecipe);
    return updatedRecipe;
  }
  
  async deleteRecipe(id: number): Promise<boolean> {
    const recipe = await this.getRecipe(id);
    if (!recipe) return false;
    
    // Decrease category recipe count
    const category = await this.getCategory(recipe.category_id);
    if (category) {
      this.updateCategory(category.id, {
        recipe_count: Math.max(0, category.recipe_count - 1)
      });
    }
    
    return this.recipes.delete(id);
  }
  
  async getRecipeOfTheDay(): Promise<Recipe | undefined> {
    const approvedRecipes = await this.getRecipes({ status: "approved" });
    if (approvedRecipes.length === 0) return undefined;
    
    // Use date as seed for pseudo-random selection
    const today = new Date();
    const dateString = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
    const dateSeed = dateString.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    
    const index = dateSeed % approvedRecipes.length;
    return approvedRecipes[index];
  }
  
  async getFeaturedRecipes(limit: number = 6): Promise<Recipe[]> {
    const approvedRecipes = await this.getRecipes({ status: "approved" });
    
    // Sort by combination of rating and favorites
    approvedRecipes.sort((a, b) => {
      const aScore = a.favorites_count + (this.getAverageRatingSync(a.id) * 2);
      const bScore = b.favorites_count + (this.getAverageRatingSync(b.id) * 2);
      return bScore - aScore;
    });
    
    return approvedRecipes.slice(0, limit);
  }
  
  async getPopularRecipes(limit: number = 6): Promise<Recipe[]> {
    const approvedRecipes = await this.getRecipes({ status: "approved" });
    
    // Sort by favorites count
    approvedRecipes.sort((a, b) => b.favorites_count - a.favorites_count);
    
    return approvedRecipes.slice(0, limit);
  }
  
  async getNewRecipes(limit: number = 6): Promise<Recipe[]> {
    return this.getRecipes({ 
      status: "approved",
      limit
    });
  }
  
  // Category operations
  async getCategory(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }
  
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }
  
  async createCategory(category: InsertCategory): Promise<Category> {
    const id = this.categoryIdCounter++;
    const newCategory: Category = {
      ...category,
      id,
      recipe_count: 0
    };
    this.categories.set(id, newCategory);
    return newCategory;
  }
  
  async updateCategory(id: number, updates: Partial<Category>): Promise<Category | undefined> {
    const category = await this.getCategory(id);
    if (!category) return undefined;
    
    const updatedCategory = { ...category, ...updates };
    this.categories.set(id, updatedCategory);
    return updatedCategory;
  }
  
  // Kitchen operations
  async getKitchen(id: number): Promise<Kitchen | undefined> {
    return this.kitchens.get(id);
  }
  
  async getKitchens(): Promise<Kitchen[]> {
    // If there are no kitchens in the storage, add some
    if (this.kitchens.size === 0) {
      // Re-seed kitchens if they weren't properly created initially
      const kitchens = [
        { name: "Italian", description: "Mediterranean classics", image_url: "https://images.unsplash.com/photo-1498579150354-977475b7ea0b" },
        { name: "Thai", description: "Aromatic and spicy", image_url: "https://images.unsplash.com/photo-1559314809-0d155014e29e" },
        { name: "Mexican", description: "Bold and vibrant", image_url: "https://images.unsplash.com/photo-1464219551459-ac14ae01fbe0" },
        { name: "Indian", description: "Rich and flavorful", image_url: "https://images.unsplash.com/photo-1505253758473-96b7015fcd40" },
        { name: "American", description: "Comfort classics", image_url: "https://images.unsplash.com/photo-1550317138-10000687a72b" }
      ];
      
      kitchens.forEach(kitchen => {
        this.createKitchen({
          name: kitchen.name,
          description: kitchen.description,
          image_url: kitchen.image_url
        });
      });
    }
    
    return Array.from(this.kitchens.values());
  }
  
  async createKitchen(kitchen: InsertKitchen): Promise<Kitchen> {
    const id = this.kitchenIdCounter++;
    const newKitchen: Kitchen = {
      ...kitchen,
      id
    };
    this.kitchens.set(id, newKitchen);
    return newKitchen;
  }
  
  // Rating operations
  async createRating(rating: InsertRating): Promise<Rating> {
    const id = this.ratingIdCounter++;
    const now = new Date();
    const newRating: Rating = {
      ...rating,
      id,
      created_at: now
    };
    this.ratings.set(id, newRating);
    return newRating;
  }
  
  async getRecipeRatings(recipeId: number): Promise<Rating[]> {
    return Array.from(this.ratings.values())
      .filter(rating => rating.recipe_id === recipeId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }
  
  // Helper method for internal use
  private getAverageRatingSync(recipeId: number): number {
    const ratings = Array.from(this.ratings.values())
      .filter(rating => rating.recipe_id === recipeId);
    
    if (ratings.length === 0) return 0;
    
    const sum = ratings.reduce((acc, rating) => acc + rating.rating, 0);
    return sum / ratings.length;
  }
  
  async getAverageRating(recipeId: number): Promise<number> {
    return this.getAverageRatingSync(recipeId);
  }
  
  // Favorite operations
  async createFavorite(favorite: InsertFavorite): Promise<Favorite> {
    // Check if already favorited
    const existing = Array.from(this.favorites.values()).find(
      f => f.user_id === favorite.user_id && f.recipe_id === favorite.recipe_id
    );
    
    if (existing) return existing;
    
    const id = this.favoriteIdCounter++;
    const now = new Date();
    const newFavorite: Favorite = {
      ...favorite,
      id,
      created_at: now
    };
    this.favorites.set(id, newFavorite);
    
    // Increment recipe favorites count
    const recipe = await this.getRecipe(favorite.recipe_id);
    if (recipe) {
      this.updateRecipe(recipe.id, { 
        favorites_count: recipe.favorites_count + 1 
      });
    }
    
    return newFavorite;
  }
  
  async deleteFavorite(userId: number, recipeId: number): Promise<boolean> {
    const favorite = Array.from(this.favorites.values()).find(
      f => f.user_id === userId && f.recipe_id === recipeId
    );
    
    if (!favorite) return false;
    
    const result = this.favorites.delete(favorite.id);
    
    // Decrement recipe favorites count
    if (result) {
      const recipe = await this.getRecipe(recipeId);
      if (recipe) {
        this.updateRecipe(recipe.id, { 
          favorites_count: Math.max(0, recipe.favorites_count - 1) 
        });
      }
    }
    
    return result;
  }
  
  async getUserFavorites(userId: number): Promise<Recipe[]> {
    const userFavorites = Array.from(this.favorites.values())
      .filter(favorite => favorite.user_id === userId);
    
    const recipes: Recipe[] = [];
    for (const favorite of userFavorites) {
      const recipe = await this.getRecipe(favorite.recipe_id);
      if (recipe) recipes.push(recipe);
    }
    
    return recipes;
  }
  
  async isFavorite(userId: number, recipeId: number): Promise<boolean> {
    return !!Array.from(this.favorites.values()).find(
      f => f.user_id === userId && f.recipe_id === recipeId
    );
  }
  
  // AI Interaction operations
  async createAIInteraction(interaction: InsertAIInteraction): Promise<AIInteraction> {
    const id = this.aiInteractionIdCounter++;
    const now = new Date();
    const newInteraction: AIInteraction = {
      ...interaction,
      id,
      created_at: now
    };
    this.aiInteractions.set(id, newInteraction);
    return newInteraction;
  }
  
  async getUserAIInteractions(userId: number, limit: number = 10): Promise<AIInteraction[]> {
    return Array.from(this.aiInteractions.values())
      .filter(interaction => interaction.user_id === userId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, limit);
  }
}

import { DBStorage } from "./storage/db";

export const storage: IStorage = new DBStorage();
