"use client";

import type React from "react";
import Link from "next/link";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/components/auth-provider";
import {
  RadioIcon,
  Users,
  Calendar,
  Music,
  DollarSign,
  BarChart3,
  Menu,
  LogOut,
  Settings,
  FileText,
  Hourglass,
  Airplay,
  Nfc,
} from "lucide-react";
import { NotificationBell } from "./notifications";

interface DashboardLayoutProps {
  children: React.ReactNode;
  notification: any;
}

export function DashboardLayout({
  children,
  notification,
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const [activeSection2, setActiveSection2] = useState("");

  const navigation = [
    {
      name: "Dashboard",
      icon: BarChart3,
      href: "#dashboard",
      key: "dashboard",
      link: "/dashboard",
    },
    {
      name: user?.role === "admin" ? "Staff" : "My Profile",
      icon: Users,
      href: "#staff",
      key: "staff",
      link: "/dashboard/staff",
    },

    {
      name: "Shows and Scheduling",
      icon: Calendar,
      href: "#scheduling",
      key: "scheduling",
      link: "/dashboard/scheduling",
    },
    {
      name: "Show Logs",
      icon: FileText,
      href: "/dashboard/logs",
      key: "logs",
      link: "/dashboard/logs",
    },
    {
      name: "Requests",
      icon: Hourglass,
      href: "/dashboard/requests",
      key: "requests",
      link: "/dashboard/requests",
    },
    {
      name: "Communications",
      icon: Nfc,
      href: "/dashboard/commincations",
      key: "communications",
      link: "/dashboard/communications",
    },
    {
      name: "Advert Management",
      icon: Airplay,
      href: "/dashboard/market",
      key: "market",
      link: "/dashboard/market",
    },
    // {
    //   name: "Playlists",
    //   icon: Music,
    //   href: "#playlists",
    //   key: "playlists",
    //   link: "#",
    // },
    // {
    //   name: "Analytics",
    //   icon: BarChart3,
    //   href: "#analytics",
    //   key: "analytics",
    //   link: "#",
    // },
  ];

  useEffect(() => {
    if (!user) {
      return;
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-sidebar border-r border-sidebar-border transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-200 ease-in-out lg:translate-x-0`}
      >
        <div className="flex h-16 items-center px-6 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500 rounded-lg">
              <RadioIcon className="h-6 w-6 text-sidebar-primary-foreground" />
            </div>
            <div>
              <h1 className="font-sans font-bold text-sidebar-foreground">
                MagLogger
              </h1>
              <p className="text-xs text-sidebar-foreground/60 font-serif">
                System Dashboard
              </p>
            </div>
          </div>
        </div>

        <nav className="mt-6 px-3">
          <ul className="space-y-1">
            {navigation.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.link}
                  onClick={() => setActiveSection2(item.key)}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-serif rounded-lg transition-colors text-left ${
                    activeSection2 === item.key
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-blue-700 hover:bg-sidebar-accent/50"
                  }
                    `}
                >
                  <item.icon
                    className={`h-5 w-5 ${
                      activeSection2 === item.key
                        ? "text-white"
                        : "text-blue-700"
                    }`}
                  />

                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-40 flex h-16 items-center gap-x-4 border-b border-border bg-background px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex flex-1"></div>
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <NotificationBell notification={notification} />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary text-primary-foreground font-sans font-bold">
                        {user?.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-sans font-bold">{user?.name}</p>
                      <p className="text-xs text-muted-foreground font-serif capitalize">
                        {user?.role}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span className="font-serif">Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      logout();
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span className="font-serif">Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-2">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
