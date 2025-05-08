import { 
  User, InsertUser, Recipe, InsertRecipe, Category, InsertCategory, 
  Kitchen, InsertKitchen, Rating, InsertRating, Favorite, InsertFavorite,
  AIInteraction, InsertAIInteraction,
  users, recipes, categories, kitchens, ratings, favorites, aiInteractions
} from "@shared/schema";
import { db } from "./db";
import { 
  eq, and, or, like, desc, sql, asc, 
  count, avg
} from "drizzle-orm";
import { IStorage } from "./storage";

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.username, username));
    return user;
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email));
    return user;
  }
  
  async createUser(user: InsertUser): Promise<User> {
    const [createdUser] = await db
      .insert(users)
      .values(user)
      .returning();
    return createdUser;
  }
  
  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const [updatedUser] = await db
      .update(users)
      .set(updates)
      .where(eq(users.id, id))
      .returning();
    return updatedUser;
  }
  
  // Recipe operations
  async getRecipe(id: number): Promise<Recipe | undefined> {
    const [recipe] = await db
      .select()
      .from(recipes)
      .where(eq(recipes.id, id));
    return recipe;
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
    let query = db.select().from(recipes);
    
    // Apply filters
    const filters = [];
    
    if (options.categoryId) {
      filters.push(eq(recipes.category_id, options.categoryId));
    }
    
    if (options.kitchenId) {
      filters.push(eq(recipes.kitchen_id, options.kitchenId));
    }
    
    if (options.authorId) {
      filters.push(eq(recipes.author_id, options.authorId));
    }
    
    if (options.status) {
      filters.push(eq(recipes.status, options.status));
    } else {
      // By default, only show approved recipes
      filters.push(eq(recipes.status, "approved"));
    }
    
    if (options.search) {
      filters.push(
        or(
          like(recipes.title, `%${options.search}%`),
          like(recipes.description, `%${options.search}%`)
        )
      );
    }
    
    // Apply all filters
    if (filters.length > 0) {
      query = query.where(and(...filters));
    }
    
    // Apply sorting (newest first)
    query = query.orderBy(desc(recipes.created_at));
    
    // Apply pagination
    if (options.offset !== undefined) {
      query = query.offset(options.offset);
    }
    
    if (options.limit !== undefined) {
      query = query.limit(options.limit);
    }
    
    return query;
  }
  
  async createRecipe(recipe: InsertRecipe): Promise<Recipe> {
    const [createdRecipe] = await db
      .insert(recipes)
      .values(recipe)
      .returning();
    return createdRecipe;
  }
  
  async updateRecipe(id: number, updates: Partial<Recipe>): Promise<Recipe | undefined> {
    const [updatedRecipe] = await db
      .update(recipes)
      .set(updates)
      .where(eq(recipes.id, id))
      .returning();
    return updatedRecipe;
  }
  
  async deleteRecipe(id: number): Promise<boolean> {
    const result = await db
      .delete(recipes)
      .where(eq(recipes.id, id));
    return result.rowCount > 0;
  }
  
  async getRecipeOfTheDay(): Promise<Recipe | undefined> {
    const todaysRecipes = await db
      .select()
      .from(recipes)
      .where(eq(recipes.status, "approved"))
      .orderBy(desc(recipes.created_at))
      .limit(1);
    
    return todaysRecipes[0];
  }
  
  async getFeaturedRecipes(limit: number = 6): Promise<Recipe[]> {
    return db
      .select()
      .from(recipes)
      .where(eq(recipes.status, "approved"))
      .orderBy(desc(recipes.favorites_count))
      .limit(limit);
  }
  
  async getPopularRecipes(limit: number = 6): Promise<Recipe[]> {
    return db
      .select()
      .from(recipes)
      .where(eq(recipes.status, "approved"))
      .orderBy(desc(recipes.favorites_count))
      .limit(limit);
  }
  
  async getNewRecipes(limit: number = 6): Promise<Recipe[]> {
    return db
      .select()
      .from(recipes)
      .where(eq(recipes.status, "approved"))
      .orderBy(desc(recipes.created_at))
      .limit(limit);
  }
  
  // Category operations
  async getCategory(id: number): Promise<Category | undefined> {
    const [category] = await db
      .select()
      .from(categories)
      .where(eq(categories.id, id));
    return category;
  }
  
  async getCategories(): Promise<Category[]> {
    return db.select().from(categories);
  }
  
  async createCategory(category: InsertCategory): Promise<Category> {
    const [createdCategory] = await db
      .insert(categories)
      .values(category)
      .returning();
    return createdCategory;
  }
  
  async updateCategory(id: number, updates: Partial<Category>): Promise<Category | undefined> {
    const [updatedCategory] = await db
      .update(categories)
      .set(updates)
      .where(eq(categories.id, id))
      .returning();
    return updatedCategory;
  }
  
  // Kitchen operations
  async getKitchen(id: number): Promise<Kitchen | undefined> {
    const [kitchen] = await db
      .select()
      .from(kitchens)
      .where(eq(kitchens.id, id));
    return kitchen;
  }
  
  async getKitchens(): Promise<Kitchen[]> {
    return db.select().from(kitchens);
  }
  
  async createKitchen(kitchen: InsertKitchen): Promise<Kitchen> {
    const [createdKitchen] = await db
      .insert(kitchens)
      .values(kitchen)
      .returning();
    return createdKitchen;
  }
  
  // Rating operations
  async createRating(rating: InsertRating): Promise<Rating> {
    const [createdRating] = await db
      .insert(ratings)
      .values(rating)
      .returning();
    return createdRating;
  }
  
  async getRecipeRatings(recipeId: number): Promise<Rating[]> {
    return db
      .select()
      .from(ratings)
      .where(eq(ratings.recipe_id, recipeId))
      .orderBy(desc(ratings.created_at));
  }
  
  async getAverageRating(recipeId: number): Promise<number> {
    const [result] = await db
      .select({ 
        averageRating: avg(ratings.rating).mapWith(Number) 
      })
      .from(ratings)
      .where(eq(ratings.recipe_id, recipeId));
    
    return result?.averageRating || 0;
  }
  
  // Favorite operations
  async createFavorite(favorite: InsertFavorite): Promise<Favorite> {
    // Check if already favorited
    const existing = await db
      .select()
      .from(favorites)
      .where(
        and(
          eq(favorites.user_id, favorite.user_id),
          eq(favorites.recipe_id, favorite.recipe_id)
        )
      );
    
    if (existing.length > 0) return existing[0];
    
    const [createdFavorite] = await db
      .insert(favorites)
      .values(favorite)
      .returning();
    
    // Increment recipe favorites count
    await db
      .update(recipes)
      .set({
        favorites_count: sql`${recipes.favorites_count} + 1`
      })
      .where(eq(recipes.id, favorite.recipe_id));
    
    return createdFavorite;
  }
  
  async deleteFavorite(userId: number, recipeId: number): Promise<boolean> {
    const deleted = await db
      .delete(favorites)
      .where(
        and(
          eq(favorites.user_id, userId),
          eq(favorites.recipe_id, recipeId)
        )
      );
    
    if (deleted.rowCount === 0) return false;
    
    // Decrement recipe favorites count
    await db
      .update(recipes)
      .set({
        favorites_count: sql`GREATEST(${recipes.favorites_count} - 1, 0)`
      })
      .where(eq(recipes.id, recipeId));
    
    return true;
  }
  
  async getUserFavorites(userId: number): Promise<Recipe[]> {
    return db
      .select({
        recipe: recipes
      })
      .from(favorites)
      .innerJoin(recipes, eq(favorites.recipe_id, recipes.id))
      .where(eq(favorites.user_id, userId))
      .orderBy(desc(favorites.created_at))
      .then(results => results.map(r => r.recipe));
  }
  
  async isFavorite(userId: number, recipeId: number): Promise<boolean> {
    const result = await db
      .select()
      .from(favorites)
      .where(
        and(
          eq(favorites.user_id, userId),
          eq(favorites.recipe_id, recipeId)
        )
      );
    
    return result.length > 0;
  }
  
  // AI Interaction operations
  async createAIInteraction(interaction: InsertAIInteraction): Promise<AIInteraction> {
    const [createdInteraction] = await db
      .insert(aiInteractions)
      .values(interaction)
      .returning();
    return createdInteraction;
  }
  
  async getUserAIInteractions(userId: number, limit: number = 10): Promise<AIInteraction[]> {
    return db
      .select()
      .from(aiInteractions)
      .where(eq(aiInteractions.user_id, userId))
      .orderBy(desc(aiInteractions.created_at))
      .limit(limit);
  }
}