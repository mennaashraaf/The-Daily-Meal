import React, { createContext, useContext } from "react";
import { User, LoginData, RegisterData } from "@/lib/types";

// Simplified Auth Context
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
}

// Create default values that don't require any actual API calls
const defaultValue: AuthContextType = {
  user: null,
  isLoading: false,
  isAuthenticated: false,
  login: async () => { console.log("Login not implemented") },
  register: async () => { console.log("Register not implemented") },
  logout: async () => { console.log("Logout not implemented") }
};

// Create context with default values
const AuthContext = createContext<AuthContextType>(defaultValue);

// Simplified provider that just uses the default values
export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <AuthContext.Provider value={defaultValue}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook for components to consume the context
export const useAuth = () => useContext(AuthContext);