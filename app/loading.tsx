import { FlowLoader } from "@/components/ui/FlowLoader";

export default function Loading() {
  return (
    <main className="grid min-h-screen place-items-center bg-cream" aria-live="polite" aria-busy="true">
      <FlowLoader message="Caricamento Flowintoone" />
    </main>
  );
}
