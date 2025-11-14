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
import { inventoryChartConfig } from "@/lib/chart-config"

type InventoryStock = {
  id: string
  quantity: number
  product: {
    id: string
    name: string
    category: string
  }
}

type InventoryPoint = {
  product: string
  quantity: number
}

export function InventoryByProductChart() {
  const [data, setData] = React.useState<InventoryPoint[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const res = await fetch("/api/inventory")
        if (!res.ok) {
          throw new Error(`Request failed: ${res.status}`)
        }
        const json = (await res.json()) as InventoryStock[]

        const byProduct = new Map<string, number>()
        for (const s of json) {
          const key = s.product?.name ?? "Unknown"
          const existing = byProduct.get(key) ?? 0
          byProduct.set(key, existing + (s.quantity || 0))
        }

        // Take top 8 products by quantity
        const points: InventoryPoint[] = Array.from(byProduct.entries())
          .map(([product, quantity]) => ({ product, quantity }))
          .sort((a, b) => b.quantity - a.quantity)
          .slice(0, 8)

        if (!cancelled) {
          setData(points)
        }
      } catch (err: any) {
        if (!cancelled) {
          setError("Failed to load inventory summary")
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
        Loading inventory chart...
      </div>
    )
  }

  if (error || data.length === 0) {
    return (
      <div className="flex h-[260px] w-full items-center justify-center text-sm text-gray-500">
        {error ?? "No inventory data available yet."}
      </div>
    )
  }

  const chartData = data

  return (
    <ChartContainer
      config={{
        quantity: {
          label: "Quantity",
          color: "var(--chart-3)",
        },
        ...inventoryChartConfig,
      }}
      className="min-h-[260px] w-full"
    >
      <BarChart
        data={chartData}
        layout="vertical"
        margin={{ top: 8, right: 16, left: 80, bottom: 8 }}
      >
        <CartesianGrid horizontal={false} strokeDasharray="3 3" />
        <XAxis type="number" />
        <YAxis
          dataKey="product"
          type="category"
          tickLine={false}
          axisLine={false}
          width={120}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar
          dataKey="quantity"
          fill="var(--color-quantity)"
          radius={[0, 4, 4, 0]}
          barSize={18}
        />
      </BarChart>
    </ChartContainer>
  )
}


