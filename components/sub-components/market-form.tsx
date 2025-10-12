"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/auth-provider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { createAdvert, updateAdvert } from "@/lib/actions";
import { Textarea } from "@/components/ui/textarea";
import { ControlledMultiSelect } from "@/components/ui/multiselect";
import { fetchStaff, fetchAdSchedule } from "@/lib/data";

interface RequestFormProps {
  initialData: any;
  onClose: () => void;
}

const slots = ["1", "2", "3", "4", "5"];

const status = [
  { name: "Active", value: "active" },
  { name: "Stopped", value: "stopped" },
];

export function MarketForm({ initialData, onClose }: RequestFormProps) {
  const { user } = useAuth();
  const canManageShows = user?.role === "admin" || user?.role === "manager";

  const [selectStatus, setSelectStatus] = useState(
    initialData?.status && initialData?.status !== "initial"
      ? initialData.status
      : ""
  );
  const [title, setTitle] = useState(initialData?.title || "");
  const [shows, setShows] = useState(null);
  const [selectShows, setSelectShows] = useState(initialData?.shows || []);
  const [selectSlots, setSelectSlot] = useState<any>(
    initialData?.slot && initialData?.slot !== "initial" ? initialData.slot : ""
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [staff, setStaff] = useState([]);

  useEffect(() => {
    async function loadData() {
      try {
        const shows: any = await fetchAdSchedule();
        setShows(shows);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    loadData();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData2 = new FormData(e.currentTarget);
    formData2.append("shows", JSON.stringify(selectShows));

    const result = await createAdvert(formData2);

    if (result?.success === false) {
      setIsSubmitting(false);
      toast.error(result.message);
    }
    if (result?.success === true) {
      setIsSubmitting(false);
      toast.success("Advert created successfully!", {});
      onClose();
    }
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData2 = new FormData(e.currentTarget);
    formData2.append("shows", JSON.stringify(selectShows));
    const result = await updateAdvert(formData2);

    if (result?.success === false) {
      setIsSubmitting(false);
      toast.error(result.message);
    }
    if (result?.success === true) {
      setIsSubmitting(false);
      toast.success("Advert Updated successfully!", {});
      onClose();
    }
  };

  return (
    <form
      onSubmit={initialData ? handleUpdate : handleSubmit}
      className="space-y-4"
    >
      <div className="grid gap-4">
        <div className="grid grid-cols-2 gap-4">
          <input name="staffId" className="hidden" value={user?.id} readOnly />
          <input
            name="id"
            className="hidden"
            value={initialData?.id || ""}
            readOnly
          />
          <div className="space-y-2">
            <Label htmlFor="role" className="font-serif">
              Title<span className="text-red-500">*</span>
            </Label>
            <Input
              name="title"
              className="border border-blue-500"
              value={title}
              onChange={(e: any) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            {" "}
            <Label htmlFor="role" className="font-serif">
              Status <span className="text-red-500">*</span>
            </Label>
            <Select
              name="status"
              value={selectStatus}
              onValueChange={(value) => {
                setSelectStatus(value);
              }}
              required
            >
              <SelectTrigger className={`border-1 border-blue-500 w-full`}>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem className="hidden" value="initial"></SelectItem>
                {status.map((request, index) => (
                  <SelectItem key={index} value={request.value || `${index}`}>
                    {request.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="role" className="font-serif">
              Shows <span className="text-red-500">*</span>
            </Label>
            <ControlledMultiSelect
              options={shows ?? []}
              placeholder="Select shows..."
              value={selectShows}
              onValueChange={setSelectShows}
            />{" "}
          </div>
          <div className="space-y-2">
            {" "}
            <Label htmlFor="role" className="font-serif">
              Slots per show <span className="text-red-500">*</span>
            </Label>
            <Select
              name="slot"
              value={selectSlots}
              onValueChange={(value) => {
                setSelectSlot(value);
              }}
              required
            >
              <SelectTrigger className={`border-1 border-blue-500 w-full`}>
                <SelectValue placeholder="Select show slots" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem className="hidden" value="initial"></SelectItem>
                {slots.map((item, index) => (
                  <SelectItem key={index} value={item || `${index}`}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
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
              `${initialData ? "Update" : "Add"} Advert`
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
