# Running The Daily Meal Project

This guide provides step-by-step instructions to set up and run The Daily Meal project locally.

## Prerequisites

Before you begin, make sure you have the following installed:
- Node.js (v16 or higher)
- npm (comes with Node.js)
- PostgreSQL database

## Setup Steps

### 1. Clone the Repository

```bash
git clone https://github.com/mennaashraaf/The-Daily-Meal.git
cd The-Daily-Meal
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env` file in the root directory with the following variables:

```
# Database
DATABASE_URL="postgresql://username:password@host:port/database?sslmode=require"

# Authentication
SESSION_SECRET="your-session-secret"

# OpenAI API (for AI features)
OPENAI_API_KEY="your-openai-api-key"

# Environment
NODE_ENV="development"
```

Replace the placeholders with your actual values:
- `DATABASE_URL`: Your PostgreSQL connection string
- `SESSION_SECRET`: A random string used for securing sessions
- `OPENAI_API_KEY`: Your OpenAI API key (required for AI features)

### 4. Database Setup

Initialize and seed the database:

```bash
npm run setup-db
```

This command:
- Creates the necessary tables
- Adds initial data like categories and cuisines
- Seeds sample recipes

### 5. Running in Development Mode

Start the development server:

```bash
npm run dev
```

This will:
- Start the backend server
- Launch the frontend development server with hot reloading
- Open the application in your default web browser

The application will be available at [http://localhost:5173](http://localhost:5173)

### 6. User Accounts

The application comes with pre-seeded user accounts:

**Admin User:**
- Email: admin@example.com
- Password: admin123

**Regular User:**
- Email: user@example.com
- Password: user123

You can also register your own account through the application.

## Running in Production

For production deployment:

```bash
# Build the frontend
npm run build

# Start the production server
npm start
```

## Troubleshooting

### Database Connection Issues
- Verify your PostgreSQL service is running
- Check that your DATABASE_URL is correct
- Ensure network access to your database is not blocked

### AI Features Not Working
- Verify your OpenAI API key is valid
- Check your API usage limits
- Ensure you have proper internet connectivity

### Application Not Starting
- Check for errors in the console
- Verify all environment variables are set correctly
- Ensure ports 5173 (frontend) and 3000 (backend) are available 