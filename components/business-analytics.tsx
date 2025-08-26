// @ts-nocheck
"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts"
import { useAuth } from "./auth-provider"
import { DollarSign, TrendingUp, TrendingDown, Users, Radio, Target, BarChart3, Download } from "lucide-react"

// Mock data for business analytics
const revenueData = [
  { month: "Jan", revenue: 8500, expenses: 6200, profit: 2300, ads: 45, sponsors: 12 },
  { month: "Feb", revenue: 9200, expenses: 6800, profit: 2400, ads: 52, sponsors: 15 },
  { month: "Mar", revenue: 10100, expenses: 7200, profit: 2900, ads: 58, sponsors: 18 },
  { month: "Apr", revenue: 11300, expenses: 7800, profit: 3500, ads: 62, sponsors: 20 },
  { month: "May", revenue: 12450, expenses: 8200, profit: 4250, ads: 68, sponsors: 22 },
  { month: "Jun", revenue: 13200, expenses: 8600, profit: 4600, ads: 72, sponsors: 25 },
]

const listenerData = [
  { time: "6AM", listeners: 1200, shows: 2 },
  { time: "9AM", listeners: 2800, shows: 3 },
  { time: "12PM", listeners: 3200, shows: 4 },
  { time: "3PM", listeners: 4100, shows: 3 },
  { time: "6PM", listeners: 3800, shows: 2 },
  { time: "9PM", listeners: 2400, shows: 2 },
  { time: "12AM", listeners: 800, shows: 1 },
]

const revenueSourcesData = [
  { name: "Advertising", value: 7200, color: "hsl(var(--chart-1))" },
  { name: "Sponsorships", value: 3800, color: "hsl(var(--chart-2))" },
  { name: "Events", value: 1450, color: "hsl(var(--chart-3))" },
  { name: "Merchandise", value: 650, color: "hsl(var(--chart-4))" },
  { name: "Other", value: 350, color: "hsl(var(--chart-5))" },
]

const showPerformanceData = [
  { show: "Morning Drive", listeners: 3200, revenue: 2800, rating: 4.8, growth: 12 },
  { show: "Afternoon Vibes", listeners: 2800, revenue: 2400, rating: 4.6, growth: 8 },
  { show: "Evening Jazz", listeners: 2200, revenue: 1900, rating: 4.7, growth: 15 },
  { show: "Night Beats", listeners: 1800, revenue: 1600, rating: 4.5, growth: -3 },
  { show: "Weekend Special", listeners: 1500, revenue: 1200, rating: 4.3, growth: 22 },
]

const kpiData = [
  {
    title: "Monthly Revenue",
    value: "$13,200",
    change: "+15.2%",
    trend: "up",
    icon: DollarSign,
    color: "text-chart-1",
  },
  {
    title: "Active Listeners",
    value: "24,800",
    change: "+8.7%",
    trend: "up",
    icon: Users,
    color: "text-chart-2",
  },
  {
    title: "Ad Revenue",
    value: "$7,200",
    change: "+12.3%",
    trend: "up",
    icon: Target,
    color: "text-chart-3",
  },
  {
    title: "Show Rating",
    value: "4.6/5",
    change: "+0.2",
    trend: "up",
    icon: Radio,
    color: "text-chart-4",
  },
]

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(var(--chart-1))",
  },
  expenses: {
    label: "Expenses",
    color: "hsl(var(--chart-2))",
  },
  profit: {
    label: "Profit",
    color: "hsl(var(--chart-3))",
  },
  listeners: {
    label: "Listeners",
    color: "hsl(var(--chart-1))",
  },
  shows: {
    label: "Shows",
    color: "hsl(var(--chart-2))",
  },
}

