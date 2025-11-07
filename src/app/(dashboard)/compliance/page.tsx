'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Document {
  id: string;
  name: string;
  path: string;
  category: string | null;
  relatedType: string | null;
  relatedId: string | null;
  uploadedAt: string;
}

export default function CompliancePage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/compliance/documents')
      .then((res) => res.json())
      .then((data) => {
        setDocuments(data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to load documents');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
        <div className="text-lg text-zinc-600 dark:text-zinc-400">Loading documents...</div>
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
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-semibold text-black dark:text-zinc-50 mb-2">
                Compliance Documents
              </h1>
              <p className="text-lg text-zinc-600 dark:text-zinc-400">
                Manage regulatory and compliance documents
              </p>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-zinc-900 rounded-lg px-6 py-4 border border-black/[.08] dark:border-white/[.145]"
            >
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Total Documents</p>
              <p className="text-2xl font-semibold text-black dark:text-zinc-50">{documents.length}</p>
            </motion.div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.map((document, index) => (
            <motion.div
              key={document.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -4 }}
              className="bg-white dark:bg-zinc-900 rounded-lg p-6 shadow-sm border border-black/[.08] dark:border-white/[.145] hover:shadow-md transition-shadow"
            >
              <div className="mb-4">
                <h3 className="text-xl font-semibold text-black dark:text-zinc-50 mb-2">
                  {document.name}
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  {new Date(document.uploadedAt).toLocaleDateString()}
                </p>
              </div>

              <div className="space-y-3 text-sm">
                {document.category && (
                  <div>
                    <span className="text-zinc-600 dark:text-zinc-400">Category: </span>
                    <span className="inline-block px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-xs font-medium">
                      {document.category}
                    </span>
                  </div>
                )}

                <div>
                  <span className="text-zinc-600 dark:text-zinc-400">Path: </span>
                  <p className="text-black dark:text-zinc-50 font-mono text-xs break-all">
                    {document.path}
                  </p>
                </div>

                {document.relatedType && (
                  <div className="mt-3 pt-3 border-t border-zinc-200 dark:border-zinc-800">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-zinc-600 dark:text-zinc-400">Related:</span>
                      <span className="text-black dark:text-zinc-50 font-medium">
                        {document.relatedType}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {documents.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-zinc-600 dark:text-zinc-400">No documents found</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}


