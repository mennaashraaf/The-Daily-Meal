import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/providers/AuthProvider";

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

// Registration form schema
const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
  name: z.string().optional(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export default function RegisterPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isLoading, register } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Get redirect URL from query params
  const searchParams = new URLSearchParams(location.search);
  const redirectTo = searchParams.get("redirect") || "/";
  
  // Redirect if already authenticated
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate(redirectTo);
    }
  }, [isAuthenticated, isLoading, navigate, redirectTo]);
  
  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
    },
  });
  
  const onSubmit = async (data: z.infer<typeof registerSchema>) => {
    try {
      setIsSubmitting(true);
      await register(data);
      navigate("/");
    } catch (error) {
      console.error("Registration error:", error);
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
        <title>Sign Up | The Daily Meal</title>
        <meta name="description" content="Create your account on The Daily Meal to save favorite recipes, submit your own creations, and get personalized cooking recommendations from Chef Rania." />
      </Helmet>
      
      <div className="bg-neutral-50 min-h-screen flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="font-heading text-2xl text-center">Create an Account</CardTitle>
            <CardDescription className="text-center">
              Join The Daily Meal community to share and discover recipes
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="Choose a username" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Your email address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name (optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Your full name" {...field} />
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
                        <Input type="password" placeholder="Create a password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Confirm your password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    "Sign Up"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-center text-sm">
              Already have an account?{" "}
              <a
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/auth/login");
                }}
                className="text-primary hover:underline cursor-pointer"
              >
                Sign In
              </a>
            </div>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
