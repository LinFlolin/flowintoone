"use client";

import { useState } from "react";
import { normalizeStorefrontSlug } from "@/lib/storefront/slug";

const inputClassName =
  "mt-2 min-h-12 w-full rounded-xl border border-heather/20 bg-white px-4 text-sm text-ink placeholder:text-ink/35 focus:border-heather focus:outline-2";

type StorefrontNameFieldProps = {
  initialName: string;
  initialSlug: string | null;
};

export function StorefrontNameField({
  initialName,
  initialSlug,
}: StorefrontNameFieldProps) {
  const [name, setName] = useState(initialName);
  const normalizedSlug = normalizeStorefrontSlug(name);
  const slug =
    name === initialName && initialSlug
      ? initialSlug
      : normalizedSlug || "your-business-name";

  return (
    <div className="grid items-end gap-6 sm:grid-cols-2">
      <label className="text-sm font-semibold text-ink">
        Business name <span className="text-candy">*</span>
        <input
          className={inputClassName}
          name="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          minLength={2}
          maxLength={100}
          autoComplete="organization"
          required
        />
      </label>
      <div className="rounded-xl border border-heather/15 bg-sandstone/20 px-4 py-3">
        <p className="text-xs font-bold uppercase tracking-[0.13em] text-ink/45">
          Storefront address
        </p>
        <p className="mt-1 break-all text-sm font-semibold text-heather" aria-live="polite">
          /artisans/{slug}
        </p>
        <p className="mt-1 text-xs text-ink/45">
          Updated automatically from your business name.
        </p>
      </div>
    </div>
  );
}
