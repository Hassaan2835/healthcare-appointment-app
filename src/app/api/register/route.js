import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { hashPassword } from "@/lib/password";
import { registerSchema, validateBody } from "@/lib/validation";
import {
  ApiError,
  handleApiError,
  parseJsonBody,
  validationError,
} from "@/lib/api-errors";

// POST /api/register — create a patient account.
// Body is validated by registerSchema (Zod, Day 18): name, a valid
// email, a password of at least 6 characters, optional phone.
// Errors are { error, details? } — see src/lib/api-errors.js.
export async function POST(request) {
  try {
    const body = await parseJsonBody(request);
    const { value, errors } = validateBody(registerSchema, body);
    if (errors) throw validationError(errors);

    const existingUser = await prisma.user.findUnique({
      where: { email: value.email },
    });
    if (existingUser) {
      throw new ApiError(409, "An account with this email already exists.");
    }

    const hashedPassword = await hashPassword(value.password);

    const user = await prisma.user.create({
      data: {
        name: value.name,
        email: value.email,
        password: hashedPassword,
        phone: value.phone || null,
        role: "PATIENT",
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      { message: "Account created successfully.", user },
      { status: 201 }
    );
  } catch (error) {
    return handleApiError(error, "Something went wrong. Please try again.");
  }
}
