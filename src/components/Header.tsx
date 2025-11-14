'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';

export default function Header() {
  const { data: session } = useSession();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showOrgMenu, setShowOrgMenu] = useState(false);
  const [currentOrg, setCurrentOrg] = useState<{ id: string; name: string } | null>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const orgMenuRef = useRef<HTMLDivElement>(null);
  
  const userInitial = session?.user?.profile?.fullName 
    ? session.user.profile.fullName.charAt(0).toUpperCase()
    : session?.user?.email?.charAt(0).toUpperCase() || 'A';

  useEffect(() => {
    if (session?.user?.currentOrganizationId) {
      fetch(`/api/organizations/${session.user.currentOrganizationId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.name) {
            setCurrentOrg({ id: data.id, name: data.name });
          }
        })
        .catch(() => {});
    }
  }, [session?.user?.currentOrganizationId]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
      if (orgMenuRef.current && !orgMenuRef.current.contains(event.target as Node)) {
        setShowOrgMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left: Branding */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <span className="text-xl">🥛</span>
          </div>
          <h1 className="text-xl font-semibold text-gray-900">Dairy CRM</h1>
        </div>

        {/* Center: Organization Switcher */}
        {session?.user?.memberships && session.user.memberships.length > 0 && (
          <div className="relative" ref={orgMenuRef}>
            <button
              onClick={() => {
                setShowOrgMenu(!showOrgMenu);
                setShowNotifications(false);
                setShowUserMenu(false);
              }}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                {currentOrg?.name?.charAt(0).toUpperCase() || 'O'}
              </div>
              <span className="text-sm font-medium text-gray-700 hidden md:block">
                {currentOrg?.name || 'Organization'}
              </span>
              <svg
                className="w-4 h-4 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            <AnimatePresence>
              {showOrgMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
                >
                  <div className="px-4 py-2 border-b border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-900">Organizations</h3>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {session.user.memberships.map((membership: any) => (
                      <div
                        key={membership.organizationId}
                        className={`px-4 py-2 hover:bg-gray-50 cursor-pointer ${
                          membership.organizationId === session.user.currentOrganizationId
                            ? 'bg-blue-50'
                            : ''
                        }`}
                      >
                        <p className="text-sm font-medium text-gray-900">
                          {membership.organizationId === session.user.currentOrganizationId && '✓ '}
                          Organization {membership.organizationId.slice(0, 8)}
                        </p>
                        <p className="text-xs text-gray-500">{membership.role}</p>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-gray-200 mt-2 pt-2">
                    <Link
                      href="/settings/organization"
                      className="block px-4 py-2 hover:bg-gray-50 cursor-pointer"
                      onClick={() => setShowOrgMenu(false)}
                    >
                      <p className="text-sm text-gray-900">Organization Settings</p>
                    </Link>
                    <Link
                      href="/settings/team"
                      className="block px-4 py-2 hover:bg-gray-50 cursor-pointer"
                      onClick={() => setShowOrgMenu(false)}
                    >
                      <p className="text-sm text-gray-900">Team Management</p>
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Right: Notifications and User Menu */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <div className="relative" ref={notificationsRef}>
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowUserMenu(false);
              }}
              className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Notifications"
            >
              <svg
                className="w-6 h-6 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
                >
                  <div className="px-4 py-2 border-b border-gray-200">
                    <h3 className="font-semibold text-gray-900">Notifications</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    <div className="px-4 py-3 hover:bg-gray-50 cursor-pointer">
                      <p className="text-sm text-gray-900">No new notifications</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User Menu */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => {
                setShowUserMenu(!showUserMenu);
                setShowNotifications(false);
              }}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="User menu"
            >
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                {userInitial}
              </div>
              <svg
                className="w-4 h-4 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            <AnimatePresence>
              {showUserMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
                >
                  {session?.user && (
                    <div className="px-4 py-2 border-b border-gray-200">
                      <p className="text-sm font-medium text-gray-900">
                        {session.user.profile?.fullName || session.user.email}
                      </p>
                      {session.user.department && (
                        <p className="text-xs text-gray-500">{session.user.department}</p>
                      )}
                    </div>
                  )}
                  <Link href="/profile" className="block px-4 py-2 hover:bg-gray-50 cursor-pointer">
                    <p className="text-sm text-gray-900">Profile</p>
                  </Link>
                  <Link href="/settings/organization" className="block px-4 py-2 hover:bg-gray-50 cursor-pointer">
                    <p className="text-sm text-gray-900">Organization Settings</p>
                  </Link>
                  <Link href="/settings/team" className="block px-4 py-2 hover:bg-gray-50 cursor-pointer">
                    <p className="text-sm text-gray-900">Team</p>
                  </Link>
                  <div className="border-t border-gray-200 mt-2 pt-2">
                    <button
                      onClick={() => signOut({ callbackUrl: '/' })}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 cursor-pointer"
                    >
                      <p className="text-sm text-gray-900">Sign out</p>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}

