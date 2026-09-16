import "server-only";

import sharp from "sharp";

export const PROFILE_AVATAR_BUCKET = "profile-avatars";
export const PROFILE_AVATAR_MAX_BYTES = 5 * 1024 * 1024;
export const PROFILE_AVATAR_ACCEPT = ["image/jpeg", "image/png", "image/webp"] as const;

export type ProcessedProfileAvatar = {
  bytes: Buffer;
  contentType: "image/webp";
};

export class ProfileAvatarValidationError extends Error {}

export async function processProfileAvatar(file: File): Promise<ProcessedProfileAvatar> {
  if (!PROFILE_AVATAR_ACCEPT.includes(file.type as (typeof PROFILE_AVATAR_ACCEPT)[number])) {
    throw new ProfileAvatarValidationError("Upload a JPEG, PNG, or WebP image.");
  }

  if (file.size > PROFILE_AVATAR_MAX_BYTES) {
    throw new ProfileAvatarValidationError("The profile photo must be 5 MB or smaller.");
  }

  if (file.size === 0) {
    throw new ProfileAvatarValidationError("The selected image is empty.");
  }

  const source = Buffer.from(await file.arrayBuffer());

  try {
    const image = sharp(source, {
      failOn: "error",
      limitInputPixels: 40_000_000,
    });
    const metadata = await image.metadata();

    if (!metadata.format || !["jpeg", "png", "webp"].includes(metadata.format)) {
      throw new ProfileAvatarValidationError(
        "The selected file is not a valid JPEG, PNG, or WebP image.",
      );
    }

    const bytes = await image
      .rotate()
      .resize(800, 800, { fit: "cover", position: "attention" })
      .webp({ quality: 84 })
      .toBuffer();

    return { bytes, contentType: "image/webp" };
  } catch (error) {
    if (error instanceof ProfileAvatarValidationError) throw error;

    throw new ProfileAvatarValidationError(
      "The selected file could not be read as an image.",
    );
  }
}

export function profileAvatarPath(userId: string) {
  return `${userId}/avatar-${crypto.randomUUID()}.webp`;
}

export function isOwnedProfileAvatarPath(
  path: string | null,
  userId: string,
): path is string {
  if (!path) return false;

  const escapedUserId = userId.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(
    `^${escapedUserId}/avatar-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\\.webp$`,
    "i",
  ).test(path);
}
