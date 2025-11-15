import { Suspense } from "react";
import { SignInPageClient } from "./SignInPageClient";

export default function SignInPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-zinc-600">Loading...</p>
        </div>
      </div>
    }>
      <SignInPageClient />
    </Suspense>
  );
}

