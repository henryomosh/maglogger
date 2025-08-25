"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useAuth, type UserRole } from "./auth-provider"
import { Plus, Edit, Mail, Phone, Calendar, Clock, MoreVertical } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface StaffMember {
  id: string
  name: string
  email: string
  phone: string
  role: UserRole
  department: string
  hireDate: string
  status: "active" | "inactive" | "on-leave"
  bio?: string
  specialties?: string[]
  schedule?: {
    monday?: string
    tuesday?: string
    wednesday?: string
    thursday?: string
    friday?: string
    saturday?: string
    sunday?: string
  }
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
    specialties: ["Management", "Operations", "Strategy"],
  },
  {
    id: "2",
    name: "Sarah Manager",
    email: "manager@radio.com",
    phone: "(555) 234-5678",
    role: "manager",
    department: "Programming",
    hireDate: "2021-03-20",
    status: "active",
    bio: "Programming director focused on content strategy and audience engagement.",
    specialties: ["Programming", "Content Strategy", "Analytics"],
    schedule: {
      monday: "9:00 AM - 6:00 PM",
      tuesday: "9:00 AM - 6:00 PM",
      wednesday: "9:00 AM - 6:00 PM",
      thursday: "9:00 AM - 6:00 PM",
      friday: "9:00 AM - 5:00 PM",
    },
  },
  {
    id: "3",
    name: "Mike DJ",
    email: "dj@radio.com",
    phone: "(555) 345-6789",
    role: "dj",
    department: "On-Air",
    hireDate: "2022-06-10",
    status: "active",
    bio: "Popular afternoon drive-time DJ with a passion for rock and alternative music.",
    specialties: ["Rock Music", "Live Shows", "Audience Interaction"],
    schedule: {
      monday: "2:00 PM - 6:00 PM",
      tuesday: "2:00 PM - 6:00 PM",
      wednesday: "2:00 PM - 6:00 PM",
      thursday: "2:00 PM - 6:00 PM",
      friday: "2:00 PM - 6:00 PM",
    },
  },
  {
    id: "4",
    name: "Lisa Staff",
    email: "staff@radio.com",
    phone: "(555) 456-7890",
    role: "staff",
    department: "Production",
    hireDate: "2023-02-14",
    status: "active",
    bio: "Audio production specialist and sound engineer.",
    specialties: ["Audio Production", "Sound Engineering", "Editing"],
    schedule: {
      monday: "10:00 AM - 7:00 PM",
      wednesday: "10:00 AM - 7:00 PM",
      friday: "10:00 AM - 7:00 PM",
      saturday: "12:00 PM - 8:00 PM",
      sunday: "12:00 PM - 8:00 PM",
    },
  },
  {
    id: "5",
    name: "Tom DJ",
    email: "tom@radio.com",
    phone: "(555) 567-8901",
    role: "dj",
    department: "On-Air",
    hireDate: "2021-11-08",
    status: "on-leave",
    bio: "Evening jazz specialist currently on medical leave.",
    specialties: ["Jazz", "Classical", "Evening Shows"],
  },
  {
    id: "6",
    name: "Alex DJ",
    email: "alex@radio.com",
    phone: "(555) 678-9012",
    role: "dj",
    department: "On-Air",
    hireDate: "2023-08-22",
    status: "active",
    bio: "Night shift DJ specializing in electronic and dance music.",
    specialties: ["Electronic", "Dance", "Late Night"],
    schedule: {
      thursday: "10:00 PM - 2:00 AM",
      friday: "10:00 PM - 2:00 AM",
      saturday: "10:00 PM - 2:00 AM",
      sunday: "10:00 PM - 2:00 AM",
    },
  },
]

