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

interface Connection {
  id: string;
  name: string;
  type: string;
  businessCategory: string | null;
  gstNumber: string | null;
  creditLimit: number;
  paymentTermsDays: number;
  hasColdStorage: boolean;
  deliveryPreferences: string | null;
  contacts: Contact[];
}

export default function ConnectionsPage() {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/connections')
      .then((res) => res.json())
      .then((data) => {
        setConnections(data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to load connections');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50">
        <div className="text-lg text-zinc-600">Loading connections...</div>
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
            Connections
          </h1>
          <p className="text-lg text-zinc-600">
            Manage all business connections
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {connections.map((connection, index) => (
            <motion.div
              key={connection.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -4 }}
              className="bg-white rounded-lg p-6 shadow-sm border border-black/[.08] hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-semibold text-black">
                  {connection.name}
                </h3>
                <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                  {connection.type}
                </span>
              </div>

              <div className="space-y-3 text-sm">
                {connection.businessCategory && (
                  <div>
                    <span className="text-zinc-600">Category: </span>
                    <span className="text-black font-medium">
                      {connection.businessCategory}
                    </span>
                  </div>
                )}

                {connection.gstNumber && (
                  <div>
                    <span className="text-zinc-600">GST: </span>
                    <span className="text-black font-medium">
                      {connection.gstNumber}
                    </span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-zinc-600">Credit Limit:</span>
                  <span className="text-black font-medium">
                    ₹{connection.creditLimit.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-zinc-600">Payment Terms:</span>
                  <span className="text-black font-medium">
                    {connection.paymentTermsDays} days
                  </span>
                </div>

                {connection.hasColdStorage && (
                  <div className="mt-2">
                    <span className="inline-block px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
                      Cold Storage Available
                    </span>
                  </div>
                )}

                {connection.deliveryPreferences && (
                  <div className="mt-3 pt-3 border-t border-zinc-200">
                    <p className="text-xs text-zinc-600">
                      <span className="font-medium">Delivery:</span> {connection.deliveryPreferences}
                    </p>
                  </div>
                )}

                {connection.contacts.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-zinc-200">
                    <p className="text-xs text-zinc-600 mb-2">
                      Contacts ({connection.contacts.length})
                    </p>
                    <div className="space-y-1">
                      {connection.contacts.slice(0, 3).map((contact) => (
                        <div key={contact.id} className="text-xs">
                          <span className="text-black font-medium">
                            {contact.fullName}
                            {contact.isPrimary && (
                              <span className="ml-1 text-blue-600">★</span>
                            )}
                          </span>
                          {contact.email && (
                            <p className="text-zinc-500">{contact.email}</p>
                          )}
                          {contact.phone && (
                            <p className="text-zinc-500">{contact.phone}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {connections.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-zinc-600">No connections found</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}


