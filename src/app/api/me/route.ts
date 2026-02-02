import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { cookieName, getSession, setSession } from "@/lib/session";

async function apiMe(apiBase: string, accessToken: string) {
  try {
    return fetch(`${apiBase}/auth/me`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: "no-store",
    });
  } catch {
    return new NextResponse("Failed to reach API", { status: 502 });
  }
}

async function apiRefresh(apiBase: string, refreshToken: string) {
  try {
    return fetch(`${apiBase}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refreshToken }),
      cache: "no-store",
    });
  } catch {
    return new NextResponse("Failed to reach API", { status: 502 });
  }
}

export async function GET() {
  const apiBase = process.env.NEXT_PUBLIC_API_URL;
  if (!apiBase) return new NextResponse("Missing NEXT_PUBLIC_API_URL", { status: 500 });
  
  const cookieStore = await cookies();
  const sid = cookieStore.get(cookieName())?.value;
  if (!sid) return new NextResponse("Not authenticated", { status: 401 });
  console.log("sid=", sid);


  const sess = await getSession(sid);
  if (!sess?.access_token || !sess?.refresh_token) {
    return new NextResponse("Session expired", { status: 401 });
  }
  console.log("sess exists=", !!sess);

  let r = await apiMe(apiBase, sess.access_token);

  if (r.status === 401) {
    const rr = await apiRefresh(apiBase, sess.refresh_token);
    if (!rr.ok) return new NextResponse("Not authenticated", { status: 401 });

    const tokens = await rr.json().catch(() => null);
    if (!tokens?.access_token || !tokens?.refresh_token) {
      return new NextResponse("Refresh response missing tokens", { status: 502 });
    }

    const updated = {
      ...sess,
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
    };

    await setSession(sid, updated);
    r = await apiMe(apiBase, updated.access_token);
  }

  if (!r.ok) return new NextResponse("Not authenticated", { status: 401 });

  const user = await r.json().catch(() => null);
  if (!user) return new NextResponse("Invalid user payload", { status: 502 });

  return NextResponse.json(user);
}
