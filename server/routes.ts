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
  
  // Standalone kitchen routes
  apiRouter.get("/kitchens", async (req, res) => {
    try {
      const kitchens = await storage.getKitchens();
      res.json(kitchens);
    } catch (error) {
      console.error("Error fetching kitchens:", error);
      res.status(500).json({ message: "Error fetching kitchens" });
    }
  });
  
  // Get kitchen by ID
  apiRouter.get("/kitchens/:id", async (req, res) => {
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
      console.error("Error fetching kitchen by ID:", error);
      res.status(500).json({ message: "Error fetching kitchen" });
    }
  });
  
  // Register other route modules
  apiRouter.use("/auth", authRoutes);
  apiRouter.use("/recipes", recipeRoutes);
  apiRouter.use("/categories", categoryRoutes);
  apiRouter.use("/ai", aiRoutes);
  
  // Mount API router with /api prefix
  app.use("/api", apiRouter);
  
  // Error handling for API routes
  app.use("/api", (err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err);
    res.status(err.status || 500).json({
      message: err.message || "Internal Server Error"
    });
  });

  const httpServer = createServer(app);
  return httpServer;
}
