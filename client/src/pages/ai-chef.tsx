import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import AIChat from "@/components/ai/AIChat";
import ImageUpload from "@/components/ai/ImageUpload";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Camera } from "lucide-react";
import { Helmet } from "react-helmet";

export default function AiChefPage() {
  const [location] = useLocation();
  const [activeTab, setActiveTab] = useState("chat");
  
  // Check if the URL includes ?upload=true for direct access to upload tab
  useEffect(() => {
    const searchParams = new URLSearchParams(location.split("?")[1]);
    if (searchParams.get("upload") === "true") {
      setActiveTab("upload");
    }
  }, [location]);
  
  return (
    <>
      <Helmet>
        <title>Chef Rania - AI Cooking Assistant | The Daily Meal</title>
        <meta name="description" content="Get personalized recipe suggestions, cooking tips, and ingredient substitutions from Chef Rania, your AI cooking assistant. Upload photos of ingredients for custom recipe ideas." />
      </Helmet>
      
      <div className="bg-neutral-50 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8 text-center">
              <h1 className="font-heading text-3xl font-bold text-neutral-800 mb-3">
                Chef Rania
              </h1>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Your personal AI cooking assistant. Ask questions about recipes, 
                ingredients, or upload a photo of what's in your fridge for personalized suggestions.
              </p>
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <div className="flex justify-center mb-6">
                <TabsList>
                  <TabsTrigger value="chat" className="flex items-center">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Chat with Chef Rania
                  </TabsTrigger>
                  <TabsTrigger value="upload" className="flex items-center">
                    <Camera className="h-4 w-4 mr-2" />
                    Upload Ingredients
                  </TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="chat">
                <AIChat />
              </TabsContent>
              
              <TabsContent value="upload">
                <ImageUpload />
              </TabsContent>
            </Tabs>
            
            <div className="mt-8 text-center text-sm text-gray-500">
              <p>
                Chef Rania uses AI to provide cooking suggestions and tips. 
                Results may vary and should be reviewed for accuracy and safety.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
