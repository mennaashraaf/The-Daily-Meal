import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from "@shared/schema";
import { users, categories, kitchens, recipes } from "@shared/schema";
import fs from 'fs';
import path from 'path';

// Read DATABASE_URL from .env file if needed
let databaseUrl: string = process.env.DATABASE_URL || '';

if (!databaseUrl) {
  try {
    const envPath = path.resolve(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf8');
      
      // Find DATABASE_URL in .env file
      const dbUrlMatch = envContent.match(/DATABASE_URL=(.+)/);
      if (dbUrlMatch && dbUrlMatch[1]) {
        databaseUrl = dbUrlMatch[1].trim().replace(/^["'](.*)["']$/, '$1');
        console.log("Found DATABASE_URL in .env file");
      }
    }
  } catch (error) {
    console.error('Error reading DATABASE_URL from .env file:', error);
  }
}

// Fallback to hardcoded value if still not found
if (!databaseUrl) {
  databaseUrl = "postgresql://neondb_owner:npg_aS9emnA8uHRE@ep-wispy-pine-a431h3ch-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require";
  console.log("Using hardcoded DATABASE_URL");
}

async function seedDatabase() {
  console.log("Starting database seeding...");
  
  try {
    const sql = neon(databaseUrl);
    const db = drizzle(sql, { schema });
    
    // Check if database is already seeded
    const existingUsers = await db.select().from(users).limit(1);
    if (existingUsers.length > 0) {
      console.log("Database already has data, skipping seed.");
      return;
    }
    
    console.log("Seeding database with initial data...");
    
    // Create admin user
    const adminUser = await db.insert(users).values({
      username: "admin",
      password: "password123", // In production, use hashed passwords
      email: "admin@cookcrafter.com",
      name: "Admin User",
      role: "admin",
      avatar_url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80"
    }).returning();
    
    // Create Chef Rania user
    const chefUser = await db.insert(users).values({
      username: "chefrania",
      password: "chef123", // In production, use hashed passwords
      email: "chef@cookcrafter.com",
      name: "Chef Rania",
      role: "admin",
      avatar_url: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c"
    }).returning();
    
    // Seed categories
    const categoryData = [
      { name: "Breakfast", description: "Start your day right", image_url: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666" },
      { name: "Lunch", description: "Midday meals", image_url: "https://images.unsplash.com/photo-1547496502-affa22d38842" },
      { name: "Dinner", description: "Evening feasts", image_url: "https://images.unsplash.com/photo-1576866209830-589e1bfbaa4d" },
      { name: "Desserts", description: "Sweet treats", image_url: "https://images.unsplash.com/photo-1488477304112-4944851de03d" },
      { name: "Salads", description: "Fresh and healthy", image_url: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd" },
      { name: "Pasta", description: "Italian comfort", image_url: "https://images.unsplash.com/photo-1567608285969-48e4bbe0d399" },
      { name: "Vegetarian", description: "Meat-free options", image_url: "https://images.unsplash.com/photo-1540420773420-3366772f4999" },
      { name: "Soups", description: "Warm and comforting", image_url: "https://images.unsplash.com/photo-1547592166-23ac45744acd" }
    ];
    
    for (const category of categoryData) {
      await db.insert(categories).values(category);
    }
    
    // Seed kitchens/cuisines
    const kitchenData = [
      { name: "Italian", description: "Mediterranean classics", image_url: "https://images.unsplash.com/photo-1498579150354-977475b7ea0b" },
      { name: "Thai", description: "Aromatic and spicy", image_url: "https://images.unsplash.com/photo-1559314809-0d155014e29e" },
      { name: "Mexican", description: "Bold and vibrant", image_url: "https://images.unsplash.com/photo-1464219551459-ac14ae01fbe0" },
      { name: "Indian", description: "Rich and flavorful", image_url: "https://images.unsplash.com/photo-1505253758473-96b7015fcd40" },
      { name: "American", description: "Comfort classics", image_url: "https://images.unsplash.com/photo-1550317138-10000687a72b" },
      { name: "Chinese", description: "Ancient culinary traditions", image_url: "https://images.unsplash.com/photo-1563245372-f21724e3856d" },
      { name: "Japanese", description: "Precise and artistic", image_url: "https://images.unsplash.com/photo-1553621042-f6e147245754" },
      { name: "Mediterranean", description: "Coastal flavors", image_url: "https://images.unsplash.com/photo-1544025162-d76694265947" }
    ];
    
    for (const kitchen of kitchenData) {
      await db.insert(kitchens).values(kitchen);
    }
    
    // Seed sample recipes
    const recipeData = [
      {
        title: "Lemon Herb Roasted Chicken",
        description: "A perfect weeknight dinner that's both impressive and easy to make. This aromatic roasted chicken is infused with lemon, garlic, and fresh herbs.",
        ingredients: JSON.stringify([
          "1 whole chicken (about 4-5 pounds)",
          "2 lemons, 1 sliced and 1 juiced",
          "4 cloves garlic, minced",
          "2 tablespoons olive oil",
          "1 tablespoon fresh rosemary, chopped",
          "1 tablespoon fresh thyme, chopped",
          "1 teaspoon salt",
          "1/2 teaspoon black pepper"
        ]),
        steps: JSON.stringify([
          "Preheat oven to 425°F (220°C).",
          "Remove giblets from chicken cavity and pat dry with paper towels.",
          "In a small bowl, mix olive oil, lemon juice, garlic, herbs, salt, and pepper.",
          "Rub mixture all over the chicken and under the skin.",
          "Place lemon slices inside the cavity and tie legs together with kitchen twine.",
          "Roast for 1 hour and 15 minutes or until juices run clear.",
          "Let rest for 10 minutes before carving."
        ]),
        image_url: "https://images.unsplash.com/photo-1518492104633-130d0cc84637",
        prep_time: 15,
        cook_time: 75,
        servings: 4,
        calories: 480,
        difficulty: "Intermediate",
        category_id: 3, // Dinner
        kitchen_id: 1, // Italian
        author_id: 2, // Chef Rania
        status: "approved"
      },
      {
        title: "Classic Margherita Pizza",
        description: "A simple yet delicious traditional pizza with fresh mozzarella, tomatoes, and basil on a perfect crust.",
        ingredients: JSON.stringify([
          "1 pizza dough",
          "3 tablespoons olive oil",
          "2 cloves garlic, minced",
          "8 oz fresh mozzarella, sliced",
          "2 large tomatoes, sliced",
          "Fresh basil leaves",
          "Salt and pepper to taste"
        ]),
        steps: JSON.stringify([
          "Preheat oven to 475°F (245°C) with a pizza stone if available.",
          "Roll out dough on floured surface to desired thickness.",
          "Mix olive oil with minced garlic and brush over dough.",
          "Arrange mozzarella and tomato slices evenly.",
          "Bake for 10-12 minutes until crust is golden.",
          "Top with fresh basil leaves, salt, and pepper before serving."
        ]),
        image_url: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3",
        prep_time: 20,
        cook_time: 12,
        servings: 4,
        calories: 350,
        difficulty: "Easy",
        category_id: 3, // Dinner
        kitchen_id: 1, // Italian
        author_id: 1, // Admin
        status: "approved"
      }
    ];
    
    for (const recipe of recipeData) {
      await db.insert(recipes).values(recipe);
    }
    
    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
}

seedDatabase();