'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

interface NavItem {
  name: string;
  href: string;
  icon: string;
}

const navItems: NavItem[] = [
  { name: 'Dashboard', href: '/', icon: '🏠' },
  { name: 'Connections', href: '/connections', icon: '🔗' },
  { name: 'Products', href: '/products', icon: '📦' },
  { name: 'Milk Procurement', href: '/procurements', icon: '🥛' },
  { name: 'Production', href: '/production', icon: '🏭' },
  { name: 'Packaging', href: '/packaging', icon: '📦' },
  { name: 'Sales', href: '/orders', icon: '👜' },
  { name: 'Inventory', href: '/inventory', icon: '🛒' },
  { name: 'Delivery', href: '/delivery', icon: '🚚' },
  { name: 'Support', href: '/support', icon: '🎧' },
  { name: 'Reports', href: '/reports', icon: '📄' },
  { name: 'Settings', href: '/settings', icon: '⚙️' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Update document margin when sidebar state changes
  useEffect(() => {
    const sidebarWidth = isOpen ? 280 : 80;
    document.documentElement.style.setProperty('--sidebar-width', `${sidebarWidth}px`);
  }, [isOpen]);

  // Don't show sidebar on auth pages
  if (pathname?.startsWith('/signup') || pathname?.startsWith('/verify-email') || pathname?.startsWith('/api/auth')) {
    return null;
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="fixed top-4 left-4 z-50 md:hidden p-2 rounded-lg bg-white border border-black/8 shadow-sm"
        aria-label="Toggle menu"
      >
        <svg
          className="w-6 h-6 text-black"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {isMobileOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          width: isOpen ? 280 : 80,
        }}
        className={`
          fixed left-0 top-0 h-full bg-slate-800 border-r border-slate-700
          z-30
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
        style={{ width: isOpen ? 280 : 80 }}
      >
        <div className="flex flex-col h-full">
          {/* Logo/Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-700">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: isOpen ? 1 : 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <Link href="/" className="flex items-center gap-2">
                <span className="text-2xl font-semibold text-white">
                  Flavi CRM
                </span>
              </Link>
            </motion.div>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="hidden md:flex p-2 rounded-lg hover:bg-slate-700 transition-colors"
              aria-label="Toggle sidebar"
            >
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 5l7 7-7 7M5 5l7 7-7 7"
                  />
                )}
              </svg>
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-1">
            {navItems.map((item, index) => {
              const isActive = pathname === item.href;
              return (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setIsMobileOpen(false)}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-lg transition-colors relative
                      ${isActive
                        ? 'bg-slate-700 text-white font-medium'
                        : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                      }
                    `}
                  >
                    <span className="text-xl shrink-0">{item.icon}</span>
                    <motion.span
                      initial={{ opacity: 1 }}
                      animate={{ opacity: isOpen ? 1 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden whitespace-nowrap"
                    >
                      {item.name}
                    </motion.span>
                    {isActive && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r"
                        initial={false}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                    )}
                  </Link>
                </motion.div>
              );
            })}
          </nav>

          {/* Footer/Auth Section */}
          <div className="p-4 border-t border-slate-700">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: isOpen ? 1 : 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <Link
                href="/api/auth/signin"
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-700/50 hover:text-white transition-colors"
              >
                <span className="text-xl">🔐</span>
                <span className="whitespace-nowrap">Sign In</span>
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.aside>
    </>
  );
}


