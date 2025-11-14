'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';

export default function SignupPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phone: '',
    organizationName: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const verifyEmailLink = useMemo(() => {
    if (!formData.email) return null;
    const params = new URLSearchParams({ email: formData.email });
    return `/verify-email?${params.toString()}`;
  }, [formData.email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // Validation
    if (!formData.email || !formData.password || !formData.organizationName) {
      setError('Email, password, and organization name are required');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          fullName: formData.fullName || undefined,
          phone: formData.phone || undefined,
          organizationName: formData.organizationName,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to create account');
        setLoading(false);
        return;
      }

      setSuccess(true);
      setLoading(false);
    } catch (err: any) {
      setError('An error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center py-16 px-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-lg p-8 shadow-sm border border-black/8">
          <h1 className="text-3xl font-semibold text-black mb-2">
            Create Account
          </h1>
          <p className="text-zinc-600 mb-6">
            Sign up to get started
          </p>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-800 text-sm"
            >
              {error}
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900"
            >
              <p className="font-medium text-base">You're almost in!</p>
              <p className="mt-1">
                We just sent a verification link to <strong>{formData.email}</strong>.
                Please confirm your email to activate your workspace.
              </p>
              <ul className="mt-3 space-y-1 text-zinc-700">
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                  Check your inbox and click <strong>“Verify email”</strong>.
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                  Look in spam or promotions if you don’t see it right away.
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                  Need another email? Use the resend option on the next screen.
                </li>
              </ul>
              {verifyEmailLink && (
                <a
                  href={verifyEmailLink}
                  className="mt-4 inline-flex w-full items-center justify-center rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
                >
                  Go to Verify Email
                </a>
              )}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="organizationName"
                className="block text-sm font-medium text-black mb-1"
              >
                Organization Name *
              </label>
              <input
                id="organizationName"
                type="text"
                required
                value={formData.organizationName}
                onChange={(e) =>
                  setFormData({ ...formData, organizationName: e.target.value })
                }
                className="w-full px-4 py-2 border border-black/8 rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-black mb-1"
              >
                Full Name (Optional)
              </label>
              <input
                id="fullName"
                type="text"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                className="w-full px-4 py-2 border border-black/8 rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-black mb-1"
              >
                Email *
              </label>
              <input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-4 py-2 border border-black/8 rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-black mb-1"
              >
                Phone (Optional)
              </label>
              <input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="w-full px-4 py-2 border border-black/8 rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-black mb-1"
              >
                Password *
              </label>
              <input
                id="password"
                type="password"
                required
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full px-4 py-2 border border-black/8 rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-black mb-1"
              >
                Confirm Password *
              </label>
              <input
                id="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                className="w-full px-4 py-2 border border-black/8 rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-black text-white rounded-lg font-medium hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-zinc-600">
            Already have an account?{' '}
            <a
              href="/api/auth/signin"
              className="text-black font-medium hover:underline"
            >
              Sign in
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  );
}


