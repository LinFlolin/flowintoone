"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

type ProfileAvatarFieldProps = {
  avatarUrl: string | null;
  initials: string;
};

function validateImage(file: File) {
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    return "Choose a JPEG, PNG, or WebP image.";
  }

  if (file.size > MAX_IMAGE_BYTES) {
    return "The image must be 5 MB or smaller.";
  }

  return null;
}

export function ProfileAvatarField({ avatarUrl, initials }: ProfileAvatarFieldProps) {
  const [preview, setPreview] = useState(avatarUrl);
  const [removeAvatar, setRemoveAvatar] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const objectUrl = useRef<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(
    () => () => {
      if (objectUrl.current) URL.revokeObjectURL(objectUrl.current);
    },
    [],
  );

  function clearObjectUrl() {
    if (!objectUrl.current) return;
    URL.revokeObjectURL(objectUrl.current);
    objectUrl.current = null;
  }

  function handleFile(file: File | undefined, input: HTMLInputElement) {
    clearObjectUrl();

    if (!file) {
      setError(null);
      setRemoveAvatar(false);
      setPreview(avatarUrl);
      return;
    }

    const validationError = validateImage(file);
    if (validationError) {
      input.value = "";
      setError(validationError);
      setRemoveAvatar(false);
      setPreview(avatarUrl);
      return;
    }

    const nextObjectUrl = URL.createObjectURL(file);
    objectUrl.current = nextObjectUrl;
    setError(null);
    setRemoveAvatar(false);
    setPreview(nextObjectUrl);
  }

  function handleRemove() {
    clearObjectUrl();
    if (inputRef.current) inputRef.current.value = "";
    setError(null);
    setRemoveAvatar(Boolean(avatarUrl));
    setPreview(null);
  }

  return (
    <fieldset className="border-0 p-0">
      <legend className="text-sm font-semibold text-ink">Profile photo</legend>
      <input type="hidden" name="removeAvatar" value={removeAvatar ? "1" : "0"} />

      <div className="mt-4 flex flex-col items-start gap-5 sm:flex-row sm:items-center lg:flex-col lg:items-start">
        <div className="relative size-32 shrink-0 overflow-hidden rounded-full border-[5px] border-white bg-sandstone/55 shadow-sm">
          {preview ? (
            <Image
              src={preview}
              alt="Profile photo preview"
              fill
              sizes="128px"
              unoptimized
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 grid place-items-center text-3xl font-semibold text-heather">
              {initials}
            </div>
          )}
        </div>

        <div className="w-full">
          <label className="inline-flex min-h-11 cursor-pointer items-center justify-center rounded-full border border-heather/25 bg-white px-5 text-sm font-semibold text-ink transition-colors hover:border-heather hover:text-heather focus-within:outline-2">
            Choose photo
            <input
              ref={inputRef}
              className="sr-only"
              type="file"
              name="avatarImage"
              accept={ACCEPTED_IMAGE_TYPES.join(",")}
              aria-describedby="avatar-image-help"
              onChange={(event) => handleFile(event.target.files?.[0], event.currentTarget)}
            />
          </label>

          {preview && (
            <button
              type="button"
              onClick={handleRemove}
              className="ml-4 text-xs font-semibold text-candy underline decoration-candy/35 underline-offset-4 focus-visible:outline-2"
            >
              Remove
            </button>
          )}

          <p
            id="avatar-image-help"
            className={`mt-3 max-w-xs text-xs leading-5 ${error ? "text-candy" : "text-ink/45"}`}
          >
            {error || "JPEG, PNG, or WebP. Maximum 5 MB. The image will be cropped square."}
          </p>
        </div>
      </div>
    </fieldset>
  );
}
