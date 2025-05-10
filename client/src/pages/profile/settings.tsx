import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, ArrowLeft } from "lucide-react";
import { Helmet } from "react-helmet";
import { Textarea } from "@/components/ui/textarea";

// Settings form schema
const settingsSchema = z.object({
  name: z.string().optional(),
  email: z.string().email("Please enter a valid email"),
  avatar_url: z.string().optional(),
  bio: z.string().optional(),
  current_password: z.string().optional(),
  new_password: z.string().optional(),
  confirm_password: z.string().optional(),
}).refine(data => {
  // If any password field is filled, all must be filled
  const hasCurrentPassword = !!data.current_password;
  const hasNewPassword = !!data.new_password;
  const hasConfirmPassword = !!data.confirm_password;
  
  if (hasCurrentPassword || hasNewPassword || hasConfirmPassword) {
    return hasCurrentPassword && hasNewPassword && hasConfirmPassword;
  }
  
  return true;
}, {
  message: "All password fields are required to change password",
  path: ["new_password"],
}).refine(data => {
  // If changing password, new and confirm must match
  if (data.new_password && data.confirm_password) {
    return data.new_password === data.confirm_password;
  }
  return true;
}, {
  message: "Passwords do not match",
  path: ["confirm_password"],
});

export default function ProfileSettingsPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/auth/login?redirect=/profile/settings");
    }
  }, [isAuthenticated, isLoading, navigate]);
  
  const form = useForm<z.infer<typeof settingsSchema>>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      avatar_url: user?.avatar_url || "",
      bio: "",
      current_password: "",
      new_password: "",
      confirm_password: "",
    },
  });
  
  // Update form values when user data is loaded
  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name || "",
        email: user.email || "",
        avatar_url: user.avatar_url || "",
        bio: "",
        current_password: "",
        new_password: "",
        confirm_password: "",
      });
    }
  }, [user, form]);
  
  const onSubmit = async (data: z.infer<typeof settingsSchema>) => {
    try {
      setIsSubmitting(true);
      
      // Mock update for now - in a real app, you would call an API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Success",
        description: "Your profile has been updated.",
      });
    } catch (error) {
      console.error("Settings update error:", error);
      toast({
        title: "Error",
        description: "Failed to update profile settings.",
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
            <p className="text-gray-600">Loading profile settings...</p>
          </div>
        </div>
      </div>
    );
  }
  
  if (!isAuthenticated || !user) {
    return null; // Will redirect to login
  }
  
  return (
    <>
      <Helmet>
        <title>Profile Settings | The Daily Meal</title>
        <meta name="description" content="Update your profile settings on The Daily Meal." />
      </Helmet>
      
      <div className="bg-neutral-50 min-h-screen py-8">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <Button
              variant="ghost"
              className="flex items-center text-gray-600"
              onClick={() => navigate("/profile")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Profile
            </Button>
          </div>
          
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="font-heading text-2xl">Profile Settings</CardTitle>
              <CardDescription>
                Update your personal information and account settings
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="flex flex-col items-center mb-6">
                    <Avatar className="h-24 w-24 mb-4">
                      <AvatarImage src={user.avatar_url} alt={user.username} />
                      <AvatarFallback>{user.username?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
                    </Avatar>
                    
                    <FormField
                      control={form.control}
                      name="avatar_url"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>Profile Picture URL</FormLabel>
                          <FormControl>
                            <Input placeholder="https://example.com/avatar.jpg" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Your name" {...field} />
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
                            <Input type="email" placeholder="Your email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bio</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Tell us about yourself and your cooking style..."
                            className="resize-none"
                            rows={4}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="border-t pt-6 mt-6">
                    <h3 className="font-medium text-lg mb-4">Change Password</h3>
                    
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="current_password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Current Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="Your current password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="new_password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>New Password</FormLabel>
                              <FormControl>
                                <Input type="password" placeholder="New password" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="confirm_password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Confirm New Password</FormLabel>
                              <FormControl>
                                <Input type="password" placeholder="Confirm new password" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving changes...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
} 