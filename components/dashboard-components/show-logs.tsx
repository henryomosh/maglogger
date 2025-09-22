"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ShowLogsForm } from "@/components/sub-components/show-logs-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Search,
  Calendar,
  Music,
  Mic,
  AlertTriangle,
  Phone,
  MessageSquare,
  Download,
  Plus,
  Eye,
  LayoutGrid,
  List,
  ChevronLeft,
  ChevronRight,
  SquarePen,
  Trash2,
  ListCheck,
  ContactRound,
  FileText,
  AlarmClock,
  OctagonAlert,
  Trash,
  Edit,
  MoreVertical,
  Clock3,
  Check,
  CircleX,
  ShieldAlert,
} from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { fetchUserSchedule, fetchLogs } from "@/lib/data";
import { deleteLog } from "@/lib/actions";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
interface ShowLog {
  id: string;
  showId: string;
  showTitle: string;
  djName: string;
  timestamp: string;
  type:
    | "song"
    | "announcement"
    | "technical"
    | "listener_call"
    | "commercial"
    | "weather"
    | "traffic"
    | "news";
  content: string;
  metadata?: {
    artist?: string;
    duration?: string;
    caller?: string;
    severity?: "low" | "medium" | "high";
    sponsor?: string;
  };
}

interface ModalLogsDetails {
  start_time: any;
  end_time: any;
  description: any;
  guest_name: any;
  topic: any;
  phone: any;
}
const mockLogs: ShowLog[] = [
  {
    id: "1",
    showId: "show-1",
    showTitle: "Morning Drive",
    djName: "Mike DJ",
    timestamp: "2024-01-15T08:15:00Z",
    type: "song",
    content: "Played: Blinding Lights",
    metadata: { artist: "The Weeknd", duration: "3:20" },
  },
  {
    id: "2",
    showId: "show-1",
    showTitle: "Morning Drive",
    djName: "Mike DJ",
    timestamp: "2024-01-15T08:18:30Z",
    type: "announcement",
    content:
      "Traffic update for Highway 101 - expect delays due to construction",
  },
  {
    id: "3",
    showId: "show-2",
    showTitle: "Afternoon Vibes",
    djName: "Sarah DJ",
    timestamp: "2024-01-15T14:22:00Z",
    type: "listener_call",
    content: "Caller requested song dedication",
    metadata: { caller: "Jenny from downtown" },
  },
  {
    id: "4",
    showId: "show-1",
    showTitle: "Morning Drive",
    djName: "Mike DJ",
    timestamp: "2024-01-15T08:45:00Z",
    type: "technical",
    content: "Microphone audio levels adjusted",
    metadata: { severity: "low" },
  },
  {
    id: "5",
    showId: "show-3",
    showTitle: "Evening Jazz",
    djName: "Tom DJ",
    timestamp: "2024-01-15T19:30:00Z",
    type: "commercial",
    content: "Played 30-second ad for Local Coffee Shop",
    metadata: { sponsor: "Local Coffee Shop", duration: "0:30" },
  },
  {
    id: "6",
    showId: "show-2",
    showTitle: "Afternoon Vibes",
    djName: "Sarah DJ",
    timestamp: "2024-01-15T15:10:00Z",
    type: "weather",
    content: "Weather update: Sunny, 75°F, light winds from the west",
  },
];

const logTypeConfig = {
  song: { icon: Music, color: "bg-blue-500", label: "Song" },
  announcement: { icon: Mic, color: "bg-green-500", label: "Announcement" },
  technical: { icon: AlertTriangle, color: "bg-red-500", label: "Technical" },
  listener_call: {
    icon: Phone,
    color: "bg-purple-500",
    label: "Listener Call",
  },
  commercial: {
    icon: MessageSquare,
    color: "bg-orange-500",
    label: "Commercial",
  },
  weather: { icon: Calendar, color: "bg-cyan-500", label: "Weather" },
  traffic: { icon: Calendar, color: "bg-yellow-500", label: "Traffic" },
  news: { icon: MessageSquare, color: "bg-indigo-500", label: "News" },
};

