"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Megaphone,
  BoomBox,
  Asterisk,
  MoreVertical,
  Edit,
  Trash,
  OctagonAlert,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { MarketForm } from "@/components/sub-components/market-form";
import { deleteAdvert } from "@/lib/actions";

export function MarketTable({
  adverts,
  schedule,
}: {
  adverts: any;
  schedule: any;
}) {
  const [editingAdvert, setEditingAdvert] = useState<any>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [advertId, setAdvertId] = useState("");

  const getShowName = (id: string) => {
    const item = schedule?.find((show: any) => show.id === id);

    return item?.title;
  };

  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    await deleteAdvert(id);
    toast.warning("Advert Deleted!");
    setIsDeleting(false);
    setIsDeleteDialogOpen(false);
  };

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 ">
        <Dialog
          open={!!editingAdvert}
          onOpenChange={() => setEditingAdvert(null)}
        >
          <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-sans font-bold">
                Edit Advert
              </DialogTitle>
            </DialogHeader>
            <MarketForm
              initialData={editingAdvert}
              onClose={() => setEditingAdvert(null)}
            />
          </DialogContent>
        </Dialog>

        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
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
                  onClick={() => handleDelete(advertId)}
                  className="font-sans font-bold bg-red-600 hover:bg-red-400"
                  disabled={isDeleting}
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </Button>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
        {adverts?.map((item: any, index: any) => (
          <Card className="shadow-sm shadow-green-500 gap-2 pt-3" key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 px-2">
              <CardTitle className=" flex justify-between px-0 w-full">
                <div className="flex gap-2">
                  {" "}
                  <Megaphone className="h-5 w-5  text-yellow-500" />{" "}
                  <p className="text-lg font-serif font-xl font-bold text-purple-700">
                    {item.title}
                  </p>
                </div>
                <div>
                  {" "}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <MoreVertical className="h-4 w-4 cursor-pointer" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setEditingAdvert(item)}>
                        <Edit className="h-4 w-4 mr-2 text-green-600 cursor-pointer" />
                        Edit Advert
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setIsDeleteDialogOpen(true);
                          setAdvertId(item.id);
                        }}
                      >
                        <Trash className="h-4 w-4 mr-2 text-red-600" />
                        Delete Advert
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Badge
                className={`${
                  item.status === "active" ? "bg-green-500" : "bg-red-500"
                }`}
              >
                {item.status}
              </Badge>
              <p className="text-sm text-muted-foreground font-serif py-2">
                Slots: {item.slot}
              </p>

              <div className="flex items-center gap-2 mb-2 border-t pt-2 ">
                <BoomBox className="h-4 w-4 text-cyan-500" />
                <span className="text-xs font-serif font-medium">SHOWS</span>
              </div>
              {item.shows?.map((show: any, index: any) => (
                <p
                  key={index}
                  className="text-xs font-bold flex  items-center py-1"
                >
                  <Asterisk className="text-indigo-500 h-3 w-3 " />{" "}
                  {getShowName(show)}
                </p>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
