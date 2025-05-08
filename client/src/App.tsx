import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
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
import CategoriesPage from "@/pages/categories/index";
import AiChefPage from "@/pages/ai-chef";
import LoginPage from "@/pages/auth/login";
import RegisterPage from "@/pages/auth/register";
import AdminPage from "@/pages/admin/index";
import AdminRecipesPage from "@/pages/admin/recipes";

function App() {
  return (
    <TooltipProvider>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow pt-16">
          <Switch>
            <Route path="/" component={HomePage} />
            <Route path="/recipes" component={RecipesPage} />
            <Route path="/recipes/:id" component={RecipeDetailPage} />
            <Route path="/recipes/new" component={NewRecipePage} />
            <Route path="/categories" component={CategoriesPage} />
            <Route path="/profile" component={ProfilePage} />
            <Route path="/ai-chef" component={AiChefPage} />
            <Route path="/auth/login" component={LoginPage} />
            <Route path="/auth/register" component={RegisterPage} />
            <Route path="/admin" component={AdminPage} />
            <Route path="/admin/recipes" component={AdminRecipesPage} />
            <Route component={NotFound} />
          </Switch>
        </main>
        <Footer />
      </div>
      <Toaster />
    </TooltipProvider>
  );
}

export default App;
