// Day 20: file upload helpers for profile pictures.
//
// Uploaded avatars are stored on local disk under
// public/uploads/avatars/ and served as static files, so no extra
// storage service is needed. Only real image files are accepted:
// the MIME type and the file extension must both be on the allow
// list, and files are capped at 2 MB. Filenames are generated from
// the user id and a timestamp — the original filename is never used,
// so a crafted name cannot escape the upload directory.

import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

export const AVATAR_MAX_BYTES = 2 * 1024 * 1024; // 2 MB
export const AVATAR_DIR = path.join(process.cwd(), "public", "uploads", "avatars");

const ALLOWED_TYPES = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

// Validate an uploaded File (from request.formData()) and return the
// extension to store it with, or an error message for the client.
export function validateAvatarFile(file) {
  if (!file || typeof file.arrayBuffer !== "function" || file.size === 0) {
    return { error: "Please choose an image file to upload." };
  }
  const extension = ALLOWED_TYPES[file.type];
  if (!extension) {
    return { error: "Please upload a JPG, PNG or WebP image." };
  }
  if (file.size > AVATAR_MAX_BYTES) {
    return { error: "The image is too large. Please choose one under 2 MB." };
  }
  return { extension };
}

// Save a validated avatar file and return its public URL, e.g.
// "/uploads/avatars/<userId>-1732690000000.jpg".
export async function saveAvatarFile(file, userId, extension) {
  await mkdir(AVATAR_DIR, { recursive: true });
  const filename = `${userId}-${Date.now()}.${extension}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(AVATAR_DIR, filename), buffer);
  return `/uploads/avatars/${filename}`;
}

// Delete a previously stored avatar, given its public URL. Only
// files inside the avatar directory are ever removed, and a missing
// file is not an error — the old picture may already be gone.
export async function deleteAvatarFile(imageUrl) {
  if (!imageUrl || !imageUrl.startsWith("/uploads/avatars/")) return;
  const filename = path.basename(imageUrl);
  if (!filename || filename.includes("..")) return;
  try {
    await unlink(path.join(AVATAR_DIR, filename));
  } catch (error) {
    if (error?.code !== "ENOENT") throw error;
  }
}
