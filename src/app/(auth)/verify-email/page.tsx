"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";

function VerifyEmailInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const email = searchParams.get("email");
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("Verifying your email...");

  useEffect(() => {
    if (token) verifyToken(token);
    else {
      setStatus("error");
      setMessage("No verification token provided");
    }
  }, [token]);

  const verifyToken = async (token: string) => {
    try {
      const response = await fetch(`/api/auth/verify-email?token=${token}`);
      const data = await response.json();

      if (!response.ok) {
        setStatus("error");
        setMessage(data.error || "Verification failed");
        return;
      }

      setStatus("success");
      setMessage(
        "Email verified successfully! Your account has been activated."
      );
      setTimeout(() => router.push("/api/auth/signin"), 3000);
    } catch {
      setStatus("error");
      setMessage("An error occurred during verification. Please try again.");
    }
  };

  const handleResendEmail = () => {
    if (!email) {
      setMessage("Email address is required to resend verification");
      return;
    }
    setStatus("loading");
    setMessage("Sending verification email...");
    router.push("/signup");
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black flex items-center justify-center py-16 px-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white dark:bg-zinc-900 rounded-lg p-8 shadow-sm border border-black/[.08] dark:border-white/[.145] text-center">
          {status === "loading" && (
            <>
              <div className="w-16 h-16 border-4 border-black dark:border-zinc-50 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <h1 className="text-2xl font-semibold text-black dark:text-zinc-50 mb-2">
                Verifying Email
              </h1>
              <p className="text-zinc-600 dark:text-zinc-400">{message}</p>
            </>
          )}

          {status === "success" && (
            <>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", duration: 0.5 }}
                className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <svg
                  className="w-8 h-8 text-green-600 dark:text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </motion.div>
              <h1 className="text-2xl font-semibold text-black dark:text-zinc-50 mb-2">
                Email Verified!
              </h1>
              <p className="text-zinc-600 dark:text-zinc-400 mb-6">{message}</p>
              <p className="text-sm text-zinc-500 dark:text-zinc-500">
                Redirecting to sign in...
              </p>
            </>
          )}

          {status === "error" && (
            <>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", duration: 0.5 }}
                className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <svg
                  className="w-8 h-8 text-red-600 dark:text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </motion.div>
              <h1 className="text-2xl font-semibold text-black dark:text-zinc-50 mb-2">
                Verification Failed
              </h1>
              <p className="text-zinc-600 dark:text-zinc-400 mb-6">{message}</p>
              {email && (
                <button
                  onClick={handleResendEmail}
                  className="px-4 py-2 bg-black dark:bg-zinc-50 text-white dark:text-black rounded-lg font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
                >
                  Resend Verification Email
                </button>
              )}
              <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-500">
                <a
                  href="/signup"
                  className="text-black dark:text-zinc-50 font-medium hover:underline"
                >
                  Back to Sign Up
                </a>
              </p>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="text-center mt-20">Loading...</div>}>
      <VerifyEmailInner />
    </Suspense>
  );
}
