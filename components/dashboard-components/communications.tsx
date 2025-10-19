"use client";

import { useState } from "react";
import { Nfc } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CommuncationForm } from "@/components/sub-components/communication-form";
import CommunicationThread from "@/components/sub-components/communication-thread";

export default function Communications({ messages }: { messages: any }) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-sans font-bold  flex gap-2 text-blue-500">
        <Nfc className=" h-8 w-8 fill-blue-500" /> Communication
      </h1>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-muted-foreground font-serif mt-1">
            Internal team communication
          </p>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="success"
              className="font-sans font-bold cursor-pointer"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Message
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-sans font-bold">
                New Message
              </DialogTitle>
            </DialogHeader>
            <CommuncationForm
              initialData={null}
              onClose={() => setIsAddDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
      <div>
        <CommunicationThread messages={messages} />
      </div>
    </div>
  );
}
