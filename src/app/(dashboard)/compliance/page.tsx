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
    fetch('/api/compliance/documents', {
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
        setDocuments(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Failed to load documents');
        setDocuments([]);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50">
        <div className="text-lg text-zinc-600">Loading documents...</div>
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
                Compliance Documents
              </h1>
              <p className="text-lg text-zinc-600">
                Manage regulatory and compliance documents
              </p>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-lg px-6 py-4 border border-black/8"
            >
              <p className="text-sm text-zinc-600">Total Documents</p>
              <p className="text-2xl font-semibold text-black">{documents.length}</p>
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
              className="bg-white rounded-lg p-6 shadow-sm border border-black/8 hover:shadow-md transition-shadow"
            >
              <div className="mb-4">
                <h3 className="text-xl font-semibold text-black mb-2">
                  {document.name}
                </h3>
                <p className="text-sm text-zinc-600">
                  {new Date(document.uploadedAt).toLocaleDateString()}
                </p>
              </div>

              <div className="space-y-3 text-sm">
                {document.category && (
                  <div>
                    <span className="text-zinc-600">Category: </span>
                    <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                      {document.category}
                    </span>
                  </div>
                )}

                <div>
                  <span className="text-zinc-600">Path: </span>
                  <p className="text-black font-mono text-xs break-all">
                    {document.path}
                  </p>
                </div>

                {document.relatedType && (
                  <div className="mt-3 pt-3 border-t border-zinc-200">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-zinc-600">Related:</span>
                      <span className="text-black font-medium">
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
            <p className="text-zinc-600">No documents found</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}



