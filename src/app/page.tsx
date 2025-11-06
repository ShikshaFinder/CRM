'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Home() {
  const quickLinks = [
    { name: 'Products', href: '/products', icon: '📦', color: 'bg-blue-500' },
    { name: 'Orders', href: '/orders', icon: '🛒', color: 'bg-green-500' },
    { name: 'Customers', href: '/customers', icon: '👥', color: 'bg-purple-500' },
    { name: 'Inventory', href: '/inventory', icon: '📋', color: 'bg-orange-500' },
    { name: 'Analytics', href: '/analytics', icon: '📈', color: 'bg-red-500' },
    { name: 'Finance', href: '/finance', icon: '💰', color: 'bg-yellow-500' },
  ];

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
            Dashboard
          </h1>
          <p className="text-lg text-zinc-600">
            Welcome to Flavi CRM - Your complete business management system
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quickLinks.map((link, index) => (
            <motion.div
              key={link.href}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -4 }}
            >
              <Link
                href={link.href}
                className="block bg-white rounded-lg p-6 shadow-sm border border-black/[.08] hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 ${link.color} rounded-lg flex items-center justify-center text-2xl`}>
                    {link.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-black">
                      {link.name}
                    </h3>
                    <p className="text-sm text-zinc-600 mt-1">
                      View and manage
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-12 bg-white rounded-lg p-6 shadow-sm border border-black/[.08]"
        >
          <h2 className="text-2xl font-semibold text-black mb-4">
            Quick Access
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              href="/production"
              className="px-4 py-2 text-center rounded-lg bg-zinc-100 text-black hover:bg-zinc-200 transition-colors"
            >
              Production
            </Link>
            <Link
              href="/procurements"
              className="px-4 py-2 text-center rounded-lg bg-zinc-100 text-black hover:bg-zinc-200 transition-colors"
            >
              Procurements
            </Link>
            <Link
              href="/marketing"
              className="px-4 py-2 text-center rounded-lg bg-zinc-100 text-black hover:bg-zinc-200 transition-colors"
            >
              Marketing
            </Link>
            <Link
              href="/hr"
              className="px-4 py-2 text-center rounded-lg bg-zinc-100 text-black hover:bg-zinc-200 transition-colors"
            >
              HR
            </Link>
            <Link
              href="/compliance"
              className="px-4 py-2 text-center rounded-lg bg-zinc-100 text-black hover:bg-zinc-200 transition-colors"
            >
              Compliance
            </Link>
            <Link
              href="/logistics"
              className="px-4 py-2 text-center rounded-lg bg-zinc-100 text-black hover:bg-zinc-200 transition-colors"
            >
              Logistics
            </Link>
            <Link
              href="/communications"
              className="px-4 py-2 text-center rounded-lg bg-zinc-100 text-black hover:bg-zinc-200 transition-colors"
            >
              Communications
            </Link>
            <Link
              href="/connections"
              className="px-4 py-2 text-center rounded-lg bg-zinc-100 text-black hover:bg-zinc-200 transition-colors"
            >
              Connections
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
