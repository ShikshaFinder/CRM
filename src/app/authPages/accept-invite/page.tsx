"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";

function AcceptInviteInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const token = searchParams.get("token");
  const [statusState, setStatusState] = useState<
    "loading" | "success" | "error" | "needs-auth"
  >("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatusState("error");
      setMessage("No invitation token provided.");
      return;
    }

    if (status === "loading") {
      return;
    }

    if (status === "unauthenticated") {
      setStatusState("needs-auth");
      setMessage("Please sign in to accept the invitation.");
      return;
    }

    if (status === "authenticated" && session) {
      handleAcceptInvite(token);
    }
  }, [token, status, session]);

  const handleAcceptInvite = async (token: string) => {
    try {
      setStatusState("loading");
      setMessage("Accepting invitation...");

      const response = await fetch("/api/organizations/invites/accept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (!response.ok) {
        setStatusState("error");
        setMessage(data.error || "Failed to accept invitation.");
        return;
      }

      setStatusState("success");
      setMessage("Invitation accepted! Redirecting...");
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (err) {
      setStatusState("error");
      setMessage("An error occurred. Please try again.");
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
          {statusState === "loading" && (
            <>
              <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <h1 className="text-2xl font-semibold text-black mb-2">
                Processing Invitation
              </h1>
              <p className="text-zinc-600">{message}</p>
            </>
          )}

          {statusState === "needs-auth" && (
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
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </motion.div>
              <h1 className="text-2xl font-semibold text-black mb-2">
                Sign In Required
              </h1>
              <p className="text-zinc-600 mb-6">{message}</p>
              <a
                href={`/api/auth/signin?callbackUrl=${encodeURIComponent(
                  window.location.href
                )}`}
                className="block w-full py-3 bg-black text-white rounded-lg font-medium hover:bg-zinc-800 transition-colors"
              >
                Sign In
              </a>
            </>
          )}

          {statusState === "success" && (
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
                Invitation Accepted!
              </h1>
              <p className="text-zinc-600 mb-6">{message}</p>
            </>
          )}

          {statusState === "error" && (
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
                Error
              </h1>
              <p className="text-zinc-600 mb-6">{message}</p>
              <a
                href="/"
                className="block w-full py-3 bg-black text-white rounded-lg font-medium hover:bg-zinc-800 transition-colors"
              >
                Go to Dashboard
              </a>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default function AcceptInvitePage() {
  return (
    <Suspense fallback={<div className="text-center mt-20">Loading...</div>}>
      <AcceptInviteInner />
    </Suspense>
  );
}

