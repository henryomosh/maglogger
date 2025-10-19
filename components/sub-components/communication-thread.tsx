"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "../ui/badge";
import { useAuth } from "../auth-provider";
import { formatDateToLocal } from "@/lib/utils";
import { MailOpen, Mail, Trash, Edit, OctagonAlert } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { updateCommunicationStatus, deleteCommunication } from "@/lib/actions";
import { CommuncationForm } from "./communication-form";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Item } from "@radix-ui/react-dropdown-menu";

export default function CommunicationThread({ messages }: { messages: any }) {
  const { user } = useAuth();
  const systemManager = user?.role === "admin";

  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [detailsModal, setDetailsModal] = useState<any>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [communicationId, setCommunicationId] = useState("");

  const isReadObj = (id: string) => {
    const com = messages?.find((item: any) => item.id === id);
    const usr = com?.user_status?.find((item: any) => item.id === user?.id);
    return usr;
  };

  const handleStatusUpdate = async (id: string) => {
    const results = await updateCommunicationStatus(id, String(user?.id));
  };

  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    await deleteCommunication(id);
    toast.warning("Item Deleted!");
    setIsDeleting(false);
    setIsDeleteDialogOpen(false);
  };

  return (
    <div>
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-sans font-bold">
              New Message
            </DialogTitle>
          </DialogHeader>
          <CommuncationForm
            initialData={detailsModal}
            onClose={() => setIsEditDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
      <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-sans font-bold">Details</DialogTitle>
          </DialogHeader>
          <div className="border border-2 rounded rounded-md p-4 border-indigo-500">
            <div className="flex items-center gap-2 mb-1 pb-4">
              <p className="font-sans font-bold text-sm">
                {detailsModal?.sender_name}
              </p>
              <p className="text-xs opacity-70 font-serif">
                {detailsModal?.created
                  ? formatDateToLocal(detailsModal?.created)
                  : ""}
              </p>
            </div>
            <p className="text-sm py-2 text-gray-600 border-t border-b">
              <strong>Subject: </strong>
              {detailsModal?.subject}
            </p>
            <p className="py-4 text-xs">{detailsModal?.content}</p>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-sans font-bold">
              <div className="flex gap-4">
                <OctagonAlert className="h-10 w-10 text-red-600" /> Are your
                sure you want to delete this item?
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
                onClick={() => handleDelete(communicationId)}
                className="font-sans font-bold bg-red-600 hover:bg-red-400 cursor-pointer"
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      {/* Message Thread */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="font-sans font-bold">Messages</CardTitle>
          <CardDescription className="font-serif"></CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Messages */}
            <div className="space-y-4 max-h-[400px] overflow-y-auto p-2 border rounded-lg">
              <div className={``}>
                {messages?.map((item: any, index: any) => (
                  <div
                    className={`max-w-[100%] rounded-lg p-3 bg-blue-100 text-default-foreground mb-2 cursor-pointer hover:bg-blue-200`}
                    key={index}
                    onClick={() => {
                      handleStatusUpdate(item?.id);
                      setIsDetailsModalOpen(true);
                      setDetailsModal(item);
                    }}
                  >
                    <div className="flex justify-between">
                      {" "}
                      <div className="flex items-center gap-2 mb-1">
                        <p
                          className={`font-sans font-bold text-sm ${
                            systemManager ? "text-green-700" : "text-indigo-700"
                          }`}
                        >
                          {item.sender_name}
                        </p>
                        <p className="text-xs opacity-70 font-serif">
                          {formatDateToLocal(item.created)}
                        </p>
                      </div>
                      {!isReadObj(item.id)?.read &&
                        item.sender_id !== user?.id && (
                          <Badge
                            variant="destructive"
                            className="mb-4 flex items-center justify-center p-0 text-xs"
                          >
                            Unread
                          </Badge>
                        )}
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-sm font-serif">
                        {item.subject?.split(" ")?.splice(0, 6)?.join(" ")}.....
                      </p>
                      <div className="flex gap-4">
                        {isReadObj(item.id)?.read ? (
                          <MailOpen className="h-5 w-5 text-indigo-500 hover:text-indigo-600" />
                        ) : (
                          <Mail
                            className="h-5 w-5 text-indigo-500 hover:text-indigo-600"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStatusUpdate(item?.id);
                            }}
                          />
                        )}
                        {systemManager && (
                          <Edit
                            className="h-5 w-5 text-green-500 hover:text-green-600"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDetailsModal(item);
                              setIsEditDialogOpen(true);
                            }}
                          />
                        )}
                        {systemManager && (
                          <Trash
                            className="h-5 w-5 text-red-500 hover:text-red-600"
                            onClick={(e) => {
                              e.stopPropagation();
                              setCommunicationId(item.id);
                              setIsDeleteDialogOpen(true);
                            }}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {messages?.length < 1 && (
                  <div className="h-10 flex items-center justify-center text-md">
                    No messages
                  </div>
                )}
              </div>
            </div>

            {/* Reply Input */}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
