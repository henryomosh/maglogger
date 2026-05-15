"use client";

import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { logoutUser } from "@/auth";
import { redirect } from "next/navigation";

export type UserRole = "admin" | "manager" | "dj" | "staff";

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  sepecialities?: string[];
  status?: string;
  bio?: string;
  password?: string;
  login: string;
}

interface AuthContextType {
  user: User | null;
  login: (user: any) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo purposes

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthentcated] = useState(false);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem("radio-user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthentcated(true);
    }

    setIsLoading(false);
  }, []);

  const login = async (user: any): Promise<boolean> => {
    setIsLoading(true);
    setUser(user);
    localStorage.setItem("radio-user", JSON.stringify(user));
    redirect("/dashboard");
  };

  const logout = async () => {
    setUser(null);
    setIsAuthentcated(false);
    localStorage.removeItem("radio-user");

    await logoutUser();
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, isLoading, isAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