const logStatus = {
  pending: "pending",
  approved: "approved",
  declined: "declined",
};

export function ShowLogs({
  schedule,
  showLogs,
}: {
  schedule: any;
  showLogs: any;
}) {
  const { user } = useAuth();
  const [logs, setLogs] = useState<ShowLog[]>(mockLogs);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterShow, setFilterShow] = useState<string>("all");
  const [selectedDate, setSelectedDate] = useState("");
  const [isAddLogOpen, setIsAddLogOpen] = useState(false);
  const [isLogDetailsOpen, setIsDetailsLogOpen] = useState(false);
  const [editingLog, setEditingLog] = useState(null);
  const [modalLogDetails, setModalLogsDetails] = useState({
    title: "",
    name: "",
    segments: [],
    guests: [],
    start: "",
    ends: "",
  });
  const [viewMode, setViewMode] = useState<"cards" | "table">("table");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [newLog, setNewLog] = useState({
    showId: "",
    showTitle: "",
    type: "announcement" as ShowLog["type"],
    content: "",
    metadata: {},
  });
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [logId, setLogId] = useState("");

  const canManageShows = user?.role === "admin" || user?.role === "manager";

  const uniqueShows = Array.from(new Set(logs.map((log) => log.showTitle)));

  const filteredUserLogs = canManageShows
    ? showLogs
    : showLogs.filter((item: any) => {
        return item.staff === user?.id;
      });

  const filteredLogs1 = filteredUserLogs?.filter((log: any) => {
    const matchesSearch =
      log.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.start.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.ends.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.status.toLowerCase().includes(searchTerm.toLowerCase());

    const timestamp = log.created;
    const matchesStatus = filterType === "all" || log.status === filterType;
    const matchesShow = filterShow === "all" || log.title === filterShow;

    const matchesDate = !selectedDate || timestamp.startsWith(selectedDate);

    return matchesSearch && matchesStatus && matchesShow && matchesDate;
  });
  const filteredLogs = filteredLogs1.sort(
    (a: any, b: any) =>
      new Date(b.created).getTime() - new Date(a.created).getTime()
  );

  const groupedLogs = filteredLogs.reduce((groups: any, log: any) => {
    const date = new Date(log.timestamp).toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(log);
    return groups;
  }, {} as Record<string, ShowLog[]>);

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString();
  };

  const exportLogs = () => {
    const csvContent = [
      [
        "Created",
        "Show",
        "Presenter",
        "Segments",
        "Guests",
        "Show Starts",
        "Show Ends",
      ].join(","),
      ...filteredLogs.map((log: any) =>
        [
          formatDate(log.created),
          log.title,
          log.name,
          log.segments.length,
          log.guests.length,
          log.start,
          log.ends,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `radio-show-logs-${
      new Date().toISOString().split("T")[0]
    }.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedLogs = filteredLogs.slice(startIndex, endIndex);

  const handleFilterChange = (filterFn: () => void) => {
    filterFn();
    setCurrentPage(1);
  };

  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    await deleteLog(id);
    toast.warning("Log Deleted!");
    setIsDeleting(false);
    setIsDeleteDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-sans font-bold text-foreground">
            Show Logs
          </h1>
          <p className="text-muted-foreground font-serif mt-1">
            Comprehensive activity logs from all radio shows
          </p>
        </div>
        <div className="flex gap-2">
          <div className="flex border rounded-lg">
            <Button
              variant={viewMode === "cards" ? "success" : "ghost"}
              size="sm"
              onClick={() => setViewMode("cards")}
              className="rounded-r-none font-serif "
            >
              <LayoutGrid className="h-4 w-4 mr-2" />
              Cards
            </Button>
            <Button
              variant={viewMode === "table" ? "success" : "ghost"}
              size="sm"
              onClick={() => setViewMode("table")}
              className="rounded-l-none font-serif"
            >
              <List className="h-4 w-4 mr-2" />
              Table
            </Button>
          </div>
          <Button
            onClick={exportLogs}
            variant="outline"
            className="font-serif bg-transparent hover:bg-green-600"
          >
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          {(user?.role === "admin" ||
            user?.role === "manager" ||
            user?.role === "staff") && (
            <Dialog open={isAddLogOpen} onOpenChange={setIsAddLogOpen}>
              <DialogTrigger asChild>
                <Button variant="success" className="font-serif">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Log Entry
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="font-sans font-bold text-xl">
                    Add Log Entry
                  </DialogTitle>
                  <DialogDescription className="font-serif">
                    Record a new activity for a radio show
                  </DialogDescription>
                </DialogHeader>
                <ShowLogsForm
                  initialData={editingLog}
                  onClose={() => setIsAddLogOpen(false)}
                />
              </DialogContent>
            </Dialog>
          )}
          <Dialog open={isLogDetailsOpen} onOpenChange={setIsDetailsLogOpen}>
            <DialogTrigger asChild></DialogTrigger>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-start gap-2 font-sans font-bold text-xl">
                  <div className={`p-2 rounded-full bg-cyan-500 text-white`}>
                    <FileText className="h-4 w-4" />
                  </div>
                  Log Details
                </DialogTitle>
                <DialogDescription className="font-serif"></DialogDescription>
              </DialogHeader>
              <div className="flex gap-4 pb-2">
                <div className="space-y-3">
                  <div className="flex items-start gap-4 ">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-sans font-bold text-md">
                          {modalLogDetails?.title}
                        </span>
                        <span className="text-sm text-muted-foreground font-serif">
                          with {modalLogDetails.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mb-1">
                        <AlarmClock className="h-4 w-4 text-indigo-400" />
                        <span className="text-sm text-muted-foreground font-serif">
                          {modalLogDetails.start}
                        </span>
                        <span className="text-sm text-muted-foreground font-serif">
                          -
                        </span>
                        <span className="text-sm text-muted-foreground font-serif">
                          {modalLogDetails.ends}
                        </span>
                      </div>
                      <hr />
                      <h1 className="font-serif font-bold pt-2">Segments</h1>
                      <div className="flex gap-4 pb-2">
                        <div>
                          {modalLogDetails.segments ? (
                            modalLogDetails.segments.map(
                              (item: any, index: any) => (
                                <div className="flex gap-6" key={index}>
                                  <div className="mt-2 flex gap-2">
                                    <ListCheck className="h-4 w-4 text-green-500" />
                                    <p className="text-xs font-serif text-foreground">
                                      <strong>Start Time: </strong>
                                      {item?.startTime}{" "}
                                    </p>
                                  </div>
                                  <div className="mt-2 flex flex-wrap gap-2">
                                    <p className="text-xs font-serif text-foreground">
                                      <strong>End Time: </strong>
                                      {item?.endTime}
                                    </p>
                                  </div>
                                  <div
                                    className="mt-2 flex flex-wrap gap-2"
                                    key={index}
                                  >
                                    <p className="text-xs font-serif text-foreground">
                                      <strong>Description: </strong>{" "}
                                      {item?.description}
                                    </p>
                                  </div>
                                </div>
                              )
                            )
                          ) : (
                            <p className="text-sm font-serif text-foreground">
                              No segments
                            </p>
                          )}
                        </div>
                      </div>
                      <hr />
                      <h1 className="font-serif font-bold pt-2">Guests</h1>
                      <div className=" ">
                        {modalLogDetails?.guests.length > 0 ? (
                          modalLogDetails.guests.map(
                            (item: any, index: any) => (
                              <div
                                className="flex justify-start gap-6"
                                key={index}
                              >
                                <div className="mt-2 flex  gap-2">
                                  <ContactRound className="h-4 w-4 text-purple-500" />
                                  <p className="text-xs font-serif text-foreground">
                                    <strong>Name: </strong>
                                    {item?.guestName}{" "}
                                  </p>
                                </div>
                                <div className="mt-2 flex flex-wrap gap-2">
                                  <p className="text-xs font-serif text-foreground">
                                    <strong>Topic: </strong>
                                    {item?.topic}
                                  </p>
                                </div>
                                <div className="mt-2 flex flex-wrap gap-2">
                                  <p className="text-xs font-serif text-foreground">
                                    <strong>Phone: </strong> {item?.phone}
                                  </p>
                                </div>
                              </div>
                            )
                          )
                        ) : (
                          <p className="text-sm font-serif text-foreground">
                            No guests
                          </p>
                        )}
                      </div>

                      <div className="mt-2 flex flex-wrap gap-2"></div>
                    </div>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          {/* Edit Logs */}
          {editingLog && (
            <Dialog
              open={!!editingLog}
              onOpenChange={() => setEditingLog(null)}
            >
              <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="font-sans font-bold">
                    Edit Show Log
                  </DialogTitle>
                  <DialogDescription className="font-serif"></DialogDescription>
                </DialogHeader>
                <ShowLogsForm
                  initialData={editingLog}
                  onClose={() => setEditingLog(null)}
                />
              </DialogContent>
            </Dialog>
          )}
          {/* Delete Log */}
          {logId && (
            <Dialog
              open={isDeleteDialogOpen}
              onOpenChange={setIsDeleteDialogOpen}
            >
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="font-sans font-bold">
                    <div className="flex gap-4">
                      <OctagonAlert className="h-10 w-10 text-red-600" /> Are
                      your sure you want to delete this log?
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
                      onClick={() => handleDelete(logId)}
                      className="font-sans font-bold bg-red-600 hover:bg-red-400"
                      disabled={isDeleting}
                    >
                      {isDeleting ? "Deleting..." : "Delete"}
                    </Button>
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="font-sans font-bold">Filter Logs</CardTitle>
          <CardDescription className="font-serif">
            Search and filter show activity logs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 font-serif border-1 border-blue-400"
              />
            </div>
            <Select
              value={filterType}
              onValueChange={(value) =>
                handleFilterChange(() => setFilterType(value))
              }
            >
              <SelectTrigger className="font-serif border-1 border-blue-400">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="font-serif">
                  All status
                </SelectItem>
                {Object.entries(logStatus).map(([key, config]) => (
                  <SelectItem key={key} value={key} className="font-serif">
                    {config}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={filterShow}
              onValueChange={(value) =>
                handleFilterChange(() => setFilterShow(value))
              }
            >
              <SelectTrigger className="font-serif border-1 border-blue-400">
                <SelectValue placeholder="Filter by show" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="font-serif">
                  All Shows
                </SelectItem>
                {showLogs.map((log: any) => (
                  <SelectItem
                    key={log.id}
                    value={log.title}
                    className="font-serif"
                  >
                    {log.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) =>
                handleFilterChange(() => setSelectedDate(e.target.value))
              }
              className="font-serif border-1 border-blue-400"
            />
          </div>
        </CardContent>
      </Card>

      {/* Logs Display */}
      {viewMode === "cards" ? (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-sans font-bold flex items-center gap-2">
                <Calendar className="h-5 w-5" />
              </CardTitle>
              <CardDescription className="font-serif">
                {filteredLogs.length} log entries
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredLogs.map((log: any) => {
                  return (
                    <div
                      key={log.id}
                      className="flex items-start gap-4 p-4 border rounded-lg"
                    >
                      <div
                        className={`p-2 rounded-full bg-cyan-500 text-white hidden md:block`}
                      >
                        <FileText className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-sans font-bold text-sm">
                              {log.title}
                            </span>
                            <span className="text-sm text-muted-foreground font-serif">
                              with {log.name}
                            </span>
                          </div>
                          <div className="flex gap-4">
                            <div>
                              {log?.status === "pending" && (
                                <Badge className="font-serif text-xs bg-yellow-200 text-default">
                                  <Clock3 className="h-4 w-4" /> Pending
                                </Badge>
                              )}
                              {log?.status === "declined" && (
                                <Badge className="font-serif text-xs bg-red-500 text-white">
                                  <CircleX className="h-6 w-6" /> Declined
                                </Badge>
                              )}
                              {log?.status === "approved" && (
                                <Badge className="font-serif text-xs bg-green-500 text-white">
                                  <Check className="h-6 w-6" /> Aproved
                                </Badge>
                              )}
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <MoreVertical className="h-4 w-4" />
                              </DropdownMenuTrigger>
                              <DropdownMenuContent
                                align="end"
                                className="bg-blue-50"
                              >
                                <DropdownMenuItem
                                  onClick={() => setEditingLog(log)}
                                >
                                  <Edit className="h-4 w-4 mr-2 text-green-600" />
                                  Edit Log
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => {
                                    setLogId(log.id);
                                    setIsDeleteDialogOpen(true);
                                  }}
                                >
                                  <Trash className="h-4 w-4 mr-2 text-red-600" />
                                  Delete Log
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mb-1">
                          <AlarmClock className="h-4 w-4 text-indigo-400" />
                          <span className="text-sm text-muted-foreground font-serif">
                            {log.start}
                          </span>
                          <span className="text-sm text-muted-foreground font-serif">
                            -
                          </span>
                          <span className="text-sm text-muted-foreground font-serif">
                            {log.ends}
                          </span>
                        </div>
                        <hr />
                        <h1 className="font-serif font-bold pt-2">Segments</h1>
                        <div className="flex gap-4 pb-2">
                          <div>
                            {log.segments.length > 0 ? (
                              log.segments.map((item: any, index: any) => (
                                <div className="flex gap-6" key={index}>
                                  <div className="mt-2 flex gap-2">
                                    <ListCheck className="h-4 w-4 text-green-500" />
                                    <p className="text-xs font-serif text-foreground">
                                      <strong>Start Time: </strong>
                                      {item?.startTime}{" "}
                                    </p>
                                  </div>
                                  <div className="mt-2 flex flex-wrap gap-2">
                                    <p className="text-xs font-serif text-foreground">
                                      <strong>End Time: </strong>
                                      {item?.endTime}
                                    </p>
                                  </div>
                                  <div
                                    className="mt-2 flex flex-wrap gap-2"
                                    key={index}
                                  >
                                    <p className="text-xs font-serif text-foreground">
                                      <strong>Description: </strong>{" "}
                                      {item?.description}
                                    </p>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <p className="text-sm font-serif text-foreground">
                                No segments
                              </p>
                            )}
                          </div>
                        </div>
                        <hr />
                        <h1 className="font-serif font-bold pt-2">Guests</h1>
                        <div className=" ">
                          {log.guests.lenghth > 0 ? (
                            log.guests.map((item: any, index: any) => (
                              <div
                                className="flex justify-start gap-6"
                                key={index}
                              >
                                <div className="mt-2 flex   gap-2">
                                  <ContactRound className="h-4 w-4 text-purple-500" />
                                  <p className="text-xs font-serif text-foreground">
                                    <strong>Name: </strong>
                                    {item?.guestName}{" "}
                                  </p>
                                </div>
                                <div className="mt-2 flex flex-wrap gap-2">
                                  <p className="text-xs font-serif text-foreground">
                                    <strong>Topic: </strong>
                                    {item?.topic}
                                  </p>
                                </div>
                                <div className="mt-2 flex flex-wrap gap-2">
                                  <p className="text-xs font-serif text-foreground">
                                    <strong>Phone: </strong> {item?.phone}
                                  </p>
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className="text-sm font-serif text-foreground">
                              No guests
                            </p>
                          )}
                        </div>

                        <div className="mt-2 flex flex-wrap gap-2"></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {showLogs.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-sans font-bold text-lg mb-2">
                  No logs found
                </h3>
                <p className="text-muted-foreground font-serif">
                  Try adjusting your search criteria or filters
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      ) : (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="font-sans font-bold">
                  Radio Show Logs Table
                </CardTitle>
                <CardDescription className="font-serif">
                  {filteredLogs.length} log entries in table format
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-serif text-muted-foreground">
                  Show:
                </span>
                <Select
                  value={itemsPerPage.toString()}
                  onValueChange={(value) => {
                    setItemsPerPage(Number(value));
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger className="w-20 font-serif">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5" className="font-serif">
                      5
                    </SelectItem>
                    <SelectItem value="10" className="font-serif">
                      10
                    </SelectItem>
                    <SelectItem value="25" className="font-serif">
                      25
                    </SelectItem>
                    <SelectItem value="50" className="font-serif">
                      50
                    </SelectItem>
                  </SelectContent>
                </Select>
                <span className="text-sm font-serif text-muted-foreground">
                  per page
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredLogs.length > 0 ? (
              <div className="space-y-4">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="font-serif font-bold">
                          Show
                        </TableHead>
                        <TableHead className="font-serif font-bold">
                          Presenter
                        </TableHead>
                        <TableHead className="font-serif font-bold">
                          Segments
                        </TableHead>
                        <TableHead className="font-serif font-bold">
                          Guests
                        </TableHead>
                        <TableHead className="font-serif font-bold">
                          Status
                        </TableHead>

                        <TableHead className="font-serif font-bold">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedLogs.map((log: any) => {
                        // const config = logTypeConfig[log.type];
                        // const IconComponent = config.icon;

                        return (
                          <TableRow key={log.id}>
                            <TableCell className="font-serif">
                              {log.title || ""}
                            </TableCell>
                            <TableCell className="font-serif">
                              {log.name}
                            </TableCell>
                            <TableCell className="font-serif">
                              {log?.segments.length || 0}
                            </TableCell>
                            <TableCell className="font-sans font-bold">
                              {log?.guests.length || 0}
                            </TableCell>
                            <TableCell className="font-serif">
                              {" "}
                              {log?.status === "pending" && (
                                <Badge className="font-serif text-xs bg-yellow-200 text-default">
                                  <Clock3 className="h-4 w-4" /> Pending
                                </Badge>
                              )}
                              {log?.status === "declined" && (
                                <Badge className="font-serif text-xs bg-red-500 text-white">
                                  <CircleX className="h-6 w-6" /> Declined
                                </Badge>
                              )}
                              {log?.status === "approved" && (
                                <Badge className="font-serif text-xs bg-green-500 text-white">
                                  <Check className="h-6 w-6" /> Aproved
                                </Badge>
                              )}
                            </TableCell>

                            <TableCell className="font-serif max-w-xs">
                              <div className="flex items-center gap-3">
                                <button
                                  onClick={() => {
                                    setModalLogsDetails(log);

                                    setIsDetailsLogOpen(true);
                                  }}
                                >
                                  <div className="p-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white">
                                    <Eye className="h-4 w-4" />
                                  </div>
                                </button>
                                <button onClick={() => setEditingLog(log)}>
                                  <div className="p-1 rounded-lg bg-green-600 hover:bg-green-500 text-white">
                                    <SquarePen className="h-4 w-4" />
                                  </div>
                                </button>
                                <button
                                  onClick={() => {
                                    setLogId(log.id);
                                    setIsDeleteDialogOpen(true);
                                  }}
                                >
                                  <div className="p-1 rounded-lg bg-red-600 hover:bg-red-500 text-white">
                                    <Trash2 className="h-4 w-4" />
                                  </div>
                                </button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground font-serif">
                      Showing {startIndex + 1} to{" "}
                      {Math.min(endIndex, filteredLogs.length)} of{" "}
                      {filteredLogs.length} entries
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="font-serif"
                      >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Previous
                      </Button>
                      <div className="flex items-center gap-1">
                        {Array.from(
                          { length: totalPages },
                          (_, i) => i + 1
                        ).map((page) => (
                          <Button
                            key={page}
                            variant={
                              currentPage === page ? "default" : "outline"
                            }
                            size="sm"
                            onClick={() => setCurrentPage(page)}
                            className="w-8 h-8 p-0 font-serif"
                          >
                            {page}
                          </Button>
                        ))}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="font-serif"
                      >
                        Next
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-sans font-bold text-lg mb-2">
                  No logs found
                </h3>
                <p className="text-muted-foreground font-serif">
                  Try adjusting your search criteria or filters
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
