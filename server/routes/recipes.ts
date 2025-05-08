import express from "express";
import { z } from "zod";
import { storage } from "../storage";
import { insertRecipeSchema, insertRatingSchema, insertFavoriteSchema } from "@shared/schema";
import { isAuthenticated, isAdmin } from "./auth";

const router = express.Router();

// Get all recipes with filters
router.get("/", async (req, res, next) => {
  try {
    const querySchema = z.object({
      limit: z.string().optional().transform(val => val ? parseInt(val) : undefined),
      offset: z.string().optional().transform(val => val ? parseInt(val) : undefined),
      category: z.string().optional().transform(val => val ? parseInt(val) : undefined),
      kitchen: z.string().optional().transform(val => val ? parseInt(val) : undefined),
      author: z.string().optional().transform(val => val ? parseInt(val) : undefined),
      search: z.string().optional(),
      status: z.string().optional()
    });
    
    const { limit, offset, category, kitchen, author, search, status } = querySchema.parse(req.query);
    
    // Only allow status filter for admin users
    const effectiveStatus = req.session?.user?.role === "admin" ? status : "approved";
    
    const recipes = await storage.getRecipes({
      limit,
      offset,
      categoryId: category,
      kitchenId: kitchen,
      authorId: author,
      search,
      status: effectiveStatus
    });
    
    res.json(recipes);
  } catch (error) {
    next(error);
  }
});

// Get recipe of the day
router.get("/daily", async (req, res, next) => {
  try {
    const recipe = await storage.getRecipeOfTheDay();
    
    if (!recipe) {
      return res.status(404).json({ message: "No recipe of the day available" });
    }
    
    res.json(recipe);
  } catch (error) {
    next(error);
  }
});

// Get featured recipes
router.get("/featured", async (req, res, next) => {
  try {
    const limitSchema = z.object({
      limit: z.string().optional().transform(val => val ? parseInt(val) : 6)
    });
    
    const { limit } = limitSchema.parse(req.query);
    const recipes = await storage.getFeaturedRecipes(limit);
    
    res.json(recipes);
  } catch (error) {
    next(error);
  }
});

// Get popular recipes
router.get("/popular", async (req, res, next) => {
  try {
    const limitSchema = z.object({
      limit: z.string().optional().transform(val => val ? parseInt(val) : 6)
    });
    
    const { limit } = limitSchema.parse(req.query);
    const recipes = await storage.getPopularRecipes(limit);
    
    res.json(recipes);
  } catch (error) {
    next(error);
  }
});

// Get new recipes
router.get("/new", async (req, res, next) => {
  try {
    const limitSchema = z.object({
      limit: z.string().optional().transform(val => val ? parseInt(val) : 6)
    });
    
    const { limit } = limitSchema.parse(req.query);
    const recipes = await storage.getNewRecipes(limit);
    
    res.json(recipes);
  } catch (error) {
    next(error);
  }
});

// Get a specific recipe
router.get("/:id", async (req, res, next) => {
  try {
    const idSchema = z.object({
      id: z.string().transform(val => parseInt(val))
    });
    
    const { id } = idSchema.parse(req.params);
    const recipe = await storage.getRecipe(id);
    
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }
    
    // Check if non-approved recipes should be visible
    if (recipe.status !== "approved" && (!req.session?.user || (req.session.user.role !== "admin" && req.session.user.id !== recipe.author_id))) {
      return res.status(404).json({ message: "Recipe not found" });
    }
    
    res.json(recipe);
  } catch (error) {
    next(error);
  }
});

// Create a new recipe
router.post("/", isAuthenticated, async (req, res, next) => {
  try {
    const recipeData = insertRecipeSchema.parse(req.body);
    
    // Set author ID from session
    recipeData.author_id = req.session.user.id;
    
    // Set status based on user role (auto-approve for admins)
    recipeData.status = req.session.user.role === "admin" ? "approved" : "pending";
    
    const recipe = await storage.createRecipe(recipeData);
    
    res.status(201).json(recipe);
  } catch (error) {
    next(error);
  }
});

