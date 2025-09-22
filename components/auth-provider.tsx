"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import bcrypt from "bcryptjs";
import { fetchUser } from "@/lib/data";
import { Fascinate } from "next/font/google";
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
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo purposes
const mockUsers: User[] = [
  { id: "1", name: "System Admin", email: "admin@magnet.com", role: "admin" },
  {
    id: "2",
    name: "Sarah Manager",
    email: "manager@radio.com",
    role: "manager",
  },
  { id: "3", name: "Mike DJ", email: "dj@radio.com", role: "dj" },
  { id: "4", name: "System Staff", email: "staff@magnet.com", role: "staff" },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
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

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);

    // authentication logic
    const user = await fetchUser(email);
    if (!user) {
      setIsLoading(false);
      setErrorMessage("Email does not exist!");
      return false;
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (user && passwordMatch) {
      setUser(user);
      localStorage.setItem("radio-user", JSON.stringify(user));
      setIsAuthentcated(true);
      setIsLoading(false);
      return true;
    }
    setIsLoading(false);
    setErrorMessage("Invalid email or password!");
    return false;
  };

  const logout = () => {
    setUser(null);
    setIsAuthentcated(false);
    localStorage.removeItem("radio-user");
    redirect("/login");
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
