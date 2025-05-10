import 'dotenv/config';
import express from "express";
import session from "express-session";
import cors from "cors";
import { registerRoutes } from "./routes";
import { authRoutes } from "./routes/auth";
import { recipeRoutes } from "./routes/recipes";
import { categoryRoutes } from "./routes/categories";
import { aiRoutes } from "./routes/ai";
import { storage } from "./storage";
import fs from 'fs';
import path from 'path';

// Read .env file manually if needed
try {
  const envPath = path.resolve(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    
    // Parse .env file and set environment variables
    envContent.split('\n').forEach(line => {
      const [key, value] = line.split('=');
      if (key && value) {
        process.env[key.trim()] = value.trim().replace(/^["'](.*)["']$/, '$1');
      }
    });
    
    console.log('Loaded environment variables from .env file');
  }
} catch (error) {
  console.error('Error loading .env file:', error);
}

// Debug logging for environment variables
console.log('Environment Variables:');
console.log('OPENAI_API_KEY:', process.env.OPENAI_API_KEY ? 'Present' : 'Missing');
console.log('SESSION_SECRET:', process.env.SESSION_SECRET ? 'Present' : 'Missing');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Present (Truncated for security)' : 'Missing');

const app = express();

// Enable CORS for all origins in development
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? 'https://your-production-domain.com' : true,
  credentials: true
}));

// Parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'cookcrafter-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Use the routes.ts module to register all routes
registerRoutes(app).then(server => {
  const port = process.env.PORT || 4000;
  server.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
});
