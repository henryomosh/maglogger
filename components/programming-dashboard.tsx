"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ShowScheduling } from "./show-scheduling"
import { PlaylistManagement } from "./playlist-management"
import { useAuth } from "./auth-provider"
import {
  Calendar,
  Music,
  Radio,
  Clock,
  Users,
  Play,
  Pause,
  SkipForward,
  Volume2,
  Mic,
  Settings,
  BarChart3,
} from "lucide-react"

interface ProgrammingStats {
  totalShows: number
  liveShows: number
  scheduledToday: number
  totalPlaylists: number
  activePlaylists: number
  totalSongs: number
  averageShowDuration: string
  mostPopularGenre: string
}

interface LiveShow {
  id: string
  title: string
  dj: string
  startTime: string
  endTime: string
  currentSong?: {
    title: string
    artist: string
    duration: string
  }
  listeners: number
  status: "live" | "scheduled" | "ended"
}

// Mock data for programming dashboard
const mockStats: ProgrammingStats = {
  totalShows: 42,
  liveShows: 2,
  scheduledToday: 8,
  totalPlaylists: 15,
  activePlaylists: 8,
  totalSongs: 1247,
  averageShowDuration: "3h 15m",
  mostPopularGenre: "Rock",
}

const mockLiveShows: LiveShow[] = [
  {
    id: "1",
    title: "Afternoon Vibes",
    dj: "Mike DJ",
    startTime: "14:00",
    endTime: "18:00",
    currentSong: {
      title: "Bohemian Rhapsody",
      artist: "Queen",
      duration: "5:55",
    },
    listeners: 1247,
    status: "live",
  },
  {
    id: "2",
    title: "Drive Time Mix",
    dj: "Lisa DJ",
    startTime: "15:00",
    endTime: "17:00",
    currentSong: {
      title: "Hotel California",
      artist: "Eagles",
      duration: "6:30",
    },
    listeners: 892,
    status: "live",
  },
]

const upcomingShows = [
  { time: "18:00", show: "Evening Jazz", dj: "Tom DJ", duration: "3h" },
  { time: "21:00", show: "Night Beats", dj: "Alex DJ", duration: "4h" },
  { time: "01:00", show: "Late Night Classics", dj: "Sarah DJ", duration: "5h" },
]

const recentActivity = [
  { time: "2:45 PM", event: 'Mike DJ updated "Afternoon Vibes" playlist', type: "playlist" },
  { time: "2:30 PM", event: 'New show "Weekend Special" scheduled', type: "schedule" },
  { time: "1:15 PM", event: 'Tom DJ went live with "Evening Jazz"', type: "live" },
  { time: "12:45 PM", event: 'Playlist "Top 40 Hits" reached 1000 plays', type: "milestone" },
]

