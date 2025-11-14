"use client"

import * as React from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
  type TooltipProps,
} from "recharts"

type ChartSeriesConfig = {
  label?: string
  icon?: React.ComponentType<{ className?: string }>
  /**
   * A color value like '#2563eb' or 'var(--chart-1)'.
   * This will be mapped to a CSS variable `--color-${key}` on the container.
   */
  color?: string
}

export type ChartConfig = Record<string, ChartSeriesConfig>

type ChartContainerProps = {
  config?: ChartConfig
  className?: string
  children: React.ReactNode
}

/**
 * ChartContainer
 *
 * Lightweight version of the shadcn/ui ChartContainer.
 * It maps the chart config into CSS variables like `--color-key`
 * so you can reference them from Recharts primitives:
 *
 *   <Bar dataKey="revenue" fill="var(--color-revenue)" />
 */
export function ChartContainer({
  config,
  className,
  children,
}: ChartContainerProps) {
  const cssVars: React.CSSProperties = {}

  if (config) {
    for (const [key, value] of Object.entries(config)) {
      if (value?.color) {
        // @ts-expect-error - we are dynamically assigning CSS variables
        cssVars[`--color-${key}`] = value.color
      }
    }
  }

  return (
    <div
      className={["min-h-[200px] w-full", className].filter(Boolean).join(" ")}
      style={cssVars}
    >
      {children}
    </div>
  )
}

/**
 * ChartTooltip
 *
 * Thin wrapper around Recharts Tooltip so we can keep a consistent import path.
 */
export function ChartTooltip(
  props: TooltipProps<number, string> & { className?: string }
) {
  return <Tooltip {...props} />
}

type ChartTooltipContentProps = TooltipProps<number, string> & {
  labelKey?: string
}

/**
 * ChartTooltipContent
 *
 * Simple, generic tooltip content that works for most charts.
 * You can always swap this out with your own component for a specific chart.
 */
export function ChartTooltipContent({
  active,
  payload,
  label,
}: ChartTooltipContentProps) {
  if (!active || !payload || payload.length === 0) return null

  return (
    <div className="rounded-md border bg-white px-3 py-2 text-xs shadow-sm">
      {label ? (
        <div className="mb-1 font-medium text-gray-900">{label}</div>
      ) : null}
      <div className="space-y-0.5">
        {payload.map((entry) => {
          const color = entry.color
          return (
            <div
              key={entry.dataKey?.toString() ?? entry.name}
              className="flex items-center justify-between gap-4"
            >
              <span className="flex items-center gap-1">
                {color ? (
                  <span
                    className="inline-block h-2 w-2 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                ) : null}
                <span className="text-gray-600">
                  {entry.name ?? entry.dataKey}
                </span>
              </span>
              <span className="font-medium text-gray-900">
                {entry.value as number}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/**
 * ChartLegend
 *
 * Thin wrapper around Recharts Legend so we can keep a consistent import path.
 */
export function ChartLegend(props: React.ComponentProps<typeof Legend>) {
  return <Legend {...props} />
}

type ChartLegendContentProps = {
  payload?: Array<{
    value: string
    color: string
  }>
}

/**
 * ChartLegendContent
 *
 * Simple legend that uses the payload provided by Recharts.
 */
export function ChartLegendContent({ payload }: ChartLegendContentProps) {
  if (!payload?.length) return null

  return (
    <div className="mt-2 flex flex-wrap gap-3 text-xs">
      {payload.map((entry) => (
        <div key={entry.value} className="flex items-center gap-1.5">
          <span
            className="inline-block h-2 w-2 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-gray-700">{entry.value}</span>
        </div>
      ))}
    </div>
  )
}

// Re-export common Recharts primitives for convenience.
export {
  Bar,
  BarChart,
  Line,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
}


