"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { readCreateFlowState, writeCreateFlowState, type WebsiteDesignModel } from "@/lib/create-flow";

export function WebsiteDesignStep() {
  const router = useRouter();
  const flow = readCreateFlowState();
  const [model, setModel] = useState<WebsiteDesignModel>(flow.designModel);

  function continueToReview() {
    if (!flow.purpose || !writeCreateFlowState({ designModel: model, step: "review" })) {
      router.replace("/create");
      return;
    }
    router.push("/create/review");
  }

  return (
    <main className="min-h-screen bg-cream px-5 py-5 text-ink sm:px-8 sm:py-8">
      <div className="mx-auto min-h-[calc(100vh-2.5rem)] max-w-3xl rounded-[2rem] border border-heather/10 bg-white/35 px-5 py-8 shadow-[0_20px_70px_rgba(81,68,91,0.06)] sm:min-h-[calc(100vh-4rem)] sm:px-12 sm:py-12">
        <div className="flex items-center justify-between gap-4"><Link href="/create/details" className="text-xs font-semibold text-ink/55 hover:text-heather">← Back</Link><Link href="/dashboard" className="text-xs font-semibold text-ink/55 hover:text-heather">Save and exit</Link></div>
        <p className="mt-14 text-xs font-bold uppercase tracking-[0.2em] text-heather">Step 3 of 4</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-[-0.045em]">Choose a starting design</h1>
        <p className="mt-3 max-w-xl text-sm leading-6 text-ink/60">Pick a model that fits your Shop or Events website. You can refine the content in the editor later.</p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {([
            ["editorial", "Editorial", "A story-led layout with generous space for your work and process."],
            ["minimal", "Minimal", "A focused, lightweight layout that keeps the essentials in front."],
          ] as const).map(([value, title, description]) => (
            <button key={value} type="button" aria-pressed={model === value} onClick={() => setModel(value)} className={`rounded-2xl border p-6 text-left transition-colors ${model === value ? "border-heather bg-[#f7eef6]" : "border-heather/15 bg-white/45 hover:border-heather/50"}`}>
              <span className="block text-lg font-semibold">{title}</span>
              <span className="mt-2 block text-sm leading-6 text-ink/60">{description}</span>
              {model === value && <span className="mt-5 inline-flex rounded-full bg-heather px-3 py-1 text-xs font-semibold text-white">Selected</span>}
            </button>
          ))}
        </div>
        <div className="mt-10 flex justify-end border-t border-heather/10 pt-6"><button type="button" onClick={continueToReview} className="inline-flex min-h-12 items-center justify-center rounded-xl bg-heather px-6 text-sm font-semibold text-white hover:bg-[#756486]">Review website →</button></div>
      </div>
    </main>
  );
}
