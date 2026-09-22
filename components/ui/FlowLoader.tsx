import Image from "next/image";

export function FlowLoader({ size = 56, message = "Caricamento" }: { size?: number; message?: string | null }) {
  return (
    <span role="status" aria-live="polite" aria-busy="true" className="inline-flex items-center gap-2">
      <Image
        src="/flowintoone-loader-dots.svg"
        width={112}
        height={42}
        unoptimized
        priority
        alt=""
        className="h-auto w-auto"
        style={{ width: size * 2.67, height: size }}
      />
      {message && <span className="sr-only">{message}</span>}
    </span>
  );
}
