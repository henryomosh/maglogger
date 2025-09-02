"use client";

import type React from "react";

import { useState } from "react";
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
import { redirect } from "next/navigation";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const success = await login(email, password);
    if (!success) {
      setError("Invalid credentials. Try: admin@radio.com / password");
    }
    redirect("/dashboard");
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
            Magnet Logger
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
              className="w-full font-sans font-bold"
              disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
          <div className="mt-4 text-sm text-muted-foreground font-serif">
            <p>Demo credentials:</p>
            <p>Admin Email: admin@magnet.com Password: password</p>
            {/* <p>manager@radio.com / password</p> */}
            <p>Staff Email: staff@magnet.com Password: password</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