export function StaffManagement() {
  const { user } = useAuth()
  const [staff, setStaff] = useState<StaffMember[]>(mockStaff)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterRole, setFilterRole] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null)

  // Check if user has permission to manage staff
  const canManageStaff = user?.role === "admin" || user?.role === "manager"

  const filteredStaff = staff.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = filterRole === "all" || member.role === filterRole
    const matchesStatus = filterStatus === "all" || member.status === filterStatus
    return matchesSearch && matchesRole && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "inactive":
        return "bg-gray-100 text-gray-800"
      case "on-leave":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 text-purple-800"
      case "manager":
        return "bg-blue-100 text-blue-800"
      case "dj":
        return "bg-green-100 text-green-800"
      case "staff":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-sans font-bold text-foreground">Staff Management</h1>
          <p className="text-muted-foreground font-serif mt-1">Manage your radio station team and their roles.</p>
        </div>
        {canManageStaff && (
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="font-sans font-bold">
                <Plus className="h-4 w-4 mr-2" />
                Add Staff Member
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="font-sans font-bold">Add New Staff Member</DialogTitle>
                <DialogDescription className="font-serif">Enter the details for the new team member.</DialogDescription>
              </DialogHeader>
              <StaffForm
                onClose={() => setIsAddDialogOpen(false)}
                onSave={(newStaff) => {
                  setStaff([...staff, { ...newStaff, id: Date.now().toString() }])
                  setIsAddDialogOpen(false)
                }}
              />
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
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="font-serif"
              />
            </div>
            <Select value={filterRole} onValueChange={setFilterRole}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
                <SelectItem value="dj">DJ</SelectItem>
                <SelectItem value="staff">Staff</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-40">
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
        {filteredStaff.map((member) => (
          <Card key={member.id} className="relative">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary text-primary-foreground font-sans font-bold">
                      {member.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg font-sans font-bold">{member.name}</CardTitle>
                    <p className="text-sm text-muted-foreground font-serif">{member.department}</p>
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
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Profile
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Badge className={`${getRoleColor(member.role)} font-serif text-xs`}>
                  {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                </Badge>
                <Badge className={`${getStatusColor(member.status)} font-serif text-xs`}>
                  {member.status.charAt(0).toUpperCase() + member.status.slice(1).replace("-", " ")}
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
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="font-serif">Hired {new Date(member.hireDate).toLocaleDateString()}</span>
                </div>
              </div>

              {member.bio && <p className="text-sm text-muted-foreground font-serif line-clamp-2">{member.bio}</p>}

              {member.specialties && member.specialties.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {member.specialties.slice(0, 3).map((specialty) => (
                    <Badge key={specialty} variant="outline" className="font-serif text-xs">
                      {specialty}
                    </Badge>
                  ))}
                  {member.specialties.length > 3 && (
                    <Badge variant="outline" className="font-serif text-xs">
                      +{member.specialties.length - 3} more
                    </Badge>
                  )}
                </div>
              )}

              {member.schedule && (
                <div className="pt-2 border-t">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-serif font-medium">This Week</span>
                  </div>
                  <div className="space-y-1">
                    {Object.entries(member.schedule)
                      .slice(0, 2)
                      .map(([day, time]) => (
                        <div key={day} className="flex justify-between text-xs">
                          <span className="font-serif capitalize">{day}</span>
                          <span className="font-serif text-muted-foreground">{time}</span>
                        </div>
                      ))}
                    {Object.keys(member.schedule).length > 2 && (
                      <p className="text-xs text-muted-foreground font-serif">
                        +{Object.keys(member.schedule).length - 2} more days
                      </p>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredStaff.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground font-serif">No staff members found matching your criteria.</p>
          </CardContent>
        </Card>
      )}

      {/* Edit Staff Dialog */}
      {editingStaff && (
        <Dialog open={!!editingStaff} onOpenChange={() => setEditingStaff(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="font-sans font-bold">Edit Staff Member</DialogTitle>
              <DialogDescription className="font-serif">Update the details for {editingStaff.name}.</DialogDescription>
            </DialogHeader>
            <StaffForm
              initialData={editingStaff}
              onClose={() => setEditingStaff(null)}
              onSave={(updatedStaff) => {
                setStaff(staff.map((s) => (s.id === editingStaff.id ? { ...updatedStaff, id: editingStaff.id } : s)))
                setEditingStaff(null)
              }}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

interface StaffFormProps {
  initialData?: StaffMember
  onClose: () => void
  onSave: (staff: Omit<StaffMember, "id">) => void
}

function StaffForm({ initialData, onClose, onSave }: StaffFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    email: initialData?.email || "",
    phone: initialData?.phone || "",
    role: initialData?.role || ("staff" as UserRole),
    department: initialData?.department || "",
    hireDate: initialData?.hireDate || new Date().toISOString().split("T")[0],
    status: initialData?.status || ("active" as const),
    bio: initialData?.bio || "",
    specialties: initialData?.specialties?.join(", ") || "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      ...formData,
      specialties: formData.specialties
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="font-serif">
            Full Name
          </Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email" className="font-serif">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="department" className="font-serif">
            Department
          </Label>
          <Input
            id="department"
            value={formData.department}
            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="role" className="font-serif">
            Role
          </Label>
          <Select value={formData.role} onValueChange={(value: UserRole) => setFormData({ ...formData, role: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="manager">Manager</SelectItem>
              <SelectItem value="dj">DJ</SelectItem>
              <SelectItem value="staff">Staff</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="status" className="font-serif">
            Status
          </Label>
          <Select
            value={formData.status}
            onValueChange={(value: "active" | "inactive" | "on-leave") => setFormData({ ...formData, status: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="on-leave">On Leave</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="hireDate" className="font-serif">
            Hire Date
          </Label>
          <Input
            id="hireDate"
            type="date"
            value={formData.hireDate}
            onChange={(e) => setFormData({ ...formData, hireDate: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="specialties" className="font-serif">
          Specialties (comma-separated)
        </Label>
        <Input
          id="specialties"
          value={formData.specialties}
          onChange={(e) => setFormData({ ...formData, specialties: e.target.value })}
          placeholder="Rock Music, Live Shows, Audio Production"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio" className="font-serif">
          Bio
        </Label>
        <Textarea
          id="bio"
          value={formData.bio}
          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          placeholder="Brief description of the staff member..."
          rows={3}
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose} className="font-serif bg-transparent">
          Cancel
        </Button>
        <Button type="submit" className="font-sans font-bold">
          {initialData ? "Update" : "Add"} Staff Member
        </Button>
      </div>
    </form>
  )
}
