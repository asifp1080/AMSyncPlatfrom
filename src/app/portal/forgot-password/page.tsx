"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle, Shield, ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthProvider";

export default function PortalForgotPasswordPage() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    try {
      await resetPassword(email);
      setSuccess(true);
    } catch (err: any) {
      let errorMessage = "Failed to send reset email";
      
      if (err.code === "auth/user-not-found") {
        errorMessage = "No account found with this email";
      } else if (err.code === "auth/invalid-email") {
        errorMessage = "Invalid email address";
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Reset Form */}
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-[#4169E1] via-[#6B5FD8] to-[#8B5FCF] p-8">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="h-10 w-10 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">Customer Portal</span>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-2xl">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-white mb-2">Reset Password</h1>
              <p className="text-white/80 text-sm">
                Enter your email address and we'll send you a reset link
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <Alert className="bg-red-500/20 border-red-400/50 text-white">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              {success && (
                <Alert className="bg-green-500/20 border-green-400/50 text-white">
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    Password reset email sent! Check your inbox.
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-white text-sm font-medium">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading || success}
                  className="bg-white/90 border-white/30 text-slate-900 placeholder:text-slate-500 h-11 focus:bg-white"
                />
              </div>

              <Button
                type="submit"
                className="w-full h-11 bg-[#4169E1] hover:bg-[#3557C7] text-white font-medium shadow-lg"
                disabled={loading || success}
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </Button>
            </form>

            <div className="mt-6">
              <Link
                href="/portal/login"
                className="flex items-center justify-center gap-2 text-white/90 hover:text-white text-sm transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to sign in
              </Link>
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
            Manage Your Insurance Policies
          </h2>
          <p className="text-lg text-white leading-relaxed drop-shadow-md">
            View policies, make payments, and submit service requests - all in one place.
          </p>
        </div>
      </div>
    </div>
  );
}