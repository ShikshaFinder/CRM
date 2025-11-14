import type { ChartConfig } from "@/components/ui/chart"

/**
 * Shared chart configs for common CRM KPIs.
 * Colors reference the chart tokens defined in globals.css.
 */

export const revenueChartConfig: ChartConfig = {
  revenue: {
    label: "Revenue",
    color: "var(--chart-1)",
  },
}

export const ordersChartConfig: ChartConfig = {
  orders: {
    label: "Orders",
    color: "var(--chart-2)",
  },
}

export const inventoryChartConfig: ChartConfig = {
  quantity: {
    label: "Quantity",
    color: "var(--chart-3)",
  },
}

export const procurementVolumeChartConfig: ChartConfig = {
  volume: {
    label: "Milk volume (L)",
    color: "var(--chart-4)",
  },
}

export const campaignsChartConfig: ChartConfig = {
  campaigns: {
    label: "Campaigns",
    color: "var(--chart-5)",
  },
}


