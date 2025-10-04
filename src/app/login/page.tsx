"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Shield } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // TODO: Implement Firebase Auth sign in
      // For now, mock authentication
      if (email && password) {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        router.push("/dashboard");
      } else {
        setError("Please enter email and password");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to sign in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Login Form */}
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-[#4169E1] via-[#6B5FD8] to-[#8B5FCF] p-8">
        <div className="w-full max-w-md">
          {/* Logo and Title */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="h-10 w-10 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">AMSync.ai</span>
            </div>
          </div>

          {/* Sign In Card */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-2xl">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-white mb-2">Sign In</h1>
              <p className="text-white/80 text-sm">
                Enter your credentials to access your account
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <Alert className="bg-red-500/20 border-red-400/50 text-white">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-white text-sm font-medium"
                >
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="asifp@getaiu.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  className="bg-white/90 border-white/30 text-slate-900 placeholder:text-slate-500 h-11 focus:bg-white"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="password"
                    className="text-white text-sm font-medium"
                  >
                    Password
                  </Label>
                  <Link
                    href="/forgot-password"
                    className="text-sm text-white/90 hover:text-white transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  className="bg-white/90 border-white/30 text-slate-900 h-11 focus:bg-white"
                />
              </div>

              <Button
                type="submit"
                className="w-full h-11 bg-[#4169E1] hover:bg-[#3557C7] text-white font-medium shadow-lg"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-white/80 text-sm">
                Don't have an account?{" "}
                <Link
                  href="#"
                  className="text-white font-medium hover:underline"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Marketing Content */}
      <div
        className="hidden lg:flex flex-1 items-center justify-center p-12 bg-cover bg-center relative"
        style={{ backgroundImage: "url('/login-bg.webp')" }}
      >
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[1px]" />
        <div className="relative z-10 max-w-xl text-white">
          <h2 className="text-4xl font-bold mb-4 leading-tight drop-shadow-lg">
            Insurance Agency Management Made Simple
          </h2>
          <p className="text-lg text-white leading-relaxed drop-shadow-md">
            Streamline your operations with our comprehensive agency management
            solution.
          </p>
        </div>
      </div>
    </div>
  );
}
