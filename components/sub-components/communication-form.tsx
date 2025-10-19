"use client";

import { useState, useEffect } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { createCommunication, updateCommunication } from "@/lib/actions";
import { fetchCommunicationUsers } from "@/lib/data";
import { useAuth } from "../auth-provider";

interface FormProps {
  initialData: any;
  onClose: () => void;
}
export function CommuncationForm({ initialData, onClose }: FormProps) {
  const { user } = useAuth();
  const [subject, setSubject] = useState(initialData?.subject ?? "");
  const [content, setContent] = useState(initialData?.content ?? "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [users, setUsers] = useState<any>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const usersData: any = await fetchCommunicationUsers();

        setUsers(usersData);
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
    formData2.append("user_status", JSON.stringify(users));
    const result = await createCommunication(formData2);

    if (result?.success === false) {
      setIsSubmitting(false);
      toast.error(result.message);
    }
    if (result?.success === true) {
      setIsSubmitting(false);
      toast.success("Message created successfully!");
      onClose();
    }
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData2 = new FormData(e.currentTarget);
    const result = await updateCommunication(formData2);

    if (result?.success === false) {
      setIsSubmitting(false);
      toast.error(result.message);
    }
    if (result?.success === true) {
      setIsSubmitting(false);
      toast.success("Message updated successfully!");
      onClose();
    }
  };

  return (
    <form onSubmit={initialData ? handleUpdate : handleSubmit}>
      <div className="space-y-4 py-4">
        <div className="space-y-2">
          <input
            name="id"
            className="hidden"
            value={initialData?.id}
            readOnly
          />
          <input name="userId" className="hidden" value={user?.id} readOnly />
          <input
            name="userName"
            className="hidden"
            value={user?.name}
            readOnly
          />
          <Label htmlFor="subject" className="font-serif">
            Subject <span className="text-red-500">*</span>
          </Label>
          <Input
            id="subject"
            name="subject"
            placeholder="Message subject..."
            className="font-serif border border-blue-500"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="content" className="font-serif">
            Message
          </Label>
          <Textarea
            name="content"
            id="content"
            placeholder="Type your message..."
            className="min-h-[150px] font-serif border border-blue-500 "
            value={content}
            onChange={(e: any) => setContent(e.target.value)}
          />
        </div>
        <Button
          type="submit"
          className="w-full font-serif bg-green-500 hover:bg-green-400 cursor-pointer"
        >
          <Send className="h-4 w-4 mr-2" />
          {isSubmitting ? (
            <div
              role="status"
              className="flex items-center justify-center gap-2"
            >
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-100 border-t-transparent"></div>
            </div>
          ) : (
            `${initialData ? "Update" : "Send"} Message`
          )}
        </Button>
      </div>
    </form>
  );
}
