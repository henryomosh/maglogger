"use client";

import React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAuth, type UserRole } from "@/components/auth-provider";
import {
  Plus,
  Edit,
  Mail,
  Phone,
  Calendar,
  Clock,
  MoreVertical,
  Trash,
  OctagonAlert,
  Eye,
  EyeClosed,
  LogIn,
  LogOut,
  Users,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createStaff } from "@/lib/actions";
import { updateStaff } from "@/lib/actions";
import { deleteStaff } from "@/lib/actions";
import { fetchStaff } from "@/lib/data";
import { User } from "@/lib/definations";
import { toast } from "sonner";
import { formatTime } from "@/lib/utils";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { fetchUserSchedule } from "@/lib/data";

interface StaffMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  department: string;
  hireDate: string;
  status: "active" | "inactive" | "on-leave";
  bio?: string;
  specialities?: string[];
  schedule?: {
    monday?: string;
    tuesday?: string;
    wednesday?: string;
    thursday?: string;
    friday?: string;
    saturday?: string;
    sunday?: string;
  };
  login: string;
  logout: string;
}

interface StaffDataMemmber {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  bio?: string;
  specialties?: [];
  login?: string;
  logout: string;
}

interface StaffFormProps {
  initialData?: StaffMember;
  onClose: () => void;
  onSave: (staff: Omit<StaffMember, "id">) => void;
}

// Mock staff data
const mockStaff: StaffMember[] = [
  {
    id: "1",
    name: "John Admin",
    email: "admin@radio.com",
    phone: "(555) 123-4567",
    role: "admin",
    department: "Management",
    hireDate: "2020-01-15",
    status: "active",
    bio: "Experienced radio station manager with 15+ years in broadcasting.",
    specialities: ["Management", "Operations", "Strategy"],
    login: "",
    logout: "",
  },
];

const daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
export function StaffManagement({
  data,
  schedule,
  staffDashboardData,
}: {
  data: any;
  schedule: any;
  staffDashboardData: any;
}) {
  const { user } = useAuth();
  const [staff, setStaff] = useState<StaffMember[]>(mockStaff);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [staffId, setStaffId] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const [staffData, setStaffData] = useState<StaffDataMemmber[]>();

  // Check if user has permission to manage staff
  const canManageStaff = user?.role === "admin" || user?.role === "manager";
  //param search
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((term) => {
    console.log(`Searching... ${term}`);

    const params = new URLSearchParams(searchParams);
    params.set("page", "1");
    if (term) {
      params.set("query", term);
      if (term === "all") {
        params.delete("query");
      }
    } else {
      params.delete("query");
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  const filteredStaff = data?.filter((member: any) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "all" || member.role === filterRole;
    const matchesStatus =
      filterStatus === "all" || member.status === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });
  const getStaffShows = (id: any) => {
    return schedule?.filter((item: any, index: any) => item?.staff === id);
  };

  const showDays = (show: any) => {
    const days: number[] = [];
    return show?.days
      ?.map((day: any, index: number) => (day.value === true ? index : -1))
      .filter((index: any) => index !== -1);
  };

  const activeStaff = data?.filter(
    (member: any) => member?.status === "active"
  );
  const onleavStaff = data?.filter(
    (member: any) => member?.status === "on-leave"
  );

  const inactiveStaff = data?.filter(
    (member: any) => member?.status === "inactive"
  );

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

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 text-purple-800";
      case "manager":
        return "bg-blue-100 text-blue-800";
      case "dj":
        return "bg-green-100 text-green-800";
      case "staff":
        return "bg-pink-100 text-pink-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    await deleteStaff(id);
    toast.warning("Member Deleted!");
    setIsDeleting(false);
    setIsDeleteDialogOpen(false);
  };
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-sans font-bold text-foreground">
        Staff Management
      </h1>
      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded rounded-2xl pl-1 bg-green-700">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-md font-serif font-medium">
                Active staff
              </CardTitle>
              <Users className="h-6 w-6 text-green-700" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-sans font-bold text-green-700">
                {staffDashboardData.activeUsers || 0}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="rounded rounded-2xl pl-1 bg-cyan-700">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-md font-serif font-medium">
                On-leave Staff
              </CardTitle>
              <Users className="h-6 w-6 text-cyan-700" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-sans font-bold text-cyan-700">
                {staffDashboardData.onLeaveUsers || 0}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="rounded rounded-2xl pl-1 bg-yellow-500">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-md font-serif font-medium">
                Inactive Staff
              </CardTitle>
              <Users className="h-6 w-6 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-sans font-bold text-yellow-500">
                {staffDashboardData.inactiveUsers || 0}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-muted-foreground font-serif mt-1">
            Manage your radio station team and their roles.
          </p>
        </div>

        {canManageStaff && (
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="success" className="font-sans font-bold">
                <Plus className="h-4 w-4 mr-2" />
                Add Staff Member
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="font-sans font-bold">
                  Add New Staff Member
                </DialogTitle>
                <DialogDescription className="font-serif">
                  Enter the details for the new team member.
                </DialogDescription>
              </DialogHeader>
              <StaffForm
                onClose={() => setIsAddDialogOpen(false)}
                onSave={(newStaff) => {
                  setStaff([
                    ...staff,
                    { ...newStaff, id: Date.now().toString() },
                  ]);
                  setIsAddDialogOpen(false);
                }}
              />
            </DialogContent>
          </Dialog>
        )}
        {canManageStaff && (
          <Dialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
          >
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
          </Dialog>
        )}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search staff members..."
                defaultValue={searchParams.get("query")?.toString()}
                onChange={(e) => handleSearch(e.target.value)}
                className="font-serif border-1 border-blue-300"
              />
            </div>
            <Select
              value={filterRole}
              onValueChange={(value) => {
                setFilterRole(value);
                handleSearch(value);
              }}
            >
              <SelectTrigger className="w-full sm:w-40 border-1 border-blue-300">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
                <SelectItem value="staff">Staff</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={filterStatus}
              onValueChange={(value) => {
                setFilterStatus(value);
                handleSearch(value);
              }}
            >
              <SelectTrigger className="w-full sm:w-40 border-1 border-blue-300">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="on-leave">On Leave</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Staff Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredStaff?.map((member: any) => (
          <Card key={member.id} className="relative">
            <CardHeader className="pb-3">
              {member.id === user?.id && (
                <Badge className="bg-green-500 mb-2">Current user</Badge>
              )}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-cyan-500 text-primary-foreground font-sans font-bold">
                      {member.name
                        .split(" ")
                        .map((n: any) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg font-sans font-bold">
                      {member.name}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground font-serif">
                      place
                    </p>
                  </div>
                </div>
                {canManageStaff && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setEditingStaff(member)}>
                        <Edit className="h-4 w-4 mr-2 text-green-600" />
                        Edit Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setIsDeleteDialogOpen(true);
                          setStaffId(member.id);
                        }}
                        disabled={member.id === user.id}
                      >
                        <Trash className="h-4 w-4 mr-2 text-red-600" />
                        Delete Member
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Badge
                  className={`${getRoleColor(member.role)} font-serif text-xs`}
                >
                  {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                </Badge>
                <Badge
                  className={`${getStatusColor(
                    member.status
                  )} font-serif text-xs`}
                >
                  {member.status.charAt(0).toUpperCase() +
                    member.status.slice(1).replace("-", " ")}
                </Badge>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="font-serif">{member.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="font-serif">{member.phone}</span>
                </div>
              </div>
              <div className=" text-sm space-y-2 ">
                {member?.login && (
                  <div className="flex items-center gap-2">
                    <LogIn className="h-4 w-4 text-muted-foreground" />
                    <span className="font-serif">
                      Login Time: {formatTime(member?.login || "")}
                    </span>
                  </div>
                )}
                {member?.logout && (
                  <div className="flex items-center gap-2">
                    <LogOut className="h-4 w-4 text-muted-foreground" />
                    <span className="font-serif">
                      Logout Time: {formatTime(member?.logout || "")}
                    </span>
                  </div>
                )}
              </div>

              {member.bio && (
                <p className="text-sm text-muted-foreground font-serif line-clamp-2">
                  {member.bio}
                </p>
              )}

              {/* {member.specialities && member.specialities.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {member.specialities.slice(0, 3).map((specialty: any) => (
                    <Badge
                      key={specialty}
                      variant="outline"
                      className="font-serif text-xs"
                    >
                      {specialty}
                    </Badge>
                  ))}
                  {member.specialties.length > 3 && (
                    <Badge variant="outline" className="font-serif text-xs">
                      +{member.specialties.length - 3} more
                    </Badge>
                  )}
                </div>
              )} */}

              {getStaffShows(member.id)?.length > 0 && (
                <div className="pt-2 border-t">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-serif font-medium">
                      This Week
                    </span>
                  </div>
                  <div className="">
                    {getStaffShows(member.id)?.map((show: any) => (
                      <div key={show.id}>
                        <p className="text-green-500 text-sm font-bold pb-1">
                          {show.title}
                        </p>
                        {showDays(show)?.map((day: any, index: any) => (
                          <div
                            key={index}
                            className="flex justify-between text-xs"
                          >
                            <span className="font-serif capitalize">
                              {daysOfWeek[day]}
                            </span>
                            <span className="font-serif text-muted-foreground">
                              {formatTime(show.start)} - {formatTime(show.ends)}
                            </span>
                          </div>
                        ))}
                        {/* {showDays(show).length > 2 && (
                            <p className="text-xs text-muted-foreground font-serif">
                              +{showDays(show).length - 2} more days
                            </p>
                          )} */}
                        {/* {getStaffShows(member.id).length > 1 && (
                            <p className="text-xs text-muted-foreground font-serif">
                              +{getStaffShows(member.id).length - 1} more shows
                            </p>
                          )} */}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredStaff?.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center ">
            <p className="text-muted-foreground font-serif">
              No staff members found matching your criteria.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Edit Staff Dialog */}
      {editingStaff && (
        <Dialog
          open={!!editingStaff}
          onOpenChange={() => setEditingStaff(null)}
        >
          <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-sans font-bold">
                Edit Staff Member
              </DialogTitle>
              <DialogDescription className="font-serif">
                Update the details for {editingStaff.name}.
              </DialogDescription>
            </DialogHeader>
            <StaffForm
              initialData={editingStaff}
              onClose={() => setEditingStaff(null)}
              onSave={(updatedStaff) => {
                setStaff(
                  staff.map((s) =>
                    s.id === editingStaff.id
                      ? { ...updatedStaff, id: editingStaff.id }
                      : s
                  )
                );
                setEditingStaff(null);
              }}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

function StaffForm({ initialData, onClose, onSave }: StaffFormProps) {
  const [status, setStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const [formData, setFormData] = useState({
    id: initialData?.id || "",
    name: initialData?.name || "",
    email: initialData?.email || "",
    phone: initialData?.phone || "",
    role: initialData?.role || ("staff" as UserRole),
    department: initialData?.department || "",
    hireDate: initialData?.hireDate || new Date().toISOString().split("T")[0],
    status: initialData?.status || ("active" as const),
    bio: initialData?.bio || "",
    specialities: initialData?.specialities || "",
    login: initialData?.login || "",
    logout: initialData?.logout || "",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    setStatus(null);

    const formData2 = new FormData(e.currentTarget);
    const result = await createStaff(formData2);
    if (result?.success === false) {
      setError(result.message);
      setIsSubmitting(false);
      toast.error(result.message);
    }
    if (result.success === true) {
      setIsSubmitting(false);
      toast.success("Staff member created successfully!", {});
      onClose();
    }
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData2 = new FormData(e.currentTarget);
    const results = await updateStaff(formData2);
    if (results?.success === false) {
      setError(results.message);
      setIsSubmitting(false);
      toast.error(results.message);
    }
    if (results?.success === true) {
      setIsSubmitting(false);
      toast.success("Member details updated successfuly!");
      onClose();
    }
  };

  return (
    <form
      onSubmit={initialData ? handleUpdate : handleSubmit}
      className="space-y-4"
    >
      {error && (
        <div className="text-sm text-center text-red-700 border-1 rounded-md p-2 bg-red-50">
          {error}
        </div>
      )}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="font-serif">
            Full Name<span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="border-1 border-blue-400"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email" className="font-serif">
            Email <span className="text-red-500">*</span>
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="border-1 border-blue-400"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phone" className="font-serif">
            Phone
          </Label>
          <Input
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            className="border-1 border-blue-400"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="role" className="font-serif">
            Role <span className="text-red-500">*</span>
          </Label>
          <Select
            name="role"
            value={formData.role}
            onValueChange={(value: UserRole) =>
              setFormData({ ...formData, role: value })
            }
          >
            <SelectTrigger className="border-1 border-blue-400 w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="manager">Manager</SelectItem>
              <SelectItem value="staff">Staff</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 space-y-2">
        <div className="space-y-2 col-span-2">
          <Label htmlFor="specialties" className="font-serif">
            Specialties (comma-separated)
          </Label>
          <Input
            id="specialities"
            name="specialities"
            value={formData.specialities}
            onChange={(e) =>
              setFormData({ ...formData, specialities: e.target.value })
            }
            className="border-1 border-blue-400"
            placeholder="Rock Music, Live Shows, Audio Production"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="status" className="font-serif">
            Status <span className="text-red-500">*</span>
          </Label>
          <Select
            value={formData.status}
            name="status"
            onValueChange={(value: "active" | "inactive" | "on-leave") =>
              setFormData({ ...formData, status: value })
            }
          >
            <SelectTrigger className="border-1 border-blue-400 w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="on-leave">On Leave</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio" className="font-serif">
          Bio
        </Label>
        <Textarea
          id="bio"
          name="bio"
          value={formData.bio}
          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          placeholder="Brief description of the staff member..."
          className="border-1 border-blue-400"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4 space-y-2">
        <div className="space-y-2">
          <Label htmlFor="login" className="font-serif">
            Log In Time
          </Label>
          <Input
            type="time"
            id="login"
            name="login"
            value={formData.login}
            onChange={(e) =>
              setFormData({ ...formData, login: e.target.value })
            }
            className="border-1 border-blue-400"
            placeholder="Reporting time"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="logout" className="font-serif">
            Log Out Time
          </Label>
          <Input
            type="time"
            id="logout"
            name="logout"
            value={formData.logout}
            onChange={(e) =>
              setFormData({ ...formData, logout: e.target.value })
            }
            className="border-1 border-blue-400"
            placeholder="Leaving time"
          />
        </div>
      </div>
      <div className="space-y-2 " style={{ position: "relative" }}>
        <Label htmlFor="password" className="font-serif">
          {initialData ? "Change Staff Password" : "Password"}
          {!initialData && <span className="text-red-500">*</span>}
        </Label>
        <Input
          type={showPassword ? "text" : "password"}
          id="password"
          name="password"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          placeholder="Set staff password"
          className="border-1 border-blue-400"
          style={{ width: "100%", paddingRight: "40px" }}
          required={!initialData}
        />
        <span
          onClick={togglePasswordVisibility}
          style={{
            position: "absolute",
            right: "20px",
            top: "65%",
            transform: "translateY(-50%)",
            cursor: "pointer",
          }}
        >
          <EyeClosed className="h-5 w-5" />
        </span>
      </div>
      {initialData && (
        <div className="hidden">
          <Input
            id="userid"
            name="id"
            value={formData.id}
            onChange={(e) => setFormData({ ...formData, id: e.target.value })}
            className="border-1 border-blue-400"
            placeholder="Rock Music, Live Shows, Audio Production"
          />
        </div>
      )}
      <div className="flex justify-end gap-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          className="font-serif bg-transparent"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="success"
          className="font-sans font-bold"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <div
              role="status"
              className="flex items-center justify-center gap-2"
            >
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-100 border-t-transparent"></div>
            </div>
          ) : (
            `${initialData ? "Update" : "Add"} Staff Member`
          )}
        </Button>
      </div>
    </form>
  );
}
