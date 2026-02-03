"use client";
import RootHeader from "@/components/shared/RootHeader";
import SignupForm from "../signup/form";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    // Appel FastAPI login route
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        }
      );
      // Si erreur
      if (!res.ok) throw new Error();
      // Redirige vers login après signup réussi
      router.push("/authentication/login");
    } catch {
      setError("Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <RootHeader />
    <SignupForm />
    <div className="text-center">
      <a
        href="/authentication/login"
        className="text-sm text-blue-600 hover:underline"
      >
        Already have an account? Login
      </a>
    </div>
    </>
  );
}
