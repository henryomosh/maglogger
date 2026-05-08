"use client";

import { createAttendance, updateAttendance } from "@/lib/actions";
import { toast } from "sonner";
import { useAuth } from "@/components/auth-provider";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LogIn, LogOut } from "lucide-react";

export default function DashboardAttendance({
  attendance,
}: {
  attendance: any;
}) {
  const { user }: any = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const isClockedIn = attendance?.length > 0;
  const isClockedOut = !!(isClockedIn && attendance[0]?.clocked_out);

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
    <div className="flex gap-4 w-full md:w-80">
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
  );
}
