"use client";

import { useEffect, useState, useTransition } from "react";
import { supabase } from "@/api/client";
import { THEME_PRESETS, type ThemeKey, type SectionType } from "@app/(page-theme-component)/themes/presets";
import { setSectionVariant, setTheme, toggleSection } from "../settings/actions";

const ALL_SECTIONS: SectionType[] = [
  "hero",
  "about",
  "capabilities",
  "products",
  "certifications",
  "contact",
  "footer",
];

export default function SiteBuilderPage() {
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [loadingBusiness, setLoadingBusiness] = useState(true);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    async function loadBusiness() {
      setLoadingBusiness(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setBusinessId(null);
        setLoadingBusiness(false);
        return;
      }

      const { data, error } = await supabase
        .from("business_memberships")
        .select("business_id")
        .eq("user_id", user.id)
        .single();

      if (error) {
        console.error(error);
        setBusinessId(null);
      } else {
        setBusinessId(data.business_id);
      }

      setLoadingBusiness(false);
    }

    loadBusiness();
  }, []);

  const themes = Object.keys(THEME_PRESETS) as ThemeKey[];

  if (loadingBusiness) return <div className="p-6">Loading...</div>;
  if (!businessId) return <div className="p-6">No business found (are you logged in?)</div>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Site Builder</h1>

      <h2 className="mt-6 font-semibold">Choose Theme</h2>
      <div className="flex gap-3 mt-2">
        {themes.map((t) => (
          <button
            key={t}
            disabled={isPending}
            className="px-3 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-60"
            onClick={() =>
              startTransition(async () => {
                await setTheme(businessId, t);
              })
            }
          >
            {t}
          </button>
        ))}
      </div>

      <hr className="my-6" />

      <h2 className="font-semibold">Customize Sections</h2>
      <p className="text-sm opacity-80">
        Example: set Products to v2 or hide Certifications.
      </p>

      <div className="grid gap-3 mt-4">
        {ALL_SECTIONS.map((s) => (
          <div key={s} className="border rounded p-3">
            <strong>{s}</strong>

            <div className="flex gap-2 mt-3">
              <button
                disabled={isPending}
                className="px-3 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-60"
                onClick={() =>
                  startTransition(async () => {
                    await setSectionVariant(businessId, s, "v1");
                  })
                }
              >
                Set v1
              </button>

              <button
                disabled={isPending}
                className="px-3 py-2 rounded bg-amber-500 text-white hover:opacity-90 disabled:opacity-60"
                onClick={() =>
                  startTransition(async () => {
                    await setSectionVariant(businessId, s, "v2");
                  })
                }
              >
                Set v2
              </button>

              <button
                disabled={isPending}
                className="px-3 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-60"
                onClick={() =>
                  startTransition(async () => {
                    await toggleSection(businessId, s);
                  })
                }
              >
                Toggle hide/show
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}