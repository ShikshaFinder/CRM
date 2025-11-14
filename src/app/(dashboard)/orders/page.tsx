"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { OrdersByStageChart } from "@/components/charts/OrdersByStageChart";

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
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'in_transit':
      case 'in transit':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50">
        <div className="text-lg text-zinc-600">Loading orders...</div>
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
          className="mb-8"
        >
          <h1 className="text-4xl font-semibold text-black mb-4">Orders</h1>
          <p className="text-lg text-zinc-600">
            View and manage sales orders
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8 bg-white rounded-lg p-6 shadow-sm border border-black/[.08]"
        >
          <h2 className="text-xl font-semibold text-black mb-4">
            Orders by Stage
          </h2>
          <p className="text-sm text-zinc-600 mb-4">
            Distribution of orders across stages for this organization.
          </p>
          <OrdersByStageChart />
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
                className="bg-white rounded-lg p-6 shadow-sm border border-black/[.08] hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-black mb-1">
                      {order.orderRef}
                    </h3>
                    {order.connection && (
                      <p className="text-zinc-600">
                        Customer: {order.connection.name}
                      </p>
                    )}
                    <p className="text-sm text-zinc-500 mt-1">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="mt-4 md:mt-0 flex flex-col items-end gap-2">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStageColor(order.stage)}`}>
                      {order.stage}
                    </span>
                    <p className="text-lg font-semibold text-black">
                      ₹{totalAmount.toFixed(2)}
                    </p>
                  </div>
                </div>

                {order.deliveryAddress && (
                  <div className="mb-4 p-3 bg-zinc-50 rounded">
                    <p className="text-sm text-zinc-600">
                      <span className="font-medium">Delivery:</span> {order.deliveryAddress}
                    </p>
                    {order.distanceKm && (
                      <p className="text-sm text-zinc-600 mt-1">
                        Distance: {order.distanceKm} km
                      </p>
                    )}
                    {order.vehicleReq && (
                      <p className="text-sm text-zinc-600 mt-1">
                        Vehicle: {order.vehicleReq}
                      </p>
                    )}
                  </div>
                )}

                <div className="border-t border-zinc-200 pt-4">
                  <h4 className="text-sm font-medium text-zinc-600 mb-2">
                    Items ({order.items.length})
                  </h4>
                  <div className="space-y-2">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex justify-between items-center text-sm">
                        <span className="text-zinc-700">
                          {item.product.name} × {item.qty}
                        </span>
                        <span className="text-black font-medium">
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
            <p className="text-zinc-600">No orders found</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}


