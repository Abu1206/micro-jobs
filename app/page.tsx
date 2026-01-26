"use client";

import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-between overflow-hidden bg-gradient-to-b from-gray-900 via-gray-800 to-black">
      {/* Background Gradient with fallback pattern */}
      <div className="absolute inset-0 w-full h-[60vh] z-0">
        <div
          className="w-full h-full bg-cover bg-center bg-no-repeat opacity-20"
          style={{
            backgroundImage: `linear-gradient(135deg, rgba(37, 99, 235, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%)`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/30 via-gray-900/70 to-black"></div>
      </div>

      {/* Header with Logo */}
      <div className="relative z-10 w-full pt-16 px-6 flex justify-center">
        <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 shadow-lg">
          <span className="material-symbols-outlined text-white text-2xl">
            school
          </span>
          <span className="text-white font-bold tracking-wide text-sm uppercase">
            Micra jobs
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex w-full flex-col items-center justify-center flex-1 pb-10 pt-10 px-5 max-w-md mx-auto lg:max-w-2xl">
        {/* Headline */}
        <div className="w-full flex flex-col items-center text-center mb-8">
          <h1 className="text-white tracking-tight text-[42px] lg:text-6xl font-extrabold leading-[1.1] mb-4 drop-shadow-sm">
            Unlock more <br />
            <span className="text-primary bg-clip-text">
              Campus opportunities
            </span>
          </h1>
          <p className="text-gray-400 text-base lg:text-lg font-medium leading-relaxed max-w-80 lg:max-w-120">
            The open platform for students to find jobs, events, and community
            opportunities.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="w-full flex flex-col gap-3.5 mb-8 lg:max-w-lg">
          <Link href="/auth/signup">
            <button
              className="group relative flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl h-14 px-5 bg-primary hover:bg-blue-500 transition-all duration-200 shadow-[0_0_20px_rgba(37,99,235,0.3)] active:scale-[0.98]"
              onMouseEnter={() => setHoveredButton("signup")}
              onMouseLeave={() => setHoveredButton(null)}
            >
              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <span className="material-symbols-outlined text-white mr-3 text-[24px]">
                person_add
              </span>
              <span className="text-white text-[17px] font-bold tracking-tight">
                Create Account
              </span>
            </button>
          </Link>

          <Link href="/auth/login">
            <button className="group flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl h-14 px-5 bg-white text-black border border-gray-200 hover:bg-gray-100 transition-all duration-200 active:scale-[0.98]">
              <span className="material-symbols-outlined text-black mr-3 text-[24px]">
                login
              </span>
              <span className="text-black text-[17px] font-bold tracking-tight">
                Log In
              </span>
            </button>
          </Link>

          <Link href="/guest">
            <button className="group flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl h-14 px-5 bg-gray-800 text-white border border-gray-700 hover:bg-gray-700 transition-all duration-200 active:scale-[0.98]">
              <span className="material-symbols-outlined text-white mr-3 text-[24px]">
                explore
              </span>
              <span className="text-white text-[17px] font-bold tracking-tight">
                Browse as Guest
              </span>
            </button>
          </Link>
        </div>

        {/* Footer Links */}
        <div className="flex flex-col items-center gap-5 w-full">
          <p className="text-gray-400 text-sm">
            Join thousands of students finding opportunities
          </p>
        </div>
      </div>
    </div>
  );
}
