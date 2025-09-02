//@ts-nocheck
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
import { useAuth } from "@/components/auth-provider";
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
import { createScheduling } from "@/lib/actions";

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

interface TimeSlot {
  hour: number;
  minute: number;
  label: string;
}

// Mock shows data
const mockShows: Show[] = [
  {
    id: "1",
    title: "Newspaper Review",
    description: "Start your day with newspaper updates",
    djId: "3",
    djName: "Mike Presenter",
    startTime: "06:00",
    endTime: "07:00",
    dayOfWeek: 1, // Monday
    category: "Music",
    isRecurring: true,
    status: "scheduled",
    color: "bg-blue-500",
  },
  {
    id: "2",
    title: "Mass Line",
    description: "Start your day with newspaper updates",
    djId: "3",
    djName: "Mary Presenter",
    startTime: "08:00",
    endTime: "10:00",
    dayOfWeek: 1, // Monday
    category: "Music",
    isRecurring: true,
    status: "scheduled",
    color: "bg-indigo-500",
  },
  {
    id: "3",
    title: "Interview",
    description: "Start your day with newspaper updates",
    djId: "3",
    djName: "Peter Presenter",
    startTime: "10:00",
    endTime: "12:00",
    dayOfWeek: 1, // Monday
    category: "Music",
    isRecurring: true,
    status: "scheduled",
    color: "bg-purple-500",
  },
  {
    id: "4",
    title: "Music",
    description: "Smooth tunes for your afternoon",
    djId: "3",
    djName: "Mike DJ",
    startTime: "12:00",
    endTime: "18:00",
    dayOfWeek: 1, // Monday
    category: "Music",
    isRecurring: true,
    status: "live",
    color: "bg-green-500",
  },
  {
    id: "5",
    title: "Requests",
    description: "Classic and contemporary jazz selections",
    djId: "5",
    djName: "Tom Presenter",
    startTime: "19:00",
    endTime: "22:00",
    dayOfWeek: 1, // Monday
    category: "Jazz",
    isRecurring: true,
    status: "scheduled",
    color: "bg-purple-500",
  },
  {
    id: "6",
    title: "Night Beats",
    description: "Electronic and dance music for the night owls",
    djId: "6",
    djName: "Alex DJ",
    startTime: "22:00",
    endTime: "02:00",
    dayOfWeek: 1, // Monday
    category: "Electronic",
    isRecurring: true,
    status: "scheduled",
    color: "bg-pink-500",
  },
  // Tuesday shows
  {
    id: "8",
    title: "Morning Drive",
    description: "Start your day with the best music and traffic updates",
    djId: "3",
    djName: "Mike DJ",
    startTime: "06:00",
    endTime: "10:00",
    dayOfWeek: 2, // Tuesday
    category: "Music",
    isRecurring: true,
    status: "scheduled",
    color: "bg-blue-500",
  },
  {
    id: "9",
    title: "Midday Mix",
    description: "Pop hits and listener requests",
    djId: "4",
    djName: "Lisa Staff",
    startTime: "12:00",
    endTime: "15:00",
    dayOfWeek: 2, // Tuesday
    category: "Pop",
    isRecurring: true,
    status: "scheduled",
    color: "bg-orange-500",
  },
];

const timeSlots: TimeSlot[] = Array.from({ length: 24 }, (_, i) => ({
  hour: i,
  minute: 0,
  label: `${i.toString().padStart(2, "0")}:00`,
}));

const daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export function ShowScheduling() {
  const { user } = useAuth();
  const [shows, setShows] = useState<Show[]>(mockShows);
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [selectedView, setSelectedView] = useState<"week" | "day">("week");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingShow, setEditingShow] = useState<Show | null>(null);

  // Check if user has permission to manage shows
  const canManageShows = user?.role === "admin" || user?.role === "manager";

  const getWeekDates = (date: Date) => {
    const week = [];
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay()); // Start from Sunday

    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      week.push(day);
    }
    return week;
  };

  const weekDates = getWeekDates(currentWeek);

  const getShowsForDay = (dayOfWeek: number) => {
    return shows
      .filter((show) => show.dayOfWeek === dayOfWeek)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "live":
        return "bg-red-100 text-red-800 animate-pulse";
      case "scheduled":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      case "cancelled":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":");
    const hour = Number.parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const navigateWeek = (direction: "prev" | "next") => {
    const newWeek = new Date(currentWeek);
    newWeek.setDate(currentWeek.getDate() + (direction === "next" ? 7 : -7));
    setCurrentWeek(newWeek);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-sans font-bold text-foreground">
            Show Programming & Sheduling
          </h1>
          <p className="text-muted-foreground font-serif mt-1">
            Manage your radio station's show Logs and programming.
          </p>
        </div>
        {canManageShows && (
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="font-sans font-bold">
                <Plus className="h-4 w-4 mr-2" />
                Schedule Show
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="font-sans font-bold">
                  Schedule New Show
                </DialogTitle>
                <DialogDescription className="font-serif">
                  Create a new show in the programming schedule.
                </DialogDescription>
              </DialogHeader>
              <ShowForm
                onClose={() => setIsAddDialogOpen(false)}
                onSave={(newShow) => {
                  setShows([
                    ...shows,
                    { ...newShow, id: Date.now().toString() },
                  ]);
                  setIsAddDialogOpen(false);
                }}
              />
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* View Controls */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <Tabs
              value={selectedView}
              onValueChange={(value) =>
                setSelectedView(value as "week" | "day")
              }>
              <TabsList>
                <TabsTrigger value="week" className="font-serif">
                  Week View
                </TabsTrigger>
                <TabsTrigger value="day" className="font-serif">
                  Day View
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateWeek("prev")}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="font-serif font-medium min-w-48 text-center">
                  {weekDates[0].toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                  })}{" "}
                  -{" "}
                  {weekDates[6].toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateWeek("next")}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentWeek(new Date())}
                className="font-serif">
                Today
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Schedule Grid */}
      {selectedView === "week" ? (
        <Card>
          <CardHeader>
            <CardTitle className="font-sans font-bold">
              Weekly Schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-8 gap-2">
              {/* Time column header */}
              <div className="font-serif font-medium text-sm text-muted-foreground">
                Time
              </div>

              {/* Day headers */}
              {daysOfWeek.map((day, index) => (
                <div
                  key={day}
                  className="font-serif font-medium text-sm text-center p-2">
                  <div>{day}</div>
                  <div className="text-xs text-muted-foreground">
                    {weekDates[index].toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                </div>
              ))}

              {/* Schedule grid */}
              {timeSlots
                .filter((_, i) => i % 2 === 0)
                .map((slot) => (
                  <React.Fragment key={slot.hour}>
                    {/* Time label */}
                    <div className="text-xs text-muted-foreground font-serif py-2 border-t">
                      {formatTime(slot.label)}
                    </div>

                    {/* Day columns */}
                    {daysOfWeek.map((_, dayIndex) => {
                      const dayShows = getShowsForDay(dayIndex).filter(
                        (show) => {
                          const showHour = Number.parseInt(
                            show.startTime.split(":")[0]
                          );
                          return (
                            showHour >= slot.hour && showHour < slot.hour + 2
                          );
                        }
                      );

                      return (
                        <div
                          key={dayIndex}
                          className="min-h-16 border-t border-l p-1">
                          {dayShows.map((show) => (
                            <div
                              key={show.id}
                              className={`${show.color} text-white text-xs p-2 rounded mb-1 cursor-pointer hover:opacity-80 transition-opacity`}
                              onClick={() =>
                                canManageShows && setEditingShow(show)
                              }>
                              <div className="font-sans font-bold truncate">
                                {show.title}
                              </div>
                              <div className="font-serif opacity-90">
                                {formatTime(show.startTime)} -{" "}
                                {formatTime(show.endTime)}
                              </div>
                              <div className="font-serif opacity-75 truncate">
                                {show.djName}
                              </div>
                            </div>
                          ))}
                        </div>
                      );
                    })}
                  </React.Fragment>
                ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {shows
            .filter((show) => show.dayOfWeek === new Date().getDay())
            .sort((a, b) => a.startTime.localeCompare(b.startTime))
            .map((show) => (
              <Card key={show.id} className="relative">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-4 h-4 rounded-full ${show.color}`}></div>
                      <div>
                        <CardTitle className="text-lg font-sans font-bold">
                          {show.title}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground font-serif">
                          {show.category}
                        </p>
                      </div>
                    </div>
                    {canManageShows && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => setEditingShow(show)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Show
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Badge
                    className={`${getStatusColor(
                      show.status
                    )} font-serif text-xs`}>
                    {show.status.charAt(0).toUpperCase() + show.status.slice(1)}
                  </Badge>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="font-serif">
                        {formatTime(show.startTime)} -{" "}
                        {formatTime(show.endTime)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="font-serif">{show.djName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="font-serif">
                        {show.isRecurring ? "Weekly" : "One-time"} •{" "}
                        {daysOfWeek[show.dayOfWeek]}
                      </span>
                    </div>
                  </div>

                  {show.description && (
                    <p className="text-sm text-muted-foreground font-serif line-clamp-2">
                      {show.description}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
        </div>
      )}

      {/* Edit Show Dialog */}
      {editingShow && (
        <Dialog open={!!editingShow} onOpenChange={() => setEditingShow(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="font-sans font-bold">
                Edit Show
              </DialogTitle>
              <DialogDescription className="font-serif">
                Update the details for {editingShow.title}.
              </DialogDescription>
            </DialogHeader>
            <ShowForm
              initialData={editingShow}
              onClose={() => setEditingShow(null)}
              onSave={(updatedShow) => {
                setShows(
                  shows.map((s) =>
                    s.id === editingShow.id
                      ? { ...updatedShow, id: editingShow.id }
                      : s
                  )
                );
                setEditingShow(null);
              }}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

interface ShowFormProps {
  initialData?: Show;
  onClose: () => void;
  onSave: (show: Omit<Show, "id">) => void;
}

function ShowForm({ initialData, onClose, onSave }: ShowFormProps) {
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
          <Label htmlFor="title" className="font-serif">
            Show Title <span className="text-red-500">*</span>
          </Label>
          <Input
            id="title"
            className="border-1 border-blue-400"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category" className="font-serif">
            Category <span className="text-red-500">*</span>
          </Label>
          <Input
            id="category"
            className="border-1 border-blue-400"
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
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
          className="border-1 border-blue-400"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder="Brief description of the show..."
          rows={3}
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="dj" className="font-serif">
            DJ/Host
          </Label>
          <Select
            name="host"
            value={formData.djId}
            onValueChange={(value) =>
              setFormData({ ...formData, djId: value })
            }>
            <SelectTrigger className="border-1 border-blue-400 w-full">
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
          <Label htmlFor="dayOfWeek" className="font-serif">
            Day of Week
          </Label>
          <Select
            name="day"
            value={formData.dayOfWeek.toString()}
            onValueChange={(value) =>
              setFormData({ ...formData, dayOfWeek: Number.parseInt(value) })
            }>
            <SelectTrigger className="border-1 border-blue-400 w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {daysOfWeek.map((day, index) => (
                <SelectItem key={index} value={index.toString()}>
                  {day}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="color" className="font-serif">
            Color
          </Label>
          <Select
            name="color"
            value={formData.color}
            onValueChange={(value) =>
              setFormData({ ...formData, color: value })
            }>
            <SelectTrigger className="border-1 border-blue-400 w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {showColors.map((color) => (
                <SelectItem key={color.value} value={color.value}>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-4 h-4 rounded-full ${color.value}`}></div>
                    {color.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startTime" className="font-serif">
            Start Time
          </Label>
          <Input
            id="startTime"
            name="startTime"
            className="border-1 border-blue-400"
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
            name="endTime"
            className="border-1 border-blue-400 w-full"
            type="time"
            value={formData.endTime}
            onChange={(e) =>
              setFormData({ ...formData, endTime: e.target.value })
            }
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="status" className="font-serif">
            Status
          </Label>
          <Select
            name="status"
            value={formData.status}
            onValueChange={(
              value: "scheduled" | "live" | "completed" | "cancelled"
            ) => setFormData({ ...formData, status: value })}>
            <SelectTrigger className="border-1 border-blue-400 w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="live">Live</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="isRecurring"
          name="isRecurring"
          checked={formData.isRecurring}
          onChange={(e) =>
            setFormData({ ...formData, isRecurring: e.target.checked })
          }
          className="rounded border-border "
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
          {initialData ? "Update" : "Schedule"} Show
        </Button>
      </div>
    </form>
  );
}
