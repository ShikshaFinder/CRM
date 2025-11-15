'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Profile {
  id: string;
  fullName: string | null;
  phone: string | null;
  roleTitle: string | null;
}

interface Department {
  id: string;
  name: string;
}

interface Employee {
  id: string;
  email: string;
  profile: Profile | null;
  department: Department | null;
  managerId: string | null;
}

export default function HRPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/hr/employees', {
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
        setEmployees(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Failed to load employees');
        setEmployees([]);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50">
        <div className="text-lg text-zinc-600">Loading employees...</div>
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
              <h1 className="text-4xl font-semibold text-black mb-2">
                Employees
              </h1>
              <p className="text-lg text-zinc-600">
                Manage your workforce
              </p>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-lg px-6 py-4 border border-black/[.08]"
            >
              <p className="text-sm text-zinc-600">Total Employees</p>
              <p className="text-2xl font-semibold text-black">{employees.length}</p>
            </motion.div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {employees.map((employee, index) => (
            <motion.div
              key={employee.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -4 }}
              className="bg-white rounded-lg p-6 shadow-sm border border-black/[.08] hover:shadow-md transition-shadow"
            >
              <div className="mb-4">
                <h3 className="text-xl font-semibold text-black mb-1">
                  {employee.profile?.fullName || 'No Name'}
                </h3>
                <p className="text-sm text-zinc-600">
                  {employee.email}
                </p>
              </div>

              <div className="space-y-3 text-sm">
                {employee.profile?.roleTitle && (
                  <div>
                    <span className="text-zinc-600">Role: </span>
                    <span className="text-black font-medium">
                      {employee.profile.roleTitle}
                    </span>
                  </div>
                )}

                {employee.department && (
                  <div>
                    <span className="text-zinc-600">Department: </span>
                    <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                      {employee.department.name}
                    </span>
                  </div>
                )}

                {employee.profile?.phone && (
                  <div>
                    <span className="text-zinc-600">Phone: </span>
                    <span className="text-black font-medium">
                      {employee.profile.phone}
                    </span>
                  </div>
                )}

                {employee.managerId && (
                  <div className="mt-3 pt-3 border-t border-zinc-200">
                    <p className="text-xs text-zinc-600">
                      Has Manager
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {employees.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-zinc-600">No employees found</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}


