import crypto from "crypto";
import { redis } from "./redis";

const COOKIE = process.env.SESSION_COOKIE_NAME || "session_id";
const TTL = Number(process.env.SESSION_TTL_SECONDS || 60 * 60 * 24 * 7);

export type SessionData = {
  user: { id: string; username: string; role: string };
  access_token: string;
  refresh_token: string;
};

export function newSessionId() {
  return crypto.randomUUID();
}

export function sessionKey(sid: string) {
  return `sess:${sid}`;
}

export async function setSession(sid: string, data: SessionData) {
  await redis.set(sessionKey(sid), data, { ex: TTL });
}

export async function getSession(sid: string): Promise<SessionData | null> {
  const v = await redis.get<SessionData>(sessionKey(sid));
  return v ?? null;
}

export async function deleteSession(sid: string) {
  await redis.del(sessionKey(sid));
}

export function cookieName() {
  return COOKIE;
}
