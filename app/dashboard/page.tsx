"use client";

import Link from "next/link";
import { useState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface Opportunity {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  media_urls: string[];
  location: string;
  deadline: string;
  created_at: string;
  user_id: string;
}

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);

      // Fetch opportunities from database
      if (user) {
        const { data, error } = await supabase
          .from("opportunities")
          .select("*")
          .eq("status", "active")
          .order("created_at", { ascending: false });

        if (!error && data) {
          setOpportunities(data as Opportunity[]);
        } else {
          console.error("Error fetching opportunities:", error);
        }
      }

      setLoading(false);
    };

    getUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background-dark flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background-dark flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-white text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-gray-400 mb-6">
            Please log in to access your dashboard
          </p>
          <Link href="/auth/login">
            <button className="px-6 py-3 bg-primary hover:bg-blue-500 text-white font-bold rounded-lg">
              Go to Login
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const firstName = user.user_metadata?.full_name?.split(" ")[0] || "there";

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark transition-colors duration-200">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md border-b border-gray-200 dark:border-white/5 pb-2">
        <div className="flex items-center justify-between px-4 pt-4 pb-2 max-w-7xl mx-auto">
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-2xl">
              school
            </span>
            <h1 className="text-slate-900 dark:text-white text-xl font-extrabold tracking-tight">
              Micra Jobs
            </h1>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/create-opportunity">
              <button className="hidden md:flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors font-medium">
                <span className="material-symbols-outlined">add</span>
                Post Opportunity
              </button>
            </Link>
            <Link href="/messages">
              <button className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors relative">
                <span className="material-symbols-outlined text-slate-900 dark:text-white">
                  mail
                </span>
                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-primary rounded-full border-2 border-background-light dark:border-background-dark"></span>
              </button>
            </Link>
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
              >
                <span className="material-symbols-outlined text-slate-900 dark:text-white">
                  account_circle
                </span>
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-surface-dark rounded-lg shadow-xl border border-gray-200 dark:border-white/10 z-50">
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
          </div>
        </div>

        {/* Search Bar */}
        <div className="px-4 mt-2 max-w-7xl mx-auto hidden lg:block">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="material-symbols-outlined text-text-secondary-light dark:text-text-secondary-dark">
                search
              </span>
            </div>
            <input
              className="block w-full pl-10 pr-3 py-3 rounded-xl border-none bg-surface-light dark:bg-surface-dark text-slate-900 dark:text-white placeholder-text-secondary-light dark:placeholder-text-secondary-dark focus:ring-2 focus:ring-primary shadow-sm"
              placeholder="Search opportunities, events..."
              type="text"
            />
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-3 px-4 pt-3 pb-1 overflow-x-auto no-scrollbar max-w-7xl mx-auto">
          <button className="flex shrink-0 items-center justify-center h-9 w-9 rounded-lg bg-surface-light dark:bg-surface-dark border border-gray-200 dark:border-white/10 text-slate-900 dark:text-white shadow-sm hover:bg-gray-50 dark:hover:bg-white/5">
            <span className="material-symbols-outlined text-[20px]">tune</span>
          </button>
          {["All", "Trending", "Local", "Remote", "Hackathons"].map(
            (filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`flex h-9 shrink-0 items-center px-4 rounded-lg text-sm font-medium transition-colors ${
                  selectedFilter === filter
                    ? "bg-slate-900 dark:bg-white text-white dark:text-background-dark"
                    : "bg-surface-light dark:bg-surface-dark border border-gray-200 dark:border-white/5 text-slate-600 dark:text-white hover:bg-gray-50 dark:hover:bg-white/5"
                }`}
              >
                {filter}
              </button>
            ),
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-col gap-6 px-4 pt-4 pb-28 max-w-7xl mx-auto lg:pb-8">
        <div className="lg:hidden">
          <h2 className="text-slate-900 dark:text-white text-2xl font-bold tracking-tight">
            Good Morning, {firstName}
          </h2>
          <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm mt-1">
            Here's what's happening around your campus.
          </p>
        </div>

        <div className="hidden lg:block">
          <h2 className="text-slate-900 dark:text-white text-3xl font-bold tracking-tight mb-2">
            Good Morning, {firstName}
          </h2>
          <p className="text-text-secondary-light dark:text-text-secondary-dark text-base">
            Here's what's happening around your campus.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {loading ? (
            <div className="col-span-full text-center py-8 text-gray-400">
              Loading opportunities...
            </div>
          ) : opportunities.length === 0 ? (
            <div className="col-span-full text-center py-8 text-gray-400">
              No opportunities found. Check back soon!
            </div>
          ) : (
            opportunities.map((opp) => (
              <Link key={opp.id} href={`/opportunities/${opp.id}`}>
                <article className="flex flex-col rounded-2xl bg-surface-light dark:bg-surface-dark shadow-[0_2px_8px_rgba(0,0,0,0.08)] overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                  {opp.media_urls && opp.media_urls.length > 0 ? (
                    <div
                      className="h-40 w-full bg-cover bg-center"
                      style={{
                        backgroundImage: `url('${opp.media_urls[0]}')`,
                      }}
                    ></div>
                  ) : (
                    <div className="h-40 w-full bg-linear-to-br from-primary/20 to-primary/5"></div>
                  )}
                  <div className="p-4 flex flex-col gap-3">
                    <div>
                      <h3 className="text-slate-900 dark:text-white text-lg font-bold leading-tight line-clamp-2">
                        {opp.title}
                      </h3>
                      <p className="text-text-secondary-light dark:text-text-secondary-dark font-medium text-sm mt-1">
                        {opp.location}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mt-2 line-clamp-2">
                        {opp.description}
                      </p>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex flex-wrap gap-1">
                        {opp.tags?.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="text-xs font-semibold bg-blue-500/10 text-blue-500 px-2 py-0.5 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <button className="text-primary text-sm font-bold hover:underline">
                        View Details
                      </button>
                    </div>
                  </div>
                </article>
              </Link>
            ))
          )}
        </div>
      </main>

      {/* Floating Action Button */}
      <Link href="/create-opportunity">
        <button className="fixed bottom-24 lg:bottom-8 right-4 lg:right-8 h-14 w-14 rounded-full bg-primary text-white shadow-lg shadow-primary/25 flex items-center justify-center z-40 hover:scale-105 transition-transform cursor-pointer">
          <span className="material-symbols-outlined text-[32px]">add</span>
        </button>
      </Link>

      {/* Bottom Navigation (Mobile Only) */}
      <nav className="fixed bottom-0 w-full bg-surface-light dark:bg-surface-dark border-t border-gray-200 dark:border-white/5 pb-6 pt-3 px-6 z-50 lg:hidden">
        <ul className="flex justify-between items-center max-w-7xl mx-auto">
          <li>
            <a
              className="flex flex-col items-center gap-1 group"
              href="/dashboard"
            >
              <span className="material-symbols-outlined text-primary text-[28px] group-hover:scale-110 transition-transform">
                home
              </span>
              <span className="text-[10px] font-bold text-primary">Home</span>
            </a>
          </li>
          <li>
            <a className="flex flex-col items-center gap-1 group" href="/guest">
              <span className="material-symbols-outlined text-gray-400 text-[28px] group-hover:text-primary transition-colors">
                explore
              </span>
              <span className="text-[10px] font-medium text-gray-400 group-hover:text-primary transition-colors">
                Explore
              </span>
            </a>
          </li>
          <li>
            <Link
              className="flex flex-col items-center gap-1 group"
              href="/messages"
            >
              <div className="relative">
                <span className="material-symbols-outlined text-gray-400 text-[28px] group-hover:text-primary transition-colors">
                  chat_bubble
                </span>
                <span className="absolute -top-1 -right-1 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-surface-light dark:border-surface-dark"></span>
              </div>
              <span className="text-[10px] font-medium text-gray-400 group-hover:text-primary transition-colors">
                Messages
              </span>
            </Link>
          </li>
          <li>
            <a
              className="flex flex-col items-center gap-1 group"
              href="/profile/current"
            >
              <span className="material-symbols-outlined text-gray-400 text-[28px] group-hover:text-primary transition-colors">
                person
              </span>
              <span className="text-[10px] font-medium text-gray-400 group-hover:text-primary transition-colors">
                Profile
              </span>
            </a>
          </li>
        </ul>
      </nav>

      {/* Desktop Navbar */}
      <nav className="hidden lg:fixed lg:flex bottom-0 right-0 w-64 h-full bg-surface-light dark:bg-surface-dark border-l border-gray-200 dark:border-white/5 p-6 flex-col z-40">
        <div className="flex items-center gap-2 mb-8">
          <span className="material-symbols-outlined text-primary text-2xl">
            school
          </span>
          <span className="text-slate-900 dark:text-white font-bold">
            CampusConnect
          </span>
        </div>

        {/* Navigation Tabs */}
        <div className="flex-1 space-y-2">
          <Link href="/dashboard">
            <button className="w-full text-left px-4 py-3 rounded-lg bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 transition-colors font-semibold text-sm flex items-center gap-2">
              <span className="material-symbols-outlined">home</span>
              Dashboard
            </button>
          </Link>
          <Link href="/guest">
            <button className="w-full text-left px-4 py-3 rounded-lg text-slate-600 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors font-semibold text-sm flex items-center gap-2">
              <span className="material-symbols-outlined">explore</span>
              Explore
            </button>
          </Link>
          <Link href="/messages">
            <button className="w-full text-left px-4 py-3 rounded-lg text-slate-600 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors font-semibold text-sm flex items-center gap-2">
              <span className="material-symbols-outlined">chat_bubble</span>
              Messages
            </button>
          </Link>
          <Link href="/profile/current">
            <button className="w-full text-left px-4 py-3 rounded-lg text-slate-600 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors font-semibold text-sm flex items-center gap-2">
              <span className="material-symbols-outlined">person</span>
              Profile
            </button>
          </Link>
        </div>

        <div className="space-y-2 pb-4 border-b border-gray-200 dark:border-white/10">
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              window.location.href = "/";
            }}
            className="w-full text-left px-4 py-3 rounded-lg text-slate-600 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors font-semibold text-sm flex items-center gap-2"
          >
            <span className="material-symbols-outlined">logout</span>
            Logout
          </button>
        </div>

        <div className="border-t border-gray-200 dark:border-white/10 pt-4">
          <div className="text-center">
            <p className="text-slate-900 dark:text-white font-semibold text-sm">
              {user?.email?.split("@")[0]}
            </p>
            <p className="text-text-secondary-light dark:text-text-secondary-dark text-xs">
              {user?.email}
            </p>
          </div>
        </div>
      </nav>
    </div>
  );
}
