"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Search, MapPin, Droplets, Wind, Eye, Gauge, Sun, Cloud, CloudRain, CloudSnow, Zap } from "lucide-react"

interface WeatherData {
  location: string
  temperature: number
  condition: string
  description: string
  humidity: number
  windSpeed: number
  visibility: number
  pressure: number
  feelsLike: number
  uvIndex: number
  hourlyForecast: Array<{
    time: string
    temp: number
    condition: string
  }>
}

const mockWeatherData: WeatherData = {
  location: "San Francisco, CA",
  temperature: 22,
  condition: "partly-cloudy",
  description: "Partly Cloudy",
  humidity: 65,
  windSpeed: 12,
  visibility: 10,
  pressure: 1013,
  feelsLike: 24,
  uvIndex: 6,
  hourlyForecast: [
    { time: "12 PM", temp: 22, condition: "sunny" },
    { time: "1 PM", temp: 23, condition: "partly-cloudy" },
    { time: "2 PM", temp: 24, condition: "partly-cloudy" },
    { time: "3 PM", temp: 25, condition: "cloudy" },
    { time: "4 PM", temp: 24, condition: "cloudy" },
    { time: "5 PM", temp: 23, condition: "rainy" },
  ],
}

const getWeatherIcon = (condition: string, size: "sm" | "lg" = "sm") => {
  const iconSize = size === "lg" ? 48 : 20
  const iconClass = size === "lg" ? "text-white" : "text-muted-foreground"

  switch (condition) {
    case "sunny":
      return <Sun className={`h-${iconSize === 48 ? "12" : "5"} w-${iconSize === 48 ? "12" : "5"} ${iconClass}`} />
    case "partly-cloudy":
      return <Cloud className={`h-${iconSize === 48 ? "12" : "5"} w-${iconSize === 48 ? "12" : "5"} ${iconClass}`} />
    case "cloudy":
      return <Cloud className={`h-${iconSize === 48 ? "12" : "5"} w-${iconSize === 48 ? "12" : "5"} ${iconClass}`} />
    case "rainy":
      return (
        <CloudRain className={`h-${iconSize === 48 ? "12" : "5"} w-${iconSize === 48 ? "12" : "5"} ${iconClass}`} />
      )
    case "snowy":
      return (
        <CloudSnow className={`h-${iconSize === 48 ? "12" : "5"} w-${iconSize === 48 ? "12" : "5"} ${iconClass}`} />
      )
    case "stormy":
      return <Zap className={`h-${iconSize === 48 ? "12" : "5"} w-${iconSize === 48 ? "12" : "5"} ${iconClass}`} />
    default:
      return <Sun className={`h-${iconSize === 48 ? "12" : "5"} w-${iconSize === 48 ? "12" : "5"} ${iconClass}`} />
  }
}

export function WeatherApp() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setWeatherData(mockWeatherData)
      setLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  const handleSearch = () => {
    if (!searchQuery.trim()) return

    setLoading(true)
    // Simulate search API call
    setTimeout(() => {
      setWeatherData({
        ...mockWeatherData,
        location: searchQuery,
      })
      setLoading(false)
    }, 1000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader>
            <Skeleton className="h-8 w-48 bg-white/20" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-20 w-full bg-white/20" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-16 bg-white/20" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!weatherData) return null

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Search Bar */}
      <Card className="bg-white/10 backdrop-blur-md border-white/20">
        <CardContent className="pt-6">
          <div className="flex gap-2">
            <Input
              placeholder="Search for a city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="bg-white/20 border-white/30 text-white placeholder:text-white/70"
            />
            <Button onClick={handleSearch} size="icon" className="bg-white/20 hover:bg-white/30 border-white/30">
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Current Weather */}
      <Card className="bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <MapPin className="h-5 w-5" />
            {weatherData.location}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              {getWeatherIcon(weatherData.condition, "lg")}
              <div>
                <div className="text-5xl font-bold text-white">{weatherData.temperature}°</div>
                <div className="text-white/80">{weatherData.description}</div>
              </div>
            </div>
            <div className="text-right text-white/80">
              <div>Feels like {weatherData.feelsLike}°</div>
            </div>
          </div>

          {/* Weather Details Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/10 rounded-lg p-3">
              <div className="flex items-center gap-2 text-white/80 mb-1">
                <Droplets className="h-4 w-4" />
                <span className="text-sm">Humidity</span>
              </div>
              <div className="text-xl font-semibold text-white">{weatherData.humidity}%</div>
            </div>

            <div className="bg-white/10 rounded-lg p-3">
              <div className="flex items-center gap-2 text-white/80 mb-1">
                <Wind className="h-4 w-4" />
                <span className="text-sm">Wind</span>
              </div>
              <div className="text-xl font-semibold text-white">{weatherData.windSpeed} km/h</div>
            </div>

            <div className="bg-white/10 rounded-lg p-3">
              <div className="flex items-center gap-2 text-white/80 mb-1">
                <Eye className="h-4 w-4" />
                <span className="text-sm">Visibility</span>
              </div>
              <div className="text-xl font-semibold text-white">{weatherData.visibility} km</div>
            </div>

            <div className="bg-white/10 rounded-lg p-3">
              <div className="flex items-center gap-2 text-white/80 mb-1">
                <Gauge className="h-4 w-4" />
                <span className="text-sm">Pressure</span>
              </div>
              <div className="text-xl font-semibold text-white">{weatherData.pressure} mb</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hourly Forecast */}
      <Card className="bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Hourly Forecast</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {weatherData.hourlyForecast.map((hour, index) => (
              <div key={index} className="flex-shrink-0 bg-white/10 rounded-lg p-3 text-center min-w-[80px]">
                <div className="text-white/80 text-sm mb-2">{hour.time}</div>
                <div className="flex justify-center mb-2">{getWeatherIcon(hour.condition)}</div>
                <div className="text-white font-semibold">{hour.temp}°</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
