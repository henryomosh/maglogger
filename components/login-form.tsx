"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "./auth-provider";
import { RadioIcon } from "lucide-react";
import { loginUser } from "@/auth";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await loginUser(formData);
    if (result?.success === false) {
      setError(result?.error);
      setIsLoading(false);
    }
    if (result?.success === true) {
      const user = result.user;
      login(user);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-purple-500 rounded-full">
              <RadioIcon className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl font-sans font-bold">
            MagLogger
          </CardTitle>
          <CardDescription className="font-serif">
            Sign in to access your dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="font-serif">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@radio.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="font-serif">
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="password"
                required
              />
            </div>
            {error && (
              <p className="text-sm text-destructive font-serif">{error}</p>
            )}
            <Button
              type="submit"
              className="w-full font-sans font-bold bg-blue-700 hover:bg-blue-600"
              disabled={isLoading}
            >
              {isLoading ? (
                <div
                  role="status"
                  className="flex items-center justify-center gap-2"
                >
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-100 border-t-transparent"></div>
                </div>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
