import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { cookieName, newSessionId, setSession } from "@/lib/session";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const username = body?.username?.trim();
  const password = body?.password;
  if (!username || !password) {
    return new NextResponse("Missing username/password", { status: 400 });
  }

  const apiBase = process.env.NEXT_PUBLIC_API_URL;
  if (!apiBase) return new NextResponse("Missing NEXT_PUBLIC_API_URL", { status: 500 });

  const r = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ username, password }),
    cache: "no-store",
  });
  if (!r.ok) {
    const text = await r.text().catch(() => "");
    return new NextResponse(text || "Login failed", { status: r.status === 401 ? 401 : 502 });
  }

  const data = await r.json().catch(() => null);
  if (!data?.user || !data?.access_token || !data?.refresh_token) {
    return new NextResponse("API login response missing tokens/user", { status: 502 });
  }

  const sid = newSessionId();
  await setSession(sid, {
    user: data.user,
    access_token: data.access_token,
    refresh_token: data.refresh_token,
  });

  const cookieStore = await cookies();
  cookieStore.set(cookieName(), sid, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    // domain: process.env.SESSION_COOKIE_DOMAIN, // optionnel
  });

  return NextResponse.json({ user: data.user });
}
