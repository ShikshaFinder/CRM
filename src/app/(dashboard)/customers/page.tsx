'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Contact {
  id: string;
  fullName: string;
  email: string | null;
  phone: string | null;
  isPrimary: boolean;
}

interface Customer {
  id: string;
  name: string;
  type: string;
  businessCategory: string;
  gstNumber: string | null;
  creditLimit: number;
  paymentTermsDays: number;
  hasColdStorage: boolean;
  deliveryPreferences: string | null;
  contacts: Contact[];
  procurements: any[];
  salesOrders: any[];
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/customers')
      .then((res) => res.json())
      .then((data) => {
        setCustomers(data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to load customers');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
        <div className="text-lg text-zinc-600 dark:text-zinc-400">Loading customers...</div>
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
            Customers
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Manage your customer relationships
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {customers.map((customer, index) => (
            <motion.div
              key={customer.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -4 }}
              className="bg-white dark:bg-zinc-900 rounded-lg p-6 shadow-sm border border-black/[.08] dark:border-white/[.145] hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-semibold text-black dark:text-zinc-50">
                  {customer.name}
                </h3>
                <span className="inline-block px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-xs font-medium">
                  {customer.type}
                </span>
              </div>

              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-zinc-600 dark:text-zinc-400">Category: </span>
                  <span className="text-black dark:text-zinc-50 font-medium">
                    {customer.businessCategory}
                  </span>
                </div>

                {customer.gstNumber && (
                  <div>
                    <span className="text-zinc-600 dark:text-zinc-400">GST: </span>
                    <span className="text-black dark:text-zinc-50 font-medium">
                      {customer.gstNumber}
                    </span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-zinc-600 dark:text-zinc-400">Credit Limit:</span>
                  <span className="text-black dark:text-zinc-50 font-medium">
                    ₹{customer.creditLimit.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-zinc-600 dark:text-zinc-400">Payment Terms:</span>
                  <span className="text-black dark:text-zinc-50 font-medium">
                    {customer.paymentTermsDays} days
                  </span>
                </div>

                {customer.hasColdStorage && (
                  <div className="mt-2">
                    <span className="inline-block px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded text-xs font-medium">
                      Cold Storage Available
                    </span>
                  </div>
                )}

                {customer.deliveryPreferences && (
                  <div className="mt-3 pt-3 border-t border-zinc-200 dark:border-zinc-800">
                    <p className="text-xs text-zinc-600 dark:text-zinc-400">
                      <span className="font-medium">Delivery:</span> {customer.deliveryPreferences}
                    </p>
                  </div>
                )}

                <div className="mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                  <div className="flex justify-between text-xs text-zinc-600 dark:text-zinc-400 mb-2">
                    <span>Contacts: {customer.contacts.length}</span>
                    <span>Orders: {customer.salesOrders.length}</span>
                  </div>
                  {customer.contacts.length > 0 && (
                    <div className="space-y-1">
                      {customer.contacts.slice(0, 2).map((contact) => (
                        <div key={contact.id} className="text-xs">
                          <span className="text-black dark:text-zinc-50 font-medium">
                            {contact.fullName}
                            {contact.isPrimary && (
                              <span className="ml-1 text-blue-600 dark:text-blue-400">★</span>
                            )}
                          </span>
                          {contact.email && (
                            <p className="text-zinc-500 dark:text-zinc-500">{contact.email}</p>
                          )}
                          {contact.phone && (
                            <p className="text-zinc-500 dark:text-zinc-500">{contact.phone}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {customers.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-zinc-600 dark:text-zinc-400">No customers found</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}


