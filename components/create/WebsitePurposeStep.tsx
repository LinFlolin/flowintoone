"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FlowLoader } from "@/components/ui/FlowLoader";
import {
  readCreateFlowState,
  writeCreateFlowState,
  type WebsitePurpose,
} from "@/lib/create-flow";

const purposes: Array<{
  id: WebsitePurpose;
  title: string;
  description: string;
  icon: string;
  tone: string;
  enabled: boolean;
}> = [
  { id: "shop", title: "Shop", description: "Sell products online and grow your brand.", icon: "bag", tone: "bg-candy/15 text-candy", enabled: true },
  { id: "events", title: "Events", description: "Promote events and manage registrations.", icon: "calendar", tone: "bg-azur/15 text-azur", enabled: true },
  { id: "portfolio", title: "Portfolio", description: "Share your work and attract opportunities.", icon: "image", tone: "bg-sandstone/55 text-[#b37d59]", enabled: false },
  { id: "services", title: "Services", description: "Showcase your services and get new clients.", icon: "gear", tone: "bg-viridian/15 text-viridian", enabled: false },
  { id: "personal", title: "Personal", description: "Create a thoughtful home for your ideas.", icon: "image", tone: "bg-heather/15 text-heather", enabled: false },
];

function PurposeIcon({ name }: { name: string }) {
  if (name === "bag") return <path d="M5 8h14l-1 12H6L5 8Zm3 0V6a4 4 0 0 1 8 0v2" />;
  if (name === "gear") return <path d="m12 3 1 2 2 .5 1.8-1 1.7 1.7-1 1.8.5 2 2 1v2.5l-2 1-.5 2 1 1.8-1.7 1.7-1.8-1-2 .5-1 2H9.5l-1-2-2-.5-1.8 1L3 18.8l1-1.8-.5-2-2-1v-2.5l2-1 .5-2-1-1.8L5.7 5l1.8 1 2-.5 1-2H12Zm0 6.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Z" />;
  if (name === "image") return <path d="M4 5h16v14H4zM7 15l3-3 2 2 2-2 3 3M8 9h.01" />;
  return <path d="M5 4h14v16H5zM8 2v4m8-4v4M5 9h14M8 13h2m2 0h2m-6 3h2" />;
}

