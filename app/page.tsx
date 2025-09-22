"use client";

import { useState } from "react";
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

function DashboardContent() {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState("dashboard");

  console.log("[v0] DashboardContent rendering, activeSection:", activeSection);
  console.log("[v0] User:", user);

  const stats = [
    {
      title: "Active Presenters",
      value: "12",
      change: "+2 this week",
      icon: Users,
      color: "text-chart-1",
    },
    {
      title: "Shows Today",
      value: "8",
      change: "2 live now",
      icon: Radio,
      color: "text-chart-2",
    },
    {
      title: "Playlists",
      value: "45",
      change: "3 updated",
      icon: Music,
      color: "text-green-700",
    },
  ];

  const recentActivity = [
    {
      time: "2:30 PM",
      event: 'Mike Presenter started "Newspaper Review"',
      type: "live",
    },
    {
      time: "1:45 PM",
      event: 'New playlist "Top 40 Hits" created',
      type: "playlist",
    },
    {
      time: "12:15 PM",
      event: "Sarah  updated show schedule",
      type: "schedule",
    },
    {
      time: "11:30 AM",
      event: 'Ad campaign "Local Business" completed',
      type: "revenue",
    },
  ];

  const upcomingShows = [
    {
      time: "3:00 PM",
      show: "Newspaper Review",
      dj: "Lisa Presenter",
      duration: "2h",
    },
    { time: "5:00 PM", show: "Mass Line", dj: "Tom Presenter", duration: "3h" },
    { time: "8:00 PM", show: "Music", dj: "Alex Presenter", duration: "1h" },
    { time: "9:00 PM", show: "Request", dj: "Alex Presenter", duration: "4h" },
  ];

  return <DashboardLayout children></DashboardLayout>;
}

function AppContent() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
