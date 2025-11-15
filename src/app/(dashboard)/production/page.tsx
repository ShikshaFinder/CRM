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
    fetch('/api/production', {
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
        setBatches(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Failed to load production batches');
        setBatches([]);
        setLoading(false);
      });
  }, []);

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'IN_PRODUCTION':
        return 'bg-blue-100 text-blue-800';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      case 'ON_HOLD':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50">
        <div className="text-lg text-zinc-600">Loading production batches...</div>
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
            Production
          </h1>
          <p className="text-lg text-zinc-600">
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
              className="bg-white rounded-lg p-6 shadow-sm border border-black/[.08] hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-black mb-1">
                    {batch.batchNumber}
                  </h3>
                  <p className="text-sm text-zinc-600">
                    {batch.product?.name || 'Unknown Product'}
                  </p>
                </div>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(batch.status)}`}>
                  {batch.status.replace('_', ' ')}
                </span>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-zinc-600">Quantity:</span>
                  <span className="text-black font-medium">
                    {batch.producedQty || 0} {batch.product?.unit || ''}
                  </span>
                </div>

                {batch.productionDate && (
                  <div className="flex justify-between">
                    <span className="text-zinc-600">Production Date:</span>
                    <span className="text-black font-medium">
                      {new Date(batch.productionDate).toLocaleDateString()}
                    </span>
                  </div>
                )}

                {batch.manufacturingDate && (
                  <div className="flex justify-between">
                    <span className="text-zinc-600">Manufacturing Date:</span>
                    <span className="text-black font-medium">
                      {new Date(batch.manufacturingDate).toLocaleDateString()}
                    </span>
                  </div>
                )}

                {batch.expiryDate && (
                  <div className="flex justify-between">
                    <span className="text-zinc-600">Expiry Date:</span>
                    <span className="text-black font-medium">
                      {new Date(batch.expiryDate).toLocaleDateString()}
                    </span>
                  </div>
                )}

                {Array.isArray(batch.items) && batch.items.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-zinc-200">
                    <p className="text-xs text-zinc-600 mb-1">
                      Items: {batch.items.length}
                    </p>
                  </div>
                )}

                {Array.isArray(batch.inventoryStocks) && batch.inventoryStocks.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs text-zinc-600">
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
            <p className="text-zinc-600">No production batches found</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}


