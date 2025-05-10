import { db } from "../db";
import { 
  users, recipes, categories, kitchens, ratings, favorites, aiInteractions,
  type User, type InsertUser, type Recipe, type InsertRecipe,
  type Category, type InsertCategory, type Kitchen, type InsertKitchen,
  type Rating, type InsertRating, type Favorite, type InsertFavorite,
  type AIInteraction, type InsertAIInteraction
} from "@shared/schema";
import { eq, and, desc, sql, like, or } from "drizzle-orm";
import type { IStorage } from "../storage";

export class DBStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email));
    return result[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const result = await db.insert(users).values(user).returning();
    return result[0];
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const result = await db.update(users)
      .set(updates)
      .where(eq(users.id, id))
      .returning();
    return result[0];
  }

  // Recipe operations
  async getRecipe(id: number): Promise<Recipe | undefined> {
    const result = await db.select().from(recipes).where(eq(recipes.id, id));
    return result[0];
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

    if (options.categoryId) {
      query = query.where(eq(recipes.category_id, options.categoryId));
    }
    if (options.kitchenId) {
      query = query.where(eq(recipes.kitchen_id, options.kitchenId));
    }
    if (options.authorId) {
      query = query.where(eq(recipes.author_id, options.authorId));
    }
    if (options.status) {
      query = query.where(eq(recipes.status, options.status));
    }
    if (options.search) {
      query = query.where(
        or(
          like(recipes.title, `%${options.search}%`),
          like(recipes.description, `%${options.search}%`)
        )
      );
    }

    if (options.limit) {
      query = query.limit(options.limit);
    }
    if (options.offset) {
      query = query.offset(options.offset);
    }

    return query;
  }

  async createRecipe(recipe: InsertRecipe): Promise<Recipe> {
    const result = await db.insert(recipes).values(recipe).returning();
    return result[0];
  }

  async updateRecipe(id: number, updates: Partial<Recipe>): Promise<Recipe | undefined> {
    const result = await db.update(recipes)
      .set(updates)
      .where(eq(recipes.id, id))
      .returning();
    return result[0];
  }

  async deleteRecipe(id: number): Promise<boolean> {
    const result = await db.delete(recipes).where(eq(recipes.id, id));
    return result.rowCount > 0;
  }

  async getRecipeOfTheDay(): Promise<Recipe | undefined> {
    // Get a random recipe that's approved
    const result = await db.select()
      .from(recipes)
      .where(eq(recipes.status, "approved"))
      .orderBy(sql`RANDOM()`)
      .limit(1);
    return result[0];
  }

  async getFeaturedRecipes(limit: number = 6): Promise<Recipe[]> {
    return db.select()
      .from(recipes)
      .where(eq(recipes.status, "approved"))
      .orderBy(desc(recipes.favorites_count))
      .limit(limit);
  }

  async getPopularRecipes(limit: number = 6): Promise<Recipe[]> {
    return db.select()
      .from(recipes)
      .where(eq(recipes.status, "approved"))
      .orderBy(desc(recipes.favorites_count))
      .limit(limit);
  }

  async getNewRecipes(limit: number = 6): Promise<Recipe[]> {
    return db.select()
      .from(recipes)
      .where(eq(recipes.status, "approved"))
      .orderBy(desc(recipes.created_at))
      .limit(limit);
  }

  // Category operations
  async getCategory(id: number): Promise<Category | undefined> {
    const result = await db.select().from(categories).where(eq(categories.id, id));
    return result[0];
  }

  async getCategories(): Promise<Category[]> {
    return db.select().from(categories);
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const result = await db.insert(categories).values(category).returning();
    return result[0];
  }

  async updateCategory(id: number, updates: Partial<Category>): Promise<Category | undefined> {
    const result = await db.update(categories)
      .set(updates)
      .where(eq(categories.id, id))
      .returning();
    return result[0];
  }

  // Kitchen operations
  async getKitchen(id: number): Promise<Kitchen | undefined> {
    const result = await db.select().from(kitchens).where(eq(kitchens.id, id));
    return result[0];
  }

  async getKitchens(): Promise<Kitchen[]> {
    return db.select().from(kitchens);
  }

  async createKitchen(kitchen: InsertKitchen): Promise<Kitchen> {
    const result = await db.insert(kitchens).values(kitchen).returning();
    return result[0];
  }

  // Rating operations
  async createRating(rating: InsertRating): Promise<Rating> {
    const result = await db.insert(ratings).values(rating).returning();
    return result[0];
  }

  async getRecipeRatings(recipeId: number): Promise<Rating[]> {
    return db.select()
      .from(ratings)
      .where(eq(ratings.recipe_id, recipeId))
      .orderBy(desc(ratings.created_at));
  }

  async getAverageRating(recipeId: number): Promise<number> {
    const result = await db.select({
      avg: sql<number>`avg(${ratings.rating})`
    })
    .from(ratings)
    .where(eq(ratings.recipe_id, recipeId));
    return result[0]?.avg || 0;
  }

  // Favorite operations
  async createFavorite(favorite: InsertFavorite): Promise<Favorite> {
    const result = await db.insert(favorites).values(favorite).returning();
    // Update recipe favorites count
    await db.update(recipes)
      .set({ favorites_count: sql`${recipes.favorites_count} + 1` })
      .where(eq(recipes.id, favorite.recipe_id));
    return result[0];
  }

  async deleteFavorite(userId: number, recipeId: number): Promise<boolean> {
    const result = await db.delete(favorites)
      .where(and(
        eq(favorites.user_id, userId),
        eq(favorites.recipe_id, recipeId)
      ));
    // Update recipe favorites count
    await db.update(recipes)
      .set({ favorites_count: sql`${recipes.favorites_count} - 1` })
      .where(eq(recipes.id, recipeId));
    return result.rowCount > 0;
  }

  async getUserFavorites(userId: number): Promise<Recipe[]> {
    return db.select({
      id: recipes.id,
      title: recipes.title,
      description: recipes.description,
      ingredients: recipes.ingredients,
      steps: recipes.steps,
      image_url: recipes.image_url,
      youtube_url: recipes.youtube_url,
      prep_time: recipes.prep_time,
      cook_time: recipes.cook_time,
      servings: recipes.servings,
      calories: recipes.calories,
      difficulty: recipes.difficulty,
      category_id: recipes.category_id,
      kitchen_id: recipes.kitchen_id,
      author_id: recipes.author_id,
      favorites_count: recipes.favorites_count,
      status: recipes.status,
      created_at: recipes.created_at,
      updated_at: recipes.updated_at
    })
      .from(recipes)
      .innerJoin(favorites, eq(favorites.recipe_id, recipes.id))
      .where(eq(favorites.user_id, userId));
  }

  async isFavorite(userId: number, recipeId: number): Promise<boolean> {
    const result = await db.select()
      .from(favorites)
      .where(and(
        eq(favorites.user_id, userId),
        eq(favorites.recipe_id, recipeId)
      ));
    return result.length > 0;
  }

  // AI Interaction operations
  async createAIInteraction(interaction: InsertAIInteraction): Promise<AIInteraction> {
    const result = await db.insert(aiInteractions).values(interaction).returning();
    return result[0];
  }

  async getUserAIInteractions(userId: number, limit: number = 10): Promise<AIInteraction[]> {
    return db.select()
      .from(aiInteractions)
      .where(eq(aiInteractions.user_id, userId))
      .orderBy(desc(aiInteractions.created_at))
      .limit(limit);
  }
} 