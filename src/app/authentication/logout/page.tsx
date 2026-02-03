"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function LogoutPage() {
  const router = useRouter();
  const { logout } = useAuth();

  useEffect(() => {
    (async () => {
      await logout();
      router.replace("/");
    })();
  }, [logout, router]);

  return <p>Logout…</p>;
}
