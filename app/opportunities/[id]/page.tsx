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

  // Mock data for development
  const MOCK_OPPORTUNITIES: Record<string, OpportunityData> = {
    "1": {
      id: "1",
      title: "UI/UX Designer for Student Startup",
      category: "gigs",
      description:
        "We are looking for a talented UI/UX Designer to join our team. You will be responsible for designing user interfaces for our mobile and web applications.\n\nRequirements:\n- Strong portfolio of UI/UX work\n- Proficiency in Figma or Adobe XD\n- Understanding of user-centered design principles\n- Excellent communication skills",
      location: "Online",
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      tags: ["Design", "Remote", "Paid"],
      media_urls: [
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBDrl8vSVia_48qHfvVVvhX8F7TGgWCLt58orNXOdBr06Ofcyrh1oivf9C5rp3qph73xHQQVM2wxLQ--UAxOPJ_oS56UMR2agy8SRpgUoxx66DXBm_QoRsWNiwIcJg-6tOyjOJc-KgTVAJhepAv-KomFgcl3u-Tb1dm16de1y6dqoTXDBEWIdXpEVV-UcOJHa9uE_e-PqsCxMoAm-fnZ55ENDKr5VT_elFQt2sFV86yutStOudZynRme2KEpxlg6gDpbCIG_SyBX4wM",
      ],
      user_id: "mock-user",
      created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      status: "active",
    },
    "2": {
      id: "2",
      title: "Annual Campus Hackathon 2024",
      category: "events",
      description:
        "Join us for the biggest hackathon of the year! This is your chance to showcase your coding skills, meet amazing developers, and potentially win great prizes.\n\nSchedule:\n- Day 1: Opening ceremony\n- Day 2-3: Hacking\n- Day 4: Awards\n\nPrizes: Up to $5000",
      location: "Student Center, Main Hall",
      deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      tags: ["Hackathon", "Coding", "Competition"],
      media_urls: [
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCZI9zTe_nG7qMvnV0aqI8A0MrNFRsrJOw7gdwQRnjmvO0css6y858KFFFgud1kv3r9F-maeIisRZ4crLdfsdVWOzLKiT0zpBLvnv7FcKUWuy9ilEpzg1-ic6WvYpD6h4Ewpfsv4e0hBCPWcFvf2vljOUt5TAj7q5Q_MrU93-C8O8pO4cEsxXi1FE3Agd_UOy3vHixPOXoDWwcXWVgWEN-_UOa_JY4fAQpCaaTzo_PQ5_J-sauAbxK77rNZHqBtITtSBGNhap9NIAhM",
      ],
      user_id: "mock-user",
      created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      status: "active",
    },
  };

  const MOCK_CREATORS: Record<string, PostCreator> = {
    "mock-user": {
      id: "mock-user",
      full_name: "Alex Johnson",
      year: "3rd Year",
      rating: 4.8,
      endorsements: 12,
      avatar_url:
        "https://api.dicebear.com/7.x/avataaars/svg?seed=alex@example.com",
      verified: true,
    },
  };

  useEffect(() => {
    const fetchOpportunityAndCreator = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        setCurrentUser(user);

        // Try to fetch from database
        const { data: oppData, error: oppError } = await supabase
          .from("opportunities")
          .select("*")
          .eq("id", id)
          .single();

        if (oppError || !oppData) {
          // Fallback to mock data for development
          console.log("Using mock data for opportunity:", id);
          const mockOpp = MOCK_OPPORTUNITIES[id];
          if (mockOpp) {
            setOpportunity(mockOpp);
            const mockCreator = MOCK_CREATORS[mockOpp.user_id];
            if (mockCreator) {
              setCreator(mockCreator);
            }
          } else {
            throw new Error(`Opportunity with ID ${id} not found`);
          }
        } else {
          setOpportunity(oppData as any);

          // Fetch creator profile
          const { data: profileData, error: profileError } = await supabase
            .from("user_profiles")
            .select("*")
            .eq("user_id", (oppData as any).user_id)
            .single();

          if (!profileError && profileData) {
            setCreator(profileData);
          }
        }
      } catch (err: any) {
        console.error("Error fetching opportunity:", err?.message || err);
        // Continue with loading state set to false
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
            <div className="mb-8 p-6 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-l-4 border-primary flex items-start gap-4 shadow-md hover:shadow-lg transition-shadow">
              <div className="p-3 rounded-lg bg-primary/20 text-primary shrink-0">
                <span className="material-symbols-outlined text-[28px]">
                  calendar_month
                </span>
              </div>
              <div className="flex-1">
                <p className="text-slate-900 dark:text-white font-bold text-lg">
                  Application Deadline
                </p>
                <div className="flex flex-wrap gap-4 mt-2">
                  <div>
                    <p className="text-slate-600 dark:text-gray-400 text-xs uppercase tracking-wide font-semibold">
                      Date & Time
                    </p>
                    <p className="text-slate-900 dark:text-white font-semibold text-base mt-1">
                      {formatDate(opportunity.deadline)} • 5:00 PM
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-600 dark:text-gray-400 text-xs uppercase tracking-wide font-semibold">
                      Time Remaining
                    </p>
                    <p className="text-primary font-bold text-base mt-1">
                      {Math.max(
                        0,
                        Math.ceil(
                          (new Date(opportunity.deadline).getTime() -
                            new Date().getTime()) /
                            (1000 * 60 * 60 * 24),
                        ),
                      )}{" "}
                      days left
                    </p>
                  </div>
                </div>
              </div>
              <button className="shrink-0 px-4 py-2 bg-primary text-white rounded-lg font-semibold text-sm hover:bg-blue-600 transition-colors">
                Add to Calendar
              </button>
            </div>
          )}

          {/* Media Gallery */}
          {opportunity.media_urls && opportunity.media_urls.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                Media
              </h2>
              <div className="grid grid-cols-1 gap-4">
                {opportunity.media_urls.map((url, index) => (
                  <div
                    key={index}
                    className="relative rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 aspect-video"
                  >
                    <img
                      src={url}
                      alt={`Opportunity media ${index + 1}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Creator Card */}
          {creator && (
            <Link href={`/profile/${creator.id}`}>
              <div className="mb-8 relative group cursor-pointer">
                <div className="absolute -inset-0.5 bg-linear-to-r from-primary/50 to-blue-600/50 rounded-2xl opacity-20 group-hover:opacity-40 transition duration-300 blur"></div>
                <div className="relative flex items-center justify-between gap-4 p-6 rounded-2xl bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/10">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="relative">
                      <img
                        alt={creator.full_name}
                        className="size-16 rounded-full object-cover border-3 border-white dark:border-black"
                        src={
                          creator.avatar_url ||
                          "https://via.placeholder.com/56?text=User"
                        }
                      />
                      {creator.verified && (
                        <div
                          className="absolute -bottom-1 -right-1 bg-primary text-white rounded-full p-1"
                          title="Verified Student"
                        >
                          <span className="material-symbols-outlined text-[16px] font-bold block">
                            check
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {creator.year && (
                          <span className="text-xs text-slate-400 dark:text-slate-500 font-medium px-2 py-1 rounded-full bg-slate-100 dark:bg-white/10 shrink-0">
                            {creator.year}
                          </span>
                        )}
                        <h3 className="text-slate-900 dark:text-white font-bold text-lg truncate">
                          {creator.full_name}
                        </h3>
                      </div>
                      {creator.rating && (
                        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-gray-400">
                          <span className="material-symbols-outlined text-[16px] text-yellow-400 font-bold">
                            star
                          </span>
                          <span className="font-semibold text-slate-900 dark:text-white">
                            {creator.rating}
                          </span>
                          <span className="text-slate-500 dark:text-gray-500">
                            • {creator.endorsements || 0} endorsements
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors">
                      arrow_forward
                    </span>
                  </div>
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
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={handleExpressInterest}
              disabled={isExpressing}
              className="flex-[0.6] h-14 bg-primary hover:bg-blue-600 active:scale-[0.98] transition-all rounded-xl flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(59,130,246,0.3)] disabled:opacity-50 disabled:cursor-not-allowed text-white font-extrabold text-lg tracking-wide"
            >
              <span>{isExpressing ? "Expressing..." : "Express Interest"}</span>
              <span className="material-symbols-outlined font-bold">
                {isExpressing ? "hourglass_empty" : "send"}
              </span>
            </button>
            <button className="flex-[0.2] h-14 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-white/10 text-slate-600 dark:text-gray-300 transition-colors flex items-center justify-center">
              <span className="material-symbols-outlined">share</span>
            </button>
            <button className="flex-[0.2] h-14 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-white/10 text-slate-600 dark:text-gray-300 transition-colors flex items-center justify-center">
              <span className="material-symbols-outlined">repeat</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
