import { FlowLoader } from "@/components/ui/FlowLoader";

export default function DiscoverLoading() {
  return (
    <main className="grid min-h-[60vh] place-items-center bg-cream" aria-live="polite" aria-busy="true">
      <FlowLoader message="Caricamento risultati" />
    </main>
  );
}
