'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Campaign {
  id: string;
  type: string;
  notes: string | null;
  relatedType: string | null;
  relatedId: string | null;
  createdAt: string;
}

export default function MarketingPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/marketing/campaigns')
      .then((res) => res.json())
      .then((data) => {
        setCampaigns(data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to load campaigns');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50">
        <div className="text-lg text-zinc-600">Loading campaigns...</div>
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
            Marketing Campaigns
          </h1>
          <p className="text-lg text-zinc-600">
            Manage your marketing activities
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map((campaign, index) => (
            <motion.div
              key={campaign.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -4 }}
              className="bg-white rounded-lg p-6 shadow-sm border border-black/8 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-black mb-1">
                    Campaign #{campaign.id.slice(-6)}
                  </h3>
                  <p className="text-sm text-zinc-600">
                    {new Date(campaign.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span className="inline-block px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs font-medium">
                  {campaign.type}
                </span>
              </div>

              {campaign.notes && (
                <div className="mt-4 pt-4 border-t border-zinc-200">
                  <p className="text-sm text-zinc-700">
                    {campaign.notes}
                  </p>
                </div>
              )}

              {campaign.relatedType && (
                <div className="mt-4 pt-4 border-t border-zinc-200">
                  <div className="flex items-center gap-2 text-xs text-zinc-600">
                    <span>Related:</span>
                    <span className="text-black font-medium">
                      {campaign.relatedType}
                    </span>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {campaigns.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-zinc-600">No campaigns found</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}



