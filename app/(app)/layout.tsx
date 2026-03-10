// Force all dashboard pages to be dynamic (required for Privy client-side auth)
export const dynamic = "force-dynamic";

import AppLayoutClient from "./layout-client";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <AppLayoutClient>{children}</AppLayoutClient>;
}
