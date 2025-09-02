//@ts-nocheck
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

  const renderContent = () => {
    console.log("[v0] renderContent called with activeSection:", activeSection);

    try {
      switch (activeSection) {
        case "staff":
          console.log("[v0] Rendering StaffManagement");
          return <StaffManagement />;
        case "logs":
          console.log("[v0] Rendering Show Logs");
          return <RadioShowLogs />;
        case "scheduling":
          console.log("[v0] Rendering ShowScheduling");
          return <ShowScheduling />;
        case "playlists":
          console.log("[v0] Rendering PlaylistManagement");
          return <PlaylistManagement />;
        case "analytics":
          console.log("[v0] Rendering BusinessAnalytics");
          return <BusinessAnalytics />;
        default:
          console.log("[v0] Rendering default dashboard");
          return (
            <div className="space-y-6">
              {/* Welcome Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-sans font-bold text-foreground">
                    Welcome back, {user?.name || "User"}!
                  </h1>
                  <p className="text-muted-foreground font-serif mt-1">
                    Here's what's happening at your radio station today.
                  </p>
                </div>
                <Badge variant="secondary" className="font-serif">
                  <div className="w-4 h-4 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                  Live Broadcasting
                </Badge>
              </div>

              {/* Stats Grid */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {stats.map((stat) => (
                  <Card key={stat.title}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-serif font-medium">
                        {stat.title}
                      </CardTitle>
                      <stat.icon className={`h-4 w-4 ${stat.color}`} />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-sans font-bold">
                        {stat.value}
                      </div>
                      <p className="text-xs text-muted-foreground font-serif">
                        {stat.change}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Main Content Grid */}
              <div className="grid gap-6 md:grid-cols-2">
                {/* Recent Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle className="font-sans font-bold">
                      Recent Activity
                    </CardTitle>
                    <CardDescription className="font-serif">
                      Latest updates from your radio station
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentActivity.map((activity, index) => (
                        <div key={index} className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground font-serif">
                              {activity.time}
                            </span>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-serif">
                              {activity.event}
                            </p>
                          </div>
                          <Badge
                            variant="outline"
                            className="font-serif text-xs">
                            {activity.type}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Upcoming Shows */}
                <Card>
                  <CardHeader>
                    <CardTitle className="font-sans font-bold">
                      Upcoming Shows
                    </CardTitle>
                    <CardDescription className="font-serif">
                      Today's scheduled programming
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {upcomingShows.map((show, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                              <Mic className="h-4 w-4 text-accent" />
                              <span className="text-sm font-serif font-medium">
                                {show.time}
                              </span>
                            </div>
                            <div>
                              <p className="text-sm font-sans font-bold">
                                {show.show}
                              </p>
                              <p className="text-xs text-muted-foreground font-serif">
                                with {show.dj}
                              </p>
                            </div>
                          </div>
                          <Badge
                            variant="secondary"
                            className="font-serif text-xs">
                            {show.duration}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-sans font-bold">
                    Quick Actions
                  </CardTitle>
                  <CardDescription className="font-serif">
                    Common tasks for {user?.role}s
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-3">
                    {user?.role === "admin" || user?.role === "manager" ? (
                      <>
                        <div
                          className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                          onClick={() => setActiveSection("staff")}>
                          <Users className="h-5 w-5 text-accent" />
                          <div>
                            <p className="font-serif font-medium">
                              Manage Staff
                            </p>
                            <p className="text-xs text-muted-foreground font-serif">
                              Add or edit DJ profiles
                            </p>
                          </div>
                        </div>
                        <div
                          className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                          onClick={() => setActiveSection("scheduling")}>
                          <Calendar className="h-5 w-5 text-accent" />
                          <div>
                            <p className="font-serif font-medium">
                              Schedule Shows
                            </p>
                            <p className="text-xs text-muted-foreground font-serif">
                              Update programming
                            </p>
                          </div>
                        </div>
                        <div
                          className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                          onClick={() => setActiveSection("analytics")}>
                          <TrendingUp className="h-5 w-5 text-accent" />
                          <div>
                            <p className="font-serif font-medium">
                              View Analytics
                            </p>
                            <p className="text-xs text-muted-foreground font-serif">
                              Check performance
                            </p>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div
                          className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                          onClick={() => setActiveSection("playlists")}>
                          <Music className="h-5 w-5 text-accent" />
                          <div>
                            <p className="font-serif font-medium">
                              My Playlists
                            </p>
                            <p className="text-xs text-muted-foreground font-serif">
                              Manage your music
                            </p>
                          </div>
                        </div>
                        <div
                          className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                          onClick={() => setActiveSection("scheduling")}>
                          <Calendar className="h-5 w-5 text-accent" />
                          <div>
                            <p className="font-serif font-medium">
                              My Schedule
                            </p>
                            <p className="text-xs text-muted-foreground font-serif">
                              View upcoming shows
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                          <Radio className="h-5 w-5 text-accent" />
                          <div>
                            <p className="font-serif font-medium">Go Live</p>
                            <p className="text-xs text-muted-foreground font-serif">
                              Start broadcasting
                            </p>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          );
      }
    } catch (error) {
      console.error("[v0] Error rendering content:", error);
      return (
        <div className="p-6 text-center">
          <h2 className="text-xl font-bold text-red-600 mb-2">
            Error Loading Content
          </h2>
          <p className="text-muted-foreground">
            There was an issue loading this section. Please try refreshing the
            page.
          </p>
          <button
            onClick={() => setActiveSection("dashboard")}
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md">
            Return to Dashboard
          </button>
        </div>
      );
    }
  };

  return (
    <DashboardLayout
      activeSection={activeSection}
      onSectionChange={setActiveSection}>
      {renderContent()}
    </DashboardLayout>
  );
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

  // if (!user) {
  //   return <LoginForm />;
  // }

  return <LoginForm />;
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
