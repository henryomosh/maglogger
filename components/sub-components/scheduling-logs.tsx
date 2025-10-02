"use client";

import React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import {
  Plus,
  Edit,
  Clock,
  User,
  Calendar,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Music,
  MessageSquare,
  AlertTriangle,
  Radio,
  ContactRound,
  FileText,
  AlarmClock,
  ListCheck,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ShowLogsForm } from "@/components/sub-components/show-logs-form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface ShowLogsManagerProps {
  logs: any;
  scheduleId: any;
  modalShow: any;
}

export function ShowLogsManager({
  logs,
  scheduleId,
  modalShow,
}: ShowLogsManagerProps) {
  const getStatusColor = (status: any) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "declined":
        return "bg-red-100 text-red-800";
      default:
        return "bg-cyan-100 text-cyan-800";
    }
  };
  return (
    <div>
      {logs.length < 1 && (
        <div className="text-center">No logs added to this show!</div>
      )}
      {logs
        .map((item: any) => (
          <div
            className="border-2 border-indigo-200 rounded rounded-md py-2 px-2 my-4"
            key={item.id}
          >
            <div className="flex justify-between pb-2">
              <Badge className={`${getStatusColor(item.status)}`}>
                {item.status}
              </Badge>
              <div className="text-xs">Created: {item.created}</div>
            </div>
            <hr className="text-gray-500" />
            <div className="pt-1">
              <h1 className="text-sm font-bold pb-2">Segments</h1>
              {item.segments.map((segment: any, index: any) => (
                <div className="flex gap-2 pb-2" key={index}>
                  <ListCheck className="h-4 w-4 text-green-500" />
                  <p className="text-xs">
                    <strong>Starts:</strong> {segment.startTime}
                  </p>
                  <p className="text-xs">
                    <strong>Ends:</strong> {segment.endTime}
                  </p>
                  <p className="text-xs">
                    <strong>Description:</strong> {segment.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="pt-1">
              {item?.guests?.length > 0 && (
                <>
                  <hr className="text-gray-500" />
                  <h1 className="text-sm font-bold pb-2">Guests</h1>
                  {item?.guests.map((guest: any, index: any) => (
                    <div className="flex gap-2 pb-2" key={index}>
                      <ContactRound className="h-4 w-4 text-indigo-500" />
                      <p className="text-xs">
                        <strong>Name:</strong> {guest.name}
                      </p>
                      <p className="text-xs">
                        <strong>Topic:</strong> {guest.topic}
                      </p>
                      <p className="text-xs">
                        <strong>Phone:</strong> {guest.phone}
                      </p>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        ))
        .slice(0, 2)}
    </div>
  );
}
