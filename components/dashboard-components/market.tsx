"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAuth } from "@/components/auth-provider";
import { MarketForm } from "@/components/sub-components/market-form";
import { MarketTable } from "@/components/sub-components/martket-table";
import { ShieldAlertIcon } from "lucide-react";

export default function Market({
  adverts,
  schedule,
}: {
  adverts: any;
  schedule: any;
}) {
  const { user } = useAuth();
  const canManageSystem = user?.role === "admin";

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  if (!canManageSystem) {
    return (
      <div className="flex items-center justify-center p-4">
        <p className="p-4 rounded-md bg-red-100 text-red-500 text-md flex gap-2 items-center">
          <ShieldAlertIcon className="h-8 w-8" /> You are not allowed to view
          this page
        </p>
      </div>
    );
  }
  return (
    <div>
      <div className="flex items-center p-4 bg-green-500 text-2xl text-white font-bold rounded-lg">
        Advert Management
      </div>
      {/* Dialogues */}
      <div className="py-4">
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="secondary"
              size="sm"
              className="font-sans font-bold cursor-pointer"
            >
              Add Advert
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-sans font-bold">
                Add Advert
              </DialogTitle>
              <DialogDescription className="font-serif">
                Enter advert details
              </DialogDescription>
            </DialogHeader>
            <MarketForm
              onClose={() => setIsAddDialogOpen(false)}
              initialData={null}
            />
          </DialogContent>
        </Dialog>
      </div>
      {/* Tables */}
      <div>
        <MarketTable adverts={adverts} schedule={schedule} />
      </div>
    </div>
  );
}
