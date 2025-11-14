'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface SalesSummary {
  month: string;
  total: number;
}

export default function AnalyticsPage() {
  const [salesSummary, setSalesSummary] = useState<SalesSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/analytics/sales-summary')
      .then((res) => res.json())
      .then((data) => {
        setSalesSummary(data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to load analytics');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50">
        <div className="text-lg text-zinc-600">Loading analytics...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50">
        <div className="text-lg text-red-600">{error}</div>
      </div>
    );
  }

  const totalSales = salesSummary.reduce((sum, item) => sum + (Number(item.total) || 0), 0);
  const maxSales = Math.max(...salesSummary.map((item) => Number(item.total) || 0), 1);

  const formatMonth = (monthStr: string) => {
    try {
      const [year, month] = monthStr.split('-');
      const date = new Date(parseInt(year), parseInt(month) - 1);
      return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    } catch {
      return monthStr;
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 py-16 px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-semibold text-black mb-4">
            Analytics
          </h1>
          <p className="text-lg text-zinc-600">
            Sales performance and insights
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-lg p-6 shadow-sm border border-black/[.08]"
          >
            <p className="text-sm text-zinc-600 mb-2">Total Sales</p>
            <p className="text-3xl font-semibold text-black">
              ₹{totalSales.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-lg p-6 shadow-sm border border-black/[.08]"
          >
            <p className="text-sm text-zinc-600 mb-2">Periods Tracked</p>
            <p className="text-3xl font-semibold text-black">
              {salesSummary.length}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white rounded-lg p-6 shadow-sm border border-black/[.08]"
          >
            <p className="text-sm text-zinc-600 mb-2">Average per Period</p>
            <p className="text-3xl font-semibold text-black">
              ₹{salesSummary.length > 0 ? (totalSales / salesSummary.length).toLocaleString('en-IN', { maximumFractionDigits: 2 }) : '0'}
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white rounded-lg p-6 shadow-sm border border-black/[.08]"
        >
          <h2 className="text-xl font-semibold text-black mb-6">
            Monthly Sales Summary
          </h2>
          <div className="space-y-4">
            {salesSummary.map((item, index) => {
              const amount = Number(item.total) || 0;
              const percentage = (amount / maxSales) * 100;
              return (
                <motion.div
                  key={item.month}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                  className="space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-black">
                      {formatMonth(item.month)}
                    </span>
                    <span className="text-sm font-semibold text-black">
                      ₹{amount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="w-full bg-zinc-200 rounded-full h-3 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 0.8, delay: 0.6 + index * 0.1 }}
                      className="h-full bg-blue-600 rounded-full"
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>

          {salesSummary.length === 0 && (
            <div className="text-center py-8">
              <p className="text-zinc-600">No sales data available</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}


