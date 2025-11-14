"use client"

import * as React from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "@/components/ui/chart"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { campaignsChartConfig } from "@/lib/chart-config"

type Campaign = {
  id: string
  createdAt: string
}

type CampaignPoint = {
  month: string
  campaigns: number
}

export function CampaignsByMonthChart() {
  const [data, setData] = React.useState<CampaignPoint[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const res = await fetch("/api/marketing/campaigns")
        if (!res.ok) {
          throw new Error(`Request failed: ${res.status}`)
        }
        const json = (await res.json()) as Campaign[]

        const byMonth = new Map<string, number>()
        for (const c of json) {
          const created = new Date(c.createdAt)
          const key = `${created.getFullYear()}-${String(
            created.getMonth() + 1
          ).padStart(2, "0")}`
          const existing = byMonth.get(key) ?? 0
          byMonth.set(key, existing + 1)
        }

        const points: CampaignPoint[] = Array.from(byMonth.entries())
          .sort(([a], [b]) => (a < b ? -1 : 1))
          .slice(-12) // last 12 months
          .map(([month, campaigns]) => ({ month, campaigns }))

        if (!cancelled) {
          setData(points)
        }
      } catch (err: any) {
        if (!cancelled) {
          setError("Failed to load campaigns summary")
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
      <div className="flex h-[220px] w-full items-center justify-center text-sm text-gray-500">
        Loading campaigns chart...
      </div>
    )
  }

  if (error || data.length === 0) {
    return (
      <div className="flex h-[220px] w-full items-center justify-center text-sm text-gray-500">
        {error ?? "No campaign data available yet."}
      </div>
    )
  }

  const chartData = data

  return (
    <ChartContainer
      config={{
        campaigns: {
          label: "Campaigns",
          color: "var(--chart-5)",
        },
        ...campaignsChartConfig,
      }}
      className="min-h-[220px] w-full"
    >
      <BarChart
        data={chartData}
        margin={{ top: 8, right: 16, left: 8, bottom: 20 }}
      >
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value: string) => value.slice(0, 7)}
        />
        <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar
          dataKey="campaigns"
          fill="var(--color-campaigns)"
          radius={[4, 4, 0, 0]}
          maxBarSize={40}
        />
      </BarChart>
    </ChartContainer>
  )
}


