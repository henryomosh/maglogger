"use client";

import { useState } from "react";
import { useAuth } from "@/components/auth-provider";

import Link from "next/link";
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
  Clock3,
  Check,
  CircleX,
  FileText,
} from "lucide-react";

export function DashboardHome({
  staffData,
  activeUsers,
  scheduleData,
  logsData,
  liveShow,
  approvedLogs,
  pendingLogs,
  declinedLogs,
  upCommingShows,
}: {
  staffData: any;
  scheduleData: any;
  activeUsers: any;
  logsData: any;
  liveShow: any;
  approvedLogs: any;
  pendingLogs: any;
  declinedLogs: any;
  upCommingShows: any;
}) {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState("dashboard");

  const canManageStaff = user?.role === "admin" || user?.role === "manager";

  const filterApprovedLogs = canManageStaff
    ? approvedLogs
    : approvedLogs.filter((item: any) => {
        return item.staff === user?.id;
      });

  const filterDeclinedLogs = canManageStaff
    ? declinedLogs
    : declinedLogs.filter((item: any) => {
        return item.staff === user?.id;
      });

  const filterPendingLogs = canManageStaff
    ? pendingLogs
    : pendingLogs.filter((item: any) => {
        return item.staff === user?.id;
      });

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
        <a href="https://zeno.fm/radio/mitumeradio/">
          <Badge variant="secondary" className="font-serif">
            <div className="w-4 h-4 bg-green-500 rounded-full mr-2 animate-pulse"></div>
            Live Broadcasting
          </Badge>
        </a>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card className="shadow-sm shadow-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 ">
            <CardTitle className="text-sm font-serif font-xl font-bold">
              Active Presenters
            </CardTitle>
            <Users className="h-6 w-6 text-chart-1" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-sans font-bold">
              {activeUsers.length || 0}
            </div>
            <p className="text-xs text-muted-foreground font-serif"></p>
          </CardContent>
        </Card>

        <Card className="shadow-sm shadow-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-serif font-xl font-bold">
              Shows Today
            </CardTitle>
            <Radio className="h-6 w-6 text-chart-2" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-sans font-bold">
              {scheduleData?.length || 0}
            </div>
            <p className="text-xs text-green-500 font-serif font-bold">
              {liveShow?.length > 0
                ? `${liveShow.length} live now`
                : "No live show now"}
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-sm shadow-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-serif font-xl font-bold">
              Approved Logs
            </CardTitle>
            <Check className="h-6 w-6 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-sans font-bold">
              {filterApprovedLogs?.length || 0}
            </div>
            <p className="text-xs text-muted-foreground font-serif"></p>
          </CardContent>
        </Card>
        <Card className="shadow-sm shadow-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-serif font-xl font-bold">
              Pending Logs
            </CardTitle>
            <Clock3 className="h-6 w-6 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-sans font-bold">
              {filterPendingLogs?.length || 0}
            </div>
            <p className="text-xs text-muted-foreground font-serif"></p>
          </CardContent>
        </Card>
        <Card className="shadow-sm shadow-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-serif font-xl font-bold">
              Declined Logs
            </CardTitle>
            <CircleX className="h-6 w-6 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-sans font-bold">
              {filterDeclinedLogs?.length || 0}
            </div>
            <p className="text-xs text-muted-foreground font-serif"></p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-1">
        {/* Recent Activity */}
        {/* <Card>
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
                    <p className="text-sm font-serif">{activity.event}</p>
                  </div>
                  <Badge variant="outline" className="font-serif text-xs">
                    {activity.type}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card> */}

        {/* Upcoming Shows */}
        <Card className="shadow-sm shadow-green-500">
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
              {upCommingShows.map((show: any, index: any) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <Mic className="h-4 w-4 text-accent" />
                      <span className="text-sm font-serif font-medium">
                        {show?.start}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-sans font-bold">
                        {show?.title}
                      </p>
                      <p className="text-xs text-muted-foreground font-serif">
                        with {show.name}
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="font-serif text-xs">
                    {show?.duration ? `${show.duration}h` : ""}
                  </Badge>
                </div>
              ))}
              {upCommingShows?.length < 1 && (
                <div className="text-sm items-center">
                  No upcoming shows today.{" "}
                  {canManageStaff && <>Go to scheduling to add shows.</>}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="shadow-sm shadow-green-500">
        <CardHeader>
          <CardTitle className="font-sans font-bold">Quick Actions</CardTitle>
          <CardDescription className="font-serif">
            Common tasks for {user?.role}s
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <>
              <Link href="dashboard/staff">
                <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                  <Users className="h-5 w-5 text-accent" />
                  <div>
                    <p className="font-serif font-medium">Manage Staff</p>
                    <p className="text-xs text-muted-foreground font-serif">
                      Add or edit Staff profiles
                    </p>
                  </div>
                </div>
              </Link>
              <Link href="dashboard/scheduling">
                {" "}
                <div
                  className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => setActiveSection("scheduling")}
                >
                  <Calendar className="h-5 w-5 text-accent" />
                  <div>
                    <p className="font-serif font-medium">Schedule Shows</p>
                    <p className="text-xs text-muted-foreground font-serif">
                      Update Show programming
                    </p>
                  </div>
                </div>
              </Link>
              <Link href="dashboard/logs">
                {" "}
                <div
                  className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => setActiveSection("analytics")}
                >
                  <FileText className="h-5 w-5 text-accent" />
                  <div>
                    <p className="font-serif font-medium">View Logs</p>
                    <p className="text-xs text-muted-foreground font-serif">
                      View and manage show logs
                    </p>
                  </div>
                </div>
              </Link>
            </>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
