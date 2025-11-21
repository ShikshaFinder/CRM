"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";

function VerifyEmailInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const email = searchParams.get("email");
  const [status, setStatus] = useState<"loading" | "success" | "error" | "info">(
    token ? "loading" : email ? "info" : "error"
  );
  const [message, setMessage] = useState(
    token
      ? "Verifying your email..."
      : email
      ? `We sent a verification link to ${email}. Check your inbox and click the button inside.`
      : "No verification token provided. Enter your email to get a new link."
  );
  const [resendEmailValue, setResendEmailValue] = useState(email ?? "");
  const [resendStatus, setResendStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [resendMessage, setResendMessage] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      setStatus("loading");
      setMessage("Verifying your email...");
      verifyToken(token);
      return;
    }

    if (email) {
      setStatus("info");
      setMessage(`We sent a verification link to ${email}. Check your inbox and click the button inside.`);
      setResendEmailValue(email);
    } else {
      setStatus("error");
      setMessage("No verification token provided. Enter your email below to request a new link.");
    }
  }, [token, email]);

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
      setTimeout(() => router.push("/authPages/signin"), 3000);
    } catch {
      setStatus("error");
      setMessage("An error occurred during verification. Please try again.");
    }
  };

  const handleResendEmail = async () => {
    if (!resendEmailValue) {
      setResendStatus("error");
      setResendMessage("Please enter your email address.");
      return;
    }

    setResendStatus("loading");
    setResendMessage("Sending verification email...");

    try {
      const response = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resendEmailValue }),
      });
      const data = await response.json();

      if (!response.ok) {
        setResendStatus("error");
        setResendMessage(data.error || "Failed to resend verification email.");
        return;
      }

      setResendStatus("success");
      setResendMessage(data.message || "Verification email sent.");
      setStatus("info");
      setMessage(
        `We just sent a fresh verification link to ${resendEmailValue}. Check your inbox and click the button inside.`
      );
    } catch (error) {
      setResendStatus("error");
      setResendMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-16 px-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-300 text-center space-y-6">
          {status === "loading" && (
            <>
              <div className="w-16 h-16 border-4 border-gray-900 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                Verifying Email
              </h1>
              <p className="text-gray-600">{message}</p>
            </>
          )}

          {status === "success" && (
            <>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", duration: 0.5 }}
                className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <svg
                  className="w-8 h-8 text-green-600"
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
              <h1 className="text-2xl font-semibold text-black mb-2">
                Email Verified!
              </h1>
              <p className="text-gray-600 mb-6">{message}</p>
              <p className="text-sm text-gray-500">
                Redirecting to sign in...
              </p>
            </>
          )}

          {status === "info" && (
            <>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", duration: 0.5 }}
                className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4"
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
              <h1 className="text-2xl font-semibold text-black mb-2">
                Check Your Inbox
              </h1>
              <p className="text-gray-600 mb-4">{message}</p>
              <p className="text-sm text-gray-500">
                Didn't get it? Request a new link below. Be sure to check spam/updates folders too.
              </p>
            </>
          )}

          {status === "error" && (
            <>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", duration: 0.5 }}
                className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <svg
                  className="w-8 h-8 text-red-600"
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
              <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                Verification Failed
              </h1>
              <p className="text-gray-600 mb-6">{message}</p>
            </>
          )}

          <div className="text-left space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1" htmlFor="resend-email">
                Need a new link?
              </label>
              <input
                id="resend-email"
                type="email"
                placeholder="your@email.com"
                value={resendEmailValue}
                onChange={(e) => {
                  setResendEmailValue(e.target.value);
                  if (resendStatus !== "idle") {
                    setResendStatus("idle");
                    setResendMessage(null);
                  }
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
            </div>
            <button
              onClick={handleResendEmail}
              className="w-full py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={resendStatus === "loading"}
            >
              {resendStatus === "loading" ? "Sending..." : "Send verification email"}
            </button>
            {resendMessage && (
              <p
                className={`text-sm ${
                  resendStatus === "error" ? "text-red-600" : "text-gray-600"
                }`}
              >
                {resendMessage}
              </p>
            )}
            <p className="text-center text-sm text-gray-500">
              <a href="/authPages/signup" className="text-gray-900 font-medium hover:underline">
                Back to Sign Up
              </a>
            </p>
          </div>
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
