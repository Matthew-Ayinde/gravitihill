import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

/**
 * Admin session: a signed JWT (via `jose`, Edge-compatible so middleware.ts
 * can verify it without a Node runtime) in an httpOnly cookie scoped to
 * /admin. There is one admin identity type — the `admins` collection — no
 * roles or scopes, since this is a single-firm site with a small number of
 * editors.
 */

const COOKIE_NAME = "gh_admin_session";
const SESSION_DURATION = "7d";

function secretKey(): Uint8Array {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error("AUTH_SECRET is not set. See README §Environment.");
  }
  return new TextEncoder().encode(secret);
}

export type SessionPayload = {
  sub: string;
  email: string;
};

export async function signSession(payload: SessionPayload): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(SESSION_DURATION)
    .sign(secretKey());
}

export async function verifySession(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey());
    if (typeof payload.sub !== "string" || typeof payload.email !== "string") {
      return null;
    }
    return { sub: payload.sub, email: payload.email };
  } catch {
    return null;
  }
}

/** Server Action / Route Handler helper — sets the session cookie. */
export async function createSession(payload: SessionPayload): Promise<void> {
  const token = await signSession(payload);
  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    // Must cover /api/admin/* too (e.g. MediaPicker's fetch calls), which
    // doesn't fall under the /admin path prefix — a cookie scoped to /admin
    // is never sent on /api/admin/media requests, so those 401 silently.
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function destroySession(): Promise<void> {
  const store = await cookies();
  store.delete({ name: COOKIE_NAME, path: "/" });
}

/** Reads and verifies the session from within a Server Component/Action. */
export async function getSession(): Promise<SessionPayload | null> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySession(token);
}

/**
 * Server Actions / Server Components call this first. An expired or missing
 * session sends the browser straight to the login page — the natural result
 * for a `useActionState` form post — rather than throwing and surfacing an
 * uncaught-error page.
 */
export async function requireSession(): Promise<SessionPayload> {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  return session;
}

/**
 * Thrown by `requireApiSession`. A distinct type (rather than a generic
 * Error) so Route Handlers can tell "not signed in" apart from a real
 * failure downstream (e.g. a Cloudinary error) and respond with 401 instead
 * of a 500 — `redirect()` isn't an option here since these routes are called
 * via `fetch()` from client components, which would just follow it to the
 * login page's HTML and fail trying to parse that as JSON.
 */
export class SessionExpiredError extends Error {
  constructor() {
    super("Session expired.");
    this.name = "SessionExpiredError";
  }
}

/** Route Handlers call this first — see `SessionExpiredError`. */
export async function requireApiSession(): Promise<SessionPayload> {
  const session = await getSession();
  if (!session) throw new SessionExpiredError();
  return session;
}

/** The 401 a Route Handler returns when `requireApiSession` rejects. */
export function sessionExpiredResponse(): NextResponse {
  return NextResponse.json({ message: "Session expired. Sign in again." }, { status: 401 });
}

export { COOKIE_NAME as SESSION_COOKIE_NAME };
