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
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "../ui/input";
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
  formatTime,
} from "@/lib/utils";

export default function AttendanceTable({
  filteredAttendance,
}: {
  filteredAttendance: any;
}) {
  const [selectedDate, setSelectedDate] = useState("");

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  const handleSearch = useDebouncedCallback((term) => {
    console.log(`Searching... ${term}`);

    const params = new URLSearchParams(searchParams);

    if (term) {
      params.set("query", term);
      if (term === "all") {
        params.delete("query");
      }
    } else {
      params.delete("query");
    }
    replace(`${pathname}?${params.toString()}`);
  }, 10);

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "on-leave":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  return (
    <>
      <Card className="shadow-sm shadow-green-500">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="font-sans font-bold text-green-500">
                <h1 className="text-lg">Staff attendance today</h1>
                <div className="space-y-2 pt-2">
                  <Label htmlFor="role" className="font-serif">
                    Search by Date:
                  </Label>
                  <Input
                    placeholder="Select Date"
                    type="date"
                    value={selectedDate}
                    onChange={(e) => {
                      setSelectedDate(e.target.value);
                      handleSearch(e.target.value);
                    }}
                    className="font-serif border-2 text-green-500 border-green-400 "
                  />
                </div>
              </CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-serif font-bold">
                      Staff
                    </TableHead>
                    <TableHead className="font-serif font-bold">
                      Status
                    </TableHead>
                    <TableHead className="font-serif font-bold">
                      Log in time
                    </TableHead>
                    <TableHead className="font-serif font-bold">
                      Log out time
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
                    <TableHead className="font-serif font-bold">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAttendance?.map((item: any, index: any) => (
                    <TableRow
                      key={index}
                      className={`${
                        item.name === "henry-admin" ? "hidden" : ""
                      }`}
                    >
                      <TableCell className="font-serif">{item.name} </TableCell>
                      <TableCell className="fonts-serif">
                        {" "}
                        <Badge
                          className={`${getStatusColor(
                            item.status
                          )} font-serif text-xs`}
                        >
                          {item.status.charAt(0).toUpperCase() +
                            item.status.slice(1).replace("-", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-serif">
                        {formatTime(item.login || "")}
                      </TableCell>
                      <TableCell className="font-serif">
                        {formatTime(item.logout || "")}
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
                        {item.clock_out_time ? (
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
                        {formatDateToDateOnly(item.date ?? "")}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
