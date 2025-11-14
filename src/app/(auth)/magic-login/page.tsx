"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";

function MagicLoginInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const userId = searchParams.get("userId");
  const error = searchParams.get("error");
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    token && userId ? "loading" : error ? "error" : "loading"
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (error) {
      setStatus("error");
      switch (error) {
        case "MissingToken":
          setMessage("No magic link token provided.");
          break;
        case "InvalidToken":
          setMessage("Invalid magic link. Please request a new one.");
          break;
        case "ExpiredToken":
          setMessage("This magic link has expired. Please request a new one.");
          break;
        case "AccountNotVerified":
          setMessage(
            "Your account is not verified. Please verify your email first."
          );
          break;
        case "LoginFailed":
          setMessage("Failed to sign in. Please try again.");
          break;
        default:
          setMessage("An error occurred. Please try again.");
      }
      return;
    }

    if (token && userId) {
      // Sign in using NextAuth with a special magic link provider
      // We'll create a custom approach: use credentials provider with the token
      handleMagicLinkSignIn(token, userId);
    } else {
      setStatus("error");
      setMessage("Invalid magic link. Missing required parameters.");
    }
  }, [token, userId, error]);

  const handleMagicLinkSignIn = async (token: string, userId: string) => {
    try {
      // Validate token with server
      const response = await fetch("/api/auth/magic-link-signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, userId }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setStatus("error");
        setMessage(data.error || "Failed to sign in with magic link.");
        return;
      }

      // Use NextAuth's signIn with the magic link token
      const result = await signIn("credentials", {
        magicLinkToken: token,
        redirect: false,
      });

      if (result?.error) {
        setStatus("error");
        setMessage("Failed to create session. Please try again.");
        return;
      }

      // Success - redirect to dashboard
      setStatus("success");
      setMessage("Successfully signed in! Redirecting...");
      setTimeout(() => {
        router.push("/");
      }, 1500);
    } catch (err) {
      setStatus("error");
      setMessage("An error occurred during sign in. Please try again.");
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
        <div className="bg-white rounded-lg p-8 shadow-sm border border-black/8 text-center space-y-6">
          {status === "loading" && (
            <>
              <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <h1 className="text-2xl font-semibold text-black mb-2">
                Signing You In
              </h1>
              <p className="text-zinc-600">Please wait while we sign you in...</p>
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
                Success!
              </h1>
              <p className="text-zinc-600 mb-6">{message}</p>
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
              <h1 className="text-2xl font-semibold text-black mb-2">
                Sign In Failed
              </h1>
              <p className="text-zinc-600 mb-6">{message}</p>
              <div className="space-y-3">
                <a
                  href="/api/auth/signin"
                  className="block w-full py-3 bg-black text-white rounded-lg font-medium hover:bg-zinc-800 transition-colors"
                >
                  Go to Sign In
                </a>
                <a
                  href="/api/auth/signin"
                  className="block text-sm text-zinc-500 hover:text-black"
                >
                  Request a new magic link
                </a>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default function MagicLoginPage() {
  return (
    <Suspense fallback={<div className="text-center mt-20">Loading...</div>}>
      <MagicLoginInner />
    </Suspense>
  );
}

