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
  Calendar,
  Clock3,
  FileText,
  Home,
  Hourglass,
  Megaphone,
  Mic,
  Radio,
  Users,
} from "lucide-react";
import DashboardAttendance from "@/components/sub-components/dashboard-attendance";

export function DashboardHome({
  attendance,
  activeUsers,
  scheduleData,
  liveShow,
  pendingLogs,
  upCommingShows,
  pendingRequests,
  advertsCount,
  pendingUserRequest,
}: {
  attendance: any;
  scheduleData: any;
  activeUsers: any;
  liveShow: any;
  pendingLogs: any;
  upCommingShows: any;
  pendingRequests: any;
  advertsCount: any;
  pendingUserRequest: any;
}) {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState("dashboard");

  const canManageStaff = user?.role === "admin" || user?.role === "manager";

  const filterPendingLogs = canManageStaff
    ? pendingLogs
    : pendingLogs.filter((item: any) => {
        return item.staff === user?.id;
      });

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex items-center gap-2">
        <Home className="h-8 w-8 text-blue-500" />
        <h1 className="text-blue-500 text-3xl font-extrabold">Dashboard</h1>
      </div>
      <div className="flex flex-col md:flex-row gap-8 justify-between border border-green-300 rounded-md p-4 bg-green-50">
        <a href="https://zeno.fm/radio/mitumeradio/">
          <Badge variant="secondary" className="font-serif p-2 px-4">
            <div className="w-4 h-4 bg-green-500 rounded-full mr-2 animate-pulse"></div>
            Mitume Radio Live
          </Badge>
        </a>
        <DashboardAttendance attendance={attendance} />
      </div>

      {/* Stats Grid */}
      <div
        className={`grid gap-4 md:grid-cols-2 ${
          canManageStaff ? "lg:grid-cols-5" : "lg:grid-cols-4"
        }`}
      >
        <Card className="shadow-sm shadow-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 ">
            <CardTitle className="text-sm font-serif font-xl font-bold">
              Active Presenters
            </CardTitle>
            <Users className="h-6 w-6 text-chart-1" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-sans font-bold">
              {activeUsers[0]?.count ?? 0}
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
                ? `${liveShow?.length} live now`
                : "No live show now"}
            </p>
          </CardContent>
        </Card>
        {canManageStaff && (
          <Card className="shadow-sm shadow-green-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-serif font-xl font-bold">
                Total Adverts
              </CardTitle>
              <Megaphone className="h-6 w-6 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-sans font-bold">
                {advertsCount[0]?.count || 0}
              </div>
              <p className="text-xs text-muted-foreground font-serif"></p>
            </CardContent>
          </Card>
        )}
        {canManageStaff && (
          <Card className="shadow-sm shadow-green-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-serif font-xl font-bold">
                Pending Requests
              </CardTitle>
              <Hourglass className="h-6 w-6 text-indigo-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-sans font-bold">
                {pendingRequests[0]?.count || 0}
              </div>
              <p className="text-xs text-muted-foreground font-serif"></p>
            </CardContent>
          </Card>
        )}
        <Card className="shadow-sm shadow-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-serif font-xl font-bold">
              Pending Logs
            </CardTitle>
            <Clock3 className="h-6 w-6 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-sans font-bold">
              {pendingLogs[0]?.count ?? 0}
            </div>
            <p className="text-xs text-muted-foreground font-serif"></p>
          </CardContent>
        </Card>
        {!canManageStaff && (
          <Card className="shadow-sm shadow-green-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-serif font-xl font-bold">
                Pending Requests
              </CardTitle>
              <Hourglass className="h-6 w-6 text-cyan-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-sans font-bold">
                {pendingUserRequest[0]?.count || 0}
              </div>
              <p className="text-xs text-muted-foreground font-serif"></p>
            </CardContent>
          </Card>
        )}
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
                    <p className="font-serif font-medium">
                      {canManageStaff ? "Manage Staff" : "View Profile"}
                    </p>
                    <p className="text-xs text-muted-foreground font-serif">
                      {canManageStaff
                        ? "Add or edit Staff profiles "
                        : "My profile details"}
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
                  {canManageStaff ? (
                    <div>
                      <p className="font-serif font-medium">Schedule Shows </p>
                      <p className="text-xs text-muted-foreground font-serif">
                        Update Show programming
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="font-serif font-medium">Shows </p>
                      <p className="text-xs text-muted-foreground font-serif">
                        Radio Shows programming
                      </p>
                    </div>
                  )}
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
