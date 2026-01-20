"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
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
  user_profiles?: {
    full_name: string;
    avatar_url?: string;
  };
}

export default function GuestBrowse() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const supabase = createClient();

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        const { data, error } = await supabase
          .from("opportunities")
          .select(
            `
            *,
            user_profiles (
              full_name,
              avatar_url
            )
          `,
          )
          .eq("status", "active")
          .order("created_at", { ascending: false });

        if (!error && data) {
          setOpportunities(data as Opportunity[]);
        }
      } catch (err) {
        console.error("Error fetching opportunities:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOpportunities();
  }, []);

  const filteredOpportunities = opportunities.filter((opp) => {
    const matchesSearch = opp.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || opp.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    "all",
    "gigs",
    "collab",
    "events",
    "housing",
    "marketplace",
  ];

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md border-b border-gray-200 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-6">
            <Link href="/" className="flex items-center gap-2">
              <span className="material-symbols-outlined text-2xl text-primary">
                school
              </span>
              <span className="text-xl font-bold text-slate-900 dark:text-white">
                Micra Jobs
              </span>
            </Link>
            <div className="flex gap-4">
              <Link href="/auth/login">
                <button className="px-6 py-2 text-slate-900 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors">
                  Log In
                </button>
              </Link>
              <Link href="/auth/signup">
                <button className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold">
                  Sign Up
                </button>
              </Link>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex gap-4 items-center">
            <input
              type="text"
              placeholder="Search opportunities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-2 rounded-lg bg-white dark:bg-surface-dark border border-gray-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Categories */}
        <div className="mb-8 flex gap-2 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? "bg-primary text-white"
                  : "bg-gray-100 dark:bg-white/10 text-slate-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-white/20"
              }`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        {/* Opportunities Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="text-gray-600 dark:text-gray-400">Loading...</div>
          </div>
        ) : filteredOpportunities.length === 0 ? (
          <div className="text-center py-12">
            <span className="material-symbols-outlined text-5xl text-gray-400 mb-4 block">
              search_off
            </span>
            <p className="text-gray-600 dark:text-gray-400">
              No opportunities found. Check back soon!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredOpportunities.map((opp) => (
              <Link key={opp.id} href={`/opportunities/${opp.id}`}>
                <div className="group bg-white dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-white/10 p-4 hover:border-primary dark:hover:border-primary/50 transition-all hover:shadow-lg cursor-pointer">
                  {/* Media Preview */}
                  {opp.media_urls?.[0] && (
                    <div className="w-full h-40 rounded-lg mb-4 overflow-hidden">
                      <img
                        src={opp.media_urls[0]}
                        alt={opp.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                  )}

                  <h3 className="font-bold text-slate-900 dark:text-white mb-2 line-clamp-2">
                    {opp.title}
                  </h3>

                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                    {opp.description}
                  </p>

                  <div className="flex items-center gap-4 mb-3 text-sm text-gray-600 dark:text-gray-400">
                    {opp.location && (
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[18px]">
                          location_on
                        </span>
                        {opp.location}
                      </span>
                    )}
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {opp.tags?.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Creator Profile */}
                  {opp.user_profiles && (
                    <Link
                      href={`/profile/${opp.user_id}`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="mb-3 p-2.5 rounded-lg bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors group/creator flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-300 dark:bg-gray-700 flex-shrink-0">
                          {opp.user_profiles.avatar_url ? (
                            <img
                              src={opp.user_profiles.avatar_url}
                              alt={opp.user_profiles.full_name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-primary/20 text-primary font-bold text-xs">
                              {opp.user_profiles.full_name?.charAt(0) || "U"}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover/creator:text-primary transition-colors">
                            {opp.user_profiles.full_name || "Anonymous"}
                          </p>
                        </div>
                        <span className="material-symbols-outlined text-slate-400 group-hover/creator:text-primary transition-colors text-sm flex-shrink-0">
                          arrow_forward
                        </span>
                      </div>
                    </Link>
                  )}

                  <div className="pt-3 border-t border-gray-200 dark:border-white/10 flex items-center justify-between">
                    <span className="text-xs text-gray-500 dark:text-gray-500">
                      {new Date(opp.created_at).toLocaleDateString()}
                    </span>
                    <span className="material-symbols-outlined text-primary text-sm group-hover:translate-x-1 transition-transform">
                      arrow_forward
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
