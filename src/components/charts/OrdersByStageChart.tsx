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
import { ordersChartConfig } from "@/lib/chart-config"

type Order = {
  id: string
  stage: string
}

type StagePoint = {
  stage: string
  count: number
}

export function OrdersByStageChart() {
  const [data, setData] = React.useState<StagePoint[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const res = await fetch("/api/orders", {
          credentials: 'include',
        })
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}))
          throw new Error(errorData.error || `Request failed: ${res.status}`)
        }
        const json = (await res.json()) as Order[]
        if (!Array.isArray(json)) {
          throw new Error("Invalid response format")
        }

        const byStage = new Map<string, number>()
        for (const order of json) {
          const key = (order.stage || "Unknown").toLowerCase()
          const existing = byStage.get(key) ?? 0
          byStage.set(key, existing + 1)
        }

        const points: StagePoint[] = Array.from(byStage.entries())
          .map(([stage, count]) => ({
            stage: stage.replace(/_/g, " "),
            count,
          }))
          .sort((a, b) => b.count - a.count)

        if (!cancelled) {
          setData(points)
        }
      } catch (err: any) {
        if (!cancelled) {
          setError(err.message || "Failed to load orders summary")
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
        Loading orders chart...
      </div>
    )
  }

  if (error || data.length === 0) {
    return (
      <div className="flex h-[220px] w-full items-center justify-center text-sm text-gray-500">
        {error ?? "No orders data available yet."}
      </div>
    )
  }

  const chartData = data

  return (
    <ChartContainer
      config={{
        orders: {
          label: "Orders",
          color: "var(--chart-2)",
        },
        ...ordersChartConfig,
      }}
      className="min-h-[220px] w-full"
    >
      <BarChart
        data={chartData}
        margin={{ top: 8, right: 16, left: 8, bottom: 20 }}
      >
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis
          dataKey="stage"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
        />
        <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar
          dataKey="count"
          fill="var(--color-orders)"
          radius={[4, 4, 0, 0]}
          maxBarSize={40}
        />
      </BarChart>
    </ChartContainer>
  )
}


