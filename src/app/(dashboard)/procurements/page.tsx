"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ProcurementVolumeChart } from "@/components/charts/ProcurementVolumeChart";

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
    fetch('/api/procurements', {
      credentials: 'include',
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((errorData) => {
            throw new Error(errorData.error || `Request failed: ${res.status}`);
          });
        }
        return res.json();
      })
      .then((data) => {
        setProcurements(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Failed to load procurements');
        setProcurements([]);
        setLoading(false);
      });
  }, []);

  const getPaymentStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'PAID':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'OVERDUE':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getQualityGradeColor = (grade: string) => {
    switch (grade.toUpperCase()) {
      case 'A':
        return 'bg-green-100 text-green-800';
      case 'B':
        return 'bg-yellow-100 text-yellow-800';
      case 'C':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50">
        <div className="text-lg text-zinc-600">Loading procurements...</div>
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

  const totalQuantity = procurements.reduce((sum, p) => sum + (p.quantityL || 0), 0);
  const totalAmount = procurements.reduce((sum, p) => sum + (p.totalAmount || 0), 0);

  return (
    <div className="min-h-screen bg-zinc-50 py-16 px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-4">
            <div>
              <h1 className="text-4xl font-semibold text-black mb-2">
                Milk Procurements
              </h1>
              <p className="text-lg text-zinc-600">
                Track milk collection and procurement
              </p>
            </div>
            <div className="flex gap-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-lg px-6 py-4 border border-black/[.08]"
              >
                <p className="text-sm text-zinc-600">Total Quantity</p>
                <p className="text-2xl font-semibold text-black">
                  {totalQuantity.toLocaleString()}L
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-lg px-6 py-4 border border-black/[.08]"
              >
                <p className="text-sm text-zinc-600">Total Amount</p>
                <p className="text-2xl font-semibold text-black">
                  ₹{totalAmount.toLocaleString()}
                </p>
              </motion.div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-8 bg-white rounded-lg p-6 shadow-sm border border-black/[.08]"
          >
            <h2 className="text-xl font-semibold text-black mb-4">
              Milk Volume (Last 30 Days)
            </h2>
            <p className="text-sm text-zinc-600 mb-4">
              Daily total litres collected across all suppliers and centers.
            </p>
            <ProcurementVolumeChart />
          </motion.div>
        </motion.div>

        <div className="space-y-6">
          {procurements.map((procurement, index) => (
            <motion.div
              key={procurement.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              whileHover={{ scale: 1.01, x: 4 }}
              className="bg-white rounded-lg p-6 shadow-sm border border-black/[.08] hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                <div>
                  {procurement.supplier && (
                    <h3 className="text-xl font-semibold text-black mb-1">
                      {procurement.supplier.name}
                    </h3>
                  )}
                  {procurement.datetime && (
                    <p className="text-sm text-zinc-600">
                      {new Date(procurement.datetime).toLocaleString()}
                    </p>
                  )}
                  {procurement.collectionCenter && (
                    <p className="text-sm text-zinc-500 mt-1">
                      Center: {procurement.collectionCenter.name}
                    </p>
                  )}
                </div>
                <div className="mt-4 md:mt-0 flex flex-col items-end gap-2">
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getPaymentStatusColor(procurement.paymentStatus)}`}>
                    {procurement.paymentStatus}
                  </span>
                  <p className="text-lg font-semibold text-black">
                    ₹{procurement.totalAmount.toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-zinc-600">Quantity:</span>
                  <p className="text-black font-medium">
                    {procurement.quantityL}L
                  </p>
                </div>
                <div>
                  <span className="text-zinc-600">Rate:</span>
                  <p className="text-black font-medium">
                    ₹{procurement.ratePerLitre}/L
                  </p>
                </div>
                {procurement.fatPercent !== null && (
                  <div>
                    <span className="text-zinc-600">Fat:</span>
                    <p className="text-black font-medium">
                      {procurement.fatPercent}%
                    </p>
                  </div>
                )}
                {procurement.snfPercent !== null && (
                  <div>
                    <span className="text-zinc-600">SNF:</span>
                    <p className="text-black font-medium">
                      {procurement.snfPercent}%
                    </p>
                  </div>
                )}
                {procurement.temperatureC !== null && (
                  <div>
                    <span className="text-zinc-600">Temperature:</span>
                    <p className="text-black font-medium">
                      {procurement.temperatureC}°C
                    </p>
                  </div>
                )}
                {procurement.clrReading !== null && (
                  <div>
                    <span className="text-zinc-600">CLR:</span>
                    <p className="text-black font-medium">
                      {procurement.clrReading}
                    </p>
                  </div>
                )}
                {procurement.milkType && (
                  <div>
                    <span className="text-zinc-600">Type:</span>
                    <p className="text-black font-medium">
                      {procurement.milkType}
                    </p>
                  </div>
                )}
                <div>
                  <span className="text-zinc-600">Quality:</span>
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
            <p className="text-zinc-600">No procurement entries found</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}


