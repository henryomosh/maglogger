"use client";

import { useState } from "react";
import AttendanceTable from "@/components/sub-components/attendance-table";
import { Clock, LogIn, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "../auth-provider";
import { toast } from "sonner";
import { createAttendance, updateAttendance } from "@/lib/actions";
import { formatDateToLocal } from "@/lib/utils";

export default function Attendance({
  attendance,
  filteredAttendance,
}: {
  attendance: any;
  filteredAttendance: any;
}) {
  const { user }: any = useAuth();
  const isAdmin = user?.role === "admin";
  const [isLoading, setIsLoading] = useState(false);
  const isClockedIn = attendance?.length > 0;
  const isClockedOut = isClockedIn && attendance[0]?.clocked_out ? true : false;

  //WORK TIMER
  const hours = isClockedIn
    ? isClockedOut
      ? String(
          Math.abs(
            new Date(attendance[0]?.clock_out_time).getHours() -
              new Date(attendance[0]?.clock_in_time).getHours(),
          ),
        )
      : String(
          Math.abs(
            new Date().getHours() -
              new Date(attendance[0]?.clock_in_time).getHours(),
          ),
        )
    : "0";
  const minutes = isClockedIn
    ? isClockedOut
      ? String(
          Math.abs(
            new Date(attendance[0]?.clock_out_time).getMinutes() -
              new Date(attendance[0]?.clock_in_time).getMinutes(),
          ),
        )
      : String(
          Math.abs(
            new Date().getMinutes() -
              new Date(attendance[0]?.clock_in_time).getMinutes(),
          ),
        )
    : "0";
  const seconds = isClockedIn
    ? isClockedOut
      ? String(
          Math.abs(
            new Date(attendance[0]?.clock_out_time).getSeconds() -
              new Date(attendance[0]?.clock_in_time).getSeconds(),
          ),
        )
      : String(
          Math.abs(
            new Date().getSeconds() -
              new Date(attendance[0]?.clock_in_time).getSeconds(),
          ),
        )
    : "0";

  // Clock in and out timmer
  const handleClockIn = async () => {
    setIsLoading(true);
    const results = await createAttendance(user?.id);
    if (results?.success) {
      toast.success(results.message);
      setIsLoading(false);
    }
    if (results?.success === false) {
      toast.error(results.message);
      setIsLoading(false);
    }
  };

  const handleClockOut = async () => {
    setIsLoading(true);
    const results = await updateAttendance(attendance[0]?.id ?? "null");
    if (results?.success) {
      toast.success(results.message);
      setIsLoading(false);
    }
    if (results?.success === false) {
      toast.error(results.message);
      setIsLoading(false);
    }
  };
  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-sans font-bold text-blue-500 flex gap-2 items-center">
          <Clock className="h-7 w-7" /> Attendance Tracking
        </h1>
        <p className="text-muted-foreground font-serif mt-1">
          Clock in and out to track your work hours.
        </p>
        {/* Action Buttons */}
        <div className="flex gap-4">
          {isClockedIn ? (
            <Button
              onClick={handleClockOut}
              className="flex-1 h-12 font-sans font-bold text-base bg-red-500 hover:bg-red-600 cursor-pointer"
              size="lg"
              disabled={isLoading || isClockedOut}
            >
              {isLoading ? (
                <div
                  role="status"
                  className="flex items-center justify-center gap-2"
                >
                  <div className="h-7 w-7 animate-spin rounded-full border-2 border-gray-100 border-t-transparent"></div>
                </div>
              ) : (
                <>
                  {" "}
                  <LogOut className="h-5 w-5 mr-2" />
                  {isClockedOut ? "Clocked Out" : "Clock Out"}
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={handleClockIn}
              className="flex-1 h-12 font-sans font-bold text-base bg-green-500 hover:bg-green-600 cursor-pointer"
              size="lg"
              disabled={isLoading || isClockedOut}
            >
              {isLoading ? (
                <div
                  role="status"
                  className="flex items-center justify-center gap-2"
                >
                  <div className="h-7 w-7 animate-spin rounded-full border-2 border-gray-100 border-t-transparent"></div>
                </div>
              ) : (
                <>
                  {" "}
                  <LogIn className="h-5 w-5 mr-2" />
                  Clock In
                </>
              )}
            </Button>
          )}
        </div>
      </div>
      {/* Main Clock In/Out Card */}
      <Card className="border-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            {isClockedIn ? (
              isClockedOut ? (
                <Badge
                  className={`text-lg px-4 py-2 font-serif bg-red-100 text-red-800`}
                >
                  Clocked Out
                </Badge>
              ) : (
                <Badge
                  className={`text-lg px-4 py-2 font-serif bg-green-100 text-green-800`}
                >
                  Clocked In
                </Badge>
              )
            ) : (
              <Badge
                className={`text-lg px-4 py-2 font-serif bg-yellow-100 text-yellow-800`}
              >
                Not Clocked In Today
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Time Display */}
          <div className="text-center space-y-2">
            <div className="text-6xl font-sans font-bold text-indigo-800">
              {hours.padStart(2, "0")}:{minutes.padStart(2, "0")}:
              {seconds.padStart(2, "0")}
            </div>
            <p className="text-indigo-800 font-serif">Time elapsed today</p>
          </div>

          {/* Clock In/Out Details */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-indigo-100">
              <CardContent className="text-center">
                <div className="text-md text-indigo-800 font-serif mb-1">
                  Clock In Time
                </div>
                <div className="text-2xl font-sans font-bold text-indigo-800 ">
                  {isClockedIn
                    ? formatDateToLocal(attendance[0]?.clock_in_time ?? "")
                    : "Not clocked in today"}
                </div>
              </CardContent>
            </Card>
            <Card className="bg-indigo-100">
              <CardContent className=" text-center">
                <div className="text-md text-indigo-800 font-serif mb-1">
                  Clock Out Time
                </div>
                <div className="text-2xl font-sans font-bold text-indigo-800 ">
                  {isClockedOut
                    ? formatDateToLocal(attendance[0]?.clock_out_time ?? "")
                    : "Not clocked out today"}
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
      {/* Table */}
      {isAdmin && <AttendanceTable filteredAttendance={filteredAttendance} />}
    </div>
  );
}
