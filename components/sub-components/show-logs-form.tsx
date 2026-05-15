"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Check,
  CircleX,
  Clock3,
  ContactRound,
  ListCheck,
  Megaphone,
  Plus,
  Trash2,
} from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { createLog, updateLog } from "@/lib/actions";
import { toast } from "sonner";
import { fetchAdsByIds, fetchLogsFormShow, fetchShowAds } from "@/lib/data2";

interface Show {
  id: string;
  title: string;
  description: string;
  show: string;
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
  initialData: any;
  onClose: () => void;
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

export function ShowLogsForm({ initialData, onClose }: ShowFormProps) {
  const { user } = useAuth();
  const [segments, setSegments] = useState(
    initialData?.segments || [
      { startTime: "--:--", endTime: "--:--", description: "" },
    ],
  );

  const [adverts, setAdverts] = useState(initialData?.ads || []);
  const [guests, setGuests] = useState(initialData?.guests || []);
  console.log(initialData?.ads);
  const [userSchedule, setUserSChedule] = useState<any>([
    { id: "", title: "" },
  ]);
  const [selectShow, setSelectShow] = useState(initialData || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectData, setSelectData] = useState(initialData?.show || "show");
  const [radioValue, setRadioValue] = useState("pending");
  const [error, setError] = useState("");
  const [filteredAds, setFilteredAds] = useState<any>([{ id: "" }]);
  const [selectFilteredAds, setSelectFilteredAds] = useState<any>([]);
  const [adError, setAdError] = useState(false);

  const canManageShows = user?.role === "admin" || user?.role === "manager";

  const fetchShowAd = async (id: any) => {
    const ad = await fetchShowAds(id);
    const ads = ad.filter((item: any, index: any) => item?.shows?.includes(id));
    if (ads.length < 1) {
      setAdverts([]);
    }
    setFilteredAds(ads);
  };

  useEffect(() => {
    async function loadData() {
      if (initialData) {
        const adData = await fetchAdsByIds(initialData?.ads);
        setFilteredAds(adData);
      }
      try {
        const schedule = await fetchLogsFormShow(user?.id);
        setUserSChedule(schedule);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    loadData();
  }, []);

  const handleSelectChange = (value: any) => {
    setSelectData(value);
    if (value === "") {
      setError("Please select an option");
    } else {
      setError("");
    }
  };

  function fetchShow(id: string) {
    const foundItem = userSchedule.find((item: any) => item.id === id);
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
      setSegments(currentItems.filter((_: any, i: any) => i !== index));
    }
  }

  const handleSegmentChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const { id, value } = e.target;
    const updatedItems = segments.map((item: any, idx: any) =>
      index === idx ? { ...item, [id]: value } : item,
    );

    setSegments(updatedItems);
  };

  // Adverts functions
  function addAdvert() {
    if (selectShow === "") {
      toast.error("Please select a show!");
      setError("Please select a show");
      return;
    } else if (filteredAds?.length < 1) {
      toast.error("Selected show has no adverts!");
      return;
    } else if (adverts?.length + 1 > filteredAds?.length) {
      toast.error("Maximum adverts reached!");
      return;
    } else {
      const currentItems = adverts;
      setAdverts([...currentItems, { id: "" }]);
    }
  }

  function removeAdverts(index: number) {
    let currentItems = adverts;
    setAdverts(currentItems.filter((_: any, i: any) => i !== index));
  }

  const handleAdvertChange = (name: string, value: any, index: number) => {
    const updatedItems = adverts.map((item: any, idx: any) =>
      index === idx ? { ...item, id: value } : item,
    );

    setAdverts(updatedItems);
  };

  const getSelectedAdvert = (id: string) => {
    const check = adverts.map((item: any) => {
      if (item?.id === id) {
        return true;
      } else {
        return false;
      }
    });
    return check[0];
  };

  // Guest functions
  function addGuest() {
    const currentItems = guests;
    setGuests([...currentItems, { guestName: "", topic: "", phone: "" }]);
  }

  function removeGuest(index: number) {
    let currentItems = guests;
    setGuests(currentItems.filter((_: any, i: any) => i !== index));
  }

  const handleGuestChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const { id, value } = e.target;
    const updatedItems = guests.map((item: any, idx: any) =>
      index === idx ? { ...item, [id]: value } : item,
    );
    setGuests(updatedItems);
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(false);
    const formData2 = new FormData(e.currentTarget);
    const show = formData2.get("show");

    if (adverts.length > 0) {
      for (let i = 0; i < adverts?.length; i++) {
        if (adverts[i]?.id === "") {
          setIsSubmitting(false);
          toast.error("Advert cannot be empty!");
          setAdError(true);
          return null;
        }
      }
    }

    if (show === "initial") {
      setError("Please select a show");
    } else {
      setIsSubmitting(true);

      formData2.append("segments", JSON.stringify(segments));
      formData2.append("adverts", JSON.stringify(adverts));
      formData2.append("ads", JSON.stringify(adverts));
      formData2.append("guests", JSON.stringify(guests));

      const result = await createLog(formData2);
      toast.success("Log Created successfully!");
      setIsSubmitting(false);
      onClose();
    }
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData2 = new FormData(e.currentTarget);
    const show = formData2.get("show");
    if (adverts.length > 0) {
      for (let i = 0; i < adverts?.length; i++) {
        if (adverts[i]?.id === "") {
          setIsSubmitting(false);
          toast.error("Advert cannot be empty!");
          setAdError(true);
          return null;
        }
      }
    }

    if (show === "initial") {
      setError("Please select a show");
      setIsSubmitting(false);
    } else {
      formData2.append("segments", JSON.stringify(segments));
      formData2.append("guests", JSON.stringify(guests));
      formData2.append("adverts", JSON.stringify(adverts));
      formData2.append("ads", JSON.stringify(adverts));

      const result = await updateLog(formData2);
      toast.success("Log Updated successfully!");
      setIsSubmitting(false);
      onClose();
    }
  };

