"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FinanceInvoicesChart } from "@/components/charts/FinanceInvoicesChart";

interface Payment {
  id: string;
  amount: number;
  paymentDate: string | null;
  paymentMethod: string | null;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  totalAmount: number;
  dueDate: string | null;
  createdAt: string;
  salesOrder: {
    id: string;
    orderRef: string;
  } | null;
  payments: Payment[];
}

export default function FinancePage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/finance/invoices', {
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
        setInvoices(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Failed to load invoices');
        setInvoices([]);
        setLoading(false);
      });
  }, []);

  const getPaymentStatus = (invoice: Invoice) => {
    const totalPaid = (Array.isArray(invoice.payments) ? invoice.payments : []).reduce((sum, p) => sum + (p.amount || 0), 0);
    const remaining = invoice.totalAmount - totalPaid;
    
    if (remaining <= 0) return { status: 'paid', amount: 0, color: 'bg-green-100 text-green-800' };
    if (invoice.dueDate && new Date(invoice.dueDate) < new Date()) {
      return { status: 'overdue', amount: remaining, color: 'bg-red-100 text-red-800' };
    }
    return { status: 'pending', amount: remaining, color: 'bg-yellow-100 text-yellow-800' };
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50">
        <div className="text-lg text-zinc-600">Loading invoices...</div>
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

  const totalAmount = invoices.reduce((sum, inv) => sum + (inv.totalAmount || 0), 0);
  const totalPaid = invoices.reduce((sum, inv) => {
    const paid = (Array.isArray(inv.payments) ? inv.payments : []).reduce((pSum, p) => pSum + (p.amount || 0), 0);
    return sum + paid;
  }, 0);
  const totalOutstanding = totalAmount - totalPaid;

  return (
    <div className="min-h-screen bg-zinc-50 py-16 px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-4xl font-semibold text-black mb-2">
                Finance & Invoices
              </h1>
              <p className="text-lg text-zinc-600">
                Manage invoices and payments
              </p>
            </div>
            <div className="flex gap-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-lg px-6 py-4 border border-black/8"
              >
                <p className="text-sm text-zinc-600">Total</p>
                <p className="text-2xl font-semibold text-black">
                  ₹{totalAmount.toLocaleString()}
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-lg px-6 py-4 border border-black/8"
              >
                <p className="text-sm text-zinc-600">Outstanding</p>
                <p className="text-2xl font-semibold text-black">
                  ₹{totalOutstanding.toLocaleString()}
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-10 bg-white rounded-lg p-6 shadow-sm border border-black/8"
        >
          <h2 className="text-xl font-semibold text-black mb-4">
            Invoiced vs Paid (Monthly)
          </h2>
          <p className="text-sm text-zinc-600 mb-4">
            Monthly totals based on invoices and their payments.
          </p>
          <FinanceInvoicesChart />
        </motion.div>

        <div className="space-y-6">
          {invoices.map((invoice, index) => {
            const paymentStatus = getPaymentStatus(invoice);
            const totalPaid = (Array.isArray(invoice.payments) ? invoice.payments : []).reduce((sum, p) => sum + (p.amount || 0), 0);
            return (
              <motion.div
                key={invoice.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                whileHover={{ scale: 1.01, x: 4 }}
                className="bg-white rounded-lg p-6 shadow-sm border border-black/8 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-black mb-1">
                      {invoice.invoiceNumber}
                    </h3>
                    {invoice.salesOrder && (
                      <p className="text-sm text-zinc-600">
                        Order: {invoice.salesOrder.orderRef}
                      </p>
                    )}
                    <p className="text-sm text-zinc-500 mt-1">
                      Created: {new Date(invoice.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="mt-4 md:mt-0 flex flex-col items-end gap-2">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${paymentStatus.color}`}>
                      {paymentStatus.status.toUpperCase()}
                    </span>
                    <p className="text-lg font-semibold text-black">
                      ₹{invoice.totalAmount.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm mb-4">
                  {invoice.dueDate && (
                    <div>
                      <span className="text-zinc-600">Due Date:</span>
                      <p className="text-black font-medium">
                        {new Date(invoice.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                  <div>
                    <span className="text-zinc-600">Paid:</span>
                    <p className="text-black font-medium">
                      ₹{totalPaid.toFixed(2)}
                    </p>
                  </div>
                  {paymentStatus.amount > 0 && (
                    <div>
                      <span className="text-zinc-600">Remaining:</span>
                      <p className="text-black font-medium">
                        ₹{paymentStatus.amount.toFixed(2)}
                      </p>
                    </div>
                  )}
                </div>

                {Array.isArray(invoice.payments) && invoice.payments.length > 0 && (
                  <div className="border-t border-zinc-200 pt-4">
                    <h4 className="text-sm font-medium text-zinc-600 mb-2">
                      Payments ({invoice.payments.length})
                    </h4>
                    <div className="space-y-2">
                      {invoice.payments.map((payment) => (
                        <div key={payment.id} className="flex justify-between items-center text-sm">
                          <span className="text-zinc-700">
                            {payment.paymentDate ? new Date(payment.paymentDate).toLocaleDateString() : 'No date'}
                            {payment.paymentMethod && ` • ${payment.paymentMethod}`}
                          </span>
                          <span className="text-black font-medium">
                            ₹{payment.amount.toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {invoices.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-zinc-600">No invoices found</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}



