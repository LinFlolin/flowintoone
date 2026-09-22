import { FlowLoader } from "@/components/ui/FlowLoader";

export default function CreateLoading() {
  return (
    <main className="grid min-h-screen place-items-center bg-cream" aria-live="polite" aria-busy="true">
      <FlowLoader message="Loading website creation" />
    </main>
  );
}
