"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [magicLinkEmail, setMagicLinkEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [magicLinkLoading, setMagicLinkLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [showMagicLink, setShowMagicLink] = useState(false);

  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
        setLoading(false);
        return;
      }

      if (result?.ok) {
        router.push(callbackUrl);
      }
    } catch (err: any) {
      setError("An error occurred. Please try again.");
      setLoading(false);
    }
  };

  const handleMagicLinkRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMagicLinkLoading(true);

    try {
      const response = await fetch("/api/auth/magic-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: magicLinkEmail }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to send magic link.");
        setMagicLinkLoading(false);
        return;
      }

      setMagicLinkSent(true);
      setMagicLinkLoading(false);
    } catch (err: any) {
      setError("An error occurred. Please try again.");
      setMagicLinkLoading(false);
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
        <div className="bg-white rounded-lg p-8 shadow-sm border border-black/8 space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-black mb-2">Sign In</h1>
            <p className="text-zinc-600 text-sm">
              Sign in to your account to continue
            </p>
          </div>

          {!showMagicLink ? (
            <>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-black mb-1"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-black/8 rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-black mb-1"
                  >
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-black/8 rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="••••••••"
                  />
                </div>

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-black text-white rounded-lg font-medium hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Signing in..." : "Sign In"}
                </button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-black/8"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-zinc-500">Or</span>
                </div>
              </div>

              <button
                onClick={() => setShowMagicLink(true)}
                className="w-full py-3 border border-black/8 text-black rounded-lg font-medium hover:bg-zinc-50 transition-colors"
              >
                Sign in with Magic Link
              </button>

              <div className="text-center space-y-2 text-sm">
                <Link
                  href="/forgot-password"
                  className="text-black hover:underline"
                >
                  Forgot password?
                </Link>
                <div className="text-zinc-500">
                  Don't have an account?{" "}
                  <Link href="/signup" className="text-black font-medium hover:underline">
                    Sign up
                  </Link>
                </div>
              </div>
            </>
          ) : (
            <>
              {magicLinkSent ? (
                <div className="text-center space-y-4">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", duration: 0.5 }}
                    className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto"
                  >
                    <svg
                      className="w-8 h-8 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </motion.div>
                  <h2 className="text-xl font-semibold text-black">
                    Check Your Email
                  </h2>
                  <p className="text-zinc-600">
                    We've sent a magic link to <strong>{magicLinkEmail}</strong>.
                    Click the link in the email to sign in.
                  </p>
                  <button
                    onClick={() => {
                      setShowMagicLink(false);
                      setMagicLinkSent(false);
                      setMagicLinkEmail("");
                    }}
                    className="w-full py-3 border border-black/8 text-black rounded-lg font-medium hover:bg-zinc-50 transition-colors"
                  >
                    Back to Sign In
                  </button>
                </div>
              ) : (
                <form onSubmit={handleMagicLinkRequest} className="space-y-4">
                  <div>
                    <label
                      htmlFor="magic-link-email"
                      className="block text-sm font-medium text-black mb-1"
                    >
                      Email
                    </label>
                    <input
                      id="magic-link-email"
                      type="email"
                      value={magicLinkEmail}
                      onChange={(e) => setMagicLinkEmail(e.target.value)}
                      required
                      className="w-full px-4 py-2 border border-black/8 rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-black"
                      placeholder="your@email.com"
                    />
                  </div>

                  {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={magicLinkLoading}
                    className="w-full py-3 bg-black text-white rounded-lg font-medium hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {magicLinkLoading
                      ? "Sending..."
                      : "Send Magic Link"}
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowMagicLink(false)}
                    className="w-full py-3 border border-black/8 text-black rounded-lg font-medium hover:bg-zinc-50 transition-colors"
                  >
                    Back to Password Sign In
                  </button>
                </form>
              )}
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}

