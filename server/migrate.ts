import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { migrate } from 'drizzle-orm/neon-http/migrator';
import * as schema from "@shared/schema";
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

async function runMigration() {
  console.log("Starting database migration...");
  
  try {
    const sql = neon(databaseUrl);
    const db = drizzle(sql, { schema });
    
    // Create tables based on the schema
    console.log("Creating tables if they don't exist...");
    
    // Users table
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        avatar_url TEXT,
        name TEXT,
        bio TEXT,
        role TEXT NOT NULL DEFAULT 'user',
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `;
    
    // Categories table
    await sql`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL UNIQUE,
        description TEXT,
        image_url TEXT,
        recipe_count INTEGER DEFAULT 0
      )
    `;
    
    // Kitchens table
    await sql`
      CREATE TABLE IF NOT EXISTS kitchens (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL UNIQUE,
        description TEXT,
        image_url TEXT
      )
    `;
    
    // Recipes table
    await sql`
      CREATE TABLE IF NOT EXISTS recipes (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        ingredients JSONB NOT NULL,
        steps JSONB NOT NULL,
        image_url TEXT,
        youtube_url TEXT,
        prep_time INTEGER NOT NULL,
        cook_time INTEGER NOT NULL,
        servings INTEGER NOT NULL,
        calories INTEGER,
        difficulty TEXT NOT NULL,
        category_id INTEGER NOT NULL,
        kitchen_id INTEGER NOT NULL,
        author_id INTEGER NOT NULL,
        favorites_count INTEGER DEFAULT 0,
        status TEXT NOT NULL DEFAULT 'pending',
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `;
    
    // Ratings table
    await sql`
      CREATE TABLE IF NOT EXISTS ratings (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        recipe_id INTEGER NOT NULL,
        rating INTEGER NOT NULL,
        comment TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `;
    
    // Favorites table
    await sql`
      CREATE TABLE IF NOT EXISTS favorites (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        recipe_id INTEGER NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `;
    
    // AI Interactions table
    await sql`
      CREATE TABLE IF NOT EXISTS ai_interactions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        type TEXT NOT NULL,
        query TEXT NOT NULL,
        response JSONB,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `;
    
    console.log("Database migration completed successfully!");
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

runMigration(); 