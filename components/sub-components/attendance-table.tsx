import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "../ui/badge";
import {
  Search,
  SquarePen,
  Trash2,
  Clock3,
  Check,
  CircleX,
} from "lucide-react";
import { useState } from "react";
import {
  useSearchParams,
  usePathname,
  useRouter,
  redirect,
} from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { useAuth } from "@/components/auth-provider";
import {
  formatDateToLocal,
  formatDateToTimeOnly,
  formatDateToDateOnly,
} from "@/lib/utils";

export default function AttendanceTable({
  filteredAttendance,
}: {
  filteredAttendance: any;
}) {
  const getDuration = (item: any) => {
    const startHour = item?.clock_in_time
      ? new Date(item?.clock_in_time)?.getHours()
      : 0;
    const endHour = item?.clock_out_time
      ? new Date(item?.clock_out_time)?.getHours()
      : 0;
    if (item?.clock_out_time) {
      return endHour - startHour;
    }
    return 0;
  };
  return (
    <>
      <Card className="shadow-sm shadow-green-500">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="font-sans font-bold text-green-500">
                Staff attendance today
              </CardTitle>
            </div>
            {/* <div className="flex items-center gap-2">
              <span className="text-sm font-serif text-green-500">Show:</span>
              <Select>
                <SelectTrigger className="w-20 font-serif border-1 border-green-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5" className="font-serif text-green-500">
                    5
                  </SelectItem>
                  <SelectItem value="10" className="font-serif text-green-500">
                    10
                  </SelectItem>
                  <SelectItem value="25" className="font-serif text-green-500">
                    25
                  </SelectItem>
                  <SelectItem value="50" className="font-serif text-green-500">
                    50
                  </SelectItem>
                </SelectContent>
              </Select>
              <span className="text-sm font-serif text-green-500">
                per page
              </span>
            </div> */}
          </div>
        </CardHeader>
        <CardContent>
          {1 > 0 ? (
            <div className="space-y-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-serif font-bold">
                        Staff
                      </TableHead>
                      <TableHead className="font-serif font-bold">
                        Clock In
                      </TableHead>
                      <TableHead className="font-serif font-bold">
                        Clock Out
                      </TableHead>
                      <TableHead className="font-serif font-bold">
                        Duration
                      </TableHead>
                      <TableHead className="font-serif font-bold">
                        Date
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAttendance?.map((item: any, index: any) => (
                      <TableRow key={index}>
                        {" "}
                        <TableCell className="font-serif">
                          {item.name}
                        </TableCell>
                        <TableCell className="font-serif">
                          {item.clock_in_time ? (
                            formatDateToTimeOnly(item.clock_in_time ?? "")
                          ) : (
                            <Badge className="font-serif text-xs bg-red-500 text-white">
                              <CircleX className="h-6 w-6" /> Not clocked in
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="font-serif">
                          {item.clock_in_time ? (
                            formatDateToTimeOnly(item.clock_out_time ?? "")
                          ) : (
                            <Badge className="font-serif text-xs bg-yellow-200 text-default">
                              <Clock3 className="h-4 w-4" /> Not clocked out
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="font-serif">
                          {getDuration(item)} hours
                        </TableCell>
                        <TableCell className="font-serif">
                          {item?.created
                            ? formatDateToDateOnly(item?.created ?? "")
                            : "Nill"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-sans font-bold text-lg mb-2">
                No Requests found
              </h3>
              <p className="text-muted-foreground font-serif">
                Try adjusting your search criteria or filters
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
