// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();

  const protectedPaths = ["/dashboard", "/students", "/coaches", "/schedules"];
  if (!protectedPaths.some((p) => url.pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // Vérifie via cookie access_token présent (check minimal)
  const access = req.cookies.get("access_token")?.value;
  if (!access) {
    url.pathname = "/authentication/signin";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/students/:path*", "/coaches/:path*", "/schedules/:path*"],
};
