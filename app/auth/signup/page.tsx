"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export const dynamic = "force-dynamic";

export default function SignUp() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          fullName: formData.fullName,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Sign up failed");
      }

      router.push("/auth/verify-email");
    } catch (err: any) {
      setError(err.message || "An error occurred during sign up");
    } finally {
      setLoading(false);
    }
  };

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
      <div className="relative z-10 w-full pt-8 px-6 flex justify-between items-center lg:px-12">
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
        <Link
          href="/auth/login"
          className="text-primary font-semibold hover:text-blue-400 transition-colors text-sm lg:text-base"
        >
          Have an account? Log In
        </Link>
      </div>

      {/* Form Container */}
      <div className="relative z-10 flex w-full flex-col items-center justify-center flex-1 py-12 px-5">
        <div className="w-full max-w-md lg:max-w-lg bg-background-dark/80 backdrop-blur-sm border border-white/10 rounded-2xl p-8 lg:p-12">
          <h1 className="text-white text-3xl lg:text-4xl font-bold mb-2">
            Create Account
          </h1>
          <p className="text-gray-400 text-sm lg:text-base mb-8">
            Join Micra jobs to find jobs, events, and opportunities
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-white text-sm font-semibold mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:bg-white/10 transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-white text-sm font-semibold mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:bg-white/10 transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-white text-sm font-semibold mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a strong password"
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:bg-white/10 transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-white text-sm font-semibold mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:bg-white/10 transition-colors"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-primary hover:bg-blue-500 text-white font-bold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(37,99,235,0.3)]"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <p className="text-center text-gray-400 text-sm mt-6">
            By creating an account, you agree to our{" "}
            <Link href="/terms" className="text-primary hover:text-blue-400">
              Terms of Service
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
