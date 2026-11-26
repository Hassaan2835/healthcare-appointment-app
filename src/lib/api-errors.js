// Day 18: shared API error handling.
//
// Every API route answers errors in one shape — { error, details? } —
// with a proper HTTP status, instead of each route hand-rolling its
// own try/catch and message strings. Handlers throw an ApiError for
// expected failures (bad input, not found, conflict, ...) and let
// unexpected failures fall through to handleApiError, which logs the
// real error server-side and answers with a safe generic message so
// database details never leak to the client.

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth-options";

// An expected, client-facing failure: a known status and a message
// that is safe to show to the user. `details` carries optional
// field-level validation errors: [{ field, message }].
export class ApiError extends Error {
  constructor(status, message, details = null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

// Build a 400 ApiError from the field errors validateBody returns.
// The first error is the headline message; the full list rides along
// in `details` so forms can highlight every bad field at once.
export function validationError(errors) {
  const first = errors?.[0]?.message || "Please check your input and try again.";
  return new ApiError(400, first, errors);
}

// Turn an error into its JSON response. Expected ApiErrors pass
// through untouched; anything else is logged and answered with the
// route's generic fallback message and status (500 by default —
// pass 503 for routes whose fallback is "unavailable right now").
export function handleApiError(error, fallbackMessage, fallbackStatus = 500) {
  if (error instanceof ApiError) {
    return errorResponse(error);
  }
  console.error("API error:", error);
  return NextResponse.json(
    { error: fallbackMessage || "Something went wrong. Please try again." },
    { status: fallbackStatus }
  );
}

export function errorResponse(error) {
  const body = { error: error.message };
  if (error.details) body.details = error.details;
  return NextResponse.json(body, { status: error.status });
}

// Read a JSON request body. A malformed body is a 400, not a 500.
export async function parseJsonBody(request) {
  try {
    return await request.json();
  } catch {
    throw new ApiError(400, "Invalid request body.");
  }
}

// Load the session or throw 401. Routes pass their own message so
// the error still reads in context ("...to book an appointment").
export async function requireSession(message = "You must be logged in.") {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new ApiError(401, message);
  }
  return session;
}
