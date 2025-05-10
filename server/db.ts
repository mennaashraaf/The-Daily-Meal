import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
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

console.log("Connecting to database...");
const sql = neon(databaseUrl);
export const db = drizzle(sql, { schema });