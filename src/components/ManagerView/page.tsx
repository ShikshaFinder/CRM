"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  profile?: {
    fullName?: string;
    phone?: string;
  };
  department: string;
  tasksCompletedToday: number;
  totalTasks: number;
  progress: number;
  currentStatus: string;
}

interface ServiceTicket {
  id: string;
  ticketNumber: string;
  category: string;
  issue: string;
  priority: string;
  assignedTo: string;
  status: string;
}

interface DashboardData {
  metrics: {
    totalEmployees: number;
    pendingTasks: number;
    pendingFollowUps: number;
  };
  teamActivity: TeamMember[];
  serviceTickets: {
    summary: {
      openTickets: number;
      escalatedTickets: number;
      assignedTickets: number;
    };
    tickets: ServiceTicket[];
  };
  salesPipeline: {
    totalInquiries: number;
    assignedInquiries: number;
    conversionRate: number;
    hotLeads: number;
    upcomingFollowUps: number;
    delayedFollowUps: number;
  };
}

export default function ManagerDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/manager/dashboard", {
      credentials: "include",
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
        setData(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to load dashboard data");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-4 text-lg text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <p className="text-lg text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "on visit":
        return "bg-green-100 text-green-800 border-green-200";
      case "at office":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "idle":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toUpperCase()) {
      case "HIGH":
      case "CRITICAL":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "LOW":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Manager Dashboard
          </h1>
          <p className="text-gray-600">
            Overview of your team's performance and activities
          </p>
        </motion.div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Total Employees Under Me
                </p>
                <p className="text-4xl font-bold text-gray-900">
                  {data.metrics.totalEmployees}
                </p>
              </div>
              <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center">
                <span className="text-3xl">👥</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Pending Tasks (Team)
                </p>
                <p className="text-4xl font-bold text-gray-900">
                  {data.metrics.pendingTasks}
                </p>
              </div>
              <div className="w-16 h-16 bg-yellow-100 rounded-xl flex items-center justify-center">
                <span className="text-3xl">📋</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Pending Follow-ups
                </p>
                <p className="text-4xl font-bold text-gray-900">
                  {data.metrics.pendingFollowUps}
                </p>
              </div>
              <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center">
                <span className="text-3xl">🔔</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Team Activity Overview */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-1 bg-white rounded-2xl shadow-lg border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                Team Activity Overview
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-2 text-xs font-semibold text-gray-600 uppercase">
                      Employee
                    </th>
                    <th className="text-left py-3 px-2 text-xs font-semibold text-gray-600 uppercase">
                      Tasks Today
                    </th>
                    <th className="text-left py-3 px-2 text-xs font-semibold text-gray-600 uppercase">
                      Progress
                    </th>
                    <th className="text-left py-3 px-2 text-xs font-semibold text-gray-600 uppercase">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.teamActivity.map((member, index) => (
                    <motion.tr
                      key={member.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.05 }}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                            {getInitials(member.name)}
                          </div>
                          <span className="text-sm font-medium text-gray-900">
                            {member.name}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-2">
                        <span className="text-sm text-gray-700">
                          {member.tasksCompletedToday}
                        </span>
                      </td>
                      <td className="py-3 px-2">
                        <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${member.progress}%` }}
                            transition={{ duration: 0.5, delay: 0.6 + index * 0.05 }}
                            className={`h-full ${
                              member.progress >= 70
                                ? "bg-green-500"
                                : member.progress >= 40
                                ? "bg-blue-500"
                                : "bg-yellow-500"
                            }`}
                          />
                        </div>
                      </td>
                      <td className="py-3 px-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                            member.currentStatus
                          )}`}
                        >
                          {member.currentStatus}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Service Tickets */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="lg:col-span-1 bg-white rounded-2xl shadow-lg border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Service Tickets</h2>
            </div>

            {/* Summary Metrics */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                <p className="text-xs text-gray-600 mb-1">Open Tickets</p>
                <p className="text-2xl font-bold text-blue-700">
                  {data.serviceTickets.summary.openTickets}
                </p>
              </div>
              <div className="bg-orange-50 rounded-lg p-3 border border-orange-100">
                <p className="text-xs text-gray-600 mb-1">Escalated</p>
                <p className="text-2xl font-bold text-orange-700">
                  {data.serviceTickets.summary.escalatedTickets}
                </p>
              </div>
              <div className="bg-green-50 rounded-lg p-3 border border-green-100">
                <p className="text-xs text-gray-600 mb-1">Assigned</p>
                <p className="text-2xl font-bold text-green-700">
                  {data.serviceTickets.summary.assignedTickets}
                </p>
              </div>
            </div>

            {/* Tickets List */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 px-2 text-xs font-semibold text-gray-600 uppercase">
                      Category
                    </th>
                    <th className="text-left py-2 px-2 text-xs font-semibold text-gray-600 uppercase">
                      Issue
                    </th>
                    <th className="text-left py-2 px-2 text-xs font-semibold text-gray-600 uppercase">
                      Priority
                    </th>
                    <th className="text-left py-2 px-2 text-xs font-semibold text-gray-600 uppercase">
                      Assigned
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.serviceTickets.tickets.map((ticket, index) => (
                    <motion.tr
                      key={ticket.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + index * 0.05 }}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-2 px-2">
                        <span className="text-xs text-gray-700">
                          {ticket.category}
                        </span>
                      </td>
                      <td className="py-2 px-2">
                        <span className="text-xs text-gray-700">
                          {ticket.issue}
                        </span>
                      </td>
                      <td className="py-2 px-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(
                            ticket.priority
                          )}`}
                        >
                          {ticket.priority}
                        </span>
                      </td>
                      <td className="py-2 px-2">
                        <span className="text-xs text-gray-700">
                          {ticket.assignedTo}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Sales & Leads Pipeline */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="lg:col-span-1 bg-white rounded-2xl shadow-lg border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                Sales & Leads Pipeline
              </h2>
            </div>

            <div className="space-y-4">
              {/* Total Inquiries */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Total Inquiries
                  </span>
                  <span className="text-2xl font-bold text-blue-700">
                    {data.salesPipeline.totalInquiries}
                  </span>
                </div>
              </div>

              {/* Assigned to Employees */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Assigned to Employees
                  </span>
                  <span className="text-xl font-bold text-gray-900">
                    {data.salesPipeline.assignedInquiries}
                  </span>
                </div>
              </div>

              {/* Conversion Rate */}
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Conversion Rate
                  </span>
                  <span className="text-xl font-bold text-green-700">
                    {data.salesPipeline.conversionRate}%
                  </span>
                </div>
                <div className="w-full h-2 bg-green-200 rounded-full overflow-hidden mt-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${data.salesPipeline.conversionRate}%` }}
                    transition={{ duration: 0.8, delay: 0.7 }}
                    className="h-full bg-green-500"
                  />
                </div>
              </div>

              {/* Hot Leads */}
              <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Hot Leads
                  </span>
                  <span className="text-xl font-bold text-orange-700">
                    {data.salesPipeline.hotLeads}
                  </span>
                </div>
                <div className="w-full h-2 bg-orange-200 rounded-full overflow-hidden mt-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: `${
                        data.salesPipeline.totalInquiries > 0
                          ? (data.salesPipeline.hotLeads /
                              data.salesPipeline.totalInquiries) *
                            100
                          : 0
                      }%`,
                    }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    className="h-full bg-orange-500"
                  />
                </div>
              </div>

              {/* Upcoming Follow-ups */}
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Upcoming Follow-ups
                  </span>
                  <span className="text-xl font-bold text-blue-700">
                    {data.salesPipeline.upcomingFollowUps}
                  </span>
                </div>
                <div className="w-full h-2 bg-blue-200 rounded-full overflow-hidden mt-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: `${
                        data.salesPipeline.totalInquiries > 0
                          ? (data.salesPipeline.upcomingFollowUps /
                              data.salesPipeline.totalInquiries) *
                            100
                          : 0
                      }%`,
                    }}
                    transition={{ duration: 0.8, delay: 0.9 }}
                    className="h-full bg-blue-500"
                  />
                </div>
              </div>

              {/* Delayed Follow-ups */}
              <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Delayed Follow-ups
                  </span>
                  <span className="text-xl font-bold text-red-700">
                    {data.salesPipeline.delayedFollowUps}
                  </span>
                </div>
                <div className="w-full h-2 bg-red-200 rounded-full overflow-hidden mt-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: `${
                        data.salesPipeline.totalInquiries > 0
                          ? (data.salesPipeline.delayedFollowUps /
                              data.salesPipeline.totalInquiries) *
                            100
                          : 0
                      }%`,
                    }}
                    transition={{ duration: 0.8, delay: 1.0 }}
                    className="h-full bg-red-500"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
