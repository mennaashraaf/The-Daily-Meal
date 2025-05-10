import express from "express";
import { z } from "zod";
import fetch from "node-fetch";
import { storage } from "../storage";
import { isAuthenticated } from "./auth";
import { db } from "../db";
import { aiInteractions } from "@shared/schema";
import session from "express-session";

const router = express.Router();

// Mock AI responses database
const mockRecipeResponses = [
  {
    prompt: "cookies",
    response: "I'd love to help you make delicious cookies! Here's a simple chocolate chip cookie recipe:\n\nIngredients:\n- 1 cup (2 sticks) unsalted butter, softened\n- 3/4 cup granulated sugar\n- 3/4 cup packed brown sugar\n- 2 large eggs\n- 2 teaspoons vanilla extract\n- 2 1/4 cups all-purpose flour\n- 1 teaspoon baking soda\n- 1/2 teaspoon salt\n- 2 cups chocolate chips\n\nInstructions:\n1. Preheat oven to 375°F (190°C)\n2. Cream butter and sugars until light and fluffy\n3. Beat in eggs and vanilla\n4. Mix dry ingredients separately, then gradually add to wet mixture\n5. Fold in chocolate chips\n6. Drop by rounded tablespoons onto ungreased baking sheets\n7. Bake for 9-11 minutes until golden brown\n8. Cool on wire racks\n\nEnjoy your homemade cookies!\n\nChef Rania"
  },
  {
    prompt: "pasta",
    response: "Pasta is a wonderful choice! Here's a quick and tasty pasta recipe:\n\nClassic Spaghetti Aglio e Olio\n\nIngredients:\n- 1 pound spaghetti\n- 6 cloves garlic, thinly sliced\n- 1/2 cup extra virgin olive oil\n- 1/2 teaspoon red pepper flakes\n- 1/4 cup fresh parsley, chopped\n- Salt to taste\n- Grated Parmesan cheese (optional)\n\nInstructions:\n1. Cook spaghetti in salted water according to package directions until al dente\n2. While pasta cooks, heat olive oil in a skillet over medium heat\n3. Add sliced garlic and cook until lightly golden (about 2 minutes)\n4. Add red pepper flakes and cook for 30 seconds more\n5. Drain pasta, reserving 1/4 cup cooking water\n6. Add pasta to the skillet with garlic oil\n7. Toss well, adding reserved pasta water if needed\n8. Sprinkle with parsley and serve with Parmesan if desired\n\nEnjoy this simple but delicious pasta dish!\n\nChef Rania"
  },
  {
    prompt: "chicken",
    response: "Chicken is so versatile! Here's an easy and flavorful roast chicken recipe:\n\nHerb Roasted Chicken\n\nIngredients:\n- 1 whole chicken (about 4-5 pounds)\n- 2 tablespoons olive oil\n- 2 teaspoons salt\n- 1 teaspoon black pepper\n- 1 teaspoon dried thyme\n- 1 teaspoon dried rosemary\n- 1 teaspoon paprika\n- 1 lemon, quartered\n- 1 head garlic, cut in half crosswise\n- Fresh herbs (optional): rosemary, thyme sprigs\n\nInstructions:\n1. Preheat oven to 425°F (220°C)\n2. Pat chicken dry with paper towels\n3. Mix olive oil with salt, pepper, and dried herbs\n4. Rub mixture all over chicken, including under skin\n5. Stuff cavity with lemon quarters, garlic, and fresh herbs if using\n6. Tie legs together with kitchen string and tuck wing tips under body\n7. Place in roasting pan and roast for 1 hour 15 minutes, or until internal temperature reaches 165°F\n8. Let rest for 15 minutes before carving\n\nServe with roasted vegetables for a complete meal!\n\nChef Rania"
  },
  {
    prompt: "dessert",
    response: "I'd be happy to share a simple yet impressive dessert recipe with you!\n\nEasy No-Bake Chocolate Mousse\n\nIngredients:\n- 8 oz (about 1 1/2 cups) semi-sweet chocolate chips\n- 2 cups heavy whipping cream, divided\n- 1/4 cup sugar\n- 1 teaspoon vanilla extract\n- Pinch of salt\n- Fresh berries and mint for garnish (optional)\n\nInstructions:\n1. Place chocolate chips in a medium bowl\n2. Heat 1/2 cup cream until just simmering, then pour over chocolate\n3. Let sit for 1 minute, then stir until smooth; let cool to room temperature\n4. In a separate bowl, whip remaining 1 1/2 cups cream with sugar, vanilla, and salt until soft peaks form\n5. Gently fold whipped cream into chocolate mixture until no streaks remain\n6. Spoon into serving glasses and refrigerate for at least 2 hours\n7. Garnish with fresh berries and mint before serving\n\nEnjoy this decadent dessert!\n\nChef Rania"
  },
  {
    prompt: "vegan",
    response: "Here's a delicious vegan recipe that everyone will love!\n\nRoasted Vegetable Buddha Bowl\n\nIngredients:\n- 1 cup quinoa, rinsed\n- 2 cups vegetable broth\n- 1 sweet potato, diced\n- 1 red bell pepper, sliced\n- 1 zucchini, sliced\n- 1 red onion, cut into wedges\n- 2 tablespoons olive oil\n- 1 teaspoon cumin\n- 1 teaspoon paprika\n- 1/2 teaspoon garlic powder\n- Salt and pepper to taste\n- 1 can (15 oz) chickpeas, drained and rinsed\n- 1 avocado, sliced\n- 2 cups fresh spinach\n\nFor the tahini dressing:\n- 1/4 cup tahini\n- 2 tablespoons lemon juice\n- 1 tablespoon maple syrup\n- Water to thin as needed\n\nInstructions:\n1. Cook quinoa in vegetable broth according to package directions\n2. Preheat oven to 425°F (220°C)\n3. Toss sweet potato, bell pepper, zucchini, and onion with olive oil, spices, salt, and pepper\n4. Roast vegetables for 20-25 minutes until tender\n5. Mix tahini, lemon juice, maple syrup, and enough water to reach desired consistency\n6. Assemble bowls: quinoa, roasted vegetables, chickpeas, avocado, and spinach\n7. Drizzle with tahini dressing and serve\n\nEnjoy this nutritious vegan meal!\n\nChef Rania"
  },
  {
    prompt: "breakfast",
    response: "Good morning! Here's a delicious breakfast recipe to start your day:\n\nFluffy Blueberry Pancakes\n\nIngredients:\n- 1 1/2 cups all-purpose flour\n- 2 tablespoons sugar\n- 1 tablespoon baking powder\n- 1/2 teaspoon salt\n- 1 1/4 cups milk\n- 1 large egg\n- 3 tablespoons melted butter, plus more for cooking\n- 1 teaspoon vanilla extract\n- 1 cup fresh blueberries\n- Maple syrup for serving\n\nInstructions:\n1. In a large bowl, whisk together flour, sugar, baking powder, and salt\n2. In another bowl, whisk milk, egg, melted butter, and vanilla\n3. Pour wet ingredients into dry ingredients and stir just until combined (small lumps are fine)\n4. Gently fold in blueberries\n5. Heat a non-stick pan or griddle over medium heat and add a small amount of butter\n6. Pour 1/4 cup batter for each pancake\n7. Cook until bubbles form on top (about 2-3 minutes), then flip and cook another 1-2 minutes\n8. Serve warm with maple syrup\n\nEnjoy your breakfast!\n\nChef Rania"
  }
];

