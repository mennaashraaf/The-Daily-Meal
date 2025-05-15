# The Daily Meal


## Features

- Browse and search for recipes by category and cuisine
- View detailed recipe information including ingredients and steps
- Create an account to save favorite recipes
- Submit your own recipes
- AI assistance for cooking through Chef Rania
- Responsive design for mobile and desktop

## Technology Stack

- **Frontend**: React, TypeScript, TailwindCSS
- **Backend**: Node.js, Express
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: JWT-based authentication

## Getting Started

### Prerequisites

- Node.js 16+
- PostgreSQL database

### Installation

1. Clone the repository
   ```
   git clone https://github.com/mennaashraaf/The-Daily-Meal.git
   cd The-Daily-Meal
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Create a `.env` file with your environment variables (see setup-env.sh for required variables)

4. Set up the database
   ```
   npm run setup-db
   ```

5. Run the development server
   ```
   npm run dev
   ```

6. Visit `http://localhost:5173` in your browser

## Project Structure

- `client/` - Frontend React application
- `server/` - Backend Express API
- `shared/` - Shared types and utilities 
