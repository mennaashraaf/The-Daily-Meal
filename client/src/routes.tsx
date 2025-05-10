import { Routes, Route } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import NotFound from "@/pages/not-found";

// Pages
import HomePage from "@/pages/index";
import RecipesPage from "@/pages/recipes/index";
import RecipeDetailPage from "@/pages/recipes/[id]";
import NewRecipePage from "@/pages/recipes/new";
import ProfilePage from "@/pages/profile/index";
import ProfileSettingsPage from "@/pages/profile/settings";
import CategoriesPage from "@/pages/categories/index";
import AiChefPage from "@/pages/ai-chef";
import LoginPage from "@/pages/auth/login";
import RegisterPage from "@/pages/auth/register";
import AdminPage from "@/pages/admin/index";
import AdminRecipesPage from "@/pages/admin/recipes";

export default function AppRoutes() {
  return (
    <TooltipProvider>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow pt-16">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/recipes" element={<RecipesPage />} />
            <Route path="/recipes/:id" element={<RecipeDetailPage />} />
            <Route path="/recipes/new" element={<NewRecipePage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/profile/favorites" element={<ProfilePage />} />
            <Route path="/profile/recipes" element={<ProfilePage />} />
            <Route path="/profile/settings" element={<ProfileSettingsPage />} />
            <Route path="/ai-chef" element={<AiChefPage />} />
            <Route path="/auth/login" element={<LoginPage />} />
            <Route path="/auth/register" element={<RegisterPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/admin/recipes" element={<AdminRecipesPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </TooltipProvider>
  );
} 