// Update a recipe
router.put("/:id", isAuthenticated, async (req, res, next) => {
  try {
    const idSchema = z.object({
      id: z.string().transform(val => parseInt(val))
    });
    
    const { id } = idSchema.parse(req.params);
    const recipe = await storage.getRecipe(id);
    
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }
    
    // Check permissions
    if (req.session.user.id !== recipe.author_id && req.session.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }
    
    const updateData = insertRecipeSchema.partial().parse(req.body);
    
    // Non-admin users can't change status directly
    if (req.session.user.role !== "admin") {
      delete updateData.status;
    }
    
    const updatedRecipe = await storage.updateRecipe(id, updateData);
    
    res.json(updatedRecipe);
  } catch (error) {
    next(error);
  }
});

// Delete a recipe
router.delete("/:id", isAuthenticated, async (req, res, next) => {
  try {
    const idSchema = z.object({
      id: z.string().transform(val => parseInt(val))
    });
    
    const { id } = idSchema.parse(req.params);
    const recipe = await storage.getRecipe(id);
    
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }
    
    // Check permissions
    if (req.session.user.id !== recipe.author_id && req.session.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }
    
    await storage.deleteRecipe(id);
    
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

// Approve or reject a recipe
router.put("/:id/status", isAdmin, async (req, res, next) => {
  try {
    const idSchema = z.object({
      id: z.string().transform(val => parseInt(val))
    });
    
    const bodySchema = z.object({
      status: z.enum(["pending", "approved", "rejected"])
    });
    
    const { id } = idSchema.parse(req.params);
    const { status } = bodySchema.parse(req.body);
    
    const recipe = await storage.getRecipe(id);
    
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }
    
    const updatedRecipe = await storage.updateRecipe(id, { status });
    
    res.json(updatedRecipe);
  } catch (error) {
    next(error);
  }
});

// Get ratings for a recipe
router.get("/:id/ratings", async (req, res, next) => {
  try {
    const idSchema = z.object({
      id: z.string().transform(val => parseInt(val))
    });
    
    const { id } = idSchema.parse(req.params);
    const recipe = await storage.getRecipe(id);
    
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }
    
    const ratings = await storage.getRecipeRatings(id);
    
    res.json(ratings);
  } catch (error) {
    next(error);
  }
});

// Get average rating for a recipe
router.get("/:id/average-rating", async (req, res, next) => {
  try {
    const idSchema = z.object({
      id: z.string().transform(val => parseInt(val))
    });
    
    const { id } = idSchema.parse(req.params);
    const recipe = await storage.getRecipe(id);
    
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }
    
    const averageRating = await storage.getAverageRating(id);
    
    res.json({ average: averageRating });
  } catch (error) {
    next(error);
  }
});

// Rate a recipe
router.post("/:id/rate", isAuthenticated, async (req, res, next) => {
  try {
    const idSchema = z.object({
      id: z.string().transform(val => parseInt(val))
    });
    
    const { id } = idSchema.parse(req.params);
    const recipe = await storage.getRecipe(id);
    
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }
    
    const ratingData = insertRatingSchema.parse({
      ...req.body,
      user_id: req.session.user.id,
      recipe_id: id
    });
    
    const rating = await storage.createRating(ratingData);
    
    res.status(201).json(rating);
  } catch (error) {
    next(error);
  }
});

// Favorite a recipe
router.post("/:id/favorite", isAuthenticated, async (req, res, next) => {
  try {
    const idSchema = z.object({
      id: z.string().transform(val => parseInt(val))
    });
    
    const { id } = idSchema.parse(req.params);
    const recipe = await storage.getRecipe(id);
    
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }
    
    const favorite = await storage.createFavorite({
      user_id: req.session.user.id,
      recipe_id: id
    });
    
    res.status(201).json(favorite);
  } catch (error) {
    next(error);
  }
});

// Unfavorite a recipe
router.delete("/:id/favorite", isAuthenticated, async (req, res, next) => {
  try {
    const idSchema = z.object({
      id: z.string().transform(val => parseInt(val))
    });
    
    const { id } = idSchema.parse(req.params);
    
    const result = await storage.deleteFavorite(req.session.user.id, id);
    
    if (!result) {
      return res.status(404).json({ message: "Favorite not found" });
    }
    
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

// Check if recipe is favorited by user
router.get("/:id/is-favorite", isAuthenticated, async (req, res, next) => {
  try {
    const idSchema = z.object({
      id: z.string().transform(val => parseInt(val))
    });
    
    const { id } = idSchema.parse(req.params);
    
    const isFavorite = await storage.isFavorite(req.session.user.id, id);
    
    res.json({ isFavorite });
  } catch (error) {
    next(error);
  }
});

export const recipeRoutes = router;
