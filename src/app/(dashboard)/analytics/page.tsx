"use client";

import { motion } from "framer-motion";
import { RevenueByMonthChart } from "@/components/charts/RevenueByMonthChart";

export default function AnalyticsPage() {

  return (
    <div className="min-h-screen bg-zinc-50 py-16 px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-semibold text-black mb-4">Analytics</h1>
          <p className="text-lg text-zinc-600">
            Sales performance and insights
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-lg p-6 shadow-sm border border-black/[.08]"
        >
          <h2 className="text-xl font-semibold text-black mb-6">
            Monthly Sales Summary
          </h2>
          <RevenueByMonthChart />
        </motion.div>
      </div>
    </div>
  );
}


