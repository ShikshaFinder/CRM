'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Product {
  id: string;
  name: string;
  category: string;
  subCategory: string | null;
  unit: string;
  packSize: number | null;
  unitPrice: number | null;
  costPrice: number | null;
  minFatPercent: number | null;
  minSnfPercent: number | null;
  shelfLifeDays: number | null;
  storageTempMin: number | null;
  storageTempMax: number | null;
  requiresColdChain: boolean;
  priceHistory: any[];
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to load products');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50">
        <div className="text-lg text-zinc-600">Loading products...</div>
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
            Products
          </h1>
          <p className="text-lg text-zinc-600">
            Manage your product catalog
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -4 }}
              className="bg-white rounded-lg p-6 shadow-sm border border-black/8 hover:shadow-md transition-shadow"
            >
              <h3 className="text-xl font-semibold text-black mb-2">
                {product.name}
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-zinc-600">Category:</span>
                  <span className="text-black font-medium">
                    {product.category}
                    {product.subCategory && ` / ${product.subCategory}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-600">Unit:</span>
                  <span className="text-black font-medium">
                    {product.unit}
                  </span>
                </div>
                {product.unitPrice && (
                  <div className="flex justify-between">
                    <span className="text-zinc-600">Price:</span>
                    <span className="text-black font-medium">
                      ₹{product.unitPrice.toFixed(2)}
                    </span>
                  </div>
                )}
                {product.packSize && (
                  <div className="flex justify-between">
                    <span className="text-zinc-600">Pack Size:</span>
                    <span className="text-black font-medium">
                      {product.packSize}
                    </span>
                  </div>
                )}
                {product.requiresColdChain && (
                  <div className="mt-3 pt-3 border-t border-zinc-200">
                    <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                      Cold Chain Required
                    </span>
                  </div>
                )}
                {product.storageTempMin !== null && product.storageTempMax !== null && (
                  <div className="flex justify-between mt-2">
                    <span className="text-zinc-600">Storage:</span>
                    <span className="text-black font-medium">
                      {product.storageTempMin}°C - {product.storageTempMax}°C
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {products.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-zinc-600">No products found</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}



