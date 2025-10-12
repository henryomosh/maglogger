//@ts-nocheck
"use client";

import { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "@/components/auth-provider";
import { LoginForm } from "@/components/login-form";
import { DashboardLayout } from "@/components/dashboard-layout";
import { StaffManagement } from "@/components/staff-management";
import { RadioShowLogs } from "@/components/show-logs";
import { ShowScheduling } from "@/components/show-scheduling";
import { PlaylistManagement } from "@/components/playlist-management";
import { BusinessAnalytics } from "@/components/business-analytics";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Calendar,
  Music,
  DollarSign,
  TrendingUp,
  Clock,
  Mic,
  Radio,
} from "lucide-react";
import { redirect } from "next/navigation";

function AppContent() {
  const [isAuthenticated, setIsAuthentcated] = useState(false);
  const [user, setUser] = useState();
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
