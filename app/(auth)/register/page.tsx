"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePrivy } from "@privy-io/react-auth";
import { Loader2 } from "lucide-react";

// Privy handles both login and register in a single modal.
// Redirect to /login which handles both flows.
export default function RegisterPage() {
  const router = useRouter();
  const { ready, authenticated } = usePrivy();

  useEffect(() => {
    if (ready) {
      if (authenticated) {
        router.push("/onboarding");
      } else {
        router.push("/login");
      }
    }
  }, [ready, authenticated, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="size-8 animate-spin text-primary" />
    </div>
  );
}
