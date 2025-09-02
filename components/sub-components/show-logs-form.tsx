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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  Edit,
  Clock,
  User,
  Calendar,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Show {
  id: string;
  title: string;
  description: string;
  djId: string;
  djName: string;
  startTime: string;
  endTime: string;
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, etc.
  category: string;
  isRecurring: boolean;
  status: "scheduled" | "live" | "completed" | "cancelled";
  color: string;
}

interface ShowFormProps {
  initialData?: Show;
  onClose: () => void;
  onSave: (show: Omit<Show, "id">) => void;
}

const daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export function ShowLogsForm({ initialData, onClose, onSave }: ShowFormProps) {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    djId: initialData?.djId || "",
    djName: initialData?.djName || "",
    startTime: initialData?.startTime || "09:00",
    endTime: initialData?.endTime || "12:00",
    dayOfWeek: initialData?.dayOfWeek || 1,
    category: initialData?.category || "Music",
    isRecurring: initialData?.isRecurring || true,
    status: initialData?.status || ("scheduled" as const),
    color: initialData?.color || "bg-blue-500",
  });

  // Mock DJs for selection
  const availableDJs = [
    { id: "3", name: "Mike DJ" },
    { id: "4", name: "Lisa Staff" },
    { id: "5", name: "Tom DJ" },
    { id: "6", name: "Alex DJ" },
  ];

  const showColors = [
    { value: "bg-blue-500", label: "Blue" },
    { value: "bg-green-500", label: "Green" },
    { value: "bg-purple-500", label: "Purple" },
    { value: "bg-pink-500", label: "Pink" },
    { value: "bg-orange-500", label: "Orange" },
    { value: "bg-red-500", label: "Red" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedDJ = availableDJs.find((dj) => dj.id === formData.djId);
    onSave({
      ...formData,
      djName: selectedDJ?.name || "",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="dj" className="font-serif">
            Show
          </Label>
          <Select
            value={formData.djId}
            onValueChange={(value) =>
              setFormData({ ...formData, djId: value })
            }>
            <SelectTrigger className="border-1 border-gray-400 w-full">
              <SelectValue placeholder="Select DJ" />
            </SelectTrigger>
            <SelectContent>
              {availableDJs.map((dj) => (
                <SelectItem key={dj.id} value={dj.id}>
                  {dj.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="category" className="font-serif">
            Show Duration (minutes)
          </Label>
          <Input
            type="number"
            id="category"
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            className="border-1 border-gray-400"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="font-serif">
          Description
        </Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder="Brief description of the log..."
          className="border-1 border-gray-400"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="dj" className="font-serif">
            Presenter
          </Label>
          <Select
            value={formData.djId}
            onValueChange={(value) =>
              setFormData({ ...formData, djId: value })
            }>
            <SelectTrigger>
              <SelectValue placeholder="Select DJ" />
            </SelectTrigger>
            <SelectContent>
              {availableDJs.map((dj) => (
                <SelectItem key={dj.id} value={dj.id}>
                  {dj.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="startTime" className="font-serif">
            Start Time
          </Label>
          <Input
            id="startTime"
            type="time"
            value={formData.startTime}
            onChange={(e) =>
              setFormData({ ...formData, startTime: e.target.value })
            }
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="endTime" className="font-serif">
            End Time
          </Label>
          <Input
            id="endTime"
            type="time"
            value={formData.endTime}
            onChange={(e) =>
              setFormData({ ...formData, endTime: e.target.value })
            }
            required
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="description" className="font-serif">
          Notes
        </Label>
        <Textarea
          id="notes"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder="Brief notes of the log..."
          className="border-1 border-gray-400"
          rows={3}
        />
      </div>
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="isRecurring"
          checked={formData.isRecurring}
          onChange={(e) => setFormData({ ...formData })}
          className="rounded border-border"
        />
        <Label htmlFor="isRecurring" className="font-serif">
          Recurring weekly show
        </Label>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          className="font-serif bg-transparent">
          Cancel
        </Button>
        <Button type="submit" className="font-sans font-bold">
          {initialData ? "Update" : "Add Log Entry"}
        </Button>
      </div>
    </form>
  );
}
