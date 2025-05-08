import express from "express";
import { z } from "zod";
import { storage } from "../storage";
import { insertCategorySchema, insertKitchenSchema } from "@shared/schema";
import { isAdmin } from "./auth";

const router = express.Router();

// Get all categories
router.get("/", async (req, res, next) => {
  try {
    const categories = await storage.getCategories();
    res.json(categories);
  } catch (error) {
    next(error);
  }
});

// Get a specific category
router.get("/:id", async (req, res, next) => {
  try {
    const idSchema = z.object({
      id: z.string().transform(val => parseInt(val))
    });
    
    const { id } = idSchema.parse(req.params);
    const category = await storage.getCategory(id);
    
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    
    res.json(category);
  } catch (error) {
    next(error);
  }
});

// Create a new category (admin only)
router.post("/", isAdmin, async (req, res, next) => {
  try {
    const categoryData = insertCategorySchema.parse(req.body);
    const category = await storage.createCategory(categoryData);
    
    res.status(201).json(category);
  } catch (error) {
    next(error);
  }
});

// Update a category (admin only)
router.put("/:id", isAdmin, async (req, res, next) => {
  try {
    const idSchema = z.object({
      id: z.string().transform(val => parseInt(val))
    });
    
    const { id } = idSchema.parse(req.params);
    const category = await storage.getCategory(id);
    
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    
    const updateData = insertCategorySchema.partial().parse(req.body);
    const updatedCategory = await storage.updateCategory(id, updateData);
    
    res.json(updatedCategory);
  } catch (error) {
    next(error);
  }
});

// Get all kitchens/cuisines
router.get("/kitchens", async (req, res, next) => {
  try {
    const kitchens = await storage.getKitchens();
    res.json(kitchens);
  } catch (error) {
    next(error);
  }
});

// Alternate route for kitchens that matches the client's API requests
router.get("/api/categories/kitchens", async (req, res, next) => {
  try {
    const kitchens = await storage.getKitchens();
    res.json(kitchens);
  } catch (error) {
    next(error);
  }
});

// Get a specific kitchen/cuisine
router.get("/kitchens/:id", async (req, res, next) => {
  try {
    const idSchema = z.object({
      id: z.string().transform(val => parseInt(val))
    });
    
    const { id } = idSchema.parse(req.params);
    const kitchen = await storage.getKitchen(id);
    
    if (!kitchen) {
      return res.status(404).json({ message: "Kitchen not found" });
    }
    
    res.json(kitchen);
  } catch (error) {
    next(error);
  }
});

// Create a new kitchen/cuisine (admin only)
router.post("/kitchens", isAdmin, async (req, res, next) => {
  try {
    const kitchenData = insertKitchenSchema.parse(req.body);
    const kitchen = await storage.createKitchen(kitchenData);
    
    res.status(201).json(kitchen);
  } catch (error) {
    next(error);
  }
});

export const categoryRoutes = router;
