"use client";

import Link from "next/link";

export const dynamic = "force-dynamic";

export default function VerifyEmail() {
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-background-light dark:bg-background-dark">
      {/* Background with gradient */}
      <div className="absolute inset-0 w-full h-[50vh] lg:h-[60vh] z-0">
        <div
          className="w-full h-full bg-cover bg-center bg-no-repeat opacity-40 grayscale"
          style={{
            backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuBD3AjQI0Lg8lY9Imjibt-A4ScoA3AmxuUK5EEqYXGlOJJYLogG1RG85_08aQXMJLOnbfy3Q4AUqHapnDr__URM7KkQ2mrAlTcZD3nZ3zMa47FJL_yu-Rak62lzED1iw20iEnFpIJO7VdNgM6R993SSB__6tUu02d3mUKdQIHFZYz1p8BgIeVTDGR33Sh5fCwHjBFZRgdcqsBWOzFIb4Xz6FOd0A3LM20--s_HlXDUEDY1a1EgiruHrllAv-8ranaLKbwC5NmRxImyw')`,
          }}
        />
        <div className="absolute inset-0 bg-linear-to-b from-background-dark/40 via-background-dark/80 to-background-dark"></div>
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
            CampusConnect
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

          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-8">
            <p className="text-blue-300 text-sm">
              Please check your inbox and spam folder if you don't see the
              email.
            </p>
          </div>

          <div className="space-y-4">
            <p className="text-gray-400 text-sm">Didn't receive the email?</p>
            <button className="w-full h-12 bg-primary/20 hover:bg-primary/30 text-primary font-bold rounded-lg transition-all duration-200 border border-primary/50">
              Resend Verification Email
            </button>
          </div>

          <Link
            href="/auth/login"
            className="block mt-6 text-primary font-semibold hover:text-blue-400"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