// Function to find a matching response or provide a default
function getMockResponse(userQuery: string): string {
  const normalizedQuery = userQuery.toLowerCase();
  
  // Try to find a specific recipe match
  for (const entry of mockRecipeResponses) {
    if (normalizedQuery.includes(entry.prompt)) {
      return entry.response;
    }
  }
  
  // Default general response
  return "I'd be happy to help with your cooking questions! What kind of recipe are you looking for today? I can suggest recipes for breakfast, lunch, dinner, desserts, or specific ingredients like chicken, pasta, or cookies. Just let me know what you're in the mood for!\n\nChef Rania";
}

// Function to analyze an image and provide recipe suggestions
function getMockImageResponse(ingredientList = "", message = "") {
  // Default detected ingredients if none provided
  const detectedIngredients = ingredientList ? 
    ingredientList.split(",").map(i => i.trim()) : 
    ["tomatoes", "onions", "peppers", "garlic"];
  
  const ingredients = detectedIngredients.join(", ");
  
  return {
    detected_ingredients: detectedIngredients,
    content: `I see you have ${ingredients}! Here are some recipe ideas:\n\n1. **Quick Tomato Sauce**: Sauté chopped onions and garlic in olive oil until translucent. Add diced tomatoes and cook until they break down. Season with salt, pepper, and herbs of your choice.\n\n2. **Stuffed Peppers**: Cut the tops off peppers and remove seeds. Fill with a mixture of cooked rice, sautéed onions, garlic, and tomatoes. Bake until peppers are tender.\n\n3. **Fresh Salsa**: Dice tomatoes, onions, and peppers. Mix with minced garlic, lime juice, salt, and cilantro if available.\n\nWhich recipe would you like to try?\n\nChef Rania`,
    citations: []
  };
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
    
    // Get mock response
    const responseContent = getMockResponse(message);
    const aiResponse = {
      content: responseContent,
      citations: []
    };
    
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
    
    // Get mock image analysis response
    const aiResponse = getMockImageResponse("", message);
    
    // Save the interaction to the database if user is logged in
    if (userId) {
      await storage.createAIInteraction({
        user_id: userId,
        type: "image",
        query: `Image analysis: ${aiResponse.detected_ingredients.join(", ")}. ${message || ""}`,
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
