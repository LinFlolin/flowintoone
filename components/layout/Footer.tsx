import Link from "next/link";

const primaryLinks = [
  { label: "Home", href: "/" },
  { label: "Events", href: "/events" },
  { label: "About us", href: "/about" },
  { label: "Register", href: "/register" },
  { label: "Login", href: "/login" },
];

const informationLinks = [
  { label: "Contact", href: "/contact" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Cookie Policy", href: "/cookies" },
];

export function Footer() {
  return (
    <footer className="bg-sandstone/65">
      <div className="mx-auto grid max-w-[1200px] gap-12 px-5 py-14 sm:px-8 md:grid-cols-[1.5fr_1fr_1fr] lg:px-10 lg:py-16">
        <div>
          <Link
            href="/"
            className="text-2xl font-bold tracking-[-0.04em] text-ink focus-visible:outline-2"
          >
            flowintoone<span className="text-candy">.</span>
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-6 text-ink/70">
            A creative home for independent makers.
          </p>
        </div>

        <div>
          <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-ink/55">
            Explore
          </h2>
          <nav className="mt-5 grid gap-3" aria-label="Footer navigation">
            {primaryLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="w-fit text-sm font-medium text-ink/75 transition-colors hover:text-heather focus-visible:outline-2"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div>
          <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-ink/55">
            Information
          </h2>
          <nav className="mt-5 grid gap-3" aria-label="Information links">
            {informationLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="w-fit text-sm font-medium text-ink/75 transition-colors hover:text-heather focus-visible:outline-2"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      <div className="border-t border-ink/10">
        <div className="mx-auto max-w-[1200px] px-5 py-5 text-xs text-ink/60 sm:px-8 lg:px-10">
          © {new Date().getFullYear()} Flowintoone. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
