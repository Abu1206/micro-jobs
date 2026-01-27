"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export const dynamic = "force-dynamic";

export default function VerifyEmail() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [canResend, setCanResend] = useState(true);
  const [resendCountdown, setResendCountdown] = useState(0);
  const [userEmail, setUserEmail] = useState("");
  const router = useRouter();
  const supabase = createClient();

  // Check if user is authenticated (already verified)
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/check");
        const data = await res.json();

        if (!data.authenticated) {
          router.push("/auth/signup");
          return;
        }

        if (data.user?.email_confirmed_at) {
          router.push("/dashboard");
          return;
        }

        setUserEmail(data.user?.email || "");
      } catch (err) {
        console.error("Auth check failed:", err);
        router.push("/auth/signup");
      }
    };
    checkAuth();
  }, [router]);

  // Resend verification email
  const handleResendEmail = async () => {
    if (!canResend) return;

    setLoading(true);
    setError("");
    setMessage("");

    try {
      if (!userEmail) {
        setError("Please sign up first");
        return;
      }

      // Resend confirmation email using Supabase SDK
      const { error } = await supabase.auth.resendEnumConfirmation({
        type: "signup",
        email: userEmail,
      });

      if (error) throw error;

      setMessage("Verification email sent! Check your inbox.");
      setCanResend(false);
      setResendCountdown(60);
    } catch (err: any) {
      console.error("Resend error:", err);
      setError(err.message || "Failed to resend email");
    } finally {
      setLoading(false);
    }
  };

  // Countdown timer for resend
  useEffect(() => {
    if (resendCountdown <= 0) {
      setCanResend(true);
      return;
    }

    const timer = setTimeout(
      () => setResendCountdown(resendCountdown - 1),
      1000,
    );
    return () => clearTimeout(timer);
  }, [resendCountdown]);

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-linear-to-b from-gray-900 via-gray-800 to-black">
      {/* Background with gradient fallback */}
      <div className="absolute inset-0 w-full h-[50vh] lg:h-[60vh] z-0">
        <div
          className="w-full h-full bg-cover bg-center bg-no-repeat opacity-20"
          style={{
            backgroundImage: `linear-gradient(135deg, rgba(37, 99, 235, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%)`,
          }}
        />
        <div className="absolute inset-0 bg-linear-to-b from-gray-900/40 via-gray-900/70 to-black"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 w-full pt-8 px-6 flex justify-center lg:px-12">
        <Link
          href="/"
          className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 shadow-lg hover:bg-black/50 transition-colors"
        >
          <span className="material-symbols-outlined text-white text-2xl">
            school
          </span>
          <span className="text-white font-bold tracking-wide text-sm uppercase">
            Micra Jobs
          </span>
        </Link>
      </div>

      {/* Content */}
      <div className="relative z-10 flex w-full flex-col items-center justify-center flex-1 py-12 px-5">
        <div className="w-full max-w-md lg:max-w-lg bg-background-dark/80 backdrop-blur-sm border border-white/10 rounded-2xl p-8 lg:p-12 text-center">
          <div className="mb-6 flex justify-center">
            <div className="w-16 h-16 lg:w-20 lg:h-20 bg-primary/20 rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-4xl lg:text-5xl">
                mail_outline
              </span>
            </div>
          </div>

          <h1 className="text-white text-3xl lg:text-4xl font-bold mb-2">
            Verify Your Email
          </h1>
          <p className="text-gray-400 text-base lg:text-lg mb-4">
            We've sent a verification link to your email address. Click the link
            to complete your registration.
          </p>

          {userEmail && (
            <p className="text-gray-500 text-sm mb-6">
              Email: <span className="text-gray-300">{userEmail}</span>
            </p>
          )}

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          {message && (
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 mb-6">
              <p className="text-green-300 text-sm">{message}</p>
            </div>
          )}

          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-8">
            <p className="text-blue-300 text-sm">
              Please check your inbox and spam folder if you don't see the
              email. Click the link in the email to verify your account and
              complete signup.
            </p>
          </div>

          <div className="space-y-4">
            <p className="text-gray-400 text-sm">Didn't receive the email?</p>
            <button
              onClick={handleResendEmail}
              disabled={!canResend || loading}
              className="w-full h-12 bg-primary/20 hover:bg-primary/30 disabled:opacity-50 disabled:cursor-not-allowed text-primary font-bold rounded-lg transition-all duration-200 border border-primary/50"
            >
              {loading
                ? "Sending..."
                : canResend
                  ? "Resend Verification Email"
                  : `Resend in ${resendCountdown}s`}
            </button>
          </div>

          <Link
            href="/auth/login"
            className="block mt-6 text-primary font-semibold hover:text-blue-400 text-center"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