export function WebsitePurposeStep() {
  const router = useRouter();
  const [selectedPurpose, setSelectedPurpose] = useState<WebsitePurpose | null>(
    () => readCreateFlowState().purpose,
  );
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function selectPurpose(purpose: WebsitePurpose) {
    setSelectedPurpose(purpose);
    setError(null);
    writeCreateFlowState({ purpose, step: "purpose" });
  }

  function continueToDetails() {
    if (!selectedPurpose) return;
    setIsSaving(true);
    setError(null);
    if (!writeCreateFlowState({ purpose: selectedPurpose, step: "details" })) {
      setIsSaving(false);
      setError("We could not save your progress. Please check your browser settings and try again.");
      return;
    }
    router.push("/create/details");
  }

  return (
    <main className="min-h-screen bg-cream px-5 py-5 text-ink sm:px-8 sm:py-8">
      <div className="mx-auto flex min-h-[calc(100vh-2.5rem)] w-full max-w-5xl flex-col rounded-[2rem] border border-heather/10 bg-white/35 px-5 py-6 shadow-[0_20px_70px_rgba(81,68,91,0.06)] sm:min-h-[calc(100vh-4rem)] sm:px-10 sm:py-8 lg:px-16">
        <header className="flex items-center justify-between gap-4 text-xs font-semibold text-ink/55">
          <Link href="/dashboard" className="inline-flex items-center gap-2 transition-colors hover:text-heather"><span aria-hidden="true">←</span> Back</Link>
          <Link href="/dashboard" className="transition-colors hover:text-heather">Save and exit</Link>
        </header>

        <div className="mx-auto mt-10 w-full max-w-3xl sm:mt-12">
          <h1 className="text-3xl font-semibold tracking-[-0.045em] sm:text-4xl">Create your website</h1>
            <p className="mt-2 text-sm leading-6 text-ink/60">Choose the kind of website you want to create. Portfolio, Services and Personal are coming soon.</p>

          <ol className="mt-9 grid grid-cols-4 gap-2 sm:mt-11 sm:gap-6" aria-label="Website creation progress">
            {["Purpose", "Details", "Design", "Review"].map((label, index) => {
              const active = index === 0;
              return (
                <li key={label} className="relative text-center">
                  {index > 0 && <span className="absolute right-1/2 top-4 -z-10 hidden h-px w-full bg-heather/20 sm:block" />}
                  <span className={`relative mx-auto grid size-8 place-items-center rounded-full border text-xs font-semibold ${active ? "border-heather bg-heather text-white" : "border-heather/20 bg-cream text-ink/60"}`}>{index + 1}</span>
                  <span className={`mt-2 block text-[10px] font-semibold sm:text-xs ${active ? "text-ink" : "text-ink/45"}`}>{label}</span>
                </li>
              );
            })}
          </ol>

          <section className="mt-12 sm:mt-16">
            <h2 className="text-2xl font-semibold tracking-[-0.04em] sm:text-3xl">What&apos;s the purpose of your website?</h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-ink/55">Choose the option that best fits your goals. You can always change this later.</p>
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              {purposes.map((purpose) => {
                const selected = selectedPurpose === purpose.id;
                return (
                  <button key={purpose.id} type="button" disabled={!purpose.enabled} aria-pressed={selected} onClick={() => purpose.enabled && selectPurpose(purpose.id)} className={`relative min-h-36 rounded-2xl border p-5 text-left transition-all focus-visible:outline-2 focus-visible:outline-heather ${purpose.enabled ? "hover:-translate-y-0.5 hover:border-heather/60" : "cursor-not-allowed opacity-60"} ${selected ? "border-heather bg-[#f7eef6] shadow-[0_8px_24px_rgba(135,116,153,0.12)]" : "border-heather/15 bg-white/35"}`}>
                    <span className={`grid size-9 place-items-center rounded-full ${purpose.tone}`}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="size-5" aria-hidden="true"><PurposeIcon name={purpose.icon} /></svg></span>
                    <span className="mt-3 block text-sm font-bold">{purpose.title}</span>
                    <span className="mt-1 block max-w-56 text-xs leading-5 text-ink/60">{purpose.description}</span>
                    {!purpose.enabled && <span className="mt-3 inline-flex rounded-full bg-ink/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-ink/50">Coming soon</span>}
                    {selected && <span className="absolute right-4 top-4 grid size-5 place-items-center rounded-full bg-heather text-xs text-white" aria-label="Selected">✓</span>}
                  </button>
                );
              })}
            </div>
          </section>

          <div className="mt-10 flex flex-col items-start justify-between gap-6 border-t border-heather/10 pt-6 sm:mt-12 sm:flex-row sm:items-center">
            <p className="max-w-xs text-xs italic leading-5 text-ink/55">“A clear purpose today, a bigger tomorrow.”</p>
            <div className="flex w-full flex-col items-stretch gap-3 sm:w-auto sm:items-end">
              {error && <p role="alert" className="max-w-xs text-xs leading-5 text-candy">{error}</p>}
              <button type="button" disabled={!selectedPurpose || isSaving} onClick={continueToDetails} className="inline-flex min-h-12 items-center justify-center gap-3 rounded-xl bg-heather px-6 text-sm font-semibold text-white transition-colors hover:bg-[#756486] disabled:cursor-not-allowed disabled:bg-heather/30 sm:min-w-36">{isSaving ? <><FlowLoader size={20} message="Saving creation progress" />Saving…</> : <>Next step <span aria-hidden="true">→</span></>}</button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
