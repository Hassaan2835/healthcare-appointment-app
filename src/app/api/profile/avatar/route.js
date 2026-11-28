import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import {
  handleApiError,
  requireSession,
  ApiError,
} from "@/lib/api-errors";
import {
  validateAvatarFile,
  saveAvatarFile,
  deleteAvatarFile,
} from "@/lib/upload";

// POST /api/profile/avatar — upload the signed-in user's profile
// picture. Expects multipart form data with an "avatar" file field
// (JPG, PNG or WebP, max 2 MB — see src/lib/upload.js). The file is
// stored under public/uploads/avatars/ and its public URL is saved
// on the user's `image` field (Day 20, Prisma schema). A new upload
// replaces the old picture and deletes the old file, so orphaned
// uploads do not pile up. Errors are { error } — see api-errors.js.
export async function POST(request) {
  try {
    const session = await requireSession("You must be logged in to upload a profile picture.");

    let formData;
    try {
      formData = await request.formData();
    } catch {
      throw new ApiError(400, "Invalid upload. Please try again.");
    }

    const file = formData.get("avatar");
    const { extension, error } = validateAvatarFile(file);
    if (error) throw new ApiError(400, error);

    const imageUrl = await saveAvatarFile(file, session.user.id, extension);

    try {
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { image: true },
      });
      await prisma.user.update({
        where: { id: session.user.id },
        data: { image: imageUrl },
      });
      // Only remove the previous picture once the new one is saved.
      if (user?.image && user.image !== imageUrl) {
        await deleteAvatarFile(user.image);
      }
    } catch (dbError) {
      // The database could not be reached: drop the uploaded file
      // again so it does not linger without a user pointing at it.
      await deleteAvatarFile(imageUrl);
      throw dbError;
    }

    return NextResponse.json({
      message: "Profile picture updated.",
      image: imageUrl,
    });
  } catch (error) {
    return handleApiError(error, "Upload failed. Please try again.");
  }
}

// DELETE /api/profile/avatar — remove the signed-in user's profile
// picture and clear the `image` field. A missing picture is fine —
// removing nothing still succeeds.
export async function DELETE() {
  try {
    const session = await requireSession("You must be logged in to remove your profile picture.");

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { image: true },
    });
    if (user?.image) {
      await deleteAvatarFile(user.image);
    }
    await prisma.user.update({
      where: { id: session.user.id },
      data: { image: null },
    });

    return NextResponse.json({ message: "Profile picture removed.", image: null });
  } catch (error) {
    return handleApiError(error, "Could not remove the profile picture. Please try again.");
  }
}
