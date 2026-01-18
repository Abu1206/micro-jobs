"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

interface HeaderProps {
  showNav?: boolean;
  userName?: string;
}

export default function Header({ showNav = true, userName }: HeaderProps) {
  const router = useRouter();
  const supabase = createClient();
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-50 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md border-b border-gray-200 dark:border-white/5">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link
            href={user ? "/dashboard" : "/"}
            className="flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-2xl text-primary">
              school
            </span>
            <span className="text-lg font-bold text-slate-900 dark:text-white">
              Micra Jobs
            </span>
          </Link>

          {showNav && (
            <nav className="hidden md:flex gap-8 items-center">
              {user ? (
                <>
                  <Link
                    href="/dashboard"
                    className="text-slate-700 dark:text-gray-300 hover:text-primary transition-colors font-medium"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/create-opportunity"
                    className="text-slate-700 dark:text-gray-300 hover:text-primary transition-colors font-medium"
                  >
                    Post Opportunity
                  </Link>
                  <Link
                    href="/messages"
                    className="text-slate-700 dark:text-gray-300 hover:text-primary transition-colors font-medium"
                  >
                    Messages
                  </Link>
                  <div className="relative">
                    <button
                      onClick={() => setMenuOpen(!menuOpen)}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                    >
                      <span className="material-symbols-outlined">
                        account_circle
                      </span>
                      <span className="text-slate-900 dark:text-white font-medium">
                        {userName || "Profile"}
                      </span>
                    </button>
                    {menuOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-surface-dark rounded-lg shadow-xl border border-gray-200 dark:border-white/10">
                        <Link
                          href="/profile/setup"
                          className="block px-4 py-2 text-slate-900 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 rounded-t-lg transition-colors"
                        >
                          Edit Profile
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-b-lg transition-colors"
                        >
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <Link
                    href="/guest"
                    className="text-slate-700 dark:text-gray-300 hover:text-primary transition-colors font-medium"
                  >
                    Browse
                  </Link>
                  <Link href="/auth/login">
                    <button className="px-4 py-2 text-primary hover:bg-primary/10 rounded-lg transition-colors font-semibold">
                      Log In
                    </button>
                  </Link>
                  <Link href="/auth/signup">
                    <button className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold">
                      Sign Up
                    </button>
                  </Link>
                </>
              )}
            </nav>
          )}

          {/* Mobile Menu Button */}
          {showNav && (
            <button className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
              <span className="material-symbols-outlined text-slate-900 dark:text-white">
                menu
              </span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
