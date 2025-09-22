"use client";

import React from "react";

import { useState, useEffect } from "react";
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
  BadgeCheck,
  Trash2,
  OctagonAlert,
  FileText,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  createScheduling,
  deleteSchedule,
  updateScheduling,
} from "@/lib/actions";
import { toast } from "sonner";
import "@/components/dashboard-components/radix-styles.css";
import { ShowLogsManager } from "@/components/sub-components/scheduling-logs";
import { fetchStaff } from "@/lib/data";

interface Show {
  id: string;
  title: string;
  description: string;
  host: string;
  staff: string;
  djName: string;
  start: string;
  ends: string;
  day: number; // 0 = Sunday, 1 = Monday, etc.
  category: string;
  recurring: boolean;
  status: string;
  color: string;
  date: string;
}

interface TimeSlot {
  hour: number;
  minute: number;
  label: string;
}

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

interface LiveEvent {
  startTime: string; // ISO 8601 format from the database
  endTime: string; // ISO 8601 format from the database
}

export function ShowScheduling({
  data,
  scheduleLogs,
}: {
  data: any;
  scheduleLogs: any;
}) {
  const { user } = useAuth();
  const [shows, setShows] = useState<Show[]>(data);
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [selectedView, setSelectedView] = useState<"week" | "day">("day");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingShow, setEditingShow] = useState<Show | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [scheduleId, setScheduleId] = useState("");
  const [scheduleLogModal, setScheduleLogModal] = useState(false);
  const [showLogs, setShowLogs] = useState(null);
  const [modalShow, setModalShow] = useState({ title: "" });
  const [staff, setStaff] = useState([]);

  useEffect(() => {
    async function loadData() {
      try {
        const { formStaff } = await fetchStaff();
        setStaff(formStaff);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    loadData();
  }, []);

  const handleLogs = async (id: string) => {
    const logs = scheduleLogs?.filter((item: any) => item?.show === id);
    setShowLogs(logs);
  };

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
    return data
      .filter((show: any) => show.day === dayOfWeek)
      .sort((a: any, b: any) => a.start.localeCompare(b.start));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "live":
        return "bg-red-300 text-red-800 animate-pulse";
      case "scheduled":
        return "bg-green-300 text-green-800";
      case "completed":
        return "bg-gray-300 text-gray-800";
      case "cancelled":
        return "bg-yellow-300 text-yellow-800";
      default:
        return "bg-gray-300 text-gray-800";
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

  const handleDelete = async (id: string) => {
    setIsDeleting(true);

    const results = await deleteSchedule(id);
    toast.warning("Shedule Deleted!");

    setIsDeleting(false);
    setIsDeleteDialogOpen(false);
  };

  const showStatus = (event: LiveEvent) => {
    const [startHours, startMinutes] = event.startTime.split(":");
    const [endHours, endMinutes] = event.endTime.split(":");
    let hourNow = Number(new Date().getHours());
    const starts = Number(startHours);
    const end = Number(endHours);

    if (end >= hourNow && starts <= hourNow) {
      return "live";
    }
    if (starts > hourNow) {
      return "scheduled";
    }
    if (end < hourNow) {
      return "completed";
    }
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
            Manage your radio station's shows and programming.
          </p>
        </div>
        {canManageShows && (
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="font-sans font-bold bg-green-700 hover:bg-green-600">
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
                staff={staff}
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
        {canManageShows && (
          <Dialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
          >
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="font-sans font-bold">
                  <div className="flex gap-4">
                    <OctagonAlert className="h-10 w-10 text-red-600" /> Are your
                    sure you want to delete this member?
                  </div>
                </DialogTitle>
                <DialogDescription className="font-serif flex justify-end gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDeleteDialogOpen(false)}
                    className="font-serif bg-transparent"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => handleDelete(scheduleId)}
                    className="font-sans font-bold bg-red-600 hover:bg-red-400"
                    disabled={isDeleting}
                  >
                    {isDeleting ? "Deleting..." : "Delete"}
                  </Button>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        )}

        <Dialog open={scheduleLogModal} onOpenChange={setScheduleLogModal}>
          <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-sans font-bold">
                Show Logs for{" "}
                <span className="text-purple-700 text-xl">
                  {modalShow?.title}
                </span>
              </DialogTitle>
              <DialogDescription className="font-serif">
                Track activities during the show.
              </DialogDescription>
            </DialogHeader>
            <ShowLogsManager
              logs={showLogs}
              scheduleId={scheduleId}
              modalShow={modalShow}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* View Controls */}
      <Card>
        <CardContent className="">
          <div className="flex items-center justify-between">
            <Tabs
              value={selectedView}
              onValueChange={(value) =>
                setSelectedView(value as "day" | "week")
              }
            >
              <TabsList>
                <TabsTrigger
                  value="week"
                  className="font-serif  bg-gray-300 data-[state=active]:bg-green-300  mr-2"
                >
                  {selectedView === "week" && (
                    <BadgeCheck className="h-6 w-6" />
                  )}{" "}
                  Week View
                </TabsTrigger>

                <TabsTrigger
                  value="day"
                  className="font-serif bg-gray-300 data-[state=active]:bg-green-300"
                >
                  {selectedView === "day" && <BadgeCheck className="h-6 w-6" />}{" "}
                  Day View
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Button
                  className="bg-green-700 hover:bg-green-600"
                  size="xs"
                  onClick={() => navigateWeek("prev")}
                >
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
                  className="bg-green-700 hover:bg-green-600"
                  size="xs"
                  onClick={() => navigateWeek("next")}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <Button
                className="font-serif bg-green-700 hover:bg-green-600"
                size="xs"
                onClick={() => setCurrentWeek(new Date())}
              >
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
            <CardTitle className="font-sans font-bold text-xl">
              Weekly Schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-8 gap-2">
              {/* Time column header */}
              <div className="font-serif font-bold text-md text-muted-foreground">
                Time
              </div>

              {/* Day headers */}
              {daysOfWeek.map((day, index) => (
                <div
                  key={day}
                  className="font-serif font-medium text-sm text-center p-2"
                >
                  <div className="text-xs text-muted-foreground">
                    <div className="text-lg font-bold text-cyan-500">
                      {weekDates[index].toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                    <div>{day}</div>
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
                        (show: any) => {
                          const showHour = Number.parseInt(
                            show.start.split(":")[0]
                          );
                          return (
                            showHour >= slot.hour && showHour < slot.hour + 2
                          );
                        }
                      );

                      return (
                        <div
                          key={dayIndex}
                          className="min-h-16 border-t border-l"
                        >
                          {dayShows.map((show: any) => (
                            <div key={show.id}>
                              {show.recurring ? (
                                <div
                                  onClick={() => {
                                    handleLogs(show.id);
                                    setModalShow(show);
                                    setScheduleLogModal(true);
                                  }}
                                  className={`${show.color} text-white text-xs pl-1 pb-2 rounded mb-1 cursor-pointer hover:opacity-80 transition-opacity`}
                                >
                                  <div className="flex items start justify-between ">
                                    <div className="font-sans font-bold truncate pt-2">
                                      {show.title}
                                    </div>
                                    {canManageShows && (
                                      <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                          <Button variant="ghost" size="sm">
                                            <MoreVertical className="h-4 w-4" />
                                          </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="start">
                                          <DropdownMenuItem
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              setEditingShow(show);
                                            }}
                                          >
                                            <Edit className="h-4 w-4 mr-2 text-green-500" />
                                            Edit Show
                                          </DropdownMenuItem>
                                          <DropdownMenuItem
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              setScheduleId(show.id);
                                              setIsDeleteDialogOpen(true);
                                            }}
                                          >
                                            <Trash2 className="h-4 w-4 mr-2 text-red-500" />
                                            Delete Show
                                          </DropdownMenuItem>
                                        </DropdownMenuContent>
                                      </DropdownMenu>
                                    )}
                                  </div>
                                  <div className="font-serif opacity-90">
                                    {formatTime(show.start)} -{" "}
                                    {formatTime(show.ends)}
                                  </div>
                                  <div className="font-serif opacity-75 truncate">
                                    {show.name}
                                  </div>
                                </div>
                              ) : (
                                <>
                                  {show.date ===
                                    weekDates[Number(show.day)]
                                      .toISOString()
                                      .substring(0, 10) && (
                                    <div
                                      className={`${show.color} text-white text-xs pl-1 pb-2 rounded mb-1 cursor-pointer hover:opacity-80 transition-opacity`}
                                    >
                                      <div className="flex items start justify-between ">
                                        <div className="font-sans font-bold truncate pt-2">
                                          {show.title}
                                        </div>
                                        {canManageShows && (
                                          <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                              <Button variant="ghost" size="sm">
                                                <MoreVertical className="h-4 w-4" />
                                              </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="start">
                                              <DropdownMenuItem
                                                onClick={() =>
                                                  setEditingShow(show)
                                                }
                                              >
                                                <Edit className="h-4 w-4 mr-2 text-green-500" />
                                                Edit Show
                                              </DropdownMenuItem>
                                              <DropdownMenuItem
                                                onClick={() => {
                                                  setScheduleId(show.id);
                                                  setIsDeleteDialogOpen(true);
                                                }}
                                              >
                                                <Trash2 className="h-4 w-4 mr-2 text-red-500" />
                                                Delete Show
                                              </DropdownMenuItem>
                                            </DropdownMenuContent>
                                          </DropdownMenu>
                                        )}
                                      </div>
                                      <div className="font-serif opacity-90">
                                        {formatTime(show.start)} -{" "}
                                        {formatTime(show.ends)}
                                      </div>
                                      <div className="font-serif opacity-75 truncate">
                                        {show.name}
                                      </div>
                                    </div>
                                  )}
                                </>
                              )}
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
          {data
            .filter((show: any) => show.day === new Date().getDay())
            .sort((a: any, b: any) => a.start.localeCompare(b.start))
            .map((show: any) => (
              <Card key={show.id} className="relative">
                <CardHeader className="">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-4 h-4 rounded-full ${show.color}`}
                      ></div>
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
                            onClick={() => setEditingShow(show)}
                          >
                            <Edit className="h-4 w-4 mr-2 text-green-500" />
                            Edit Show
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setScheduleId(show.id);
                              setIsDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4 mr-2 text-red-500" />
                            Delete Show
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Badge
                    className={`${getStatusColor(
                      showStatus({
                        startTime: show.start,
                        endTime: show.ends,
                      }) || ""
                    )} font-serif text-sm`}
                  >
                    {/* {show.status.charAt(0).toUpperCase() + show.status.slice(1)} */}
                    {showStatus({ startTime: show.start, endTime: show.ends })}{" "}
                  </Badge>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="font-serif">
                        {formatTime(show.start)} - {formatTime(show.ends)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="font-serif">{show.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="font-serif">
                        {show.recurring ? "Weekly" : "One-time"} •{" "}
                        {daysOfWeek[show.day]}
                      </span>
                    </div>
                  </div>

                  {show.description && (
                    <p className="text-sm text-muted-foreground font-serif line-clamp-2">
                      {show.description}
                    </p>
                  )}
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="font-serif text-xs"
                      onClick={() => {
                        handleLogs(show.id);
                        setModalShow(show);
                        setScheduleLogModal(true);
                      }}
                    >
                      <FileText className="h-3 w-3 mr-1 text-cyan-500" />
                      View Logs (
                      {
                        scheduleLogs?.filter(
                          (item: any) => item.show === show.id
                        ).length
                      }
                      )
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          {data.filter((show: any) => show.day === new Date().getDay()).length <
            1 && <p className="flex justify-center text-sm">No shows today</p>}
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
              staff={staff}
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
  staff?: any;
  initialData?: Show;
  onClose: () => void;
  onSave: (show: Omit<Show, "id">) => void;
}

function ShowForm({ staff, initialData, onClose, onSave }: ShowFormProps) {
  const [status, setStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hostSelect, setHostSelect] = useState(initialData?.staff || "");
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    id: initialData?.id || "",
    staff: initialData?.staff || "",
    title: initialData?.title || "",
    description: initialData?.description || "",
    djId: initialData?.host || "",
    djName: initialData?.djName || "",
    startTime: initialData?.start || "",
    endTime: initialData?.ends || "",
    dayOfWeek: initialData?.day || 1,
    category: initialData?.category || "Music",
    isRecurring: initialData ? initialData?.recurring : (true as boolean),
    status: initialData?.status || ("scheduled" as const),
    color: initialData?.color || "bg-blue-500",
    date: initialData?.date || "",
  });

  // Mock DJs for selection
  const availableDJs = [
    { id: "3", name: "Mike BARASA" },
    { id: "4", name: "Lisa Staff" },
    { id: "5", name: "Tom CAT" },
    { id: "6", name: "Alex MWANNGI" },
  ];

  const showColors = [
    { value: "bg-blue-500", label: "Blue" },
    { value: "bg-green-500", label: "Green" },
    { value: "bg-purple-500", label: "Purple" },
    { value: "bg-pink-500", label: "Pink" },
    { value: "bg-orange-500", label: "Orange" },
    { value: "bg-red-500", label: "Red" },
  ];

  const { user } = useAuth();

  const handleDayChange = (value: any) => {
    const day = new Date(value);
    setFormData({ ...formData, dayOfWeek: day.getDay(), date: value });
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData2 = new FormData(e.currentTarget);
    const staffId = formData2.get("staffId");
    if (staffId === "initial") {
      setError("Please select a show host");
      setIsSubmitting(false);
    } else {
      const result = await createScheduling(formData2);
      if (result) {
        setStatus({ success: result?.success, message: result?.message });
        setIsSubmitting(false);
      } else {
        toast.success("Show Created successfully!");
        setIsSubmitting(false);
        onClose();
      }
    }
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData2 = new FormData(e.currentTarget);
    const result = await updateScheduling(formData2);
    toast.success("Show Updated Successfully!", {});
    setIsSubmitting(false);
    onClose();
  };
  return (
    <form
      onSubmit={initialData ? handleUpdate : handleSubmit}
      className="space-y-4"
    >
      <div>
        {!status?.success && status?.message && (
          <p className="text-red-500 text-sm text-center rounded border-1 bg-red-100 py-2 ">
            {status?.message}
          </p>
        )}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title" className="font-serif">
            Show Title <span className="text-red-500">*</span>
          </Label>
          <Input
            id="title"
            name="title"
            className="border-1 border-blue-400"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            required
          />

          <Input
            name="userId"
            className="border-1 border-blue-500 hidden"
            defaultValue={user?.id}
          />
          <Input
            name="id"
            className="border-1 border-blue-500 hidden"
            defaultValue={formData.id}
          />
        </div>
        <div className="space-y-2">
          <Label
            htmlFor="host"
            className={`font-serif ${error ? "text-red-500" : ""}`}
          >
            Show Host/Presenter
          </Label>

          <Select
            name="staffId"
            value={hostSelect}
            onValueChange={(value) => {
              setHostSelect(value);
            }}
          >
            <SelectTrigger
              className={`border-1  w-full ${
                error ? "border-red-500" : "border-blue-400"
              }`}
            >
              <SelectValue placeholder="Select Host" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem key="select" value="initial" hidden>
                Select Host
              </SelectItem>
              {staff?.map((item: any, index: any) => (
                <SelectItem key={index} value={item.id}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {error && <p className="text-xs text-red-600">{error}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="font-serif">
          Description
        </Label>
        <Textarea
          id="description"
          name="description"
          className="border-1 border-blue-400"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder="Brief description of the show..."
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* <div className="space-y-2">
          <Label htmlFor="dj" className="font-serif">
            Show Host
          </Label>
          <Select
            name="host"
            value={formData.djId}
            onValueChange={(value) => setFormData({ ...formData, djId: value })}
          >
            <SelectTrigger className="border-1 border-blue-400 w-full">
              <SelectValue placeholder="Select Host" />
            </SelectTrigger>
            <SelectContent>
              {availableDJs.map((dj) => (
                <SelectItem key={dj.id} value={dj.id}>
                  {dj.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div> */}
        <div className="space-y-2">
          <Label htmlFor="dayOfWeek" className="font-serif">
            Day of Week
          </Label>
          <Select
            name="day"
            value={formData.dayOfWeek.toString()}
            onValueChange={(value) =>
              setFormData({ ...formData, dayOfWeek: Number.parseInt(value) })
            }
            disabled={!formData.isRecurring}
          >
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
            }
          >
            <SelectTrigger className="border-1 border-blue-400 w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {showColors.map((color) => (
                <SelectItem key={color.value} value={color.value}>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-4 h-4 rounded-full ${color.value}`}
                    ></div>
                    {color.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
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
        {/* <div className="space-y-2">
          <Label htmlFor="status" className="font-serif">
            Status
          </Label>
          <Select
            name="status"
            value={formData.status}
            onValueChange={(
              value: "scheduled" | "live" | "completed" | "cancelled"
            ) => setFormData({ ...formData, status: value })}
          >
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
        </div> */}
      </div>

      <div className="grid grid-cols-2 gap-4">
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
        {!formData.isRecurring && (
          <div className="space-y-2">
            <Label htmlFor="status" className="font-serif">
              Date <span className="text-red-500">*</span>
            </Label>
            <Input
              type="date"
              name="date"
              value={formData.date}
              onChange={(e) => {
                handleDayChange(e.target.value);
              }}
              className="border-1 border-blue-500"
              required={!formData.isRecurring}
            />
          </div>
        )}
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          className="font-serif bg-transparent"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="success"
          className="font-sans font-bold"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <div
              role="status"
              className="flex items-center justify-center gap-2"
            >
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-100 border-t-transparent"></div>
            </div>
          ) : (
            `${initialData ? "Update" : "Add"} Schedule`
          )}
        </Button>
      </div>
    </form>
  );
}
