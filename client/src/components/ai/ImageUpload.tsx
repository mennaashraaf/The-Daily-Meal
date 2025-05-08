import { useState, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { aiAPI } from "@/lib/api";
import { useAuth } from "@/providers/AuthProvider";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Camera, Upload, CheckCircle, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default function ImageUpload() {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [imageUrl, setImageUrl] = useState("");
  const [message, setMessage] = useState("");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [detectedIngredients, setDetectedIngredients] = useState<string[]>([]);
  const [response, setResponse] = useState("");
  
  // File input reference
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Handle input URL change
  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageUrl(e.target.value);
  };
  
  // Image analysis mutation
  const analyzeImageMutation = useMutation({
    mutationFn: (data: { image_url: string; message?: string }) => aiAPI.analyzeImage(data),
    onSuccess: (data) => {
      setDetectedIngredients(data.detected_ingredients);
      setResponse(data.content);
      toast({
        title: "Image analyzed",
        description: "Chef Rania has analyzed your ingredients",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to analyze image",
        variant: "destructive"
      });
    }
  });
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please login to use the image analysis feature",
        variant: "default"
      });
      return;
    }
    
    if (!imageUrl) {
      toast({
        title: "Image Required",
        description: "Please provide an image URL to analyze",
        variant: "destructive"
      });
      return;
    }
    
    analyzeImageMutation.mutate({
      image_url: imageUrl,
      message: message || undefined
    });
  };
  
  // Mock file upload (in a real app, this would upload to a server or cloud storage)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // For demo purposes, we're just creating a data URL
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setUploadedImage(dataUrl);
      
      // In a real app, you would upload this file to a server/cloud storage
      // and then set the resulting URL to imageUrl state
      // For now, we'll just use a placeholder URL
      setImageUrl("https://images.unsplash.com/photo-1512621776951-a57141f2eefd");
      
      toast({
        title: "Image uploaded",
        description: "Your image has been uploaded successfully",
      });
    };
    reader.readAsDataURL(file);
  };
  
  // Trigger file input click
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };
  
  return (
    <div className="bg-white rounded-xl border overflow-hidden">
      <div className="bg-primary p-4 text-white">
        <h2 className="font-heading font-bold text-xl">Upload Ingredients</h2>
        <p className="text-white/80 text-sm">
          Take a photo of your ingredients, and Chef Rania will suggest recipes
        </p>
      </div>
      
      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="image-url">Image URL</Label>
            <div className="flex mt-1.5">
              <Input
                id="image-url"
                type="url"
                placeholder="https://example.com/image.jpg"
                value={imageUrl}
                onChange={handleImageUrlChange}
                className="flex-grow mr-2"
                disabled={analyzeImageMutation.isPending}
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleUploadClick}
                disabled={analyzeImageMutation.isPending}
              >
                <Upload className="h-4 w-4 mr-2" />
                Browse
              </Button>
              
              {/* Hidden file input */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Enter image URL or upload from your device
            </p>
          </div>
          
          {uploadedImage && (
            <div className="mt-4">
              <Label>Uploaded Image Preview</Label>
              <div className="mt-1.5 relative border rounded-md overflow-hidden h-48">
                <img
                  src={uploadedImage}
                  alt="Uploaded ingredients"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 bg-green-500 text-white p-1 rounded-full">
                  <CheckCircle className="h-5 w-5" />
                </div>
              </div>
            </div>
          )}
          
          <div>
            <Label htmlFor="message">Additional Information (Optional)</Label>
            <Textarea
              id="message"
              placeholder="Tell Chef Rania what you're looking for or add dietary restrictions"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="mt-1.5"
              disabled={analyzeImageMutation.isPending}
            />
          </div>
          
          <Button
            type="submit"
            disabled={!imageUrl || analyzeImageMutation.isPending || !isAuthenticated}
            className="w-full"
          >
            {analyzeImageMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Analyzing...
              </>
            ) : (
              <>
                <Camera className="h-4 w-4 mr-2" />
                Analyze Ingredients
              </>
            )}
          </Button>
          
          {!isAuthenticated && (
            <div className="flex items-center text-amber-600 bg-amber-50 p-3 rounded-md text-sm">
              <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
              Please log in to use the image analysis feature
            </div>
          )}
        </form>
        
        {detectedIngredients.length > 0 && response && (
          <Card className="mt-8">
            <CardContent className="pt-6">
              <h3 className="font-heading font-bold text-lg mb-3">Analysis Results</h3>
              
              <div className="mb-4">
                <h4 className="font-medium text-sm text-gray-600 mb-2">Detected Ingredients:</h4>
                <div className="flex flex-wrap gap-2">
                  {detectedIngredients.map((ingredient, index) => (
                    <span
                      key={index}
                      className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs"
                    >
                      {ingredient}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-sm text-gray-600 mb-2">Chef Rania's Suggestions:</h4>
                <div className="bg-yellow-50 rounded-xl p-4">
                  {response.split("\n").map((line, i) => (
                    <p key={i} className={line.trim() === "" ? "h-4" : "mb-2 text-sm"}>
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
