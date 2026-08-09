import { NextResponse, type NextRequest } from "next/server";
import { verifySession, SESSION_COOKIE_NAME } from "@/lib/auth";

/**
 * Gates every /admin route except the login page itself. Runs on the Edge
 * runtime, so session verification goes through `jose` (verifySession),
 * never bcrypt or the MongoDB driver. Those stay server-only, reached only
 * from Server Actions and Route Handlers after this gate has already passed.
 *
 * Also flags every /admin request with an `x-is-admin` request header so the
 * single root layout (app/layout.tsx) can skip the public SiteHeader/
 * SiteFooter/MotionRoot chrome for the admin panel without a second root
 * layout / route-group restructuring of the whole app directory.
 */
export async function proxy(request: NextRequest) {
  if (request.nextUrl.pathname === "/admin/login") {
    const headers = new Headers(request.headers);
    headers.set("x-is-admin", "1");
    return NextResponse.next({ request: { headers } });
  }

  // /api/admin/* is fetched by client components (e.g. MediaPicker) with the
  // browser's own cookies, so it needs the same gate as the pages: a 401
  // here, not a redirect, since it's called from JS rather than navigated to.
  if (request.nextUrl.pathname.startsWith("/api/admin/")) {
    const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
    const session = token ? await verifySession(token) : null;
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.next();
  }

  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const session = token ? await verifySession(token) : null;

  if (!session) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("from", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  const headers = new Headers(request.headers);
  headers.set("x-is-admin", "1");
  return NextResponse.next({ request: { headers } });
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
