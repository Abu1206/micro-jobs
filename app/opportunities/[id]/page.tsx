"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface OpportunityData {
  id: string;
  title: string;
  category: string;
  description: string;
  location: string;
  deadline: string;
  tags: string[];
  media_urls: string[];
  user_id: string;
  created_at: string;
  status: string;
}

interface PostCreator {
  id: string;
  full_name: string;
  year?: string;
  rating?: number;
  endorsements?: number;
  avatar_url?: string;
  verified?: boolean;
}

export default function OpportunityDetails() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [opportunity, setOpportunity] = useState<OpportunityData | null>(null);
  const [creator, setCreator] = useState<PostCreator | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [isExpressing, setIsExpressing] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  const supabase = createClient();

  useEffect(() => {
    const fetchOpportunityAndCreator = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        setCurrentUser(user);

        // Fetch opportunity
        const { data: oppData, error: oppError } = await supabase
          .from("opportunities")
          .select("*")
          .eq("id", id)
          .single();

        if (oppError) throw oppError;
        setOpportunity(oppData);

        // Fetch creator profile
        const { data: profileData, error: profileError } = await supabase
          .from("user_profiles")
          .select("*")
          .eq("user_id", oppData.user_id)
          .single();

        if (!profileError && profileData) {
          setCreator(profileData);
        }
      } catch (err) {
        console.error("Error fetching opportunity:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOpportunityAndCreator();
  }, [id]);

  const handleExpressInterest = async () => {
    if (!currentUser) {
      router.push("/auth/login");
      return;
    }

    setIsExpressing(true);

    try {
      const { error } = await supabase.from("applications").insert({
        user_id: currentUser.id,
        opportunity_id: id,
        status: "pending",
        created_at: new Date().toISOString(),
      });

      if (error) throw error;

      alert("Interest expressed! The poster will be notified.");
    } catch (err: any) {
      console.error("Error expressing interest:", err);
      alert("Failed to express interest. Please try again.");
    } finally {
      setIsExpressing(false);
    }
  };

  const handleSaveOpportunity = async () => {
    if (!currentUser) {
      router.push("/auth/login");
      return;
    }

    try {
      if (isSaved) {
        // Remove from saved
        await supabase
          .from("saved_opportunities")
          .delete()
          .eq("user_id", currentUser.id)
          .eq("opportunity_id", id);
      } else {
        // Add to saved
        await supabase.from("saved_opportunities").insert({
          user_id: currentUser.id,
          opportunity_id: id,
          created_at: new Date().toISOString(),
        });
      }

      setIsSaved(!isSaved);
    } catch (err) {
      console.error("Error saving opportunity:", err);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return "Just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background-dark">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  if (!opportunity) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background-dark">
        <div className="text-center">
          <h1 className="text-white text-2xl font-bold mb-4">Post not found</h1>
          <Link href="/dashboard">
            <button className="px-6 py-3 bg-primary text-white rounded-lg font-semibold">
              Back to Dashboard
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex justify-center min-h-screen bg-black">
      <div className="relative flex h-full min-h-screen w-full max-w-2xl flex-col bg-background-light dark:bg-background-dark overflow-hidden">
        {/* Header */}
        <header className="fixed top-0 z-50 w-full max-w-2xl flex items-center justify-between px-4 py-3 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm border-b border-black/5 dark:border-white/10">
          <Link href="/dashboard">
            <button className="flex items-center justify-center size-10 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-slate-800 dark:text-white">
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSaveOpportunity}
              className="flex items-center justify-center size-10 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-slate-800 dark:text-white"
            >
              <span
                className={`material-symbols-outlined ${
                  isSaved ? "icon-filled" : ""
                }`}
              >
                {isSaved ? "bookmark" : "bookmark_border"}
              </span>
            </button>
            <button className="flex items-center justify-center size-10 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-slate-800 dark:text-white">
              <span className="material-symbols-outlined">share</span>
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto pt-20 pb-32 px-5 no-scrollbar">
          {/* Category Badge */}
          <div className="flex mb-4">
            <div className="inline-flex items-center px-3 py-1.5 rounded-lg border border-primary/30 bg-primary/10 text-primary text-xs font-bold tracking-wide uppercase">
              {opportunity.category === "gigs"
                ? "Part-time Job"
                : opportunity.category === "events"
                ? "Campus Event"
                : opportunity.category === "collab"
                ? "Collaboration"
                : opportunity.category === "housing"
                ? "Housing"
                : "Marketplace"}
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white leading-tight mb-4 tracking-tight">
            {opportunity.title}
          </h1>

          {/* Location and Time */}
          <div className="flex flex-col gap-2 mb-8">
            {opportunity.location && (
              <div className="flex items-center gap-2 text-slate-500 dark:text-gray-400">
                <span className="material-symbols-outlined text-[20px]">
                  location_on
                </span>
                <span className="text-sm font-medium">
                  {opportunity.location}
                </span>
              </div>
            )}
            <div className="flex items-center gap-2 text-slate-500 dark:text-gray-400">
              <span className="material-symbols-outlined text-[20px]">
                schedule
              </span>
              <span className="text-sm font-medium">
                Posted {getTimeAgo(opportunity.created_at)}
              </span>
            </div>
          </div>

          {/* Deadline Card */}
          {opportunity.deadline && (
            <div className="mb-8 p-4 rounded-xl bg-gray-50 dark:bg-surface-dark border-l-4 border-primary flex items-start gap-4 shadow-sm">
              <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
                <span className="material-symbols-outlined">event</span>
              </div>
              <div>
                <p className="text-slate-900 dark:text-white font-bold text-base">
                  Application Deadline
                </p>
                <p className="text-slate-500 dark:text-gray-400 text-sm mt-0.5">
                  {formatDate(opportunity.deadline)} • 5:00 PM
                </p>
              </div>
            </div>
          )}

          {/* Creator Card */}
          {creator && (
            <Link href={`/profile/${creator.id}`}>
              <div className="mb-8 relative group cursor-pointer">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/50 to-blue-600/50 rounded-2xl opacity-20 group-hover:opacity-40 transition duration-300 blur"></div>
                <div className="relative flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/10">
                  <div className="relative">
                    <img
                      alt={creator.full_name}
                      className="size-14 rounded-full object-cover border-2 border-white dark:border-black"
                      src={
                        creator.avatar_url ||
                        "https://via.placeholder.com/56?text=User"
                      }
                    />
                    {creator.verified && (
                      <div
                        className="absolute -bottom-1 -right-1 bg-primary text-white rounded-full p-0.5"
                        title="Verified Student"
                      >
                        <span className="material-symbols-outlined text-[14px] font-bold block">
                          check
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <h3 className="text-slate-900 dark:text-white font-bold text-base truncate">
                        {creator.full_name}
                      </h3>
                      {creator.year && (
                        <span className="text-xs text-slate-400 dark:text-slate-500 font-medium px-1.5 py-0.5 rounded bg-slate-100 dark:bg-white/10">
                          {creator.year}
                        </span>
                      )}
                    </div>
                    {creator.rating && (
                      <div className="flex items-center gap-1 text-sm text-slate-500 dark:text-gray-400">
                        <span className="material-symbols-outlined text-[16px] text-yellow-400 icon-filled">
                          star
                        </span>
                        <span className="font-semibold text-slate-700 dark:text-white">
                          {creator.rating}
                        </span>
                        <span>({creator.endorsements || 0} endorsements)</span>
                      </div>
                    )}
                  </div>
                  <span className="material-symbols-outlined text-slate-300 dark:text-slate-600">
                    chevron_right
                  </span>
                </div>
              </div>
            </Link>
          )}

          {/* About Section */}
          <div className="mb-8">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
              About the Opportunity
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 text-base leading-relaxed">
              <p className="whitespace-pre-wrap">{opportunity.description}</p>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-10">
            {opportunity.tags.map((tag) => (
              <button
                key={tag}
                className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 text-sm font-medium hover:bg-slate-200 dark:hover:bg-white/20 transition-colors"
              >
                #{tag}
              </button>
            ))}
          </div>

          {/* Report Button */}
          <div className="flex justify-center mb-4">
            <button className="flex items-center gap-2 text-slate-400 dark:text-slate-500 text-sm font-medium hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
              <span className="material-symbols-outlined text-[18px]">
                flag
              </span>
              Report this post
            </button>
          </div>
        </main>

        {/* Bottom Action Bar */}
        <div className="fixed bottom-0 w-full max-w-2xl p-4 pt-4 pb-8 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-xl border-t border-slate-200 dark:border-white/10 z-40">
          <button
            onClick={handleExpressInterest}
            disabled={isExpressing}
            className="w-full h-14 bg-primary hover:bg-blue-600 active:scale-[0.98] transition-all rounded-xl flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(59,130,246,0.3)] disabled:opacity-50 disabled:cursor-not-allowed text-white font-extrabold text-lg tracking-wide"
          >
            <span>
              {isExpressing ? "Expressing Interest..." : "Express Interest"}
            </span>
            <span className="material-symbols-outlined font-bold">
              {isExpressing ? "hourglass_empty" : "send"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
