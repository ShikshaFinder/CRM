'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Notification {
  id: string;
  userId: string;
  title: string;
  body: string | null;
  read: boolean;
  createdAt: string;
}

interface Comment {
  id: string;
  body: string;
  createdAt: string;
}

interface SupportTicket {
  id: string;
  ticketNumber: string;
  connectionId: string | null;
  issueType: string | null;
  priority: string;
  status: string;
  comments: Comment[];
  createdAt: string;
}

interface CommunicationsData {
  notifications: Notification[];
  tickets: SupportTicket[];
}

export default function CommunicationsPage() {
  const [data, setData] = useState<CommunicationsData>({ notifications: [], tickets: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'notifications' | 'tickets'>('notifications');

  useEffect(() => {
    fetch('/api/communications')
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to load communications');
        setLoading(false);
      });
  }, []);

  const getPriorityColor = (priority: string) => {
    switch (priority.toUpperCase()) {
      case 'HIGH':
        return 'bg-red-100 text-red-800';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800';
      case 'LOW':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'OPEN':
        return 'bg-blue-100 text-blue-800';
      case 'IN_PROGRESS':
        return 'bg-yellow-100 text-yellow-800';
      case 'RESOLVED':
        return 'bg-green-100 text-green-800';
      case 'CLOSED':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50">
        <div className="text-lg text-zinc-600">Loading communications...</div>
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

  const unreadNotifications = data.notifications.filter(n => !n.read).length;

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
            Communications
          </h1>
          <p className="text-lg text-zinc-600">
            Notifications and support tickets
          </p>
        </motion.div>

        <div className="mb-6 flex gap-4 border-b border-zinc-200">
          <button
            onClick={() => setActiveTab('notifications')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'notifications'
                ? 'text-black border-b-2 border-black'
                : 'text-zinc-600 hover:text-black'
            }`}
          >
            Notifications
            {unreadNotifications > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs">
                {unreadNotifications}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('tickets')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'tickets'
                ? 'text-black border-b-2 border-black'
                : 'text-zinc-600 hover:text-black'
            }`}
          >
            Support Tickets ({data.tickets.length})
          </button>
        </div>

        {activeTab === 'notifications' && (
          <div className="space-y-4">
            {data.notifications.map((notification, index) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                whileHover={{ scale: 1.01, x: 4 }}
                className={`bg-white rounded-lg p-6 shadow-sm border border-black/[.08] hover:shadow-md transition-shadow ${
                  !notification.read ? 'border-l-4 border-l-blue-500' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-black mb-1">
                      {notification.title}
                    </h3>
                    {notification.body && (
                      <p className="text-sm text-zinc-600 mb-2">
                        {notification.body}
                      </p>
                    )}
                    <p className="text-xs text-zinc-500">
                      {new Date(notification.createdAt).toLocaleString()}
                    </p>
                  </div>
                  {!notification.read && (
                    <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                      New
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
            {data.notifications.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <p className="text-zinc-600">No notifications found</p>
              </motion.div>
            )}
          </div>
        )}

        {activeTab === 'tickets' && (
          <div className="space-y-6">
            {data.tickets.map((ticket, index) => (
              <motion.div
                key={ticket.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                whileHover={{ scale: 1.01, x: 4 }}
                className="bg-white rounded-lg p-6 shadow-sm border border-black/[.08] hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-black mb-1">
                      {ticket.ticketNumber}
                    </h3>
                    {ticket.issueType && (
                      <p className="text-sm text-zinc-600">
                        {ticket.issueType}
                      </p>
                    )}
                    <p className="text-sm text-zinc-500 mt-1">
                      Created: {new Date(ticket.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="mt-4 md:mt-0 flex gap-2">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                      {ticket.priority}
                    </span>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                      {ticket.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                {ticket.comments.length > 0 && (
                  <div className="border-t border-zinc-200 pt-4">
                    <h4 className="text-sm font-medium text-zinc-600 mb-2">
                      Comments ({ticket.comments.length})
                    </h4>
                    <div className="space-y-2">
                      {ticket.comments.map((comment) => (
                        <div key={comment.id} className="bg-zinc-50 rounded p-3 text-sm">
                          <p className="text-zinc-700">{comment.body}</p>
                          <p className="text-xs text-zinc-500 mt-1">
                            {new Date(comment.createdAt).toLocaleString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
            {data.tickets.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <p className="text-zinc-600">No support tickets found</p>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}


