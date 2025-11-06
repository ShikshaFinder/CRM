'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface ProductionBatch {
  id: string;
  batchNumber: string;
  producedQty: number;
  productionDate: string | null;
  manufacturingDate: string | null;
  expiryDate: string | null;
  status: string;
  product: {
    id: string;
    name: string;
    unit: string;
  };
  items: any[];
  inventoryStocks: any[];
}

export default function ProductionPage() {
  const [batches, setBatches] = useState<ProductionBatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/production')
      .then((res) => res.json())
      .then((data) => {
        setBatches(data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to load production batches');
        setLoading(false);
      });
  }, []);

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'IN_PRODUCTION':
        return 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200';
      case 'COMPLETED':
        return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
      case 'CANCELLED':
        return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200';
      case 'ON_HOLD':
        return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200';
      default:
        return 'bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
        <div className="text-lg text-zinc-600 dark:text-zinc-400">Loading production batches...</div>
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
          <h1 className="text-4xl font-semibold text-black dark:text-zinc-50 mb-4">
            Production
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Manage production batches
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {batches.map((batch, index) => (
            <motion.div
              key={batch.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -4 }}
              className="bg-white dark:bg-zinc-900 rounded-lg p-6 shadow-sm border border-black/[.08] dark:border-white/[.145] hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-black dark:text-zinc-50 mb-1">
                    {batch.batchNumber}
                  </h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    {batch.product.name}
                  </p>
                </div>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(batch.status)}`}>
                  {batch.status.replace('_', ' ')}
                </span>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-zinc-600 dark:text-zinc-400">Quantity:</span>
                  <span className="text-black dark:text-zinc-50 font-medium">
                    {batch.producedQty} {batch.product.unit}
                  </span>
                </div>

                {batch.productionDate && (
                  <div className="flex justify-between">
                    <span className="text-zinc-600 dark:text-zinc-400">Production Date:</span>
                    <span className="text-black dark:text-zinc-50 font-medium">
                      {new Date(batch.productionDate).toLocaleDateString()}
                    </span>
                  </div>
                )}

                {batch.manufacturingDate && (
                  <div className="flex justify-between">
                    <span className="text-zinc-600 dark:text-zinc-400">Manufacturing Date:</span>
                    <span className="text-black dark:text-zinc-50 font-medium">
                      {new Date(batch.manufacturingDate).toLocaleDateString()}
                    </span>
                  </div>
                )}

                {batch.expiryDate && (
                  <div className="flex justify-between">
                    <span className="text-zinc-600 dark:text-zinc-400">Expiry Date:</span>
                    <span className="text-black dark:text-zinc-50 font-medium">
                      {new Date(batch.expiryDate).toLocaleDateString()}
                    </span>
                  </div>
                )}

                {batch.items.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-zinc-200 dark:border-zinc-800">
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-1">
                      Items: {batch.items.length}
                    </p>
                  </div>
                )}

                {batch.inventoryStocks.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs text-zinc-600 dark:text-zinc-400">
                      In Stock: {batch.inventoryStocks.length} location(s)
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {batches.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-zinc-600 dark:text-zinc-400">No production batches found</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}


