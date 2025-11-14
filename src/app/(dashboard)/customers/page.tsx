'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Modal from '../../../components/Modal';

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'CUSTOMER',
    businessCategory: 'B2C',
    gstNumber: '',
    creditLimit: 0,
    paymentTermsDays: 0,
    hasColdStorage: false,
    deliveryPreferences: '',
    contacts: [{ fullName: '', email: '', phone: '', isPrimary: true }],
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchCustomers = () => {
    setLoading(true);
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
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsModalOpen(false);
        setFormData({
          name: '',
          type: 'CUSTOMER',
          businessCategory: 'B2C',
          gstNumber: '',
          creditLimit: 0,
          paymentTermsDays: 0,
          hasColdStorage: false,
          deliveryPreferences: '',
          contacts: [{ fullName: '', email: '', phone: '', isPrimary: true }],
        });
        fetchCustomers();
      } else {
        alert('Failed to add customer');
      }
    } catch (err) {
      alert('Error adding customer');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50">
        <div className="text-lg text-zinc-600">Loading customers...</div>
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
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-semibold text-black mb-4">
                Customers
              </h1>
              <p className="text-lg text-zinc-600">
                Manage your customer relationships
              </p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
            >
              + Add Customer
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {customers.map((customer, index) => (
            <motion.div
              key={customer.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -4 }}
              className="bg-white rounded-lg p-6 shadow-sm border border-black/8 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-semibold text-black">
                  {customer.name}
                </h3>
                <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                  {customer.type}
                </span>
              </div>

              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-zinc-600">Category: </span>
                  <span className="text-black font-medium">
                    {customer.businessCategory}
                  </span>
                </div>

                {customer.gstNumber && (
                  <div>
                    <span className="text-zinc-600">GST: </span>
                    <span className="text-black font-medium">
                      {customer.gstNumber}
                    </span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-zinc-600">Credit Limit:</span>
                  <span className="text-black font-medium">
                    ₹{customer.creditLimit.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-zinc-600">Payment Terms:</span>
                  <span className="text-black font-medium">
                    {customer.paymentTermsDays} days
                  </span>
                </div>

                {customer.hasColdStorage && (
                  <div className="mt-2">
                    <span className="inline-block px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
                      Cold Storage Available
                    </span>
                  </div>
                )}

                {customer.deliveryPreferences && (
                  <div className="mt-3 pt-3 border-t border-zinc-200">
                    <p className="text-xs text-zinc-600">
                      <span className="font-medium">Delivery:</span> {customer.deliveryPreferences}
                    </p>
                  </div>
                )}

                <div className="mt-4 pt-4 border-t border-zinc-200">
                  <div className="flex justify-between text-xs text-zinc-600 mb-2">
                    <span>Contacts: {customer.contacts.length}</span>
                    <span>Orders: {customer.salesOrders.length}</span>
                  </div>
                  {customer.contacts.length > 0 && (
                    <div className="space-y-1">
                      {customer.contacts.slice(0, 2).map((contact) => (
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
            <p className="text-zinc-600">No customers found</p>
          </motion.div>
        )}
      </div>

      {/* Add Customer Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Customer" size="lg">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Customer Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type *
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="CUSTOMER">Customer</option>
                <option value="SUPPLIER">Supplier</option>
                <option value="BOTH">Both</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Category *
              </label>
              <select
                value={formData.businessCategory}
                onChange={(e) => setFormData({ ...formData, businessCategory: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="B2C">B2C</option>
                <option value="B2B">B2B</option>
                <option value="DAIRY_FARM">Dairy Farm</option>
                <option value="DISTRIBUTOR">Distributor</option>
                <option value="RETAILER">Retailer</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                GST Number
              </label>
              <input
                type="text"
                value={formData.gstNumber}
                onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Credit Limit (₹)
              </label>
              <input
                type="number"
                value={formData.creditLimit}
                onChange={(e) => setFormData({ ...formData, creditLimit: Number(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Terms (Days)
              </label>
              <input
                type="number"
                value={formData.paymentTermsDays}
                onChange={(e) => setFormData({ ...formData, paymentTermsDays: Number(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="hasColdStorage"
              checked={formData.hasColdStorage}
              onChange={(e) => setFormData({ ...formData, hasColdStorage: e.target.checked })}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="hasColdStorage" className="text-sm font-medium text-gray-700">
              Has Cold Storage
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Delivery Preferences
            </label>
            <textarea
              value={formData.deliveryPreferences}
              onChange={(e) => setFormData({ ...formData, deliveryPreferences: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Primary Contact</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.contacts[0].fullName}
                  onChange={(e) => setFormData({
                    ...formData,
                    contacts: [{ ...formData.contacts[0], fullName: e.target.value }]
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.contacts[0].email}
                  onChange={(e) => setFormData({
                    ...formData,
                    contacts: [{ ...formData.contacts[0], email: e.target.value }]
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  value={formData.contacts[0].phone}
                  onChange={(e) => setFormData({
                    ...formData,
                    contacts: [{ ...formData.contacts[0], phone: e.target.value }]
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-6 border-t">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Adding...' : 'Add Customer'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}



