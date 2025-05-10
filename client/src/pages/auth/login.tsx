import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/providers/AuthProvider";
import { toast } from "@/components/ui/use-toast";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { Helmet } from "react-helmet";

// Login form schema
const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isLoading, login } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Get redirect URL from query params
  const searchParams = new URLSearchParams(location.search);
  const redirectTo = searchParams.get("redirect") || "/";
  
  // Redirect if already authenticated
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate(redirectTo);
    }
  }, [isAuthenticated, isLoading, navigate, redirectTo]);
  
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  
  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    try {
      setIsSubmitting(true);
      setError(null);
      await login(data);
      toast({
        title: "Success",
        description: "You have been signed in successfully.",
      });
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      setError(error instanceof Error ? error.message : "Failed to sign in");
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to sign in",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    );
  }
  
  if (isAuthenticated) {
    return null; // Will redirect
  }
  
  return (
    <>
      <Helmet>
        <title>Sign In | The Daily Meal</title>
        <meta name="description" content="Sign in to your Daily Meal account to access your saved recipes, submit your own creations, and interact with Chef Rania." />
      </Helmet>
      
      <div className="bg-neutral-50 min-h-screen flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="font-heading text-2xl text-center">Sign In</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
                {error}
              </div>
            )}
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="Your username" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Your password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>
            </Form>
            
            {/* Demo credentials */}
            <div className="mt-6 p-4 bg-blue-50 rounded-md text-sm">
              <p className="font-medium text-blue-800 mb-1">Demo Credentials:</p>
              <p className="text-blue-700">Username: <span className="font-mono">admin</span></p>
              <p className="text-blue-700">Password: <span className="font-mono">password123</span></p>
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-center text-sm">
              Don't have an account?{" "}
              <a
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/auth/register");
                }}
                className="text-primary hover:underline cursor-pointer"
              >
                Sign Up
              </a>
            </div>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
