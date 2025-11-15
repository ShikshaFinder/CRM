"use client"

import * as React from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
} from "@/components/ui/chart"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { revenueChartConfig } from "@/lib/chart-config"

type SalesSummaryRow = {
  month: string
  total: number
}

export function RevenueByMonthChart() {
  const [data, setData] = React.useState<SalesSummaryRow[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const res = await fetch("/api/analytics/sales-summary", {
          credentials: 'include',
        })
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}))
          throw new Error(errorData.error || `Request failed: ${res.status}`)
        }
        const json = (await res.json()) as SalesSummaryRow[]
        if (!cancelled) {
          setData(Array.isArray(json) ? json : [])
        }
      } catch (err: any) {
        if (!cancelled) {
          setError(err.message || "Failed to load revenue data")
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
        Loading revenue chart...
      </div>
    )
  }

  if (error || data.length === 0) {
    return (
      <div className="flex h-[220px] w-full items-center justify-center text-sm text-gray-500">
        {error ?? "No revenue data available yet."}
      </div>
    )
  }

  const chartData = data.map((row) => ({
    month: row.month,
    revenue: row.total,
  }))

  return (
    <ChartContainer
      config={{
        revenue: {
          label: "Revenue",
          color: "var(--chart-1)",
        },
        ...revenueChartConfig,
      }}
      className="min-h-[220px] w-full"
    >
      <BarChart
        data={chartData}
        accessibilityLayer
        margin={{ top: 8, right: 8, left: 8, bottom: 8 }}
      >
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value: string) => value.slice(0, 3)}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar
          dataKey="revenue"
          fill="var(--color-revenue)"
          radius={4}
          maxBarSize={32}
        />
      </BarChart>
    </ChartContainer>
  )
}


