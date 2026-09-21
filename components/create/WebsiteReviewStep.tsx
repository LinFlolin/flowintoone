"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createWebsiteAction } from "@/app/create/actions";
import { readCreateFlowState, type CreateFlowState } from "@/lib/create-flow";

export function WebsiteReviewStep({ error }: { error: string | null }) {
  const [flow, setFlow] = useState<CreateFlowState | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setFlow(readCreateFlowState()), 0);
    return () => window.clearTimeout(timer);
  }, []);

  if (!flow?.purpose) {
    return <main className="min-h-screen bg-cream p-8 text-center text-ink"><Link href="/create" className="text-sm font-semibold text-heather">Return to website creation</Link></main>;
  }

  const details = flow.details;
  return (
    <main className="min-h-screen bg-cream px-5 py-5 text-ink sm:px-8 sm:py-8">
      <div className="mx-auto min-h-[calc(100vh-2.5rem)] max-w-3xl rounded-[2rem] border border-heather/10 bg-white/35 px-5 py-8 shadow-[0_20px_70px_rgba(81,68,91,0.06)] sm:min-h-[calc(100vh-4rem)] sm:px-12 sm:py-12">
        <div className="flex items-center justify-between gap-4"><Link href="/create/design" className="text-xs font-semibold text-ink/55 hover:text-heather">← Back</Link><Link href="/dashboard" className="text-xs font-semibold text-ink/55 hover:text-heather">Save and exit</Link></div>
        <p className="mt-14 text-xs font-bold uppercase tracking-[0.2em] text-heather">Step 4 of 4</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-[-0.045em]">Review your website</h1>
        <p className="mt-3 text-sm leading-6 text-ink/60">Everything looks ready. Create a draft website, then continue in the existing editor.</p>
        {error && <p role="alert" className="mt-7 rounded-xl border border-candy/25 bg-candy/10 px-4 py-3 text-sm leading-6">{error}</p>}
        <dl className="mt-8 grid gap-4 rounded-2xl border border-heather/15 bg-white/55 p-6 text-sm sm:grid-cols-2">
          <div><dt className="text-xs font-bold uppercase tracking-[0.12em] text-ink/45">Purpose</dt><dd className="mt-1 font-semibold capitalize">{flow.purpose}</dd></div>
          <div><dt className="text-xs font-bold uppercase tracking-[0.12em] text-ink/45">Design</dt><dd className="mt-1 font-semibold capitalize">{flow.designModel}</dd></div>
          <div><dt className="text-xs font-bold uppercase tracking-[0.12em] text-ink/45">Website name</dt><dd className="mt-1 font-semibold">{details.name}</dd></div>
          <div><dt className="text-xs font-bold uppercase tracking-[0.12em] text-ink/45">Public URL</dt><dd className="mt-1 font-semibold text-heather">/artisans/{details.slug}</dd></div>
          <div className="sm:col-span-2"><dt className="text-xs font-bold uppercase tracking-[0.12em] text-ink/45">Description</dt><dd className="mt-1 leading-6 text-ink/70">{details.description}</dd></div>
        </dl>
        <form action={createWebsiteAction} className="mt-8">
          {Object.entries({ purpose: flow.purpose, designModel: flow.designModel, ...details }).map(([name, value]) => <input key={name} type="hidden" name={name} value={value} />)}
          <button type="submit" className="inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-heather px-6 text-sm font-semibold text-white hover:bg-[#756486]">Create website</button>
        </form>
      </div>
    </main>
  );
}
