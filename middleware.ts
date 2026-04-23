import { NextRequest, NextResponse } from "next/server";
import { getAbsoluteUrl } from "@/lib/site-url";

const ADMIN_COOKIE_NAME = "amj_admin_session";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isAdminPage = pathname.startsWith("/admin");
  const isAdminApi = pathname.startsWith("/api/admin");

  const isLoginPage = pathname === "/admin/login";
  const isLoginApi = pathname === "/api/admin/login";

  if (!isAdminPage && !isAdminApi) {
    return NextResponse.next();
  }

  if (isLoginPage || isLoginApi) {
    return NextResponse.next();
  }

  const sessionCookie = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const expectedSession = process.env.ADMIN_SESSION_SECRET;

  const isAuthenticated =
    !!sessionCookie &&
    !!expectedSession &&
    sessionCookie === expectedSession;

  if (isAuthenticated) {
    return NextResponse.next();
  }

  if (isAdminApi) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const loginUrl =
    process.env.NODE_ENV === "production"
      ? new URL(getAbsoluteUrl("/admin/login"))
      : new URL("/admin/login", req.url);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