  return (
    <form
      onSubmit={initialData ? handleUpdate : handleSubmit}
      className="space-y-4"
    >
      <div
        className={`grid ${selectShow ? "grid-cols-3" : "grid-cols-1"} gap-4`}
      >
        <div className={`space-y-2 ${selectShow ? "col-span-2" : ""}`}>
          <Input
            className="hidden"
            name="staff"
            type="text"
            value={user?.id}
            readOnly
          />
          <Input
            name="logId"
            className="hidden"
            type="text"
            value={initialData?.id || ""}
            onChange={() => null}
          />
          <Label htmlFor="dj" className="font-serif">
            Show <span className="text-red-500">*</span>
          </Label>
          {error && <p className="text-xs text-red-600">{error}</p>}

          <Select
            name="show"
            value={selectData}
            onValueChange={(value) => {
              handleSelectChange(value);
              fetchShowAd(value);
              fetchShow(value);
            }}
            required
            disabled={initialData}
          >
            <SelectTrigger
              className={`border-1 ${
                error ? "border-red-400" : "border-blue-400"
              } w-full`}
            >
              <SelectValue placeholder="Select Show" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem className="hidden" value="initial"></SelectItem>
              <SelectItem value="show">Select Show</SelectItem>
              {userSchedule.map((show: any, index: any) => (
                <SelectItem key={index} value={show.id || `${index}`}>
                  {show.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {/*{selectShow && (*/}
        {/*  <div className="space-y-2 flex flex-col  pt-4 pl-6 text-sm text-gray-500">*/}
        {/*    <div className="flex gap-2">*/}
        {/*      <AlarmClockCheck className="h-4 w-4" />*/}
        {/*      <p>Start: {selectShow.start} </p>{" "}*/}
        {/*    </div>*/}
        {/*    <div className="flex gap-2">*/}
        {/*      <AlarmClockCheck className="h-4 w-4" />*/}
        {/*      <p>End: {selectShow.ends} </p>{" "}*/}
        {/*    </div>*/}
        {/*  </div>*/}
        {/*)}*/}
      </div>
      <hr className="border-gray-300" />

      {/* Segments */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className=" font-black flex gap-2">
            <ListCheck className="h-6 w-6 text-green-500" /> Show Segments
          </h3>
          <Button
            type="button"
            size="sm"
            onClick={addSegment}
            className="bg-indigo-500 hover:bg-indigo-400 cursor-pointer"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Segment
          </Button>
        </div>
        {segments.map((_: any, index: any) => (
          <div
            className="grid border-2 border-blue-300 rounded-md p-4  grid-cols-8 gap-4 items-end "
            key={index}
          >
            <div className="grid grid-cols-4 md:grid-cols-7 gap-4 col-span-7">
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
              <div className="space-y-2 col-span-4 md:col-span-3">
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
      {/* Adverts */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className=" font-black flex gap-2">
            {" "}
            <Megaphone className="h-6 w-6 text-green-500" />
            Adverts
          </h3>
          <Button
            type="button"
            className="bg-indigo-500 hover:bg-indigo-400 cursor-pointer "
            size="sm"
            onClick={addAdvert}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Advert
          </Button>
        </div>
        {adverts?.map((_: any, index: any) => (
          <div className="grid grid-cols-8 gap-4 items-end " key={index}>
            {/* <div className="space-y-2 col-span-3">
              <Label htmlFor="title" className="font-serif">
                Title <span className="text-red-500">*</span>
              </Label>
              <Input
                className="border-1 border-blue-400"
                name={`title_${index}`}
                id="title"
                type="text"
                value={adverts[index].title}
                onChange={(e) => handleAdvertChange(e, index)}
                required
              />
            </div> */}
            <div
              className="space-y-2 col-span-7
          "
            >
              <Label htmlFor="dj" className="font-serif">
                Advert <span className="text-red-500">*</span>
              </Label>
              <Select
                name="filteredAds"
                value={adverts[index]?.id}
                onValueChange={(value) => {
                  handleAdvertChange("filtredAds", value, index);
                }}
                required
              >
                <SelectTrigger
                  className={`border-1 w-full ${
                    adError ? "border-red-400 " : "border-blue-400"
                  }`}
                >
                  <SelectValue placeholder="Select Advert" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem className="hidden" value="initial"></SelectItem>
                  {filteredAds.map((ad: any, index: any) => (
                    <SelectItem key={ad.id} value={ad.id || `${index}`}>
                      {ad.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="pb-2">
              <Button
                type="button"
                size="icon"
                className="col-span-1 cursor-pointer bg-red-700 hover:bg-red-600 w-full"
                onClick={() => removeAdverts(index)}
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Remove item</span>
              </Button>
            </div>
          </div>
        ))}
        {adverts.length < 1 && (
          <div>
            <p className="text-sm">No advert added!</p>
          </div>
        )}
      </div>
      <hr />
      {/* Guests */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className=" font-black flex gap-2">
            {" "}
            <ContactRound className="h-6 w-6 text-green-500" /> Show Guests
          </h3>
          <Button
            type="button"
            className="bg-indigo-500 hover:bg-indigo-400 cursor-pointer "
            size="sm"
            onClick={addGuest}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Guest
          </Button>
        </div>
        {guests.map((_: any, index: any) => (
          <div
            className="grid border-2 border-blue-300 rounded-md p-4  grid-cols-8 gap-4 items-end "
            key={index}
          >
            <div className="grid grid-cols-4 md:grid-cols-7 gap-4 col-span-7">
              <div className="space-y-2 col-span-2 md:col-span-3 ">
                <Label htmlFor="description" className="font-serif">
                  Full Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  className="border-1 border-blue-400"
                  name={`guestName_${index}`}
                  id="guestName"
                  type="text"
                  value={guests[index].guestName}
                  onChange={(e) => handleGuestChange(e, index)}
                  required
                />
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="description" className="font-serif">
                  Topic <span className="text-red-500">*</span>
                </Label>
                <Input
                  className="border-1 border-blue-400"
                  name={`topic_${index}`}
                  id="topic"
                  type="text"
                  value={guests[index].topic}
                  onChange={(e) => handleGuestChange(e, index)}
                  required
                />
              </div>
              <div className="space-y-2 col-span-4 md:col-span-2">
                <Label htmlFor="description" className="font-serif">
                  Phone <span className="text-red-500">*</span>
                </Label>
                <Input
                  className="border-1 border-blue-400"
                  name={`phone_${index}`}
                  id="phone"
                  type="text"
                  value={guests[index].phone}
                  onChange={(e) => handleGuestChange(e, index)}
                  required
                />
              </div>
            </div>
            <div className="">
              <Button
                type="button"
                size="icon"
                className="col-span-1 cursor-pointer bg-red-700 hover:bg-red-600 w-full"
                onClick={() => removeGuest(index)}
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Remove item</span>
              </Button>
            </div>
          </div>
        ))}
        {guests.length < 1 && (
          <div>
            <p className="text-sm">No guests added!</p>
          </div>
        )}
      </div>
      {/* Log Status */}
      {initialData && (
        <fieldset>
          {canManageShows && (
            <>
              <hr className="border-gray-300" />
              <h3 className=" font-black py-4">Set Log Status</h3>
              <div className="rounded-md border border-gray-200 bg-white px-[14px] py-3">
                <div className="flex gap-4 flex-col md:flex-row">
                  <div className="flex flex-row gap-4">
                    <div className="flex items-center">
                      <input
                        id="pending"
                        name="status"
                        type="radio"
                        value="pending"
                        className="h-4 w-4 cursor-pointer text-whitefocus:ring-2"
                        defaultChecked={initialData?.status === "pending"}
                      />
                      <label
                        htmlFor="pending"
                        className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-yellow-200 px-3 py-1.5 text-xs font-medium text-gray-600"
                      >
                        Pending <Clock3 className="h-4 w-4" />
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="approved"
                        name="status"
                        type="radio"
                        value="approved"
                        className="h-4 w-4 cursor-pointer  bg-white text-white focus:ring-2"
                        defaultChecked={initialData?.status === "approved"}
                      />
                      <label
                        htmlFor="approved"
                        className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-green-500 px-3 py-1.5 text-xs font-medium text-white"
                      >
                        Approved <Check className="h-4 w-4" />
                      </label>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex items-center">
                      <input
                        id="declined"
                        name="status"
                        type="radio"
                        value="declined"
                        className="h-4 w-4 cursor-pointer text-white focus:ring-2"
                        defaultChecked={initialData?.status === "declined"}
                      />
                      <label
                        htmlFor="declined"
                        className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-red-500 px-3 py-1.5 text-xs font-medium text-white"
                      >
                        Declined <CircleX className="h-4 w-4" />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div id="status-error" aria-live="polite" aria-atomic="true">
                {/* {state?.errors?.status &&
            state.errors.status.map((error: string) => (
              <p className="mt-2 text-sm text-red-500" key={error}>
                {error}
              </p>
            ))} */}
              </div>
            </>
          )}
        </fieldset>
      )}

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
          ) : initialData ? (
            "Update"
          ) : (
            "Add Log Entry"
          )}
        </Button>
      </div>
    </form>
  );
}
