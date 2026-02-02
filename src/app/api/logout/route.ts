import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { cookieName, deleteSession } from "@/lib/session";

export async function POST() {

  const cookieStore = await cookies();

  const sid = cookieStore.get(cookieName())?.value;
  try {
    if (sid) await deleteSession(sid);
  } catch (error) {
    console.error("Failed to delete session:", error);
  }
  
  cookieStore.set(cookieName(), "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
    expires: new Date(0),
  });

  return NextResponse.json({ ok: true });
}