export function BusinessAnalytics() {
  const { user } = useAuth()
  const [selectedPeriod, setSelectedPeriod] = useState("6months")
  const [activeTab, setActiveTab] = useState("overview")

  const canViewAnalytics = user?.role === "admin" || user?.role === "manager"

  if (!canViewAnalytics) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="py-12 text-center">
            <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground font-serif">You don't have permission to view business analytics.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-sans font-bold text-foreground">Business Analytics</h1>
          <p className="text-muted-foreground font-serif mt-1">Track revenue, performance, and key business metrics.</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1month">Last Month</SelectItem>
              <SelectItem value="3months">Last 3 Months</SelectItem>
              <SelectItem value="6months">Last 6 Months</SelectItem>
              <SelectItem value="1year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="font-serif bg-transparent">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="font-serif">
            Overview
          </TabsTrigger>
          <TabsTrigger value="revenue" className="font-serif">
            Revenue
          </TabsTrigger>
          <TabsTrigger value="audience" className="font-serif">
            Audience
          </TabsTrigger>
          <TabsTrigger value="performance" className="font-serif">
            Performance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* KPI Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {kpiData.map((kpi) => (
              <Card key={kpi.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-serif font-medium">{kpi.title}</CardTitle>
                  <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-sans font-bold">{kpi.value}</div>
                  <div className="flex items-center gap-1 text-xs">
                    {kpi.trend === "up" ? (
                      <TrendingUp className="h-3 w-3 text-green-500" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-red-500" />
                    )}
                    <span className={`font-serif ${kpi.trend === "up" ? "text-green-500" : "text-red-500"}`}>
                      {kpi.change}
                    </span>
                    <span className="text-muted-foreground font-serif">vs last period</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Revenue Overview Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="font-sans font-bold">Revenue Overview</CardTitle>
              <CardDescription className="font-serif">Monthly revenue, expenses, and profit trends</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig}>
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Bar dataKey="revenue" fill="var(--color-revenue)" />
                  <Bar dataKey="expenses" fill="var(--color-expenses)" />
                  <Bar dataKey="profit" fill="var(--color-profit)" />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Revenue Sources & Listener Trends */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="font-sans font-bold">Revenue Sources</CardTitle>
                <CardDescription className="font-serif">Breakdown of income streams</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig}>
                  <PieChart>
                    <Pie
                      data={revenueSourcesData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, percent }) => {
                        if (!name || percent === undefined) return ""
                        return `${name} ${(percent * 100).toFixed(0)}%`
                      }}
                    >
                      {revenueSourcesData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-sans font-bold">Daily Listener Trends</CardTitle>
                <CardDescription className="font-serif">Average listeners throughout the day</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig}>
                  <AreaChart data={listenerData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area
                      type="monotone"
                      dataKey="listeners"
                      stroke="var(--color-listeners)"
                      fill="var(--color-listeners)"
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-6">
          {/* Revenue Metrics */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="font-sans font-bold">Total Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-sans font-bold text-chart-1">$13,200</div>
                <p className="text-sm text-muted-foreground font-serif">+15.2% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="font-sans font-bold">Ad Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-sans font-bold text-chart-2">$7,200</div>
                <p className="text-sm text-muted-foreground font-serif">54.5% of total revenue</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="font-sans font-bold">Profit Margin</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-sans font-bold text-chart-3">34.8%</div>
                <p className="text-sm text-muted-foreground font-serif">+2.1% improvement</p>
              </CardContent>
            </Card>
          </div>

          {/* Revenue Trend Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="font-sans font-bold">Revenue Trend Analysis</CardTitle>
              <CardDescription className="font-serif">6-month revenue and profit trends</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Line type="monotone" dataKey="revenue" stroke="var(--color-revenue)" strokeWidth={3} />
                  <Line type="monotone" dataKey="profit" stroke="var(--color-profit)" strokeWidth={3} />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Ad Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="font-sans font-bold">Advertising Performance</CardTitle>
              <CardDescription className="font-serif">Monthly ad campaigns and sponsorships</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig}>
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="ads" fill="var(--color-revenue)" name="Ad Campaigns" />
                  <Bar dataKey="sponsors" fill="var(--color-profit)" name="Sponsorships" />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audience" className="space-y-6">
          {/* Audience Metrics */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader>
                <CardTitle className="font-sans font-bold">Total Listeners</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-sans font-bold text-chart-1">24,800</div>
                <p className="text-sm text-muted-foreground font-serif">+8.7% growth</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="font-sans font-bold">Peak Hours</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-sans font-bold text-chart-2">3-6 PM</div>
                <p className="text-sm text-muted-foreground font-serif">4,100 avg listeners</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="font-sans font-bold">Retention Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-sans font-bold text-chart-3">78%</div>
                <p className="text-sm text-muted-foreground font-serif">+5% improvement</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="font-sans font-bold">Avg Session</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-sans font-bold text-chart-4">45m</div>
                <p className="text-sm text-muted-foreground font-serif">+3 min increase</p>
              </CardContent>
            </Card>
          </div>

          {/* Listener Patterns */}
          <Card>
            <CardHeader>
              <CardTitle className="font-sans font-bold">Daily Listener Patterns</CardTitle>
              <CardDescription className="font-serif">Hourly listener distribution and show count</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig}>
                <AreaChart data={listenerData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Area
                    type="monotone"
                    dataKey="listeners"
                    stackId="1"
                    stroke="var(--color-listeners)"
                    fill="var(--color-listeners)"
                  />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          {/* Show Performance Table */}
          <Card>
            <CardHeader>
              <CardTitle className="font-sans font-bold">Show Performance Rankings</CardTitle>
              <CardDescription className="font-serif">Performance metrics by show</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {showPerformanceData.map((show, index) => (
                  <div key={show.show} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-sans font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-sans font-bold">{show.show}</p>
                        <p className="text-sm text-muted-foreground font-serif">
                          {show.listeners.toLocaleString()} listeners • Rating {show.rating}/5
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-right">
                      <div>
                        <p className="font-sans font-bold">${show.revenue.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground font-serif">Revenue</p>
                      </div>
                      <div className="flex items-center gap-1">
                        {show.growth > 0 ? (
                          <TrendingUp className="h-4 w-4 text-green-500" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-500" />
                        )}
                        <span className={`font-serif ${show.growth > 0 ? "text-green-500" : "text-red-500"}`}>
                          {show.growth > 0 ? "+" : ""}
                          {show.growth}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
