import Hero from "@/components/home/Hero";
import RecipeOfTheDay from "@/components/home/RecipeOfTheDay";
import Categories from "@/components/home/Categories";
import FeaturedRecipes from "@/components/home/FeaturedRecipes";
import ChefRania from "@/components/home/ChefRania";
import AIChatDemo from "@/components/home/AIChatDemo";
import CTA from "@/components/home/CTA";
import { Helmet } from "react-helmet";

export default function HomePage() {
  return (
    <>
      <Helmet>
        <title>The Daily Meal - Discover, Cook, Share Recipes</title>
        <meta name="description" content="Find, create, and share delicious recipes with our AI-powered chef assistant. Get personalized recipe suggestions, cooking tips, and more." />
        <meta property="og:title" content="The Daily Meal - Discover, Cook, Share" />
        <meta property="og:description" content="Find, create, and share delicious recipes with our AI-powered chef assistant." />
        <meta property="og:type" content="website" />
      </Helmet>
      
      <div>
        <Hero />
        <RecipeOfTheDay />
        <Categories />
        <FeaturedRecipes />
        <ChefRania />
        <AIChatDemo />
        <CTA />
      </div>
    </>
  );
}
