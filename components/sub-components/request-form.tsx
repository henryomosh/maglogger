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
import { createRequest, updateRequest } from "@/lib/actions";
import { Textarea } from "@/components/ui/textarea";
import { fetchStaff } from "@/lib/data";

interface RequestFormProps {
  initialData: any;
  onClose: () => void;
}

const requests = [
  { name: "Emergency", value: "emergency" },
  { name: "Off-Duty", value: "off-duty" },
  { name: "Leave", value: "leave" },
  { name: "Facilitation", value: "facilitation" },
];

const status = [
  { name: "Pending", value: "pending" },
  { name: "Approved", value: "approved" },
  { name: "Declined", value: "declined" },
];

export function RequestForm({ initialData, onClose }: RequestFormProps) {
  const { user } = useAuth();
  const canManageShows = user?.role === "admin" || user?.role === "manager";

  const [selectType, setSelectType] = useState(initialData?.type || "");
  const [selectStatus, setSelectStatus] = useState(
    initialData?.status || "pending"
  );
  const [reason, setReason] = useState(initialData?.reason || "");
  const [startDate, setStartDate] = useState(initialData?.start_date || "");
  const [endDate, setEndDate] = useState(initialData?.end_date || "");
  const [standin, setStandIn] = useState(
    initialData?.stand_in && initialData?.stand_in !== "initial"
      ? initialData?.stand_in
      : ""
  );
  const [notes, setNotes] = useState(initialData?.notes || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData2 = new FormData(e.currentTarget);
    const result = await createRequest(formData2);
    if (result?.success === false) {
      setIsSubmitting(false);
      toast.error(result.message);
    }
    if (result?.success === true) {
      setIsSubmitting(false);
      toast.success("Staff member created successfully!", {});
      onClose();
    }
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData2 = new FormData(e.currentTarget);
    const result = await updateRequest(formData2);
    if (result?.success === false) {
      setIsSubmitting(false);
      toast.error(result.message);
    }
    if (result?.success === true) {
      setIsSubmitting(false);
      toast.success("Staff member Updated successfully!", {});
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
            {" "}
            <Label htmlFor="role" className="font-serif">
              Request Type <span className="text-red-500">*</span>
            </Label>
            <Select
              name="type"
              value={selectType}
              onValueChange={(value) => {
                setSelectType(value);
              }}
              required
            >
              <SelectTrigger className={`border-1 border-blue-500 w-full`}>
                <SelectValue placeholder="Select request" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem className="hidden" value="initial"></SelectItem>
                {requests.map((request, index) => (
                  <SelectItem key={index} value={request.value || `${index}`}>
                    {request.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="role" className="font-serif">
              Reason<span className="text-red-500">*</span>
            </Label>
            <Input
              name="reason"
              className="border border-blue-500"
              value={reason}
              onChange={(e: any) => setReason(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            {" "}
            <Label htmlFor="date" className="font-serif">
              From <span className="text-red-500">*</span>
            </Label>
            <Input
              type="date"
              name="startDate"
              className="border border-blue-500"
              value={startDate}
              onChange={(e: any) => setStartDate(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role" className="font-serif">
              To <span className="text-red-500">*</span>
            </Label>
            <Input
              type="date"
              name="endDate"
              className="border border-blue-500"
              value={endDate}
              onChange={(e: any) => setEndDate(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {/* <div className="space-y-2">
            {" "}
            <Label htmlFor="role" className="font-serif">
              Standin <span className="text-red-500">*</span>
            </Label>
            <Input
              type="text"
              name="standIn"
              className="border border-blue-500"
              value={standin}
              onChange={(e: any) => setStandIn(e.target.value)}
            />
          </div> */}
          <div className="space-y-2">
            {" "}
            <Label htmlFor="role" className="font-serif">
              Stand-In Host
            </Label>
            <Select
              name="standIn"
              value={standin}
              onValueChange={(value) => {
                setStandIn(value);
              }}
              disabled={selectType === "facilitation"}
            >
              <SelectTrigger className={`border-1 border-blue-500 w-full`}>
                <SelectValue placeholder="Select stand-in host" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem className="hidden" value="initial"></SelectItem>
                {staff.map((request: any, index: any) => (
                  <SelectItem key={index} value={request.id || `${index}`}>
                    {request.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
              disabled={!canManageShows}
            >
              <SelectTrigger className={`border-1 border-blue-500 w-full`}>
                <SelectValue placeholder="Select request" />
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
        </div>
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            {" "}
            <Label htmlFor="role" className="font-serif">
              Notes
            </Label>
            <Textarea
              disabled={!canManageShows}
              name="notes"
              className="border border-blue-500"
              value={notes}
              placeholder="Brief descripion on request status..."
              onChange={(e: any) => setNotes(e.target.value)}
              rows={3}
            />
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
              `${initialData ? "Update" : "Add"} Request`
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
