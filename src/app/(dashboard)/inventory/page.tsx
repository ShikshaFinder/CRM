"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { InventoryByProductChart } from "@/components/charts/InventoryByProductChart";

interface InventoryStock {
  id: string;
  quantity: number;
  mfgDate: string | null;
  expiryDate: string | null;
  product: {
    id: string;
    name: string;
    category: string;
    unit: string;
  };
  storageLocation: {
    id: string;
    name: string;
    type: string;
  } | null;
  batch: {
    id: string;
    batchNumber: string;
  } | null;
}

export default function InventoryPage() {
  const [stocks, setStocks] = useState<InventoryStock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/inventory')
      .then((res) => res.json())
      .then((data) => {
        setStocks(data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to load inventory');
        setLoading(false);
      });
  }, []);

  const getExpiryStatus = (expiryDate: string | null) => {
    if (!expiryDate) return null;
    const expiry = new Date(expiryDate);
    const now = new Date();
    const diffDays = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { status: 'expired', days: Math.abs(diffDays) };
    if (diffDays <= 7) return { status: 'expiring', days: diffDays };
    if (diffDays <= 30) return { status: 'warning', days: diffDays };
    return { status: 'ok', days: diffDays };
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50">
        <div className="text-lg text-zinc-600">Loading inventory...</div>
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

  const totalQuantity = stocks.reduce((sum, stock) => sum + stock.quantity, 0);

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
                Inventory
              </h1>
              <p className="text-lg text-zinc-600">Track your stock levels</p>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-lg px-6 py-4 border border-black/8"
            >
              <p className="text-sm text-zinc-600">Total Items</p>
              <p className="text-2xl font-semibold text-black">
                {totalQuantity.toLocaleString()}
              </p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-lg p-6 shadow-sm border border-black/8"
          >
            <h2 className="text-xl font-semibold text-black mb-4">
              Top Products by Stock
            </h2>
            <p className="text-sm text-zinc-600 mb-4">
              Shows the top products by current quantity across all locations.
            </p>
            <InventoryByProductChart />
          </motion.div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stocks.map((stock, index) => {
            const expiryStatus = getExpiryStatus(stock.expiryDate);
            return (
              <motion.div
                key={stock.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                whileHover={{ scale: 1.02, y: -4 }}
                className="bg-white rounded-lg p-6 shadow-sm border border-black/8 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-black mb-1">
                      {stock.product.name}
                    </h3>
                    <p className="text-sm text-zinc-600">
                      {stock.product.category}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-black">
                      {stock.quantity}
                    </p>
                    <p className="text-xs text-zinc-500">
                      {stock.product.unit}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 text-sm border-t border-zinc-200 pt-4">
                  {stock.storageLocation && (
                    <div className="flex justify-between">
                      <span className="text-zinc-600">Location:</span>
                      <span className="text-black font-medium">
                        {stock.storageLocation.name}
                      </span>
                    </div>
                  )}

                  {stock.batch && (
                    <div className="flex justify-between">
                      <span className="text-zinc-600">Batch:</span>
                      <span className="text-black font-medium">
                        {stock.batch.batchNumber}
                      </span>
                    </div>
                  )}

                  {stock.mfgDate && (
                    <div className="flex justify-between">
                      <span className="text-zinc-600">Manufactured:</span>
                      <span className="text-black font-medium">
                        {new Date(stock.mfgDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}

                  {stock.expiryDate && (
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-600">Expires:</span>
                      <div className="flex items-center gap-2">
                        <span className="text-black font-medium">
                          {new Date(stock.expiryDate).toLocaleDateString()}
                        </span>
                        {expiryStatus && (
                          <span
                            className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                              expiryStatus.status === 'expired'
                                ? 'bg-red-100 text-red-800'
                                : expiryStatus.status === 'expiring'
                                ? 'bg-orange-100 text-orange-800'
                                : expiryStatus.status === 'warning'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-green-100 text-green-800'
                            }`}
                          >
                            {expiryStatus.status === 'expired'
                              ? `Expired ${expiryStatus.days}d ago`
                              : expiryStatus.status === 'expiring'
                              ? `${expiryStatus.days}d left`
                              : expiryStatus.status === 'warning'
                              ? `${expiryStatus.days}d left`
                              : `${expiryStatus.days}d left`}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {stocks.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-zinc-600">No inventory items found</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}



