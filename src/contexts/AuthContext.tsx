"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

type User = {
  id: string;
  username: string;
  role: string;
};

type AuthContextValue = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  refreshMe: () => Promise<User | null>;
  login: (username: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

async function safeJson<T>(res: Response): Promise<T | null> {
  const ct = res.headers.get("content-type") || "";
  if (!ct.includes("application/json")) return null;
  return (await res.json()) as T;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshMe = useCallback(async (): Promise<User | null> => {
    // BFF endpoint: cookie session_id envoyé automatiquement (same-origin)
    const res = await fetch("/api/me", {
      method: "GET",
      cache: "no-store",
      // credentials: "include" n'est pas nécessaire en same-origin, mais OK si tu veux le forcer :
    });

    if (res.ok) {
      const data = await safeJson<User>(res);
      if (data) {
        setUser(data);
        return data;
      }
      setUser(null);
      return null;
    }

    // 401 => pas de session valide
    setUser(null);
    return null;
  }, []);

  const login = useCallback(async (username: string, password: string): Promise<User> => {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
      cache: "no-store",
      // credentials: "include",
    });

    if (!res.ok) {
      // Option: essayer de lire un message d'erreur
      const err = await safeJson<{ detail?: string }>(res);
      throw new Error(err?.detail || "Login failed");
    }

    const data = (await safeJson<{ user: User }>(res)) ?? null;
    if (!data?.user) throw new Error("Login response missing user");

    setUser(data.user);
    return data.user;
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    await fetch("/api/logout", {
      method: "POST",
      cache: "no-store",
      // credentials: "include",
    }).catch(() => {
      // même si ça échoue, on nettoie le state côté client
    });

    setUser(null);
  }, []);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        if (!alive) return;
        await refreshMe();
      } finally {
        if (alive) setIsLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [refreshMe]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      isAuthenticated: !!user,
      refreshMe,
      login,
      logout,
    }),
    [user, isLoading, refreshMe, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
