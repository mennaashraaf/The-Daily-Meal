import { useState } from "react";
import { Link, useLocation } from "wouter";
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger 
} from "@/components/ui/sheet";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Search, 
  Heart, 
  User, 
  Menu,
  LogOut,
  Settings,
  FileText,
  Star
} from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";

export default function Header() {
  const [location, navigate] = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileSearchVisible, setMobileSearchVisible] = useState(false);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/recipes?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };
  
  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-3">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-primary text-3xl mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-utensils"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg>
              </span>
              <span className="font-heading font-bold text-2xl text-neutral-800">Daily Meal</span>
            </Link>
          </div>
          
          {/* Desktop Search Bar */}
          <div className="hidden md:block w-1/3">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search recipes, ingredients..."
                  className="w-full pl-10 pr-4 py-2 rounded-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <span className="absolute left-3 top-2.5 text-gray-400">
                  <Search size={18} />
                </span>
              </div>
            </form>
          </div>
          
          {/* Navigation */}
          <nav className="flex items-center">
            <div className="hidden md:flex items-center space-x-6">
              <Link href="/recipes" className="text-neutral-800 hover:text-primary font-medium">
                Recipes
              </Link>
              <Link href="/categories" className="text-neutral-800 hover:text-primary font-medium">
                Categories
              </Link>
              {isAuthenticated && (
                <Link href="/recipes/new" className="text-neutral-800 hover:text-primary font-medium">
                  Submit Recipe
                </Link>
              )}
              <Link href="/ai-chef" className="text-neutral-800 hover:text-primary font-medium">
                Chef Rania
              </Link>
            </div>
            
            <div className="flex items-center ml-6 space-x-3">
              {/* Mobile Search Button */}
              <button 
                className="md:hidden text-neutral-800 text-xl"
                onClick={() => setMobileSearchVisible(!mobileSearchVisible)}
              >
                <Search size={24} />
              </button>
              
              {/* Favorites Link */}
              {isAuthenticated && (
                <Link href="/profile/favorites" className="text-neutral-800 hover:text-primary text-xl">
                  <Heart size={24} />
                </Link>
              )}
              
              {/* User Menu */}
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user?.avatar_url} alt={user?.username} />
                        <AvatarFallback>{user?.username?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href="/profile">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/profile/recipes">
                        <FileText className="mr-2 h-4 w-4" />
                        <span>My Recipes</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/profile/favorites">
                        <Heart className="mr-2 h-4 w-4" />
                        <span>Favorites</span>
                      </Link>
                    </DropdownMenuItem>
                    {user?.role === 'admin' && (
                      <DropdownMenuItem asChild>
                        <Link href="/admin">
                          <Star className="mr-2 h-4 w-4" />
                          <span>Admin</span>
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem asChild>
                      <Link href="/profile/settings">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => logout()}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sign Out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm">Sign In</Button>
                </Link>
              )}
              
              {/* Mobile Menu */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu size={24} />
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <div className="flex flex-col space-y-4 mt-8">
                    <Link href="/recipes" className="text-lg font-medium py-2">Recipes</Link>
                    <Link href="/categories" className="text-lg font-medium py-2">Categories</Link>
                    {isAuthenticated && (
                      <Link href="/recipes/new" className="text-lg font-medium py-2">Submit Recipe</Link>
                    )}
                    <Link href="/ai-chef" className="text-lg font-medium py-2">Chef Rania</Link>
                    {!isAuthenticated && (
                      <>
                        <Link href="/auth/login" className="text-lg font-medium py-2">Sign In</Link>
                        <Link href="/auth/register" className="text-lg font-medium py-2">Sign Up</Link>
                      </>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </nav>
        </div>
        
        {/* Mobile Search - Hidden by Default */}
        {mobileSearchVisible && (
          <div className="md:hidden pb-3">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search recipes, ingredients..."
                  className="w-full pl-10 pr-4 py-2 rounded-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <span className="absolute left-3 top-2.5 text-gray-400">
                  <Search size={18} />
                </span>
              </div>
            </form>
          </div>
        )}
      </div>
    </header>
  );
}
