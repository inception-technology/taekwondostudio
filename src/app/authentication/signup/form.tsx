"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";

type SignupPayload = {
  first_name: string;
  last_name: string;
  email: string;
  organization_name: string;
  password: string;
  consent: boolean;
};

export default function SignupForm() {
  const router = useRouter();

  const [form, setForm] = React.useState<SignupPayload>({
    first_name: "",
    last_name: "",
    email: "",
    organization_name: "",
    password: "",
    consent: false,
  });

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  function update<K extends keyof SignupPayload>(key: K, value: SignupPayload[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!form.consent) {
      setError("You must accept data collection to continue.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || "Signup failed");
      }

      router.replace("/authentication/login");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signup failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign up</CardTitle>
          <CardDescription>
            Create an account to manage your Studios.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="organization_name">Organization name *</Label>
              <Input
                id="organization_name"
                type="text"
                autoComplete="organization"
                value={form.organization_name}
                onChange={(e) => update("organization_name", e.target.value)}
                disabled={loading}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name">First name *</Label>
                <Input
                  id="first_name"
                  value={form.first_name}
                  onChange={(e) => update("first_name", e.target.value)}
                  disabled={loading}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="last_name">Last name *</Label>
                <Input
                  id="last_name"
                  value={form.last_name}
                  onChange={(e) => update("last_name", e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                disabled={loading}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                value={form.password}
                onChange={(e) => update("password", e.target.value)}
                disabled={loading}
                required
              />
            </div>

            <div className="flex items-start gap-2">
              <Checkbox
                id="consent"
                checked={form.consent}
                onCheckedChange={(v) => update("consent", Boolean(v))}
                disabled={loading}
              />
              <Label htmlFor="consent" className="leading-snug">
                By clicking <span className="font-semibold">Sign Up</span> I agree to the Terms and Privacy Policy.
              </Label>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating account..." : "Sign Up"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
