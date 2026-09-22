import Link from "next/link";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

const primaryLinks = [
  { label: "Home", href: "/" },
  { label: "Eventi", href: "/#events" },
  { label: "Chi siamo", href: null },
  { label: "Registrati", href: "/register" },
  { label: "Accedi", href: "/login" },
];

const informationLinks = [
  { label: "Contatti", href: null },
  { label: "Privacy", href: null },
  { label: "Cookie", href: null },
];

export function Footer() {
  return (
    <footer className="bg-sandstone/65">
      <ScrollReveal>
      <div className="mx-auto grid max-w-[1500px] gap-12 px-5 py-14 sm:px-8 md:grid-cols-[1.5fr_1fr_1fr] lg:px-10 lg:py-16">
        <div>
          <Link
            href="/"
            className="text-2xl font-bold tracking-[-0.04em] text-ink focus-visible:outline-2"
          >
            flowintoone<span className="text-candy">.</span>
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-6 text-ink/80">
            Una casa creativa per creator indipendenti.
          </p>
        </div>

        <div>
          <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-ink/70">
            Esplora
          </h2>
          <nav className="mt-5 grid gap-3" aria-label="Footer navigation">
            {primaryLinks.map((link) => (
              link.href ? (
                <Link
                  key={link.label}
                  href={link.href}
                  className="w-fit text-sm font-medium text-ink/85 transition-colors hover:text-heather focus-visible:outline-2"
                >
                  {link.label}
                </Link>
              ) : (
                <span key={link.label} className="w-fit cursor-default text-sm font-medium text-ink/45" aria-disabled="true">
                  {link.label} <span className="text-xs">Prossimamente</span>
                </span>
              )
            ))}
          </nav>
        </div>

        <div>
          <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-ink/70">
            Informazioni
          </h2>
          <nav className="mt-5 grid gap-3" aria-label="Information links">
            {informationLinks.map((link) => (
              <span key={link.label} className="w-fit cursor-default text-sm font-medium text-ink/45" aria-disabled="true">
                {link.label} <span className="text-xs">Prossimamente</span>
              </span>
            ))}
          </nav>
        </div>
      </div>

      <div className="border-t border-ink/10">
        <div className="mx-auto max-w-[1500px] px-5 py-5 text-xs text-ink/70 sm:px-8 lg:px-10">
          © {new Date().getFullYear()} Flowintoone. Tutti i diritti riservati.
        </div>
      </div>
      </ScrollReveal>
    </footer>
  );
}
