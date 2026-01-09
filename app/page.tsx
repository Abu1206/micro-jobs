'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Home() {
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-between overflow-hidden bg-background-light dark:bg-background-dark text-[#111418] dark:text-white">
      {/* Background Image with Gradient Overlay */}
      <div className="absolute inset-0 w-full h-[60vh] z-0">
        <div
          className="w-full h-full bg-cover bg-center bg-no-repeat opacity-60 grayscale"
          style={{
            backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuBD3AjQI0Lg8lY9Imjibt-A4ScoA3AmxuUK5EEqYXGlOJJYLogG1RG85_08aQXMJLOnbfy3Q4AUqHapnDr__URM7KkQ2mrAlTcZD3nZ3zMa47FJL_yu-Rak62lzED1iw20iEnFpIJO7VdNgM6R993SSB__6tUu02d3mUKdQIHFZYz1p8BgIeVTDGR33Sh5fCwHjBFZRgdcqsBWOzFIb4Xz6FOd0A3LM20--s_HlXDUEDY1a1EgiruHrllAv-8ranaLKbwC5NmRxImyw')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background-dark/30 via-background-dark/90 to-background-dark"></div>
      </div>

      {/* Header with Logo */}
      <div className="relative z-10 w-full pt-16 px-6 flex justify-center">
        <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 shadow-lg">
          <span className="material-symbols-outlined text-white text-2xl">school</span>
          <span className="text-white font-bold tracking-wide text-sm uppercase">
            CampusConnect
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex w-full flex-col items-center justify-end flex-1 pb-10 pt-10 px-5 max-w-md mx-auto lg:max-w-2xl">
        {/* Headline */}
        <div className="w-full flex flex-col items-center text-center mb-8">
          <h1 className="text-white tracking-tight text-[42px] lg:text-6xl font-extrabold leading-[1.1] mb-4 drop-shadow-sm">
            Unlock Your <br />
            <span className="text-primary bg-clip-text">Campus Life</span>
          </h1>
          <p className="text-gray-400 text-base lg:text-lg font-medium leading-relaxed max-w-[320px] lg:max-w-[480px]">
            The open platform for students to find jobs, events, and community opportunities.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="w-full flex flex-col gap-3.5 mb-8 lg:max-w-lg">
          <Link href="/auth/signup">
            <button
              className="group relative flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl h-[56px] px-5 bg-primary hover:bg-blue-500 transition-all duration-200 shadow-[0_0_20px_rgba(37,99,235,0.3)] active:scale-[0.98]"
              onMouseEnter={() => setHoveredButton('signup')}
              onMouseLeave={() => setHoveredButton(null)}
            >
              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <span className="material-symbols-outlined text-white mr-3 text-[24px]">badge</span>
              <span className="text-white text-[17px] font-bold tracking-tight">
                Connect with School ID
              </span>
            </button>
          </Link>

          <Link href="/auth/email">
            <button className="group flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl h-[56px] px-5 bg-white text-black border border-gray-200 hover:bg-gray-100 transition-all duration-200 active:scale-[0.98]">
              <span className="material-symbols-outlined text-black mr-3 text-[24px]">mail</span>
              <span className="text-black text-[17px] font-bold tracking-tight">
                Continue with Email
              </span>
            </button>
          </Link>
        </div>

        {/* Footer Links */}
        <div className="flex flex-col items-center gap-5 w-full">
          <div className="flex items-center gap-1.5 text-sm text-gray-400">
            <span>Already have an account?</span>
            <Link
              href="/auth/login"
              className="text-primary font-bold hover:text-blue-400 transition-colors"
            >
              Log In
            </Link>
          </div>
          <Link href="/guest">
            <button className="text-xs font-semibold text-gray-500 hover:text-white uppercase tracking-widest transition-colors py-2">
              Browse as Guest
            </button>
          </Link>
        </div>

        {/* Footer Credits */}
        <div className="mt-10 text-center text-sm text-gray-500">
          <p>
            Explore more{' '}
            <a
              href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              className="font-medium text-blue-400 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Templates
            </a>{' '}
            or the{' '}
            <a
              href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              className="font-medium text-blue-400 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learning
            </a>{' '}
            center.
          </p>
        </div>
      </div>
    </div>
  );
}
