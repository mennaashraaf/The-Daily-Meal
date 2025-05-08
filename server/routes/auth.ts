import express from "express";
import { z } from "zod";
import { storage } from "../storage";
import { insertUserSchema } from "@shared/schema";

const router = express.Router();

// Middleware to check if user is authenticated
export const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.user) {
    return next();
  }
  
  res.status(401).json({ message: "Unauthorized" });
};

// Middleware to check if user is admin
export const isAdmin = (req, res, next) => {
  if (req.session && req.session.user && req.session.user.role === "admin") {
    return next();
  }
  
  res.status(403).json({ message: "Forbidden" });
};

// Register a new user
router.post("/signup", async (req, res, next) => {
  try {
    // Validate request body
    const userSchema = insertUserSchema.extend({
      confirmPassword: z.string()
    }).refine(data => data.password === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    });
    
    const userData = userSchema.parse(req.body);
    
    // Check if username or email already exists
    const existingUsername = await storage.getUserByUsername(userData.username);
    if (existingUsername) {
      return res.status(400).json({ message: "Username already exists" });
    }
    
    const existingEmail = await storage.getUserByEmail(userData.email);
    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }
    
    // Create user
    const { confirmPassword, ...userToCreate } = userData;
    const user = await storage.createUser(userToCreate);
    
    // Remove password from response
    const { password, ...userWithoutPassword } = user;
    
    // Start session
    req.session.user = userWithoutPassword;
    
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    next(error);
  }
});

// Login
router.post("/login", async (req, res, next) => {
  try {
    const loginSchema = z.object({
      username: z.string(),
      password: z.string()
    });
    
    const { username, password } = loginSchema.parse(req.body);
    
    const user = await storage.getUserByUsername(username);
    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid username or password" });
    }
    
    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;
    
    // Start session
    req.session.user = userWithoutPassword;
    
    res.json(userWithoutPassword);
  } catch (error) {
    next(error);
  }
});

// Logout
router.post("/logout", (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ message: "Could not log out" });
    }
    
    res.status(200).json({ message: "Logged out successfully" });
  });
});

// Get current user
router.get("/me", isAuthenticated, (req, res) => {
  res.json(req.session.user);
});

export const authRoutes = router;
