"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Bell,
  Check,
  X,
  Calendar,
  Music,
  Users,
  DollarSign,
  Radio,
  AlertCircle,
  Nfc,
  FileText,
  Hourglass,
} from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { markNotificationRead, deleteUserNotification } from "@/lib/actions";
import { formatDateToLocal } from "@/lib/utils";
import Link from "next/link";

interface Notification {
  id: string;
  type: "logs" | "requests" | "communication";
  title: string;
  message: string;
  time: string;
  read: boolean;
  priority: "low" | "medium" | "high";
}

export function NotificationBell({ notification }: { notification: any }) {
  const { user }: any = useAuth();

  const canManageSystem = user?.role === "admin";

  const unreadCount = notification.filter((n: any) => !n.read).length;

  const markAsRead = async (id: string) => {
    const res = await markNotificationRead(id, user?.id);
  };

  const markAllAsRead = () => {
    // setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = async (id: string) => {
    const res = await deleteUserNotification(id, user.id);
  };

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "logs":
        return <FileText className="h-4 w-4" />;
      case "requests":
        return <Hourglass className="h-4 w-4" />;
      case "communication":
        return <Nfc className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: Notification["priority"]) => {
    switch (priority) {
      case "high":
        return "text-red-500";
      case "medium":
        return "text-yellow-500";
      case "low":
        return "text-blue-500";
    }
  };

  const isReadObj = (id: string) => {
    const com = notification?.find((item: any) => item.id === id);
    const userObj = JSON.parse(com.user_status);
    const usr = userObj.find((item: any) => item.id === user?.id);
    return usr;
  };

  const isDeletedObj = (id: string) => {
    const com = notification?.find((item: any) => item.id === id);
    const userObj = JSON.parse(com.user_status);
    const usr = userObj.find((item: any) => item.id === user?.id);
    return usr;
  };

  let filtredNotification: any = [];

  if (canManageSystem) {
    filtredNotification = notification?.filter(
      (item: any) => item.type !== "communication"
    );
  }

  if (!canManageSystem) {
    filtredNotification = notification?.filter(
      (item: any) => item.type === "communication"
    );
  }
  const unreadUserCount = filtredNotification?.filter((item: any) => {
    const users = JSON.parse(item.user_status);
    const curentUser = users?.find((item: any) => item.id === user?.id);
    return curentUser?.read === false;
  }).length;

  const deletedUserCount = filtredNotification?.filter((item: any) => {
    const users = JSON.parse(item.user_status);
    const curentUser = users?.find((item: any) => item.id === user?.id);
    return curentUser?.deleted === false;
  }).length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadUserCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadUserCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h3 className="font-sans font-bold text-lg">Notifications</h3>
            <p className="text-xs text-muted-foreground font-serif">
              {unreadUserCount} unread notification
              {unreadUserCount !== 1 ? "s" : ""}
            </p>
          </div>
          {unreadUserCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="text-xs font-serif hidden"
            >
              Mark all read
            </Button>
          )}
        </div>

        <div className="max-h-[400px] overflow-y-auto">
          {deletedUserCount === 0 ? (
            <div className="p-8 text-center">
              <Bell className="h-12 w-12 mx-auto text-muted-foreground/50 mb-2" />
              <p className="text-sm text-muted-foreground font-serif">
                No notifications
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {notification?.map((item: any) => (
                <div
                  key={item.id}
                  className={`p-4 hover:bg-muted/50 transition-colors outline-none ${
                    isDeletedObj(item.id)?.deleted ? "hidden" : ""
                  } ${
                    !isReadObj(item.id)?.read ? "bg-accent/9" : "bg-accent/4"
                  } ${
                    canManageSystem && item.type === "communication"
                      ? "hidden"
                      : ""
                  }  ${
                    !canManageSystem && item.type !== "communication"
                      ? "hidden"
                      : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`mt-1 ${getPriorityColor(item.priority)}`}>
                      {getIcon(item.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <p className="font-sans font-bold text-sm">
                            {item.title}
                          </p>
                          <p className="text-sm text-muted-foreground font-serif mt-0.5">
                            {item.message}
                          </p>
                          <p className="text-xs text-muted-foreground font-serif mt-1">
                            {formatDateToLocal(item.time)}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          {!isReadObj(item.id)?.read && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 cursor-pointer"
                              onClick={() => markAsRead(item.id)}
                            >
                              <Check className="h-3 w-3 text-green-500 hover:text-white" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 cursor-pointer"
                            onClick={() => deleteNotification(item.id)}
                          >
                            <X className="h-3 w-3 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {notification.length > 0 && (
          <div className="p-2 border-t hidden">
            <Button variant="ghost" className="w-full text-xs font-serif">
              View all notifications
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
