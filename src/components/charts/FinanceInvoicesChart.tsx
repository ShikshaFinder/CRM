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
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import { revenueChartConfig } from "@/lib/chart-config"

type Invoice = {
  id: string
  createdAt: string
  totalAmount: number
  payments: { amount: number }[]
}

type FinancePoint = {
  month: string
  invoiced: number
  paid: number
}

export function FinanceInvoicesChart() {
  const [data, setData] = React.useState<FinancePoint[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const res = await fetch("/api/finance/invoices", {
          credentials: 'include',
        })
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}))
          throw new Error(errorData.error || `Request failed: ${res.status}`)
        }
        const json = (await res.json()) as Invoice[]
        if (!Array.isArray(json)) {
          throw new Error("Invalid response format")
        }

        const byMonth = new Map<string, { invoiced: number; paid: number }>()

        for (const inv of json) {
          const created = new Date(inv.createdAt)
          const key = `${created.getFullYear()}-${String(
            created.getMonth() + 1
          ).padStart(2, "0")}`
          const bucket = byMonth.get(key) ?? { invoiced: 0, paid: 0 }
          bucket.invoiced += inv.totalAmount
          const paid = inv.payments?.reduce(
            (sum, p) => sum + (p.amount || 0),
            0
          )
          bucket.paid += paid
          byMonth.set(key, bucket)
        }

        const points: FinancePoint[] = Array.from(byMonth.entries())
          .sort(([a], [b]) => (a < b ? -1 : 1))
          .map(([month, value]) => ({
            month,
            invoiced: value.invoiced,
            paid: value.paid,
          }))

        if (!cancelled) {
          setData(points)
        }
      } catch (err: any) {
        if (!cancelled) {
          setError(err.message || "Failed to load finance summary")
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
        Loading finance chart...
      </div>
    )
  }

  if (error || data.length === 0) {
    return (
      <div className="flex h-[260px] w-full items-center justify-center text-sm text-gray-500">
        {error ?? "No invoice data available yet."}
      </div>
    )
  }

  const chartData = data.map((row) => ({
    month: row.month,
    invoiced: row.invoiced,
    paid: row.paid,
  }))

  return (
    <ChartContainer
      config={{
        invoiced: {
          label: "Invoiced",
          color: "var(--chart-1)",
        },
        paid: {
          label: "Paid",
          color: "var(--chart-2)",
        },
        ...revenueChartConfig,
      }}
      className="min-h-[260px] w-full"
    >
      <BarChart
        data={chartData}
        accessibilityLayer
        margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
      >
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value: string) => value.slice(0, 3)}
        />
        <YAxis tickLine={false} axisLine={false} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar
          dataKey="invoiced"
          fill="var(--color-invoiced)"
          radius={[4, 4, 0, 0]}
        />
        <Bar
          dataKey="paid"
          fill="var(--color-paid)"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ChartContainer>
  )
}


