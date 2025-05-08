import express from "express";
import { z } from "zod";
import fetch from "node-fetch";
import { storage } from "../storage";
import { isAuthenticated } from "./auth";
import OpenAI from "openai";

const router = express.Router();

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Helper function to format AI messages for "Chef Rania"
function formatAIPrompt(userMessage: string) {
  return [
    {
      role: "system" as const,
      content: "You are Chef Rania, an AI-powered cooking assistant. Your tone is warm, friendly and encouraging. You specialize in providing recipe suggestions, cooking tips, ingredient substitutions, and step-by-step guidance. Always try to recommend specific recipes based on user queries and include reference links to cooking resources when helpful. Sign off your messages with 'Chef Rania'."
    },
    {
      role: "user" as const,
      content: userMessage
    }
  ];
}

// Add session type to Express request
declare global {
  namespace Express {
    interface Request {
      session: {
        user?: {
          id: number;
          username: string;
          role: string;
        };
      }
    }
  }
}

// AI text chat
router.post("/chat", isAuthenticated, async (req, res, next) => {
  try {
    const bodySchema = z.object({
      message: z.string().min(1)
    });
    
    const { message } = bodySchema.parse(req.body);
    const userId = req.session?.user?.id;
    
    // Check for OpenAI API key
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    
    let aiResponse;
    
    if (!OPENAI_API_KEY) {
      // Fallback response if no API key
      aiResponse = {
        content: "I'd be happy to help with your cooking questions! Unfortunately, I can't access my full capabilities right now. Please try again later or contact support.\n\nChef Rania",
        citations: []
      };
    } else {
      // Call OpenAI API
      try {
        const completion = await openai.chat.completions.create({
          model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
          messages: formatAIPrompt(message),
          temperature: 0.7,
          max_tokens: 500,
        });
        
        aiResponse = {
          content: completion.choices[0].message.content || "I'm not sure how to respond to that. Could you try asking in a different way?\n\nChef Rania",
          citations: [] // OpenAI doesn't provide citations like Perplexity
        };
      } catch (apiError: any) {
        console.error("OpenAI API Error:", apiError);
        throw new Error(`OpenAI API Error: ${apiError?.message || "Unknown error"}`);
      }
    }
    
    // Save the interaction to the database if user is logged in
    if (userId) {
      await storage.createAIInteraction({
        user_id: userId,
        type: "text",
        query: message,
        response: aiResponse
      });
    }
    
    res.json(aiResponse);
  } catch (error) {
    console.error("AI Chat Error:", error);
    next(error);
  }
});

// AI image analysis
router.post("/image", isAuthenticated, async (req, res, next) => {
  try {
    const bodySchema = z.object({
      image_url: z.string().url(),
      message: z.string().optional()
    });
    
    const { image_url, message } = bodySchema.parse(req.body);
    const userId = req.session?.user?.id;
    
    // For image analysis, we'll use a combination of OpenAI vision capabilities
    // or we can mock the ingredient detection for now
    const detectedIngredients = ["tomatoes", "onions", "garlic", "basil"];
    
    // Format prompt with detected ingredients
    const ingredientList = detectedIngredients.join(", ");
    const userPrompt = message 
      ? `I have uploaded a photo with these ingredients: ${ingredientList}. ${message}`
      : `I have uploaded a photo with these ingredients: ${ingredientList}. What recipes can I make with them?`;
    
    // Check for OpenAI API key
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    
    let aiResponse;
    
    if (!OPENAI_API_KEY) {
      // Fallback response if no API key
      aiResponse = {
        detected_ingredients: detectedIngredients,
        content: `I see you have ${ingredientList}! You could make a simple tomato sauce pasta, bruschetta, or a fresh tomato salad with these ingredients. What would you like to cook?\n\nChef Rania`,
        citations: []
      };
    } else {
      // Call OpenAI API with ingredient prompt
      try {
        const completion = await openai.chat.completions.create({
          model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
          messages: formatAIPrompt(userPrompt),
          temperature: 0.7,
          max_tokens: 500,
        });
        
        aiResponse = {
          detected_ingredients: detectedIngredients,
          content: completion.choices[0].message.content || "I'm not sure how to analyze these ingredients. Could you try again with a clearer image?\n\nChef Rania",
          citations: []
        };
      } catch (apiError: any) {
        console.error("OpenAI API Error:", apiError);
        throw new Error(`OpenAI API Error: ${apiError?.message || "Unknown error"}`);
      }
    }
    
    // Save the interaction to the database if user is logged in
    if (userId) {
      await storage.createAIInteraction({
        user_id: userId,
        type: "image",
        query: `Image analysis: ${ingredientList}. ${message || ""}`,
        response: aiResponse
      });
    }
    
    res.json(aiResponse);
  } catch (error) {
    console.error("AI Image Analysis Error:", error);
    next(error);
  }
});

// Get recent AI interactions for a user
router.get("/history", isAuthenticated, async (req, res, next) => {
  try {
    const limitSchema = z.object({
      limit: z.string().optional().transform(val => val ? parseInt(val) : 10)
    });
    
    const { limit } = limitSchema.parse(req.query);
    const userId = req.session?.user?.id;
    
    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }
    
    const interactions = await storage.getUserAIInteractions(userId, limit as number);
    
    res.json(interactions);
  } catch (error) {
    next(error);
  }
});

export const aiRoutes = router;
