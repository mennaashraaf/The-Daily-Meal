import React, { createContext, useContext, useState, useEffect } from "react";
import { User, LoginData, RegisterData } from "@/lib/types";
import { authAPI } from "@/lib/api";

// Auth Context Type
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await authAPI.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (data: LoginData) => {
    const user = await authAPI.login(data);
    setUser(user);
  };

  // Register function
  const register = async (data: RegisterData) => {
    const user = await authAPI.register(data);
    setUser(user);
  };

  // Logout function
  const logout = async () => {
    await authAPI.logout();
    setUser(null);
    // Navigation will be handled by the component that calls logout
  };

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook for components to consume the context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};