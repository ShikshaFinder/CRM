'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface DeliveryChallan {
  id: string;
  challanNumber: string;
  vehicleNumber: string | null;
  driverName: string | null;
  driverPhone: string | null;
  tempInitialC: number | null;
  tempFinalC: number | null;
  signedBy: string | null;
  deliveredAt: string | null;
  salesOrderId: string | null;
}

export default function LogisticsPage() {
  const [challans, setChallans] = useState<DeliveryChallan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/logistics/delivery')
      .then((res) => res.json())
      .then((data) => {
        setChallans(data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to load delivery challans');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
        <div className="text-lg text-zinc-600 dark:text-zinc-400">Loading delivery challans...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
        <div className="text-lg text-red-600 dark:text-red-400">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black py-16 px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-semibold text-black dark:text-zinc-50 mb-2">
                Logistics & Delivery
              </h1>
              <p className="text-lg text-zinc-600 dark:text-zinc-400">
                Track deliveries and shipments
              </p>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-zinc-900 rounded-lg px-6 py-4 border border-black/[.08] dark:border-white/[.145]"
            >
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Total Deliveries</p>
              <p className="text-2xl font-semibold text-black dark:text-zinc-50">{challans.length}</p>
            </motion.div>
          </div>
        </motion.div>

        <div className="space-y-6">
          {challans.map((challan, index) => (
            <motion.div
              key={challan.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              whileHover={{ scale: 1.01, x: 4 }}
              className="bg-white dark:bg-zinc-900 rounded-lg p-6 shadow-sm border border-black/[.08] dark:border-white/[.145] hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-black dark:text-zinc-50 mb-1">
                    {challan.challanNumber}
                  </h3>
                  {challan.deliveredAt && (
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      Delivered: {new Date(challan.deliveredAt).toLocaleString()}
                    </p>
                  )}
                  {challan.salesOrderId && (
                    <p className="text-sm text-zinc-500 dark:text-zinc-500 mt-1">
                      Order ID: {challan.salesOrderId.slice(-8)}
                    </p>
                  )}
                </div>
                {challan.deliveredAt && (
                  <span className="inline-block mt-4 md:mt-0 px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm font-medium">
                    Delivered
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                {challan.vehicleNumber && (
                  <div>
                    <span className="text-zinc-600 dark:text-zinc-400">Vehicle:</span>
                    <p className="text-black dark:text-zinc-50 font-medium">
                      {challan.vehicleNumber}
                    </p>
                  </div>
                )}
                {challan.driverName && (
                  <div>
                    <span className="text-zinc-600 dark:text-zinc-400">Driver:</span>
                    <p className="text-black dark:text-zinc-50 font-medium">
                      {challan.driverName}
                    </p>
                  </div>
                )}
                {challan.driverPhone && (
                  <div>
                    <span className="text-zinc-600 dark:text-zinc-400">Driver Phone:</span>
                    <p className="text-black dark:text-zinc-50 font-medium">
                      {challan.driverPhone}
                    </p>
                  </div>
                )}
                {challan.tempInitialC !== null && (
                  <div>
                    <span className="text-zinc-600 dark:text-zinc-400">Initial Temp:</span>
                    <p className="text-black dark:text-zinc-50 font-medium">
                      {challan.tempInitialC}°C
                    </p>
                  </div>
                )}
                {challan.tempFinalC !== null && (
                  <div>
                    <span className="text-zinc-600 dark:text-zinc-400">Final Temp:</span>
                    <p className="text-black dark:text-zinc-50 font-medium">
                      {challan.tempFinalC}°C
                    </p>
                  </div>
                )}
                {challan.signedBy && (
                  <div>
                    <span className="text-zinc-600 dark:text-zinc-400">Signed By:</span>
                    <p className="text-black dark:text-zinc-50 font-medium">
                      {challan.signedBy}
                    </p>
                  </div>
                )}
              </div>

              {challan.tempInitialC !== null && challan.tempFinalC !== null && (
                <div className="mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-zinc-600 dark:text-zinc-400">Temperature Range:</span>
                    <span className="text-xs font-medium text-black dark:text-zinc-50">
                      {challan.tempInitialC}°C → {challan.tempFinalC}°C
                    </span>
                    {Math.abs(challan.tempFinalC - challan.tempInitialC) <= 2 && (
                      <span className="inline-block px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded text-xs font-medium">
                        Stable
                      </span>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {challans.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-zinc-600 dark:text-zinc-400">No delivery challans found</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}


