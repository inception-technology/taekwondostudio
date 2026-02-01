"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

type Role = "admin" | "coach" | "student";
type User = { 
  id: string; 
  username: string;
  role: Role 
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  refreshMe: () => Promise<void>;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshMe = async () => {
    try {
      const res = await apiFetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`);
      if (!res.ok) {
        setUser(null);
        return;
      }
      const data = await res.json();
      setUser({ id: data.id, username: data.username, role: data.role });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    refreshMe();
  }, []);

  const login = async (username: string, password: string) => {
    const body = new URLSearchParams({ username, password });
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
      method: "POST",
      body,
      credentials: "include",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
    if (!res.ok) throw new Error("Login failed");
    await refreshMe();
  };

  const logout = async () => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        refreshMe,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  console.log("AuthContext:", ctx);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
