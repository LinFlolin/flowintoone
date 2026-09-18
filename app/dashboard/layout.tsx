import type { ReactNode } from "react";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { Header } from "@/components/layout/Header";
import { requireUser } from "@/lib/auth/session";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  await requireUser();

  return (
    <div className="min-h-screen bg-cream">
      <Header />
      <main className="px-6 py-8 sm:px-8 lg:px-10 2xl:px-12 mx-auto">
        <div className="grid gap-4 lg:grid-cols-[12rem_minmax(0,1fr)] 2xl:gap-8 2xl:grid-cols-[14rem_minmax(0,1fr)]">
          <DashboardSidebar />
          <div className="min-w-0">{children}</div>
        </div>
      </main>
    </div>
  );
}
