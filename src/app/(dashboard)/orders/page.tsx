'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface OrderItem {
  id: string;
  product: {
    id: string;
    name: string;
  };
  qty: number;
  price: number;
}

interface Order {
  id: string;
  orderRef: string;
  stage: string;
  deliveryAddress: string | null;
  distanceKm: number | null;
  vehicleReq: string | null;
  connection: {
    id: string;
    name: string;
  } | null;
  items: OrderItem[];
  createdAt: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/orders')
      .then((res) => res.json())
      .then((data) => {
        setOrders(data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to load orders');
        setLoading(false);
      });
  }, []);

  const getStageColor = (stage: string) => {
    switch (stage.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200';
      case 'confirmed':
        return 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200';
      case 'in_transit':
      case 'in transit':
        return 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200';
      case 'delivered':
        return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
      case 'cancelled':
        return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200';
      default:
        return 'bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
        <div className="text-lg text-zinc-600 dark:text-zinc-400">Loading orders...</div>
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
            Orders
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            View and manage sales orders
          </p>
        </motion.div>

        <div className="space-y-6">
          {orders.map((order, index) => {
            const totalAmount = order.items.reduce((sum, item) => sum + item.qty * item.price, 0);
            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.01, x: 4 }}
                className="bg-white dark:bg-zinc-900 rounded-lg p-6 shadow-sm border border-black/[.08] dark:border-white/[.145] hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-black dark:text-zinc-50 mb-1">
                      {order.orderRef}
                    </h3>
                    {order.connection && (
                      <p className="text-zinc-600 dark:text-zinc-400">
                        Customer: {order.connection.name}
                      </p>
                    )}
                    <p className="text-sm text-zinc-500 dark:text-zinc-500 mt-1">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="mt-4 md:mt-0 flex flex-col items-end gap-2">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStageColor(order.stage)}`}>
                      {order.stage}
                    </span>
                    <p className="text-lg font-semibold text-black dark:text-zinc-50">
                      ₹{totalAmount.toFixed(2)}
                    </p>
                  </div>
                </div>

                {order.deliveryAddress && (
                  <div className="mb-4 p-3 bg-zinc-50 dark:bg-zinc-800 rounded">
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      <span className="font-medium">Delivery:</span> {order.deliveryAddress}
                    </p>
                    {order.distanceKm && (
                      <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                        Distance: {order.distanceKm} km
                      </p>
                    )}
                    {order.vehicleReq && (
                      <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                        Vehicle: {order.vehicleReq}
                      </p>
                    )}
                  </div>
                )}

                <div className="border-t border-zinc-200 dark:border-zinc-800 pt-4">
                  <h4 className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-2">
                    Items ({order.items.length})
                  </h4>
                  <div className="space-y-2">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex justify-between items-center text-sm">
                        <span className="text-zinc-700 dark:text-zinc-300">
                          {item.product.name} × {item.qty}
                        </span>
                        <span className="text-black dark:text-zinc-50 font-medium">
                          ₹{(item.qty * item.price).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {orders.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-zinc-600 dark:text-zinc-400">No orders found</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}


