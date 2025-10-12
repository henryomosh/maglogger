"use client";

import { useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Siren,
  Armchair,
  CalendarClock,
  Coins,
  CoinsIcon,
  Hourglass,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { RequestForm } from "@/components/sub-components/request-form";
import { RequestsTable } from "@/components/sub-components/requests-table";

export function Requests({
  requests,
  totalPages,
  totalRequests,
  totalCurentUserRequests,
  totalCurentUserPages,
  dashboard,
}: {
  requests: any;
  totalPages: any;
  totalRequests: any;
  totalCurentUserRequests: any;
  totalCurentUserPages: any;
  dashboard: any;
}) {
  const { user } = useAuth();

  const canManageShows = user?.role === "admin" || user?.role === "manager";

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-sans font-bold  flex gap-2 text-blue-500">
        <Hourglass className=" h-8 w-8 fill-blue-500" /> Requests Page
      </h1>
      {/* STATS */}
      {!canManageShows && (
        <div className={`grid gap-4 md:grid-cols-2 lg:grid-cols-4 `}>
          <div className="rounded rounded-2xl pl-1 bg-red-700">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-md font-serif font-medium">
                  Emeregency Cases
                </CardTitle>
                <Siren className="'h-6 w-6 text-red-700" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-sans font-bold text-red-700">
                  {dashboard?.emergency[0]?.count}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="rounded rounded-2xl pl-1 bg-cyan-700">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-md font-serif font-medium">
                  Off-Duty
                </CardTitle>
                <Armchair className="h-6 w-6 text-cyan-700" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-sans font-bold text-cyan-700">
                  {dashboard?.offDuty[0]?.count}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="rounded rounded-2xl pl-1 bg-yellow-500">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-md font-serif font-medium">
                  Leave
                </CardTitle>
                <CalendarClock className="h-6 w-6 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-sans font-bold text-yellow-500">
                  {dashboard?.leave[0]?.count}
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="rounded rounded-2xl pl-1 bg-pink-500">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-md font-serif font-medium">
                  Faciliation
                </CardTitle>
                <CoinsIcon className="h-6 w-6 text-pink-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-sans font-bold text-pink-500">
                  {dashboard?.facilitation[0]?.count}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-muted-foreground font-serif mt-1">
            Make requests to the adminsitration.
          </p>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="success" className="font-sans font-bold">
              <Plus className="h-4 w-4 mr-2" />
              Add Request
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-sans font-bold">
                Add Request
              </DialogTitle>
              <DialogDescription className="font-serif">
                Enter request details
              </DialogDescription>
            </DialogHeader>
            <RequestForm
              onClose={() => setIsAddDialogOpen(false)}
              initialData={null}
            />
            {/* <StaffForm
              onClose={() => setIsAddDialogOpen(false)}
              onSave={(newStaff) => {
                setStaff([
                  ...staff,
                  { ...newStaff, id: Date.now().toString() },
                ]);
                setIsAddDialogOpen(false);
              }}
            /> */}
          </DialogContent>
        </Dialog>
        {/* <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
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
                  onClick={() => handleDelete(staffId)}
                  className="font-sans font-bold bg-red-600 hover:bg-red-400"
                  disabled={isDeleting}
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </Button>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog> */}
      </div>
      {/* TABLE */}
      <RequestsTable
        requests={requests}
        totalPages={totalPages}
        totalRequests={totalRequests}
        totalCurentUserRequests={totalCurentUserRequests}
        totalCurentUserPages={totalCurentUserPages}
      />
    </div>
  );
}
