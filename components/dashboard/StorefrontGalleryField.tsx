"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

const MAX_GALLERY_IMAGES = 6;
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

type SelectedPreview = {
  name: string;
  url: string;
};

type StorefrontGalleryFieldProps = {
  imageUrls: string[];
  businessName: string;
};

function validateFiles(files: File[], availableSlots: number) {
  if (files.length > availableSlots) {
    return `Choose no more than ${availableSlots} additional ${availableSlots === 1 ? "image" : "images"}.`;
  }

  for (const file of files) {
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      return `${file.name}: choose a JPEG, PNG, or WebP image.`;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      return `${file.name}: each image must be 5 MB or smaller.`;
    }
  }

  return null;
}

export function StorefrontGalleryField({
  imageUrls,
  businessName,
}: StorefrontGalleryFieldProps) {
  const [removedUrls, setRemovedUrls] = useState<string[]>([]);
  const [selectedPreviews, setSelectedPreviews] = useState<SelectedPreview[]>([]);
  const [error, setError] = useState<string | null>(null);
  const objectUrls = useRef<string[]>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const activeExistingCount = imageUrls.length - removedUrls.length;
  const availableSlots = MAX_GALLERY_IMAGES - activeExistingCount;
  const removedSet = useMemo(() => new Set(removedUrls), [removedUrls]);

  function revokeSelectedPreviews() {
    objectUrls.current.forEach((url) => URL.revokeObjectURL(url));
    objectUrls.current = [];
  }

  useEffect(() => () => revokeSelectedPreviews(), []);

  function handleFiles(files: File[], input: HTMLInputElement) {
    revokeSelectedPreviews();
    const validationError = validateFiles(files, availableSlots);

    if (validationError) {
      input.value = "";
      setSelectedPreviews([]);
      setError(validationError);
      return;
    }

    const previews = files.map((file) => {
      const url = URL.createObjectURL(file);
      objectUrls.current.push(url);
      return { name: file.name, url };
    });
    setSelectedPreviews(previews);
    setError(null);
  }

  function clearSelectedFiles() {
    revokeSelectedPreviews();
    if (inputRef.current) inputRef.current.value = "";
    setSelectedPreviews([]);
    setError(null);
  }

  function toggleExistingImage(url: string) {
    setRemovedUrls((current) =>
      current.includes(url) ? current.filter((item) => item !== url) : [...current, url],
    );
    clearSelectedFiles();
  }

  return (
    <fieldset className="border-0 p-0">
      <legend className="text-sm font-semibold text-ink">Gallery</legend>
      <p className="mt-2 max-w-2xl text-xs leading-5 text-ink/50">
        Add up to six photographs of finished pieces, details, materials, or your studio.
      </p>

      {removedUrls.map((url) => (
        <input key={url} type="hidden" name="removeGalleryUrl" value={url} />
      ))}

      {imageUrls.length > 0 && (
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {imageUrls.map((url, index) => {
            const removed = removedSet.has(url);
            return (
              <div
                key={url}
                className={`overflow-hidden rounded-2xl border bg-sandstone/20 ${
                  removed ? "border-candy/35 opacity-55" : "border-heather/15"
                }`}
              >
                <div className="relative aspect-[4/3]">
                  <Image
                    src={url}
                    alt={`${businessName || "Storefront"} gallery image ${index + 1}`}
                    fill
                    sizes="(min-width: 640px) 180px, 45vw"
                    className="object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => toggleExistingImage(url)}
                  className={`w-full px-3 py-2.5 text-xs font-semibold focus-visible:outline-2 ${
                    removed ? "text-heather" : "text-candy"
                  }`}
                >
                  {removed ? "Keep image" : "Remove image"}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {selectedPreviews.length > 0 && (
        <div className="mt-5 rounded-2xl border border-viridian/25 bg-viridian/5 p-4">
          <div className="flex items-center justify-between gap-4">
            <p className="text-xs font-bold uppercase tracking-[0.13em] text-[#477b7b]">
              Ready to upload
            </p>
            <button
              type="button"
              onClick={clearSelectedFiles}
              className="text-xs font-semibold text-heather underline underline-offset-4"
            >
              Clear selection
            </button>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {selectedPreviews.map((preview) => (
              <div
                key={preview.url}
                className="relative aspect-[4/3] overflow-hidden rounded-xl bg-sandstone/30"
              >
                <Image
                  src={preview.url}
                  alt={`${preview.name} preview`}
                  fill
                  sizes="(min-width: 640px) 180px, 45vw"
                  unoptimized
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <label className="mt-5 inline-flex min-h-11 cursor-pointer items-center justify-center rounded-full border border-heather/25 bg-white px-5 text-sm font-semibold text-ink transition-colors hover:border-heather hover:text-heather focus-within:outline-2">
        Add gallery images
        <input
          ref={inputRef}
          className="sr-only"
          type="file"
          name="galleryImages"
          accept={ACCEPTED_IMAGE_TYPES.join(",")}
          multiple
          disabled={availableSlots === 0}
          aria-describedby="gallery-image-help"
          onChange={(event) => handleFiles(Array.from(event.target.files ?? []), event.currentTarget)}
        />
      </label>

      <p
        id="gallery-image-help"
        className={`mt-3 text-xs leading-5 ${error ? "text-candy" : "text-ink/45"}`}
      >
        {error ||
          (availableSlots === 0
            ? "The gallery is full. Remove an existing image to add another."
            : `${availableSlots} ${availableSlots === 1 ? "slot" : "slots"} available. JPEG, PNG, or WebP; 5 MB each.`)}
      </p>
    </fieldset>
  );
}
