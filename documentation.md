# The Daily Meal - Project Documentation

## Project Overview

The Daily Meal is a full-stack web application for cooking enthusiasts and home chefs. It serves as a platform for discovering, sharing, and organizing recipes. The application features a modern, responsive UI and incorporates AI assistance for recipe suggestions and cooking tips.

## Business Goals

- Provide a user-friendly platform for recipe discovery and sharing
- Build a community of cooking enthusiasts
- Offer personalized cooking assistance through AI
- Enable users to organize their favorite recipes and meal plans

## Key Features

### User Features
- **Recipe Discovery**: Browse recipes by categories, cuisines, or trending recipes
- **Recipe Details**: View detailed instructions, ingredients, cooking time, difficulty level
- **User Accounts**: Register, login, and manage user profiles
- **Favorites**: Save favorite recipes for easy access
- **Recipe Submission**: Create and share personal recipes
- **Recipe Reviews**: Rate and review recipes
- **Search**: Find recipes by name, ingredients, or categories

### AI Features
- **Chef Rania**: AI-powered virtual chef assistant
- **Ingredient Analysis**: Upload images of ingredients for recipe suggestions
- **Cooking Tips**: Get personalized cooking advice
- **Recipe Recommendations**: Receive tailored recipe suggestions

## Technical Architecture

### Frontend

- **Framework**: React with TypeScript
- **UI Library**: Custom components using TailwindCSS and shadcn/ui
- **State Management**: React Query for server state and React Context for application state
- **Routing**: React Router v6
- **Build Tool**: Vite for fast development and optimized production builds
- **File Structure**:
  - `client/src/components/`: Reusable UI components
  - `client/src/pages/`: Page components for different routes
  - `client/src/hooks/`: Custom React hooks
  - `client/src/lib/`: Utility functions and API clients
  - `client/src/providers/`: Context providers

### Backend

- **Runtime**: Node.js
- **Framework**: Express.js
- **API Style**: RESTful API
- **Authentication**: JWT-based authentication
- **File Structure**:
  - `server/routes/`: API route handlers
  - `server/db.ts`: Database configuration
  - `server/storage.ts`: Data access layer
  - `server/vite.ts`: Development server integration

### Database

- **Database System**: PostgreSQL
- **ORM**: Drizzle ORM
- **Data Models**:
  - Users
  - Recipes
  - Categories
  - Kitchens (Cuisines)
  - Ratings/Reviews
  - Favorites
  - AI Interactions

### AI Integration

- **Provider**: OpenAI API
- **Features**:
  - Natural language processing for recipe assistance
  - Image analysis for ingredient recognition
  - Conversational interface with Chef Rania

## Development Environment

- **Version Control**: Git
- **Package Manager**: npm
- **Linting**: ESLint
- **Formatting**: Prettier
- **Development Server**: Vite dev server with hot module replacement

## Deployment

The application is designed to be deployed to any modern hosting platform supporting Node.js applications. The frontend and backend can be served from the same origin or deployed separately.

## Database Schema

### Users
- id (primary key)
- username
- email
- password_hash
- avatar_url
- role (user/admin)
- created_at

### Recipes
- id (primary key)
- title
- description
- user_id (foreign key to users)
- category_id (foreign key to categories)
- kitchen_id (foreign key to kitchens)
- prep_time
- cook_time
- difficulty
- servings
- ingredients (JSON)
- steps (JSON)
- image_url
- video_url
- created_at
- updated_at

### Categories
- id (primary key)
- name
- description
- image_url

### Kitchens (Cuisines)
- id (primary key)
- name
- description
- image_url

### Ratings
- id (primary key)
- recipe_id (foreign key to recipes)
- user_id (foreign key to users)
- rating (1-5)
- comment
- created_at

### Favorites
- user_id (foreign key to users)
- recipe_id (foreign key to recipes)
- created_at

## API Endpoints

### Authentication
- `POST /api/auth/register`: Register a new user
- `POST /api/auth/login`: Login existing user
- `GET /api/auth/me`: Get current user information

### Recipes
- `GET /api/recipes`: Get all recipes with filtering options
- `GET /api/recipes/:id`: Get a specific recipe
- `POST /api/recipes`: Create a new recipe
- `PUT /api/recipes/:id`: Update an existing recipe
- `DELETE /api/recipes/:id`: Delete a recipe
- `GET /api/recipes/new`: Get newest recipes
- `GET /api/recipes/popular`: Get popular recipes

### Categories
- `GET /api/categories`: Get all categories
- `POST /api/categories`: Create a new category (admin)
- `PUT /api/categories/:id`: Update a category (admin)
- `DELETE /api/categories/:id`: Delete a category (admin)

### Kitchens (Cuisines)
- `GET /api/categories/kitchens`: Get all kitchens/cuisines
- `POST /api/categories/kitchens`: Create a new kitchen (admin)
- `PUT /api/categories/kitchens/:id`: Update a kitchen (admin)
- `DELETE /api/categories/kitchens/:id`: Delete a kitchen (admin)

### User Data
- `GET /api/user/recipes`: Get recipes created by current user
- `GET /api/user/favorites`: Get favorite recipes of current user
- `POST /api/user/favorites/:recipeId`: Add a recipe to favorites
- `DELETE /api/user/favorites/:recipeId`: Remove a recipe from favorites

### AI Features
- `POST /api/ai/chat`: Chat with Chef Rania
- `POST /api/ai/analyze-image`: Analyze image for ingredients

## Security Considerations

- Passwords are hashed before storage
- Authentication is handled via JWT tokens
- API endpoints are protected based on user roles
- CORS is configured for API access
- Input validation is performed on all user inputs

## Future Enhancements

- Social sharing capabilities
- Meal planning calendar
- Grocery list generation
- Nutritional information for recipes
- Mobile application using React Native
- Advanced search with filtering options
- Recipe version history
- Community forums

## Troubleshooting

### Common Issues
- Database connection errors: Check environment variables for proper database URL
- Authentication failures: Verify token expiration and proper login flow
- Image upload issues: Ensure proper storage configuration 