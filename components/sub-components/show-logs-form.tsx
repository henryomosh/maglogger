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
import { Plus, Trash2, AlarmClockCheck } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/components/auth-provider";
import { fetchUserSchedule } from "@/lib/data";
import { createLog } from "@/lib/actions";
import { toast } from "sonner";

interface Show {
  id: string;
  title: string;
  description: string;
  showId: string;
  djId: string;
  djName: string;
  startTime: string;
  endTime: string;
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, etc.
  category: string;
  isRecurring: boolean;
  status: "scheduled" | "live" | "completed" | "cancelled";
  color: string;
  segmentItems: [{ startTime: string; endTime: string; description: string }];
}
interface SegmentInterface {
  startTime: string;
  endTime: string;
  description: string;
}

interface GuestInterface {
  guestName: string;
  topic: string;
  phone: string;
}

interface ShowFormProps {
  initialData?: Show;
  onClose: () => void;
  onSave: (show: Omit<Show, "id">) => void;
}

interface UserSchedule {
  id: string;
  title: string;
  start: string;
  ends: string;
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
    showId: initialData?.showId || "",
    djId: initialData?.djId || "",
    djName: initialData?.djName || "",
    startTime: initialData?.startTime || "09:00",
    endTime: initialData?.endTime || "12:00",
    dayOfWeek: initialData?.dayOfWeek || 1,
    category: initialData?.category || "Music",
    isRecurring: initialData?.isRecurring || true,
    status: initialData?.status || ("scheduled" as const),
    color: initialData?.color || "bg-blue-500",
    segmentItems: [
      {
        startTime: initialData?.segmentItems[0].startTime || "",
        endTime: initialData?.segmentItems[0].endTime || "",
        description: initialData?.segmentItems[0].description || "",
      },
    ],
  });
  const [segments, setSegments] = useState<SegmentInterface[]>([
    { startTime: "--:--", endTime: "--:--", description: "" },
  ]);

  const [guests, setGuests] = useState<GuestInterface[]>([
    { guestName: "", topic: "", phone: "" },
  ]);
  const { user } = useAuth();
  const [userSchedule, setUserSChedule] = useState<UserSchedule[]>([
    { id: "", title: "", start: "", ends: "" },
  ]);
  const [selectShow, setSelectShow] = useState<UserSchedule>();
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  useEffect(() => {
    async function loadData() {
      try {
        const result = await fetchUserSchedule(user?.id || "");
        console.log(result);
        setUserSChedule(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    loadData();
  }, []);

  function fetchShow(id: string) {
    const foundItem = userSchedule.find((item) => item.id === id);
    setSelectShow(foundItem);
  }
  // Show segment functions
  function addSegment() {
    const currentItems = segments;
    setSegments([
      ...currentItems,
      { startTime: "--:--", endTime: "--:--", description: "" },
    ]);
  }

  function removeSegment(index: number) {
    let currentItems = segments;
    if (currentItems.length > 1) {
      setSegments(currentItems.filter((_, i) => i !== index));
    }
  }

  const handleSegmentChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const { id, value } = e.target;
    const updatedItems = segments.map((item, idx) =>
      index === idx ? { ...item, [id]: value } : item
    );

    setSegments(updatedItems);
  };
  // Guest functions
  function addGuest() {
    const currentItems = guests;
    setGuests([...currentItems, { guestName: "", topic: "", phone: "" }]);
  }

  function removeGuest(index: number) {
    let currentItems = guests;
    if (currentItems.length > 1) {
      setGuests(currentItems.filter((_, i) => i !== index));
    }
  }

  const handleGuestChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const { id, value } = e.target;
    const updatedItems = guests.map((item, idx) =>
      index === idx ? { ...item, [id]: value } : item
    );
    setGuests(updatedItems);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData2 = new FormData(e.currentTarget);
    const result = await createLog(formData2);
    toast.success("Log Created successfully!");
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div
        className={`grid ${selectShow ? "grid-cols-3" : "grid-cols-1"} gap-4`}
      >
        <div className={`space-y-2 ${selectShow ? "col-span-2" : ""}`}>
          <Label htmlFor="dj" className="font-serif">
            Show <span className="text-red-500">*</span>
          </Label>
          <Select
            name="show"
            value={formData.showId}
            onValueChange={(value) => {
              setFormData({ ...formData, showId: value });
              fetchShow(value);
            }}
            required
          >
            <SelectTrigger className="border-1 border-blue-400 w-full">
              <SelectValue placeholder="Select Show" />
            </SelectTrigger>
            <SelectContent>
              {userSchedule.map((show) => (
                <SelectItem key={show.id} value={show.id || "Select Show"}>
                  {show.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {selectShow && (
          <div className="space-y-2 flex flex-col  pt-4 pl-6 text-sm text-gray-500">
            <div className="flex gap-2">
              <AlarmClockCheck className="h-4 w-4" />
              <p>Start: {selectShow.start} </p>{" "}
            </div>
            <div className="flex gap-2">
              <AlarmClockCheck className="h-4 w-4" />
              <p>End: {selectShow.ends} </p>{" "}
            </div>
          </div>
        )}
      </div>
      <hr className="border-gray-300" />
      {/* Segments */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className=" font-black">Show Segments</h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addSegment}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Segment
          </Button>
        </div>
        {segments.map((_, index) => (
          <div className="grid grid-cols-8 gap-4 items-end " key={index}>
            <div className="space-y-2 col-span-2">
              <Label htmlFor="description" className="font-serif">
                Start Time <span className="text-red-500">*</span>
              </Label>
              <Input
                className="border-1 border-blue-400"
                name={`startTime_${index}`}
                id="startTime"
                type="time"
                value={segments[index].startTime}
                onChange={(e) => handleSegmentChange(e, index)}
                required
              />
            </div>
            <div className="space-y-2 col-span-2">
              <Label htmlFor="description" className="font-serif">
                End Time <span className="text-red-500">*</span>
              </Label>
              <Input
                className="border-1 border-blue-400"
                name={`endTime_${index}`}
                id="endTime"
                type="time"
                value={segments[index].endTime}
                onChange={(e) => handleSegmentChange(e, index)}
                required
              />
            </div>
            <div className="space-y-2 col-span-3">
              <Label htmlFor="description" className="font-serif">
                Description <span className="text-red-500">*</span>
              </Label>
              <Input
                className="border-1 border-blue-400"
                name={`description_${index}`}
                id="description"
                type="text"
                value={segments[index].description}
                onChange={(e) => handleSegmentChange(e, index)}
                required
              />
            </div>
            <div className="">
              <Button
                type="button"
                size="icon"
                className="col-span-1 cursor-pointer bg-red-700 hover:bg-red-600 w-full"
                onClick={() => removeSegment(index)}
                disabled={segments.length <= 1}
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Remove item</span>
              </Button>
            </div>
          </div>
        ))}
      </div>
      <hr className="border-gray-300" />
      {/* Guests */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className=" font-black">Show Guests</h3>
          <Button type="button" variant="outline" size="sm" onClick={addGuest}>
            <Plus className="h-4 w-4 mr-2" />
            Add Guest
          </Button>
        </div>
        {guests.map((_, index) => (
          <div className="grid grid-cols-8 gap-4 items-end " key={index}>
            <div className="space-y-2 col-span-3">
              <Label htmlFor="description" className="font-serif">
                Full Name
              </Label>
              <Input
                className="border-1 border-blue-400"
                name={`guestName_${index}`}
                id="guestName"
                type="text"
                value={guests[index].guestName}
                onChange={(e) => handleGuestChange(e, index)}
              />
            </div>
            <div className="space-y-2 col-span-2">
              <Label htmlFor="description" className="font-serif">
                Topic
              </Label>
              <Input
                className="border-1 border-blue-400"
                name={`topic_${index}`}
                id="topic"
                type="text"
                value={guests[index].topic}
                onChange={(e) => handleGuestChange(e, index)}
              />
            </div>
            <div className="space-y-2 col-span-2">
              <Label htmlFor="description" className="font-serif">
                Phone
              </Label>
              <Input
                className="border-1 border-blue-400"
                name={`phone_${index}`}
                id="phone"
                type="text"
                value={guests[index].phone}
                onChange={(e) => handleGuestChange(e, index)}
              />
            </div>
            <div className="">
              <Button
                type="button"
                size="icon"
                className="col-span-1 cursor-pointer bg-red-700 hover:bg-red-600 w-full"
                onClick={() => removeGuest(index)}
                disabled={guests.length <= 1}
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Remove item</span>
              </Button>
            </div>
          </div>
        ))}
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
        <Button type="submit" className="font-sans font-bold">
          {initialData ? "Update" : "Add Log Entry"}
        </Button>
      </div>
    </form>
  );
}
