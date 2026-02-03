// src/lib/api.ts
export async function apiFetch(input: RequestInfo, init: RequestInit = {}) {
  const res = await fetch(input, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
  });

  if (res.status !== 401) return res;

  // Try refresh
  const refreshRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, {
    method: "POST",
    credentials: "include",
  });

  if (!refreshRes.ok) return res;

  // Retry original request
  return fetch(input, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
  });
}

export async function fetchKpis() {
  const res = await fetch("/api/kpis", {
    method: "GET",
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to load KPIs");
  }

  return res.json();
}

