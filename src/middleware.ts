// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();

  const protectedPaths = ["/user/*"];
  if (!protectedPaths.some((p) => url.pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // C1: cookie de session opaque
  const sid = req.cookies.get("session_id")?.value; // <-- adapte au nom exact cookieName()
  if (!sid) {
    url.pathname = "/authentication/login";
    return NextResponse.redirect(url);
  }

  const isAuthRoute = url.pathname.startsWith("/authentication");
  if (isAuthRoute && sid) {
    url.pathname = "/user/dashboard";
    return NextResponse.redirect(url);
  }


  return NextResponse.next();
}

export const config = {
  matcher: ["/user/dashboard/:path*", "/students/:path*", "/coaches/:path*", "/schedules/:path*"],
};
