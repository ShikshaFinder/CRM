"use client"

import * as React from "react"
import {
  Line,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "@/components/ui/chart"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { procurementVolumeChartConfig } from "@/lib/chart-config"

type ProcurementEntry = {
  id: string
  datetime: string | null
  quantityL: number
}

type VolumePoint = {
  date: string
  volume: number
}

export function ProcurementVolumeChart() {
  const [data, setData] = React.useState<VolumePoint[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const res = await fetch("/api/procurements")
        if (!res.ok) {
          throw new Error(`Request failed: ${res.status}`)
        }
        const json = (await res.json()) as ProcurementEntry[]

        const byDay = new Map<string, number>()
        for (const entry of json) {
          if (!entry.datetime) continue
          const d = new Date(entry.datetime)
          const key = d.toISOString().slice(0, 10) // YYYY-MM-DD
          const existing = byDay.get(key) ?? 0
          byDay.set(key, existing + (entry.quantityL || 0))
        }

        const points: VolumePoint[] = Array.from(byDay.entries())
          .sort(([a], [b]) => (a < b ? -1 : 1))
          .slice(-30) // last 30 days
          .map(([date, volume]) => ({ date, volume }))

        if (!cancelled) {
          setData(points)
        }
      } catch (err: any) {
        if (!cancelled) {
          setError("Failed to load procurement summary")
          // eslint-disable-next-line no-console
          console.error(err)
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  if (loading) {
    return (
      <div className="flex h-[260px] w-full items-center justify-center text-sm text-gray-500">
        Loading procurement chart...
      </div>
    )
  }

  if (error || data.length === 0) {
    return (
      <div className="flex h-[260px] w-full items-center justify-center text-sm text-gray-500">
        {error ?? "No procurement data available yet."}
      </div>
    )
  }

  const chartData = data

  return (
    <ChartContainer
      config={{
        volume: {
          label: "Milk volume (L)",
          color: "var(--chart-4)",
        },
        ...procurementVolumeChartConfig,
      }}
      className="min-h-[260px] w-full"
    >
      <LineChart
        data={chartData}
        margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value: string) =>
            new Date(value).toLocaleDateString("en-IN", {
              month: "short",
              day: "numeric",
            })
          }
        />
        <YAxis tickLine={false} axisLine={false} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Line
          type="monotone"
          dataKey="volume"
          stroke="var(--color-volume)"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4 }}
        />
      </LineChart>
    </ChartContainer>
  )
}