export function ProgrammingDashboard() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("overview")
  const [currentlyPlaying, setCurrentlyPlaying] = useState<LiveShow | null>(mockLiveShows[0])
  const [isPlaying, setIsPlaying] = useState(true)

  const canManagePrograms = user?.role === "admin" || user?.role === "manager"

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":")
    const hour = Number.parseInt(hours)
    const ampm = hour >= 12 ? "PM" : "AM"
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-sans font-bold text-foreground">Programming Dashboard</h1>
          <p className="text-muted-foreground font-serif mt-1">
            Manage shows, playlists, and live broadcasting operations.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="font-serif">
            <div className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></div>
            {mockStats.liveShows} Live Shows
          </Badge>
          {canManagePrograms && (
            <Button variant="outline" className="font-serif bg-transparent">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          )}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview" className="font-serif">
            Overview
          </TabsTrigger>
          <TabsTrigger value="scheduling" className="font-serif">
            Show Scheduling
          </TabsTrigger>
          <TabsTrigger value="playlists" className="font-serif">
            Playlist Management
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Stats Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-serif font-medium">Total Shows</CardTitle>
                <Radio className="h-4 w-4 text-chart-1" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-sans font-bold">{mockStats.totalShows}</div>
                <p className="text-xs text-muted-foreground font-serif">{mockStats.scheduledToday} scheduled today</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-serif font-medium">Live Shows</CardTitle>
                <Mic className="h-4 w-4 text-chart-2" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-sans font-bold">{mockStats.liveShows}</div>
                <p className="text-xs text-muted-foreground font-serif">
                  {mockLiveShows.reduce((sum, show) => sum + show.listeners, 0)} total listeners
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-serif font-medium">Playlists</CardTitle>
                <Music className="h-4 w-4 text-chart-3" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-sans font-bold">{mockStats.totalPlaylists}</div>
                <p className="text-xs text-muted-foreground font-serif">{mockStats.totalSongs} total songs</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-serif font-medium">Avg Duration</CardTitle>
                <Clock className="h-4 w-4 text-chart-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-sans font-bold">{mockStats.averageShowDuration}</div>
                <p className="text-xs text-muted-foreground font-serif">{mockStats.mostPopularGenre} most popular</p>
              </CardContent>
            </Card>
          </div>

          {/* Live Shows & Upcoming */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Live Shows */}
            <Card>
              <CardHeader>
                <CardTitle className="font-sans font-bold flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  Live Shows
                </CardTitle>
                <CardDescription className="font-serif">Currently broadcasting</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockLiveShows.map((show) => (
                    <div key={show.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center">
                          <Radio className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <p className="font-sans font-bold">{show.title}</p>
                          <p className="text-sm text-muted-foreground font-serif">
                            {show.dj} • {formatTime(show.startTime)} - {formatTime(show.endTime)}
                          </p>
                          {show.currentSong && (
                            <p className="text-xs text-muted-foreground font-serif">
                              Now: {show.currentSong.title} - {show.currentSong.artist}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2 text-sm font-serif">
                          <Users className="h-4 w-4" />
                          {show.listeners.toLocaleString()}
                        </div>
                        <Badge variant="destructive" className="font-serif text-xs mt-1">
                          LIVE
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Shows */}
            <Card>
              <CardHeader>
                <CardTitle className="font-sans font-bold">Upcoming Shows</CardTitle>
                <CardDescription className="font-serif">Next scheduled programming</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingShows.map((show, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-serif font-medium">{formatTime(show.time)}</span>
                        </div>
                        <div>
                          <p className="text-sm font-sans font-bold">{show.show}</p>
                          <p className="text-xs text-muted-foreground font-serif">with {show.dj}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="font-serif text-xs">
                        {show.duration}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity & Quick Actions */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="font-sans font-bold">Recent Programming Activity</CardTitle>
                <CardDescription className="font-serif">Latest updates and changes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground font-serif">{activity.time}</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-serif">{activity.event}</p>
                      </div>
                      <Badge variant="outline" className="font-serif text-xs">
                        {activity.type}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="font-sans font-bold">Quick Actions</CardTitle>
                <CardDescription className="font-serif">Common programming tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {canManagePrograms ? (
                    <>
                      <Button
                        variant="outline"
                        className="justify-start font-serif bg-transparent"
                        onClick={() => setActiveTab("scheduling")}
                      >
                        <Calendar className="h-4 w-4 mr-2" />
                        Schedule New Show
                      </Button>
                      <Button
                        variant="outline"
                        className="justify-start font-serif bg-transparent"
                        onClick={() => setActiveTab("playlists")}
                      >
                        <Music className="h-4 w-4 mr-2" />
                        Create Playlist
                      </Button>
                      <Button variant="outline" className="justify-start font-serif bg-transparent">
                        <BarChart3 className="h-4 w-4 mr-2" />
                        View Analytics
                      </Button>
                      <Button variant="outline" className="justify-start font-serif bg-transparent">
                        <Settings className="h-4 w-4 mr-2" />
                        Broadcast Settings
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="outline"
                        className="justify-start font-serif bg-transparent"
                        onClick={() => setActiveTab("playlists")}
                      >
                        <Music className="h-4 w-4 mr-2" />
                        My Playlists
                      </Button>
                      <Button
                        variant="outline"
                        className="justify-start font-serif bg-transparent"
                        onClick={() => setActiveTab("scheduling")}
                      >
                        <Calendar className="h-4 w-4 mr-2" />
                        My Schedule
                      </Button>
                      <Button variant="outline" className="justify-start font-serif bg-transparent">
                        <Radio className="h-4 w-4 mr-2" />
                        Go Live
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Live Control Panel */}
          {currentlyPlaying && (
            <Card>
              <CardHeader>
                <CardTitle className="font-sans font-bold">Live Control Panel</CardTitle>
                <CardDescription className="font-serif">Monitor and control live broadcasts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-16 h-16 bg-red-500 rounded-lg flex items-center justify-center">
                      <Radio className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <p className="font-sans font-bold text-lg">{currentlyPlaying.title}</p>
                      <p className="text-muted-foreground font-serif">
                        {currentlyPlaying.dj} • {currentlyPlaying.listeners.toLocaleString()} listeners
                      </p>
                      {currentlyPlaying.currentSong && (
                        <p className="text-sm text-muted-foreground font-serif">
                          Now Playing: {currentlyPlaying.currentSong.title} - {currentlyPlaying.currentSong.artist}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <SkipForward className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setIsPlaying(!isPlaying)}>
                      {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                    </Button>
                    <Button variant="outline" size="sm">
                      <Volume2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="text-right">
                    <Badge variant="destructive" className="font-serif">
                      LIVE
                    </Badge>
                    <p className="text-sm text-muted-foreground font-serif mt-1">
                      {formatTime(currentlyPlaying.startTime)} - {formatTime(currentlyPlaying.endTime)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="scheduling">
          <ShowScheduling />
        </TabsContent>

        <TabsContent value="playlists">
          <PlaylistManagement />
        </TabsContent>
      </Tabs>
    </div>
  )
}
