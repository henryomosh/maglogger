"use client";

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
  Megaphone,
} from "lucide-react";
import { useState } from "react";
import {
  useSearchParams,
  usePathname,
  useRouter,
  redirect,
} from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { formatDateToLocal, formatTime } from "@/lib/utils";
import { useAuth } from "@/components/auth-provider";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RequestForm } from "@/components/sub-components/request-form";
import { deleteRequest } from "@/lib/actions";
import { toast } from "sonner";

export function RequestsTable({
  requests,
  totalPages,
  totalRequests,
  totalCurentUserRequests,
  totalCurentUserPages,
}: {
  requests: any;
  totalPages: any;
  totalRequests: any;
  totalCurentUserRequests: any;
  totalCurentUserPages: any;
}) {
  const { user } = useAuth();

  const canManageShows = user?.role === "admin" || user?.role === "manager";

  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [modalRequestDetails, setModalRequestDetails] = useState<any>(null);
  const [isRequestDetailsOpen, setIsDetailsRequestOpen] = useState(false);
  const [editingRequest, setEditingRequest] = useState(null);
  const [requestId, setRequestId] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  const handleTotalPages = useDebouncedCallback((term) => {
    console.log(`Searching... ${term}`);

    const params = new URLSearchParams(searchParams);
    params.set("page", "1");

    if (term) {
      params.set("total", term);
    } else {
      params.delete("total");
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    await deleteRequest(id);
    toast.warning("Request Deleted!");
    setIsDeleting(false);
    setIsDeleteDialogOpen(false);
  };
  return (
    <>
      <Dialog
        open={!!editingRequest}
        onOpenChange={() => setEditingRequest(null)}
      >
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-sans font-bold">
              Edit Request
            </DialogTitle>
            <DialogDescription className="font-serif"></DialogDescription>
          </DialogHeader>
          <RequestForm
            initialData={editingRequest}
            onClose={() => setEditingRequest(null)}
          />
        </DialogContent>
        {requestId && (
          <Dialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
          >
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="font-sans font-bold p-4">
                  <div className="flex gap-4 space-y-4">
                    <OctagonAlert className="h-10 w-10 text-red-600" /> Are your
                    sure you want to delete this request?
                  </div>
                </DialogTitle>
                <DialogDescription className="font-serif flex justify-end gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDeleteDialogOpen(false)}
                    className="font-serif bg-transparent cursor-pointer"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => handleDelete(requestId)}
                    className="font-sans font-bold bg-red-600 hover:bg-red-400 cursor-pointer"
                    disabled={isDeleting}
                  >
                    {isDeleting ? "Deleting..." : "Delete"}
                  </Button>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        )}
      </Dialog>

      <Dialog
        open={!!editingRequest}
        onOpenChange={() => setEditingRequest(null)}
      >
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-sans font-bold">
              Edit Request
            </DialogTitle>
            <DialogDescription className="font-serif"></DialogDescription>
          </DialogHeader>
          <RequestForm
            initialData={editingRequest}
            onClose={() => setEditingRequest(null)}
          />
        </DialogContent>
        {modalRequestDetails && (
          <Dialog
            open={isRequestDetailsOpen}
            onOpenChange={setIsDetailsRequestOpen}
          >
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="font-sans font-bold">
                  Request Details
                </DialogTitle>
                <DialogDescription className="font-serif flex justify-end gap-4"></DialogDescription>
              </DialogHeader>
              <p className="text-sm">
                <strong>Reason: </strong>
                {modalRequestDetails?.reason}
              </p>
              <div>
                {modalRequestDetails?.notes ? (
                  <div className="border-2 border-indigo-700 text-sm rounded-md p-2">
                    <div className="flex gap-2 items-center pb-2">
                      <FileText className="h-4 w-4 text-indigo-500" />{" "}
                      <p className="text-indigo-500 txt-sm">Admin notes</p>
                    </div>{" "}
                    {modalRequestDetails?.notes}
                  </div>
                ) : (
                  <p className="text-md p-6 flex items-center justify-center">
                    No admin notes
                  </p>
                )}
              </div>
              <div>
                <Button
                  type="button"
                  variant="default"
                  onClick={() => setIsDetailsRequestOpen(false)}
                  className="font-serif bg-transparent cursor-pointer"
                >
                  Cancel
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </Dialog>
      <Card className="shadow-sm shadow-green-500">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="font-sans font-bold text-green-500">
                Requests Table
              </CardTitle>
              <CardDescription className="font-serif text-green-500">
                {requests?.length} requests in table format
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-serif text-green-500">Show:</span>
              <Select
                value={itemsPerPage.toString()}
                onValueChange={(value) => {
                  setItemsPerPage(Number(value));
                  setCurrentPage(1);
                  handleTotalPages(value);
                }}
              >
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
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {requests?.length > 0 ? (
            <div className="space-y-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {canManageShows && (
                        <TableHead className="font-serif font-bold">
                          Staff
                        </TableHead>
                      )}
                      <TableHead className="font-serif font-bold">
                        Type
                      </TableHead>
                      <TableHead className="font-serif font-bold">
                        Reason
                      </TableHead>
                      <TableHead className="font-serif font-bold">
                        From
                      </TableHead>
                      <TableHead className="font-serif font-bold">To</TableHead>
                      <TableHead className="font-serif font-bold">
                        Stand In
                      </TableHead>
                      <TableHead className="font-serif font-bold">
                        Status
                      </TableHead>
                      <TableHead className="font-serif font-bold">
                        Created
                      </TableHead>
                      <TableHead className="font-serif font-bold">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {requests.map((request: any) => {
                      // const config = logTypeConfig[log.type];
                      // const IconComponent = config.icon;

                      return (
                        <TableRow key={request.id}>
                          {canManageShows && (
                            <TableCell className="font-serif">
                              {request.name || ""}
                            </TableCell>
                          )}
                          <TableCell className="font-serif">
                            {request.type}
                          </TableCell>
                          <TableCell className="font-serif">
                            {request?.reason
                              ?.split(" ")
                              ?.splice(0, 4)
                              .join(" ") || ""}
                            {request?.reason?.split(" ")?.length > 4
                              ? "..."
                              : ""}
                          </TableCell>
                          <TableCell className="font-sans font-bold">
                            {request.start_date || ""}
                          </TableCell>
                          <TableCell className="font-sans font-bold">
                            {request.end_date || ""}
                          </TableCell>
                          <TableCell className="font-sans font-bold">
                            {request.standin ? request.standin : "None"}
                          </TableCell>
                          <TableCell className="font-serif">
                            {" "}
                            {request?.status === "pending" && (
                              <Badge className="font-serif text-xs bg-yellow-200 text-default">
                                <Clock3 className="h-4 w-4" /> Pending
                              </Badge>
                            )}
                            {request?.status === "declined" && (
                              <Badge className="font-serif text-xs bg-red-500 text-white">
                                <CircleX className="h-6 w-6" /> Declined
                              </Badge>
                            )}
                            {request?.status === "approved" && (
                              <Badge className="font-serif text-xs bg-green-500 text-white">
                                <Check className="h-6 w-6" /> Aproved
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="font-sans text-xs font-bold">
                            {formatDateToLocal(request.created)}
                          </TableCell>

                          <TableCell className="font-serif max-w-xs">
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => {
                                  setModalRequestDetails(request);

                                  setIsDetailsRequestOpen(true);
                                }}
                                className="cursor-pointer"
                              >
                                <div className="p-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white">
                                  <FileText className="h-4 w-4" />
                                </div>
                              </button>
                              <button
                                onClick={() => setEditingRequest(request)}
                                className="cursor-pointer"
                              >
                                <div className="p-1 rounded-lg bg-green-600 hover:bg-green-500 text-white">
                                  <SquarePen className="h-4 w-4" />
                                </div>
                              </button>
                              <button
                                disabled={!canManageShows}
                                onClick={() => {
                                  setRequestId(request.id);
                                  setIsDeleteDialogOpen(true);
                                }}
                                className="cursor-pointer"
                              >
                                <div
                                  className={`p-1 rounded-lg ${
                                    canManageShows
                                      ? "bg-red-600 hover:bg-red-500"
                                      : "bg-red-200"
                                  } text-white`}
                                >
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

              {canManageShows ? (
                <>
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <div className="text-sm  text-green-500 font-bold font-serif">
                        Showing {startIndex + 1} to{" "}
                        {startIndex + itemsPerPage < totalRequests?.count
                          ? currentPage === 1
                            ? startIndex + itemsPerPage
                            : startIndex + 1 + itemsPerPage
                          : totalRequests?.count}{" "}
                        of {totalRequests?.count} Entries
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setCurrentPage(currentPage - 1);
                            redirect(createPageURL(currentPage - 1));
                          }}
                          disabled={currentPage === 1}
                          className="font-serif hover:bg-green-500"
                        >
                          <ChevronLeft className="h-4 w-4 mr-1" />
                          Previous
                        </Button>
                        <div className="flex items-center gap-1">
                          {totalPages > 4 ? (
                            <>
                              {currentPage < 4 ? (
                                <>
                                  <Button
                                    variant={
                                      currentPage === 1 ? "default" : "outline"
                                    }
                                    size="sm"
                                    onClick={() => {
                                      setCurrentPage(1);
                                      redirect(createPageURL(1));
                                    }}
                                    className={`w-8 h-8 p-0 font-serif   ${
                                      currentPage === 1
                                        ? "bg-green-600 hover:bg-green-500"
                                        : "hover:bg-green-600"
                                    }`}
                                  >
                                    1
                                  </Button>{" "}
                                  {Array.from(
                                    { length: totalPages },
                                    (_, i) => i + 1
                                  )
                                    .map((page) => (
                                      <Button
                                        key={page}
                                        variant={
                                          currentPage === page
                                            ? "default"
                                            : "outline"
                                        }
                                        size="sm"
                                        onClick={() => {
                                          setCurrentPage(page);
                                          redirect(createPageURL(page));
                                        }}
                                        className={`w-8 h-8 p-0 font-serif  ${
                                          currentPage === page
                                            ? "bg-green-600 hover:bg-green-500"
                                            : "hover:bg-green-600"
                                        }`}
                                      >
                                        {page}
                                      </Button>
                                    ))
                                    .slice(1, 3)}
                                  <Button
                                    className={`w-8 h-8 p-0 font-serif bg-gray-400 hover:bg-gray-400 ${
                                      currentPage === totalPages - 1 ||
                                      currentPage === totalPages
                                        ? "hidden"
                                        : ""
                                    }`}
                                  >
                                    ...
                                  </Button>
                                  <Button
                                    variant={
                                      currentPage === totalPages
                                        ? "default"
                                        : "outline"
                                    }
                                    size="sm"
                                    onClick={() => {
                                      setCurrentPage(totalPages);
                                      redirect(createPageURL(totalPages));
                                    }}
                                    className={`w-8 h-8 p-0 font-serif ${
                                      currentPage === totalPages ? "hidden" : ""
                                    }  ${
                                      currentPage === totalPages
                                        ? "bg-green-600 hover:bg-green-500"
                                        : "hover:bg-green-600"
                                    }`}
                                  >
                                    {totalPages}
                                  </Button>
                                </>
                              ) : (
                                <>
                                  <Button
                                    variant={
                                      currentPage === 1 ? "default" : "outline"
                                    }
                                    size="sm"
                                    onClick={() => {
                                      setCurrentPage(1);
                                      redirect(createPageURL(1));
                                    }}
                                    className={`w-8 h-8 p-0 font-serif   ${
                                      currentPage === 1
                                        ? "bg-green-600 hover:bg-green-500"
                                        : "hover:bg-green-600"
                                    }`}
                                  >
                                    1
                                  </Button>{" "}
                                  <Button
                                    className={`w-8 h-8 p-0 font-serif bg-gray-400 hover:bg-gray-400 `}
                                  >
                                    ...
                                  </Button>
                                  {Array.from(
                                    { length: totalPages },
                                    (_, i) => i + 1
                                  )
                                    .map((page) => (
                                      <Button
                                        key={page}
                                        variant={
                                          currentPage === page
                                            ? "default"
                                            : "outline"
                                        }
                                        size="sm"
                                        onClick={() => {
                                          setCurrentPage(page);
                                          redirect(createPageURL(page));
                                        }}
                                        className={`w-8 h-8 p-0 font-serif  ${
                                          currentPage === page
                                            ? "bg-green-600 hover:bg-green-500"
                                            : "hover:bg-green-600"
                                        }`}
                                      >
                                        {page}
                                      </Button>
                                    ))
                                    .slice(currentPage - 2, currentPage)}
                                  <Button
                                    className={`w-8 h-8 p-0 font-serif bg-gray-400 hover:bg-gray-400 ${
                                      currentPage === totalPages - 1 ||
                                      currentPage === totalPages
                                        ? "hidden"
                                        : ""
                                    }`}
                                  >
                                    ...
                                  </Button>
                                  <Button
                                    variant={
                                      currentPage === totalPages
                                        ? "default"
                                        : "outline"
                                    }
                                    size="sm"
                                    onClick={() => {
                                      setCurrentPage(totalPages);
                                      redirect(createPageURL(totalPages));
                                    }}
                                    className={`w-8 h-8 p-0 font-serif ${
                                      currentPage === totalPages ? "hidden" : ""
                                    } ${
                                      currentPage === totalPages
                                        ? "bg-green-600 hover:bg-green-500"
                                        : "hover:bg-green-600"
                                    }`}
                                  >
                                    {totalPages}
                                  </Button>
                                </>
                              )}
                            </>
                          ) : (
                            <>
                              {" "}
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
                                  onClick={() => {
                                    setCurrentPage(page);
                                    redirect(createPageURL(page));
                                  }}
                                  className={`w-8 h-8 p-0 font-serif  ${
                                    currentPage === page
                                      ? "bg-green-600 hover:bg-green-500"
                                      : "hover:bg-green-600"
                                  }`}
                                >
                                  {page}
                                </Button>
                              ))}
                            </>
                          )}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setCurrentPage(currentPage + 1);
                            redirect(createPageURL(currentPage + 1));
                          }}
                          disabled={currentPage === totalPages}
                          className="font-serif hover:bg-green-500"
                        >
                          Next
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <>
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between">
                      <div className="text-sm  text-green-500 font-bold font-serif">
                        Showing {startIndex + 1} to{" "}
                        {startIndex + itemsPerPage <
                        totalCurentUserRequests?.count
                          ? currentPage === 1
                            ? startIndex + itemsPerPage
                            : startIndex + 1 + itemsPerPage
                          : totalCurentUserRequests?.count}{" "}
                        of {totalCurentUserRequests?.count} Entries
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setCurrentPage(currentPage - 1);
                            redirect(createPageURL(currentPage - 1));
                          }}
                          disabled={currentPage === 1}
                          className="font-serif hover:bg-green-500"
                        >
                          <ChevronLeft className="h-4 w-4 mr-1" />
                          Previous
                        </Button>
                        <div className="flex items-center gap-1">
                          {Array.from(
                            { length: totalCurentUserPages },
                            (_, i) => i + 1
                          ).map((page) => (
                            <Button
                              key={page}
                              variant={
                                currentPage === page ? "default" : "outline"
                              }
                              size="sm"
                              onClick={() => {
                                setCurrentPage(page);
                                redirect(createPageURL(page));
                              }}
                              className={`w-8 h-8 p-0 font-serif  ${
                                currentPage === page
                                  ? "bg-green-600 hover:bg-green-500"
                                  : "hover:bg-green-600"
                              }`}
                            >
                              {page}
                            </Button>
                          ))}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setCurrentPage(currentPage + 1);
                            redirect(createPageURL(currentPage + 1));
                          }}
                          disabled={currentPage === totalCurentUserPages}
                          className="font-serif hover:bg-green-500"
                        >
                          Next
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
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
