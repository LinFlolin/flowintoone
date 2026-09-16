import "server-only";

import sharp from "sharp";

export const STOREFRONT_IMAGE_BUCKET = "storefront-images";
export const STOREFRONT_IMAGE_MAX_BYTES = 5 * 1024 * 1024;
export const STOREFRONT_IMAGE_ACCEPT = ["image/jpeg", "image/png", "image/webp"] as const;

type StorefrontImageKind = "logo" | "cover";

export type ProcessedStorefrontImage = {
  bytes: Buffer;
  contentType: "image/webp";
};

export class StorefrontImageValidationError extends Error {}

export async function processStorefrontImage(
  file: File,
  kind: StorefrontImageKind,
): Promise<ProcessedStorefrontImage> {
  if (!STOREFRONT_IMAGE_ACCEPT.includes(file.type as (typeof STOREFRONT_IMAGE_ACCEPT)[number])) {
    throw new StorefrontImageValidationError("Upload a JPEG, PNG, or WebP image.");
  }

  if (file.size > STOREFRONT_IMAGE_MAX_BYTES) {
    throw new StorefrontImageValidationError("Each image must be 5 MB or smaller.");
  }

  if (file.size === 0) {
    throw new StorefrontImageValidationError("The selected image is empty.");
  }

  const source = Buffer.from(await file.arrayBuffer());
  try {
    const image = sharp(source, {
      failOn: "error",
      limitInputPixels: 40_000_000,
    });
    const metadata = await image.metadata();

    if (!metadata.format || !["jpeg", "png", "webp"].includes(metadata.format)) {
      throw new StorefrontImageValidationError(
        "The selected file is not a valid JPEG, PNG, or WebP image.",
      );
    }

    const dimensions =
      kind === "logo" ? { width: 800, height: 800 } : { width: 2400, height: 1600 };
    const bytes = await image
      .rotate()
      .resize({ ...dimensions, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 84 })
      .toBuffer();

    return { bytes, contentType: "image/webp" };
  } catch (error) {
    if (error instanceof StorefrontImageValidationError) throw error;

    throw new StorefrontImageValidationError(
      "The selected file could not be read as an image.",
    );
  }
}

export function storefrontImagePath(
  userId: string,
  businessId: string,
  kind: StorefrontImageKind,
) {
  return `${userId}/${businessId}/${kind}-${crypto.randomUUID()}.webp`;
}

export function storefrontObjectPathFromPublicUrl(urlValue: string | null) {
  if (!urlValue) return null;

  try {
    const url = new URL(urlValue);
    const marker = `/storage/v1/object/public/${STOREFRONT_IMAGE_BUCKET}/`;
    const markerIndex = url.pathname.indexOf(marker);

    if (markerIndex === -1) return null;

    return decodeURIComponent(url.pathname.slice(markerIndex + marker.length));
  } catch {
    return null;
  }
}
