//@ts-nocheck
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
} from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { fetchUserSchedule, fetchLogs } from "@/lib/data";

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
  const [modalLogDetails, setModalLogsDetails] = useState<ModalLogsDetails>({
    start_time: {},
    end_time: {},
    description: {},
    guest_name: {},
    topic: {},
    phone: {},
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

  const uniqueShows = Array.from(new Set(logs.map((log) => log.showTitle)));

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.showTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.djName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = filterType === "all" || log.type === filterType;
    const matchesShow = filterShow === "all" || log.showTitle === filterShow;
    const matchesDate = !selectedDate || log.timestamp.startsWith(selectedDate);

    return matchesSearch && matchesType && matchesShow && matchesDate;
  });

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

  const handleAddLog = () => {
    const log: ShowLog = {
      id: Date.now().toString(),
      ...newLog,
      djName: user?.name || "Unknown DJ",
      timestamp: new Date().toISOString(),
    };
    setLogs([log, ...logs]);
    setNewLog({
      showId: "",
      showTitle: "",
      type: "announcement",
      content: "",
      metadata: {},
    });
    setIsAddLogOpen(false);
  };

  const exportLogs = () => {
    const csvContent = [
      ["Date", "Time", "Show", "DJ", "Type", "Content", "Metadata"].join(","),
      ...filteredLogs.map((log) =>
        [
          formatDate(log.timestamp),
          formatTime(log.timestamp),
          log.showTitle,
          log.djName,
          logTypeConfig[log.type].label,
          `"${log.content}"`,
          JSON.stringify(log.metadata || {}),
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
  const paginatedLogs = showLogs.slice(startIndex, endIndex);

  const handleFilterChange = (filterFn: () => void) => {
    filterFn();
    setCurrentPage(1);
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
              variant={viewMode === "cards" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("cards")}
              className="rounded-r-none font-serif"
            >
              <LayoutGrid className="h-4 w-4 mr-2" />
              Cards
            </Button>
            <Button
              variant={viewMode === "table" ? "default" : "ghost"}
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
            className="font-serif bg-transparent"
          >
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          {(user?.role === "admin" ||
            user?.role === "manager" ||
            user?.role === "dj") && (
            <Dialog open={isAddLogOpen} onOpenChange={setIsAddLogOpen}>
              <DialogTrigger asChild>
                <Button className="font-serif">
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
                <ShowLogsForm />
              </DialogContent>
            </Dialog>
          )}
          <Dialog open={isLogDetailsOpen} onOpenChange={setIsDetailsLogOpen}>
            <DialogTrigger asChild></DialogTrigger>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="font-sans font-bold text-xl">
                  Log Details
                </DialogTitle>
                <DialogDescription className="font-serif"></DialogDescription>
              </DialogHeader>
              <div className="flex gap-4 pb-2">
                <div>
                  {modalLogDetails?.start_time ? (
                    Object.keys(modalLogDetails?.start_time).map(
                      (key, index) => (
                        <div className="mt-2 flex flex-wrap gap-2" key={index}>
                          <ListCheck className="h-4 w-4 text-green-500" />
                          <p className="text-xs font-serif text-foreground">
                            <strong>Start Time: </strong>
                            {modalLogDetails.start_time[key]}
                          </p>
                        </div>
                      )
                    )
                  ) : (
                    <p className="text-sm font-serif text-foreground">
                      No segments
                    </p>
                  )}
                </div>
                <div>
                  {" "}
                  {modalLogDetails?.end_time &&
                    Object.keys(modalLogDetails.end_time).map((key, index) => (
                      <div className="mt-2 flex flex-wrap gap-2" key={index}>
                        <p className="text-xs font-serif text-foreground">
                          <strong>End Time: </strong>
                          {modalLogDetails.end_time[key]}
                        </p>
                      </div>
                    ))}
                </div>
                <div>
                  {modalLogDetails.description &&
                    Object.keys(modalLogDetails.description).map(
                      (key, index) => (
                        <div className="mt-2 flex flex-wrap gap-2" key={index}>
                          <p className="text-xs font-serif text-foreground">
                            <strong>Description:</strong>{" "}
                            {modalLogDetails.description[key]}
                          </p>
                        </div>
                      )
                    )}
                </div>
              </div>
              <hr />
              <h1 className="font-serif font-bold pt-2">Guests</h1>
              <div className="flex gap-4 ">
                <div>
                  {modalLogDetails.guest_name ? (
                    Object.keys(modalLogDetails.guest_name).map(
                      (key, index) => (
                        <div className="mt-2 flex flex-wrap gap-2" key={index}>
                          <ContactRound className="h-4 w-4 text-purple-500" />
                          <p className="text-xs font-serif text-foreground">
                            <strong>Guest Name:</strong>{" "}
                            {modalLogDetails.guest_name[key]}
                          </p>
                        </div>
                      )
                    )
                  ) : (
                    <p className="text-sm font-serif text-foreground">
                      No guests
                    </p>
                  )}
                </div>
                <div>
                  {" "}
                  {modalLogDetails.topic &&
                    Object.keys(modalLogDetails.topic).map((key, index) => (
                      <div className="mt-2 flex flex-wrap gap-2" key={index}>
                        <p className="text-xs font-serif text-foreground">
                          <strong> Topic:</strong> {modalLogDetails.topic[key]}
                        </p>
                      </div>
                    ))}
                </div>
                <div>
                  {modalLogDetails.phone &&
                    Object.keys(modalLogDetails.phone).map((key, index) => (
                      <div className="mt-2 flex flex-wrap gap-2" key={index}>
                        <p className="text-xs font-serif text-foreground">
                          <strong>Phone Number:</strong>{" "}
                          {modalLogDetails.phone[key]}
                        </p>
                      </div>
                    ))}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      {/* <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-serif font-medium">
              Total Logs
            </CardTitle>
            <Eye className="h-4 w-4 text-chart-1" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-sans font-bold">
              {filteredLogs.length}
            </div>
            <p className="text-xs text-muted-foreground font-serif">
              {logs.length} total entries
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-serif font-medium">
              Songs Played
            </CardTitle>
            <Music className="h-4 w-4 text-chart-2" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-sans font-bold">
              {filteredLogs.filter((log) => log.type === "song").length}
            </div>
            <p className="text-xs text-muted-foreground font-serif">
              Music tracks logged
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-serif font-medium">
              Technical Issues
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-chart-3" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-sans font-bold">
              {filteredLogs.filter((log) => log.type === "technical").length}
            </div>
            <p className="text-xs text-muted-foreground font-serif">
              Issues reported
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-serif font-medium">
              Listener Calls
            </CardTitle>
            <Phone className="h-4 w-4 text-chart-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-sans font-bold">
              {
                filteredLogs.filter((log) => log.type === "listener_call")
                  .length
              }
            </div>
            <p className="text-xs text-muted-foreground font-serif">
              Calls received
            </p>
          </CardContent>
        </Card>
      </div> */}

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
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="font-serif">
                  All Types
                </SelectItem>
                {Object.entries(logTypeConfig).map(([key, config]) => (
                  <SelectItem key={key} value={key} className="font-serif">
                    {config.label}
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
                {uniqueShows.map((show) => (
                  <SelectItem key={show} value={show} className="font-serif">
                    {show}
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
                {showLogs.length} log entries
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {showLogs.map((log: any) => {
                  return (
                    <div
                      key={log.id}
                      className="flex items-start gap-4 p-4 border rounded-lg"
                    >
                      <div className={`p-2 rounded-full  text-white`}></div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge
                            variant="secondary"
                            className="font-serif text-xs"
                          >
                            Approved
                          </Badge>
                          <span className="text-sm text-muted-foreground font-serif"></span>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-sans font-bold text-sm">
                            {log.title}
                          </span>
                          <span className="text-sm text-muted-foreground font-serif">
                            with {log.name}
                          </span>
                        </div>
                        <hr />
                        <h1 className="font-serif font-bold pt-2">Segments</h1>
                        <div className="flex gap-4 pb-2">
                          <div>
                            {log.start_time ? (
                              Object.keys(log.start_time).map((key, index) => (
                                <div
                                  className="mt-2 flex flex-wrap gap-2"
                                  key={index}
                                >
                                  <ListCheck className="h-4 w-4 text-green-500" />
                                  <p className="text-xs font-serif text-foreground">
                                    <strong>Start Time: </strong>
                                    {log.start_time[key]}
                                  </p>
                                </div>
                              ))
                            ) : (
                              <p className="text-sm font-serif text-foreground">
                                No segments
                              </p>
                            )}
                          </div>
                          <div>
                            {" "}
                            {log.end_time &&
                              Object.keys(log.end_time).map((key, index) => (
                                <div
                                  className="mt-2 flex flex-wrap gap-2"
                                  key={index}
                                >
                                  <p className="text-xs font-serif text-foreground">
                                    <strong>End Time: </strong>
                                    {log.end_time[key]}
                                  </p>
                                </div>
                              ))}
                          </div>
                          <div>
                            {log.description &&
                              Object.keys(log.description).map((key, index) => (
                                <div
                                  className="mt-2 flex flex-wrap gap-2"
                                  key={index}
                                >
                                  <p className="text-xs font-serif text-foreground">
                                    <strong>Description:</strong>{" "}
                                    {log.description[key]}
                                  </p>
                                </div>
                              ))}
                          </div>
                        </div>
                        <hr />
                        <h1 className="font-serif font-bold pt-2">Guests</h1>
                        <div className="flex gap-4 ">
                          <div>
                            {log.guest_name ? (
                              Object.keys(log.guest_name).map((key, index) => (
                                <div
                                  className="mt-2 flex flex-wrap gap-2"
                                  key={index}
                                >
                                  <ContactRound className="h-4 w-4 text-purple-500" />
                                  <p className="text-xs font-serif text-foreground">
                                    <strong>Guest Name:</strong>{" "}
                                    {log.guest_name[key]}
                                  </p>
                                </div>
                              ))
                            ) : (
                              <p className="text-sm font-serif text-foreground">
                                No guests
                              </p>
                            )}
                          </div>
                          <div>
                            {" "}
                            {log.topic &&
                              Object.keys(log.topic).map((key, index) => (
                                <div
                                  className="mt-2 flex flex-wrap gap-2"
                                  key={index}
                                >
                                  <p className="text-xs font-serif text-foreground">
                                    <strong> Topic:</strong> {log.topic[key]}
                                  </p>
                                </div>
                              ))}
                          </div>
                          <div>
                            {log.phone &&
                              Object.keys(log.phone).map((key, index) => (
                                <div
                                  className="mt-2 flex flex-wrap gap-2"
                                  key={index}
                                >
                                  <p className="text-xs font-serif text-foreground">
                                    <strong>Phone Number:</strong>{" "}
                                    {log.phone[key]}
                                  </p>
                                </div>
                              ))}
                          </div>
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
            {showLogs.length > 0 ? (
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
                              {log.start_time
                                ? Object.keys(log.start_time).length
                                : 0}
                            </TableCell>
                            <TableCell className="font-sans font-bold">
                              {log.guest_name
                                ? Object.keys(log.start_time).length
                                : 0}
                            </TableCell>
                            <TableCell className="font-serif">
                              {" "}
                              <Badge
                                variant="secondary"
                                className="font-serif text-xs"
                              >
                                Approved
                              </Badge>
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
                                <button>
                                  <div className="p-1 rounded-lg bg-green-600 hover:bg-green-500 text-white">
                                    <SquarePen className="h-4 w-4" />
                                  </div>
                                </button>
                                <button>
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
