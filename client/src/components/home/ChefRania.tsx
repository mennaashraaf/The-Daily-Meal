import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";

export default function ChefRania() {
  return (
    <section className="py-12 bg-gradient-to-r from-primary/10 to-secondary/10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-8">
          <div className="lg:w-1/2">
            <div className="mb-6">
              <span className="font-accent text-2xl text-primary">Meet Your AI Assistant</span>
              <h2 className="font-heading text-3xl font-bold text-neutral-800 mt-2">Chef Rania</h2>
            </div>
            <p className="text-gray-700 mb-6">
              Chef Rania is your personal AI cooking assistant, ready to help with recipe suggestions, 
              ingredient substitutions, and cooking techniques. Whether you're a beginner or an 
              experienced cook, Chef Rania has the answers you need.
            </p>
            
            <div className="bg-yellow-50 relative rounded-xl p-6 mb-6" style={{
              position: "relative",
              '&:after': {
                content: '""',
                position: "absolute",
                bottom: 0,
                left: "25px",
                width: 0,
                height: 0,
                border: "15px solid transparent",
                borderTopColor: "#FEF9C3",
                borderBottom: 0,
                marginBottom: "-15px"
              }
            }}>
              <div className="after:content-[''] after:absolute after:bottom-0 after:left-[25px] after:w-0 after:h-0 after:border-[15px] after:border-transparent after:border-t-yellow-50 after:border-b-0 after:mb-[-15px]">
                <p className="font-accent text-lg">
                  Hi there! I'm Chef Rania. What would you like to cook today? You can ask me anything 
                  about recipes or upload a photo of ingredients you have!
                </p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <Link href="/ai-chef">
                <Button className="bg-primary hover:bg-primary/90 text-white font-bold py-3 px-6 rounded-full text-center transition">
                  Chat with Chef Rania
                </Button>
              </Link>
              <Link href="/ai-chef?upload=true">
                <Button variant="outline" className="flex items-center justify-center border border-gray-300 hover:bg-gray-50 text-neutral-800 font-bold py-3 px-6 rounded-full text-center transition">
                  <Camera className="mr-2 h-5 w-5" />
                  Upload Ingredients
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="lg:w-1/2">
            <img 
              src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c" 
              alt="Chef Rania" 
              className="w-full max-w-md mx-auto rounded-full shadow-xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
