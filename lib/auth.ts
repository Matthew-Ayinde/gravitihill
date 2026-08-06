import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

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
    path: "/admin",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function destroySession(): Promise<void> {
  const store = await cookies();
  store.delete({ name: COOKIE_NAME, path: "/admin" });
}

/** Reads and verifies the session from within a Server Component/Action. */
export async function getSession(): Promise<SessionPayload | null> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySession(token);
}

/** Server Actions call this first — belt-and-braces beyond the middleware gate. */
export async function requireSession(): Promise<SessionPayload> {
  const session = await getSession();
  if (!session) throw new Error("Not authenticated.");
  return session;
}

export { COOKIE_NAME as SESSION_COOKIE_NAME };
