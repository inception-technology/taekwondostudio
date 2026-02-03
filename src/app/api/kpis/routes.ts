import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { cookieName, getSession, setSession } from "@/lib/session";

export async function GET() {
  const apiBase = process.env.API_BASE_URL;
  if (!apiBase) return new NextResponse("Missing API_BASE_URL", { status: 500 });

  const cookieStore = await cookies();
  const sid = cookieStore.get(cookieName())?.value;
  if (!sid) return new NextResponse("Not authenticated", { status: 401 });

  const session = await getSession(sid);
  if (!session) return new NextResponse("Session expired", { status: 401 });

  // appel API avec Bearer
  let res = await fetch(`${apiBase}/kpis`, {
    headers: {
      Authorization: `Bearer ${session.access_token}`,
    },
    cache: "no-store",
  });

  // refresh si access token expiré
  if (res.status === 401) {
    const rr = await fetch(`${apiBase}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: session.refresh_token }),
      cache: "no-store",
    });

    if (!rr.ok) return new NextResponse("Not authenticated", { status: 401 });

    const tokens = await rr.json();
    const updated = {
      ...session,
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
    };

    await setSession(sid, updated);

    res = await fetch(`${apiBase}/kpis`, {
      headers: {
        Authorization: `Bearer ${updated.access_token}`,
      },
      cache: "no-store",
    });
  }

  if (!res.ok) {
    const text = await res.text();
    return new NextResponse(text || "Failed to fetch KPIs", { status: 502 });
  }

  const data = await res.json();
  return NextResponse.json(data);
}
