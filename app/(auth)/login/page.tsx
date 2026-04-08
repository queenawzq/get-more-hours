"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";

function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSignIn() {
    setLoading(true);
    setError("");

    const supabase = createClient();
    // Auto-login with a demo account for clickable prototype
    const { error } = await supabase.auth.signInWithPassword({
      email: "demo@getmorehours.com",
      password: "demo123456",
    });

    if (error) {
      // If demo account doesn't exist, create it and sign in
      const { error: signUpError } = await supabase.auth.signUp({
        email: "demo@getmorehours.com",
        password: "demo123456",
        options: { data: { full_name: "Demo User" } },
      });
      if (signUpError) {
        setError(signUpError.message);
        setLoading(false);
        return;
      }
      // Try signing in again after signup
      const { error: retryError } = await supabase.auth.signInWithPassword({
        email: "demo@getmorehours.com",
        password: "demo123456",
      });
      if (retryError) {
        setError(retryError.message);
        setLoading(false);
        return;
      }
    }

    window.location.href = callbackUrl;
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Welcome Back</CardTitle>
        <CardDescription>Sign in to access your dashboard</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && <p className="text-sm text-destructive text-center">{error}</p>}
        <Button
          onClick={handleSignIn}
          className="w-full"
          disabled={loading}
          size="lg"
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Sign In
        </Button>
      </CardContent>
      <CardFooter className="justify-center">
        <p className="text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="text-primary hover:underline font-medium"
          >
            Register
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
