"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

type StorefrontImageFieldsProps = {
  logoUrl: string | null;
  coverUrl: string | null;
};

function validateImage(file: File) {
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    return "Scegli un'immagine JPEG, PNG o WebP.";
  }

  if (file.size > MAX_IMAGE_BYTES) {
    return "L'immagine deve essere di 5 MB o meno.";
  }

  return null;
}

export function StorefrontImageFields({ logoUrl, coverUrl }: StorefrontImageFieldsProps) {
  const [logoPreview, setLogoPreview] = useState(logoUrl);
  const [coverPreview, setCoverPreview] = useState(coverUrl);
  const [logoError, setLogoError] = useState<string | null>(null);
  const [coverError, setCoverError] = useState<string | null>(null);
  const logoObjectUrl = useRef<string | null>(null);
  const coverObjectUrl = useRef<string | null>(null);

  useEffect(
    () => () => {
      if (logoObjectUrl.current) URL.revokeObjectURL(logoObjectUrl.current);
      if (coverObjectUrl.current) URL.revokeObjectURL(coverObjectUrl.current);
    },
    [],
  );

  function updatePreview(
    file: File | undefined,
    input: HTMLInputElement,
    kind: "logo" | "cover",
  ) {
    const currentObjectUrl = kind === "logo" ? logoObjectUrl : coverObjectUrl;
    const setPreview = kind === "logo" ? setLogoPreview : setCoverPreview;
    const setError = kind === "logo" ? setLogoError : setCoverError;
    const currentUrl = kind === "logo" ? logoUrl : coverUrl;

    if (currentObjectUrl.current) {
      URL.revokeObjectURL(currentObjectUrl.current);
      currentObjectUrl.current = null;
    }

    if (!file) {
      setError(null);
      setPreview(currentUrl);
      return;
    }

    const error = validateImage(file);
    if (error) {
      input.value = "";
      setError(error);
      setPreview(currentUrl);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    currentObjectUrl.current = objectUrl;
    setError(null);
    setPreview(objectUrl);
  }

  return (
    <fieldset className="grid gap-6 border-0 p-0 sm:grid-cols-2">
      <legend className="mb-1 text-sm font-semibold text-ink sm:col-span-2">
        Immagini del sito
      </legend>

      <div>
        <div className="relative aspect-square max-w-52 overflow-hidden rounded-2xl border border-heather/15 bg-sandstone/25">
          {logoPreview ? (
            <Image
              src={logoPreview}
              alt="Anteprima logo attività"
              fill
              sizes="208px"
              unoptimized={logoPreview.startsWith("blob:")}
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 grid place-items-center text-sm font-semibold text-heather/55">
              Anteprima logo
            </div>
          )}
        </div>
        <label className="mt-4 block text-sm font-semibold text-ink">
          Logo
          <input
            className="mt-2 block w-full cursor-pointer rounded-xl border border-heather/20 bg-white px-3 py-3 text-xs text-ink file:mr-3 file:rounded-full file:border-0 file:bg-sandstone/45 file:px-4 file:py-2 file:text-xs file:font-semibold file:text-ink"
            type="file"
            name="logoImage"
            accept={ACCEPTED_IMAGE_TYPES.join(",")}
            aria-describedby="logo-image-help"
            onChange={(event) => updatePreview(event.target.files?.[0], event.currentTarget, "logo")}
          />
        </label>
        <p id="logo-image-help" className={`mt-2 text-xs ${logoError ? "text-candy" : "text-ink/45"}`}>
          {logoError || "JPEG, PNG o WebP. Massimo 5 MB."}
        </p>
      </div>

      <div>
        <div className="relative aspect-[3/2] overflow-hidden rounded-2xl border border-heather/15 bg-sandstone/25">
          {coverPreview ? (
            <Image
              src={coverPreview}
              alt="Storefront cover preview"
              fill
              sizes="(min-width: 640px) 384px, 100vw"
              unoptimized={coverPreview.startsWith("blob:")}
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 grid place-items-center text-sm font-semibold text-heather/55">
              Cover preview
            </div>
          )}
        </div>
        <label className="mt-4 block text-sm font-semibold text-ink">
          Immagine di copertina
          <input
            className="mt-2 block w-full cursor-pointer rounded-xl border border-heather/20 bg-white px-3 py-3 text-xs text-ink file:mr-3 file:rounded-full file:border-0 file:bg-sandstone/45 file:px-4 file:py-2 file:text-xs file:font-semibold file:text-ink"
            type="file"
            name="coverImage"
            accept={ACCEPTED_IMAGE_TYPES.join(",")}
            aria-describedby="cover-image-help"
            onChange={(event) => updatePreview(event.target.files?.[0], event.currentTarget, "cover")}
          />
        </label>
        <p id="cover-image-help" className={`mt-2 text-xs ${coverError ? "text-candy" : "text-ink/45"}`}>
          {coverError || "JPEG, PNG o WebP. Massimo 5 MB."}
        </p>
      </div>
    </fieldset>
  );
}
