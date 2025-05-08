import { Link } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Facebook, 
  Instagram, 
  Youtube, 
  Twitter, 
  SendHorizontal
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-neutral-800 text-white py-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-6">
              <span className="text-primary text-3xl mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-utensils"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg>
              </span>
              <span className="font-heading font-bold text-2xl">Daily Meal</span>
            </div>
            <p className="text-gray-400 mb-6">
              Discover, cook, and share delicious recipes with our AI-powered cooking assistant.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white text-xl" aria-label="Facebook">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-xl" aria-label="Instagram">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-xl" aria-label="YouTube">
                <Youtube size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-xl" aria-label="Twitter">
                <Twitter size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-heading font-bold text-lg mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link href="/" className="text-gray-400 hover:text-white">Home</Link></li>
              <li><Link href="/recipes" className="text-gray-400 hover:text-white">Recipes</Link></li>
              <li><Link href="/categories" className="text-gray-400 hover:text-white">Categories</Link></li>
              <li><Link href="/recipes/new" className="text-gray-400 hover:text-white">Submit Recipe</Link></li>
              <li><Link href="/ai-chef" className="text-gray-400 hover:text-white">Chef Rania</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-heading font-bold text-lg mb-6">Categories</h3>
            <ul className="space-y-3">
              <li><Link href="/recipes?category=1" className="text-gray-400 hover:text-white">Breakfast</Link></li>
              <li><Link href="/recipes?category=2" className="text-gray-400 hover:text-white">Lunch</Link></li>
              <li><Link href="/recipes?category=3" className="text-gray-400 hover:text-white">Dinner</Link></li>
              <li><Link href="/recipes?category=4" className="text-gray-400 hover:text-white">Desserts</Link></li>
              <li><Link href="/recipes?category=7" className="text-gray-400 hover:text-white">Vegetarian</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-heading font-bold text-lg mb-6">Newsletter</h3>
            <p className="text-gray-400 mb-4">Subscribe to get weekly recipe ideas and cooking tips.</p>
            <form className="flex">
              <div className="flex-grow">
                <Input
                  type="email"
                  placeholder="Your email"
                  className="bg-neutral-700 border-0 rounded-l-md w-full focus:ring-primary"
                />
              </div>
              <Button type="submit" className="bg-primary hover:bg-primary/90 text-white rounded-r-md">
                <SendHorizontal size={18} />
              </Button>
            </form>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} The Daily Meal. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link href="/privacy" className="text-gray-400 hover:text-white text-sm">Privacy Policy</Link>
            <Link href="/terms" className="text-gray-400 hover:text-white text-sm">Terms of Service</Link>
            <Link href="/cookies" className="text-gray-400 hover:text-white text-sm">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
