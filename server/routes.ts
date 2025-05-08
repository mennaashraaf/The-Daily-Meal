import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import express from "express";
import { authRoutes } from "./routes/auth";
import { recipeRoutes } from "./routes/recipes";
import { categoryRoutes } from "./routes/categories";
import { aiRoutes } from "./routes/ai";

export async function registerRoutes(app: Express): Promise<Server> {
  // Create API router
  const apiRouter = express.Router();
  
  // Register route modules
  apiRouter.use("/auth", authRoutes);
  apiRouter.use("/recipes", recipeRoutes);
  apiRouter.use("/categories", categoryRoutes);
  apiRouter.use("/ai", aiRoutes);
  
  // Special routes for kitchens
  apiRouter.get("/categories/kitchens", async (req, res, next) => {
    try {
      const kitchens = await storage.getKitchens();
      res.json(kitchens);
    } catch (error) {
      next(error);
    }
  });
  
  // Get kitchen by ID
  apiRouter.get("/categories/kitchens/:id", async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid kitchen ID" });
      }
      
      const kitchen = await storage.getKitchen(id);
      if (!kitchen) {
        return res.status(404).json({ message: "Kitchen not found" });
      }
      
      res.json(kitchen);
    } catch (error) {
      next(error);
    }
  });
  
  // Mount API router with /api prefix
  app.use("/api", apiRouter);
  
  // Error handling for API routes
  app.use("/api", (err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).json({
      message: err.message || "Internal Server Error"
    });
  });

  const httpServer = createServer(app);
  return httpServer;
}
