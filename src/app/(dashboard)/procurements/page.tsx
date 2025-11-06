'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface ProcurementEntry {
  id: string;
  datetime: string | null;
  quantityL: number;
  fatPercent: number | null;
  snfPercent: number | null;
  clrReading: number | null;
  temperatureC: number | null;
  qualityGrade: string;
  ratePerLitre: number;
  totalAmount: number;
  paymentStatus: string;
  milkType: string | null;
  supplier: {
    id: string;
    name: string;
  } | null;
  collectionCenter: {
    id: string;
    name: string;
  } | null;
}

export default function ProcurementsPage() {
  const [procurements, setProcurements] = useState<ProcurementEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/procurements')
      .then((res) => res.json())
      .then((data) => {
        setProcurements(data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to load procurements');
        setLoading(false);
      });
  }, []);

  const getPaymentStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'PAID':
        return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
      case 'PENDING':
        return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200';
      case 'OVERDUE':
        return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200';
      default:
        return 'bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200';
    }
  };

  const getQualityGradeColor = (grade: string) => {
    switch (grade.toUpperCase()) {
      case 'A':
        return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
      case 'B':
        return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200';
      case 'C':
        return 'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200';
      default:
        return 'bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
        <div className="text-lg text-zinc-600 dark:text-zinc-400">Loading procurements...</div>
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

  const totalQuantity = procurements.reduce((sum, p) => sum + p.quantityL, 0);
  const totalAmount = procurements.reduce((sum, p) => sum + p.totalAmount, 0);

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
                Milk Procurements
              </h1>
              <p className="text-lg text-zinc-600 dark:text-zinc-400">
                Track milk collection and procurement
              </p>
            </div>
            <div className="flex gap-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-white dark:bg-zinc-900 rounded-lg px-6 py-4 border border-black/[.08] dark:border-white/[.145]"
              >
                <p className="text-sm text-zinc-600 dark:text-zinc-400">Total Quantity</p>
                <p className="text-2xl font-semibold text-black dark:text-zinc-50">{totalQuantity.toLocaleString()}L</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-white dark:bg-zinc-900 rounded-lg px-6 py-4 border border-black/[.08] dark:border-white/[.145]"
              >
                <p className="text-sm text-zinc-600 dark:text-zinc-400">Total Amount</p>
                <p className="text-2xl font-semibold text-black dark:text-zinc-50">₹{totalAmount.toLocaleString()}</p>
              </motion.div>
            </div>
          </div>
        </motion.div>

        <div className="space-y-6">
          {procurements.map((procurement, index) => (
            <motion.div
              key={procurement.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              whileHover={{ scale: 1.01, x: 4 }}
              className="bg-white dark:bg-zinc-900 rounded-lg p-6 shadow-sm border border-black/[.08] dark:border-white/[.145] hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                <div>
                  {procurement.supplier && (
                    <h3 className="text-xl font-semibold text-black dark:text-zinc-50 mb-1">
                      {procurement.supplier.name}
                    </h3>
                  )}
                  {procurement.datetime && (
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      {new Date(procurement.datetime).toLocaleString()}
                    </p>
                  )}
                  {procurement.collectionCenter && (
                    <p className="text-sm text-zinc-500 dark:text-zinc-500 mt-1">
                      Center: {procurement.collectionCenter.name}
                    </p>
                  )}
                </div>
                <div className="mt-4 md:mt-0 flex flex-col items-end gap-2">
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getPaymentStatusColor(procurement.paymentStatus)}`}>
                    {procurement.paymentStatus}
                  </span>
                  <p className="text-lg font-semibold text-black dark:text-zinc-50">
                    ₹{procurement.totalAmount.toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-zinc-600 dark:text-zinc-400">Quantity:</span>
                  <p className="text-black dark:text-zinc-50 font-medium">
                    {procurement.quantityL}L
                  </p>
                </div>
                <div>
                  <span className="text-zinc-600 dark:text-zinc-400">Rate:</span>
                  <p className="text-black dark:text-zinc-50 font-medium">
                    ₹{procurement.ratePerLitre}/L
                  </p>
                </div>
                {procurement.fatPercent !== null && (
                  <div>
                    <span className="text-zinc-600 dark:text-zinc-400">Fat:</span>
                    <p className="text-black dark:text-zinc-50 font-medium">
                      {procurement.fatPercent}%
                    </p>
                  </div>
                )}
                {procurement.snfPercent !== null && (
                  <div>
                    <span className="text-zinc-600 dark:text-zinc-400">SNF:</span>
                    <p className="text-black dark:text-zinc-50 font-medium">
                      {procurement.snfPercent}%
                    </p>
                  </div>
                )}
                {procurement.temperatureC !== null && (
                  <div>
                    <span className="text-zinc-600 dark:text-zinc-400">Temperature:</span>
                    <p className="text-black dark:text-zinc-50 font-medium">
                      {procurement.temperatureC}°C
                    </p>
                  </div>
                )}
                {procurement.clrReading !== null && (
                  <div>
                    <span className="text-zinc-600 dark:text-zinc-400">CLR:</span>
                    <p className="text-black dark:text-zinc-50 font-medium">
                      {procurement.clrReading}
                    </p>
                  </div>
                )}
                {procurement.milkType && (
                  <div>
                    <span className="text-zinc-600 dark:text-zinc-400">Type:</span>
                    <p className="text-black dark:text-zinc-50 font-medium">
                      {procurement.milkType}
                    </p>
                  </div>
                )}
                <div>
                  <span className="text-zinc-600 dark:text-zinc-400">Quality:</span>
                  <span className={`inline-block mt-1 px-2 py-1 rounded text-xs font-medium ${getQualityGradeColor(procurement.qualityGrade)}`}>
                    Grade {procurement.qualityGrade}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {procurements.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-zinc-600 dark:text-zinc-400">No procurement entries found</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}


