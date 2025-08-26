// @ts-nocheck
"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
import { useAuth } from "./auth-provider"
import {
  Plus,
  Edit,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  Music,
  Search,
  MoreVertical,
  Trash2,
  Copy,
  Share,
  Download,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface Song {
  id: string
  title: string
  artist: string
  album: string
  duration: string // in MM:SS format
  genre: string
  year: number
  bpm?: number
  explicit: boolean
  fileUrl?: string
}

interface Playlist {
  id: string
  name: string
  description: string
  createdBy: string
  createdByName: string
  category: string
  isPublic: boolean
  totalDuration: string
  songCount: number
  songs: Song[]
  createdAt: string
  updatedAt: string
  color: string
}

// Mock songs data
const mockSongs: Song[] = [
  {
    id: "1",
    title: "Bohemian Rhapsody",
    artist: "Queen",
    album: "A Night at the Opera",
    duration: "5:55",
    genre: "Rock",
    year: 1975,
    bpm: 72,
    explicit: false,
  },
  {
    id: "2",
    title: "Hotel California",
    artist: "Eagles",
    album: "Hotel California",
    duration: "6:30",
    genre: "Rock",
    year: 1976,
    bpm: 75,
    explicit: false,
  },
  {
    id: "3",
    title: "Billie Jean",
    artist: "Michael Jackson",
    album: "Thriller",
    duration: "4:54",
    genre: "Pop",
    year: 1982,
    bpm: 117,
    explicit: false,
  },
  {
    id: "4",
    title: "Sweet Child O' Mine",
    artist: "Guns N' Roses",
    album: "Appetite for Destruction",
    duration: "5:03",
    genre: "Rock",
    year: 1987,
    bpm: 125,
    explicit: false,
  },
  {
    id: "5",
    title: "Smells Like Teen Spirit",
    artist: "Nirvana",
    album: "Nevermind",
    duration: "5:01",
    genre: "Grunge",
    year: 1991,
    bpm: 117,
    explicit: false,
  },
]

// Mock playlists data
const mockPlaylists: Playlist[] = [
  {
    id: "1",
    name: "Morning Drive Hits",
    description: "Upbeat songs perfect for the morning commute",
    createdBy: "3",
    createdByName: "Mike DJ",
    category: "Morning Show",
    isPublic: true,
    totalDuration: "2:15:30",
    songCount: 25,
    songs: [mockSongs[0], mockSongs[2], mockSongs[4]],
    createdAt: "2024-01-15",
    updatedAt: "2024-01-20",
    color: "bg-blue-500",
  },
  {
    id: "2",
    name: "Classic Rock Essentials",
    description: "Timeless rock classics that never get old",
    createdBy: "5",
    createdByName: "Tom DJ",
    category: "Rock",
    isPublic: true,
    totalDuration: "3:45:20",
    songCount: 42,
    songs: [mockSongs[0], mockSongs[1], mockSongs[3]],
    createdAt: "2024-01-10",
    updatedAt: "2024-01-18",
    color: "bg-purple-500",
  },
  {
    id: "3",
    name: "Late Night Vibes",
    description: "Smooth and mellow tracks for late night listening",
    createdBy: "6",
    createdByName: "Alex DJ",
    category: "Night Show",
    isPublic: false,
    totalDuration: "4:20:15",
    songCount: 38,
    songs: [mockSongs[2]],
    createdAt: "2024-01-12",
    updatedAt: "2024-01-19",
    color: "bg-indigo-500",
  },
  {
    id: "4",
    name: "Top 40 Current",
    description: "Current chart-toppers and trending hits",
    createdBy: "4",
    createdByName: "Lisa Staff",
    category: "Pop",
    isPublic: true,
    totalDuration: "1:58:45",
    songCount: 30,
    songs: [mockSongs[2], mockSongs[4]],
    createdAt: "2024-01-14",
    updatedAt: "2024-01-21",
    color: "bg-pink-500",
  },
]

export function PlaylistManagement() {
  const { user } = useAuth()
  const [playlists, setPlaylists] = useState<Playlist[]>(mockPlaylists)
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState<string>("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingPlaylist, setEditingPlaylist] = useState<Playlist | null>(null)
  const [currentlyPlaying, setCurrentlyPlaying] = useState<Song | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const filteredPlaylists = playlists.filter((playlist) => {
    const matchesSearch =
      playlist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      playlist.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === "all" || playlist.category === filterCategory
    const hasAccess = playlist.isPublic || playlist.createdBy === user?.id
    return matchesSearch && matchesCategory && hasAccess
  })

  const categories = Array.from(new Set(playlists.map((p) => p.category)))

  const handlePlayPause = (song?: Song) => {
    if (song && song.id !== currentlyPlaying?.id) {
      setCurrentlyPlaying(song)
      setIsPlaying(true)
    } else {
      setIsPlaying(!isPlaying)
    }
  }

  const formatDuration = (duration: string) => {
    return duration
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-sans font-bold text-foreground">Music Playlist Management</h1>
          <p className="text-muted-foreground font-serif mt-1">Create and manage playlists for your radio shows.</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="font-sans font-bold">
              <Plus className="h-4 w-4 mr-2" />
              Create Playlist
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="font-sans font-bold">Create New Playlist</DialogTitle>
              <DialogDescription className="font-serif">Create a new playlist for your shows.</DialogDescription>
            </DialogHeader>
            <PlaylistForm
              onClose={() => setIsAddDialogOpen(false)}
              onSave={(newPlaylist) => {
                setPlaylists([...playlists, { ...newPlaylist, id: Date.now().toString() }])
                setIsAddDialogOpen(false)
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search playlists..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 font-serif"
                />
              </div>
            </div>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Playlists Grid */}
        <div className="lg:col-span-2">
          <div className="grid gap-4 md:grid-cols-2">
            {filteredPlaylists.map((playlist) => (
              <Card
                key={playlist.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedPlaylist?.id === playlist.id ? "ring-2 ring-accent" : ""
                }`}
                onClick={() => setSelectedPlaylist(playlist)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-lg ${playlist.color} flex items-center justify-center`}>
                        <Music className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg font-sans font-bold">{playlist.name}</CardTitle>
                        <p className="text-sm text-muted-foreground font-serif">{playlist.category}</p>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation()
                            setEditingPlaylist(playlist)
                          }}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Playlist
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                          <Copy className="h-4 w-4 mr-2" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                          <Share className="h-4 w-4 mr-2" />
                          Share
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                          <Download className="h-4 w-4 mr-2" />
                          Export
                        </DropdownMenuItem>
                        {playlist.createdBy === user?.id && (
                          <DropdownMenuItem onClick={(e) => e.stopPropagation()} className="text-destructive">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex gap-2">
                    <Badge variant="outline" className="font-serif text-xs">
                      {playlist.songCount} songs
                    </Badge>
                    <Badge variant="outline" className="font-serif text-xs">
                      {playlist.totalDuration}
                    </Badge>
                    {!playlist.isPublic && (
                      <Badge variant="secondary" className="font-serif text-xs">
                        Private
                      </Badge>
                    )}
                  </div>

                  <p className="text-sm text-muted-foreground font-serif line-clamp-2">{playlist.description}</p>

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="font-serif">by {playlist.createdByName}</span>
                    <span className="font-serif">Updated {new Date(playlist.updatedAt).toLocaleDateString()}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredPlaylists.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <Music className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground font-serif">No playlists found matching your criteria.</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Playlist Details */}
        <div className="lg:col-span-1">
          {selectedPlaylist ? (
            <Card className="sticky top-6">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className={`w-16 h-16 rounded-lg ${selectedPlaylist.color} flex items-center justify-center`}>
                    <Music className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <CardTitle className="font-sans font-bold">{selectedPlaylist.name}</CardTitle>
                    <p className="text-sm text-muted-foreground font-serif">{selectedPlaylist.category}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm font-serif">{selectedPlaylist.description}</p>

                <div className="flex gap-2">
                  <Badge className="font-serif text-xs">{selectedPlaylist.songCount} songs</Badge>
                  <Badge className="font-serif text-xs">{selectedPlaylist.totalDuration}</Badge>
                </div>

                <div className="space-y-2">
                  <h4 className="font-sans font-bold text-sm">Songs</h4>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {selectedPlaylist.songs.map((song, index) => (
                      <div key={song.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50">
                        <span className="text-xs text-muted-foreground font-serif w-6">{index + 1}</span>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handlePlayPause(song)}>
                          {currentlyPlaying?.id === song.id && isPlaying ? (
                            <Pause className="h-4 w-4" />
                          ) : (
                            <Play className="h-4 w-4" />
                          )}
                        </Button>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-serif font-medium truncate">{song.title}</p>
                          <p className="text-xs text-muted-foreground font-serif truncate">{song.artist}</p>
                        </div>
                        <span className="text-xs text-muted-foreground font-serif">{song.duration}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1 font-serif">
                      <Play className="h-4 w-4 mr-2" />
                      Play All
                    </Button>
                    <Button variant="outline" size="sm" className="font-serif bg-transparent">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <Music className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground font-serif">Select a playlist to view details</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Now Playing Bar */}
      {currentlyPlaying && (
        <Card className="fixed bottom-4 left-4 right-4 lg:left-72 shadow-lg">
          <CardContent className="py-3">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                  <Music className="h-6 w-6 text-muted-foreground" />
                </div>
                <div className="min-w-0">
                  <p className="font-serif font-medium truncate">{currentlyPlaying.title}</p>
                  <p className="text-sm text-muted-foreground font-serif truncate">{currentlyPlaying.artist}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm">
                  <SkipBack className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handlePlayPause()}>
                  {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                </Button>
                <Button variant="ghost" size="sm">
                  <SkipForward className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm">
                  <Volume2 className="h-4 w-4" />
                </Button>
                <span className="text-sm font-serif text-muted-foreground">{currentlyPlaying.duration}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Edit Playlist Dialog */}
      {editingPlaylist && (
        <Dialog open={!!editingPlaylist} onOpenChange={() => setEditingPlaylist(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="font-sans font-bold">Edit Playlist</DialogTitle>
              <DialogDescription className="font-serif">
                Update the details for {editingPlaylist.name}.
              </DialogDescription>
            </DialogHeader>
            <PlaylistForm
              initialData={editingPlaylist}
              onClose={() => setEditingPlaylist(null)}
              onSave={(updatedPlaylist) => {
                setPlaylists(
                  playlists.map((p) =>
                    p.id === editingPlaylist.id ? { ...updatedPlaylist, id: editingPlaylist.id } : p,
                  ),
                )
                setEditingPlaylist(null)
              }}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

interface PlaylistFormProps {
  initialData?: Playlist
  onClose: () => void
  onSave: (playlist: Omit<Playlist, "id">) => void
}

function PlaylistForm({ initialData, onClose, onSave }: PlaylistFormProps) {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    category: initialData?.category || "General",
    isPublic: initialData?.isPublic || true,
    color: initialData?.color || "bg-blue-500",
  })

  const playlistColors = [
    { value: "bg-blue-500", label: "Blue" },
    { value: "bg-green-500", label: "Green" },
    { value: "bg-purple-500", label: "Purple" },
    { value: "bg-pink-500", label: "Pink" },
    { value: "bg-orange-500", label: "Orange" },
    { value: "bg-red-500", label: "Red" },
    { value: "bg-indigo-500", label: "Indigo" },
    { value: "bg-teal-500", label: "Teal" },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      ...formData,
      createdBy: user?.id || "",
      createdByName: user?.name || "",
      totalDuration: "0:00:00",
      songCount: 0,
      songs: initialData?.songs || [],
      createdAt: initialData?.createdAt || new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="font-serif">
            Playlist Name
          </Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category" className="font-serif">
            Category
          </Label>
          <Input
            id="category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="font-serif">
          Description
        </Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Brief description of the playlist..."
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="color" className="font-serif">
            Color Theme
          </Label>
          <Select value={formData.color} onValueChange={(value) => setFormData({ ...formData, color: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {playlistColors.map((color) => (
                <SelectItem key={color.value} value={color.value}>
                  <div className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded-full ${color.value}`}></div>
                    {color.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="font-serif">Visibility</Label>
          <div className="flex items-center space-x-2 pt-2">
            <input
              type="checkbox"
              id="isPublic"
              checked={formData.isPublic}
              onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
              className="rounded border-border"
            />
            <Label htmlFor="isPublic" className="font-serif">
              Make playlist public
            </Label>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose} className="font-serif bg-transparent">
          Cancel
        </Button>
        <Button type="submit" className="font-sans font-bold">
          {initialData ? "Update" : "Create"} Playlist
        </Button>
      </div>
    </form>
  )
}
