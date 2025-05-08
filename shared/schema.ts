import { pgTable, text, serial, integer, boolean, timestamp, varchar, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  avatar_url: text("avatar_url"),
  name: text("name"),
  bio: text("bio"),
  role: text("role").default("user").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  created_at: true,
  role: true,
});

// Categories table
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description"),
  image_url: text("image_url"),
  recipe_count: integer("recipe_count").default(0),
});

export const insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
  recipe_count: true,
});

// Kitchens/Cuisines table
export const kitchens = pgTable("kitchens", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description"),
  image_url: text("image_url"),
});

export const insertKitchenSchema = createInsertSchema(kitchens).omit({
  id: true,
});

// Recipes table
export const recipes = pgTable("recipes", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  ingredients: jsonb("ingredients").notNull(),
  steps: jsonb("steps").notNull(),
  image_url: text("image_url"),
  youtube_url: text("youtube_url"),
  prep_time: integer("prep_time").notNull(),
  cook_time: integer("cook_time").notNull(),
  servings: integer("servings").notNull(),
  calories: integer("calories"),
  difficulty: text("difficulty").notNull(),
  category_id: integer("category_id").notNull(),
  kitchen_id: integer("kitchen_id").notNull(),
  author_id: integer("author_id").notNull(),
  favorites_count: integer("favorites_count").default(0),
  status: text("status").default("pending").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export const insertRecipeSchema = createInsertSchema(recipes).omit({
  id: true,
  favorites_count: true,
  status: true, 
  created_at: true,
  updated_at: true,
});

// Ratings table
export const ratings = pgTable("ratings", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").notNull(),
  recipe_id: integer("recipe_id").notNull(),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

export const insertRatingSchema = createInsertSchema(ratings).omit({
  id: true,
  created_at: true,
});

// Favorites table
export const favorites = pgTable("favorites", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").notNull(),
  recipe_id: integer("recipe_id").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

export const insertFavoriteSchema = createInsertSchema(favorites).omit({
  id: true,
  created_at: true,
});

// AI Interactions table
export const aiInteractions = pgTable("ai_interactions", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").notNull(),
  type: text("type").notNull(),
  query: text("query").notNull(),
  response: jsonb("response"),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

export const insertAiInteractionSchema = createInsertSchema(aiInteractions).omit({
  id: true,
  created_at: true,
});

// Type definitions
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Category = typeof categories.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;

export type Kitchen = typeof kitchens.$inferSelect;
export type InsertKitchen = z.infer<typeof insertKitchenSchema>;

export type Recipe = typeof recipes.$inferSelect;
export type InsertRecipe = z.infer<typeof insertRecipeSchema>;

export type Rating = typeof ratings.$inferSelect;
export type InsertRating = z.infer<typeof insertRatingSchema>;

export type Favorite = typeof favorites.$inferSelect;
export type InsertFavorite = z.infer<typeof insertFavoriteSchema>;

export type AIInteraction = typeof aiInteractions.$inferSelect;
export type InsertAIInteraction = z.infer<typeof insertAiInteractionSchema>;
