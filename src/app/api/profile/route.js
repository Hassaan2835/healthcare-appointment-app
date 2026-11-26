import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { profileSchema, validateBody } from "@/lib/validation";
import {
  handleApiError,
  parseJsonBody,
  requireSession,
  validationError,
} from "@/lib/api-errors";

// PATCH /api/profile — update the signed-in user's own profile
// (name and phone only). Body is validated by profileSchema (Zod,
// Day 18). Email and role can never be changed through this route —
// they are not in the schema, so Zod strips them before Prisma sees
// the data. Errors are { error, details? } — see api-errors.js.
export async function PATCH(request) {
  try {
    const session = await requireSession("You must be logged in.");
    const body = await parseJsonBody(request);
    const { value, errors } = validateBody(profileSchema, body);
    if (errors) throw validationError(errors);

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: { name: value.name, phone: value.phone || null },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ message: "Profile updated.", user });
  } catch (error) {
    return handleApiError(error, "Something went wrong. Please try again.");
  }
}
