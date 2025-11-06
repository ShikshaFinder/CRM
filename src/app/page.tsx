'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Home() {
  const metrics = [
    {
      title: "Today's Milk Collection",
      value: "12,450 L",
      change: "+5.2%",
      changeType: "up",
      icon: "🥛",
      bgColor: "bg-blue-50",
      iconBg: "bg-blue-100",
    },
    {
      title: "Active Orders",
      value: "24",
      change: "+12.5%",
      changeType: "up",
      icon: "🛒",
      bgColor: "bg-green-50",
      iconBg: "bg-green-100",
    },
    {
      title: "Pending Inquiries",
      value: "18",
      change: "-3.2%",
      changeType: "down",
      icon: "💬",
      bgColor: "bg-yellow-50",
      iconBg: "bg-yellow-100",
    },
    {
      title: "Monthly Revenue",
      value: "₹8.5L",
      change: "+8.7%",
      changeType: "up",
      icon: "₹",
      bgColor: "bg-purple-50",
      iconBg: "bg-purple-100",
    },
    {
      title: "Production Today",
      value: "850 kg",
      change: "+4.1%",
      changeType: "up",
      icon: "📊",
      bgColor: "bg-green-50",
      iconBg: "bg-green-100",
    },
    {
      title: "Low Stock Alerts",
      value: "7",
      change: null,
      changeType: null,
      icon: "⚠️",
      bgColor: "bg-red-50",
      iconBg: "bg-red-100",
    },
  ];

  const recentOrders = [
    { orderNo: "SO-2025-00124", customer: "Fresh Dairy Mart", amount: "₹12,500", status: "Pending", days: 20 },
    { orderNo: "SO-2025-00123", customer: "Sunrise Retailers", amount: "₹8,750", status: "Processing", days: 20 },
    { orderNo: "SO-2025-00122", customer: "City Supermarket", amount: "₹15,200", status: "Delivered", days: 19 },
    { orderNo: "SO-2025-00121", customer: "Local Grocer", amount: "₹6,300", status: "Pending", days: 18 },
  ];

  const milkProcurement = [
    { farmer: "Ramesh Kumar", quantity: "450 L", fat: "4.2%", grade: "A", amount: "₹18,000" },
    { farmer: "Suresh Patil", quantity: "380 L", fat: "4.0%", grade: "A", amount: "₹15,200" },
    { farmer: "Rajesh Singh", quantity: "520 L", fat: "4.5%", grade: "A+", amount: "₹22,100" },
    { farmer: "Mohan Das", quantity: "290 L", fat: "3.8%", grade: "B", amount: "₹11,600" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dashboard Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome back! Here's what's happening today.</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors">
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            <span className="text-gray-700 font-medium">Refresh</span>
          </button>
        </div>
      </div>

      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {metrics.map((metric, index) => (
              <motion.div
                key={metric.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`${metric.bgColor} rounded-lg p-6 border border-gray-200`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-2">{metric.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mb-2">{metric.value}</p>
                    {metric.change && (
                      <div className="flex items-center gap-1">
                        {metric.changeType === "up" ? (
                          <>
                            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                            </svg>
                            <span className="text-sm font-medium text-green-600">{metric.change}</span>
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                            </svg>
                            <span className="text-sm font-medium text-red-600">{metric.change}</span>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                  <div className={`${metric.iconBg} w-12 h-12 rounded-lg flex items-center justify-center text-2xl`}>
                    {metric.icon}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Tables Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Orders */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="bg-white rounded-lg border border-gray-200 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
                <Link href="/orders" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  View All
                </Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">ORDER #</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">CUSTOMER</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">AMOUNT</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">STATUS</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">DA</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order, index) => (
                      <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm text-gray-900">{order.orderNo}</td>
                        <td className="py-3 px-4 text-sm text-gray-700">{order.customer}</td>
                        <td className="py-3 px-4 text-sm text-gray-700">{order.amount}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            order.status === "Delivered" ? "bg-green-100 text-green-800" :
                            order.status === "Processing" ? "bg-blue-100 text-blue-800" :
                            "bg-yellow-100 text-yellow-800"
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-700">{order.days}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>

            {/* Today's Milk Procurement */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="bg-white rounded-lg border border-gray-200 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Today's Milk Procurement</h2>
                <Link href="/procurements" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  View All
                </Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">FARMER</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">QUANTITY (L)</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">FAT %</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">GRADE</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">AMOUNT</th>
                    </tr>
                  </thead>
                  <tbody>
                    {milkProcurement.map((procurement, index) => (
                      <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm text-gray-900">{procurement.farmer}</td>
                        <td className="py-3 px-4 text-sm text-gray-700">{procurement.quantity}</td>
                        <td className="py-3 px-4 text-sm text-gray-700">{procurement.fat}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            procurement.grade === "A+" ? "bg-green-100 text-green-800" :
                            procurement.grade === "A" ? "bg-blue-100 text-blue-800" :
                            "bg-yellow-100 text-yellow-800"
                          }`}>
                            {procurement.grade}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-700">{procurement.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
