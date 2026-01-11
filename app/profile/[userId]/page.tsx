"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface Achievement {
  id: string;
  title: string;
  icon: string;
  gradient: string;
  ring: string;
  locked?: boolean;
}

interface Endorsement {
  skill: string;
  count: number;
  percentage: number;
}

interface Testimonial {
  text: string;
  author: string;
  date: string;
}

export default function PublicProfile() {
  const params = useParams();
  const router = useRouter();
  const userId = params.userId as string;

  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchProfileAndUser = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        setCurrentUser(user);

        // Try to fetch profile from database
        const { data: profileData, error } = await supabase
          .from("user_profiles")
          .select("*")
          .eq("user_id", userId)
          .single();

        if (profileData) {
          setProfile(profileData);
        } else {
          console.log("Profile not found");
          setProfile(null);
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndUser();
  }, [userId]);

  const handleConnect = () => {
    setIsConnected(!isConnected);
  };

  const handleMessage = () => {
    if (!currentUser) {
      router.push("/auth/login");
      return;
    }
    router.push("/messages");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-white text-2xl font-bold mb-4">
            Profile not found
          </h1>
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
      <div className="relative flex h-full min-h-screen w-full max-w-md flex-col bg-background-light dark:bg-background-dark">
        {/* Header */}
        <div className="flex items-center p-4 justify-between sticky top-0 z-50 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md border-b border-gray-200 dark:border-white/10">
          <Link href="/dashboard">
            <button className="flex size-10 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
              <span
                className="material-symbols-outlined text-gray-900 dark:text-white"
                style={{ fontSize: "24px" }}
              >
                arrow_back
              </span>
            </button>
          </Link>
          <h2 className="text-gray-900 dark:text-white text-lg font-bold leading-tight tracking-tight">
            Profile
          </h2>
          <button className="flex size-10 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
            <span
              className="material-symbols-outlined text-gray-900 dark:text-white"
              style={{ fontSize: "24px" }}
            >
              share
            </span>
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto no-scrollbar">
          {/* Profile Hero Section */}
          <div className="px-4 pb-6 pt-2 flex flex-col items-center gap-6">
            {/* Profile Photo with Halo */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-primary/30 rounded-full blur-md opacity-75 group-hover:opacity-100 transition duration-500"></div>
              <div
                className="relative bg-center bg-no-repeat bg-cover rounded-full h-32 w-32 border-4 border-background-light dark:border-background-dark shadow-xl"
                style={{
                  backgroundImage: `url("${profile.profile_photo_url}")`,
                }}
              ></div>
            </div>

            {/* Name and Info */}
            <div className="flex flex-col items-center justify-center text-center gap-1">
              <h1 className="text-2xl font-bold leading-tight text-slate-900 dark:text-white">
                {profile.full_name}
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-base font-medium">
                {profile.major} @ {profile.university}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex w-full gap-3 justify-center">
              <button
                onClick={handleConnect}
                className={`flex-1 max-w-40 h-11 items-center justify-center rounded-lg text-sm font-bold tracking-wide transition-all ${
                  isConnected
                    ? "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600"
                    : "bg-primary text-white hover:brightness-110 shadow-[0_0_15px_rgba(37,99,235,0.3)]"
                }`}
              >
                {isConnected ? "Connected" : "Connect"}
              </button>
              <button
                onClick={handleMessage}
                className="flex-1 max-w-40 h-11 items-center justify-center rounded-lg bg-gray-100 dark:bg-surface-dark border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white text-sm font-bold tracking-wide hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
              >
                Message
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="px-4 py-2">
            <div className="grid grid-cols-3 gap-3">
              <div className="flex flex-col gap-1 rounded-xl bg-white dark:bg-surface-dark border border-gray-100 dark:border-gray-800 p-3 items-center text-center shadow-sm">
                <p className="text-gray-900 dark:text-white text-xl font-bold">
                  15
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-xs font-medium">
                  Posted
                </p>
              </div>
              <div className="flex flex-col gap-1 rounded-xl bg-white dark:bg-surface-dark border border-gray-100 dark:border-gray-800 p-3 items-center text-center shadow-sm">
                <p className="text-gray-900 dark:text-white text-xl font-bold">
                  {profile.endorsements}
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-xs font-medium">
                  Connects
                </p>
              </div>
              <div className="flex flex-col gap-1 rounded-xl bg-white dark:bg-surface-dark border border-gray-100 dark:border-gray-800 p-3 items-center text-center shadow-sm">
                <p className="text-primary text-xl font-bold drop-shadow-[0_0_8px_rgba(37,99,235,0.4)]">
                  850
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-xs font-medium">
                  Reputation
                </p>
              </div>
            </div>
          </div>

          {/* About Section */}
          <div className="px-4 py-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              About
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed">
              {profile.about}
            </p>
          </div>

          {/* Skills & Interests */}
          <div className="px-4 py-2">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
              Skills & Interests
            </h3>
            <div className="flex flex-wrap gap-2">
              {profile.skills?.map((skill: string, idx: number) => (
                <span
                  key={idx}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                    idx % 2 === 0
                      ? "bg-primary/10 border border-primary/20 text-primary"
                      : "bg-gray-100 dark:bg-surface-dark text-gray-700 dark:text-gray-300"
                  }`}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Portfolio Section */}
          <div className="px-4 py-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Portfolio
              </h3>
              <button className="text-primary text-sm font-semibold hover:underline">
                View All
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {profile.github_url && (
                <a
                  href={profile.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex flex-col gap-2 p-4 rounded-xl bg-white dark:bg-surface-dark border border-gray-100 dark:border-gray-800 hover:border-primary/50 transition-colors shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-black text-white p-2 rounded-lg">
                      <span className="material-symbols-outlined text-xl">
                        code
                      </span>
                    </div>
                    <span className="material-symbols-outlined ml-auto text-gray-400 group-hover:text-primary transition-colors text-sm">
                      open_in_new
                    </span>
                  </div>
                  <div>
                    <p className="font-bold text-sm text-slate-900 dark:text-white">
                      GitHub
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      @alexrivera_dev
                    </p>
                  </div>
                </a>
              )}
              {profile.behance_url && (
                <a
                  href={profile.behance_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex flex-col gap-2 p-4 rounded-xl bg-white dark:bg-surface-dark border border-gray-100 dark:border-gray-800 hover:border-primary/50 transition-colors shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-600 text-white p-2 rounded-lg">
                      <span className="material-symbols-outlined text-xl">
                        palette
                      </span>
                    </div>
                    <span className="material-symbols-outlined ml-auto text-gray-400 group-hover:text-primary transition-colors text-sm">
                      open_in_new
                    </span>
                  </div>
                  <div>
                    <p className="font-bold text-sm text-slate-900 dark:text-white">
                      Behance
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Project Case Studies
                    </p>
                  </div>
                </a>
              )}
            </div>
          </div>

          {/* Achievements Section */}
          <div className="py-4">
            <h3 className="px-4 text-lg font-bold text-slate-900 dark:text-white mb-3">
              Achievements
            </h3>
            <div className="flex overflow-x-auto px-4 gap-4 no-scrollbar pb-2">
              {profile?.achievements && profile.achievements.length > 0 ? (
                profile.achievements.map((achievement: any) => (
                  <div
                    key={achievement.id}
                    className="flex flex-col items-center gap-2 min-w-20"
                  >
                    <div
                      className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg border-2 border-background-light dark:border-background-dark bg-linear-to-br from-primary/50 to-primary/20 ring-2 ring-primary/30`}
                    >
                      <span
                        className="material-symbols-outlined text-white"
                        style={{ fontSize: "32px" }}
                      >
                        {achievement.icon || "verified"}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-center text-slate-900 dark:text-white">
                      {achievement.title}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-sm">No achievements yet</p>
              )}
            </div>
          </div>

          {/* Top Endorsements */}
          <div className="px-4 py-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
              Top Endorsements
            </h3>
            <div className="flex flex-col gap-4">
              {profile?.endorsements && profile.endorsements.length > 0 ? (
                profile.endorsements.map((endorsement: any) => (
                  <div key={endorsement.skill} className="flex flex-col gap-2">
                    <div className="flex justify-between items-end">
                      <span className="font-medium text-sm text-slate-900 dark:text-white">
                        {endorsement.skill}
                      </span>
                      <span className="text-primary font-bold text-sm">
                        {endorsement.count || 0}
                      </span>
                    </div>
                    <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full shadow-[0_0_10px_rgba(37,99,235,0.5)]"
                        style={{ width: `${endorsement.percentage || 0}%` }}
                      ></div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-sm">No endorsements yet</p>
              )}
            </div>
          </div>

          {/* Community Rating */}
          <div className="px-4 py-4 pb-12">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
              Community Rating
            </h3>
            <div className="rounded-2xl bg-white dark:bg-surface-dark p-5 border border-gray-100 dark:border-gray-800 shadow-sm">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex flex-col items-center">
                  <span className="text-3xl font-extrabold text-gray-900 dark:text-white">
                    {profile?.rating || 5}
                  </span>
                  <div className="flex text-yellow-400 text-sm">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className="material-symbols-outlined text-sm fill-current"
                      >
                        {i < Math.floor(profile.rating)
                          ? "star"
                          : i < profile.rating
                          ? "star_half"
                          : "star"}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="h-10 w-px bg-gray-200 dark:bg-gray-700"></div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    Trustworthy & Collaborative
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Based on 24 interactions
                  </span>
                </div>
              </div>

              {/* Testimonial */}
              <div className="bg-gray-50 dark:bg-black/50 p-3 rounded-lg border border-gray-100 dark:border-gray-800">
                <div className="flex gap-2 mb-1">
                  <span className="material-symbols-outlined text-primary text-base">
                    format_quote
                  </span>
                  <p className="text-sm italic text-gray-600 dark:text-gray-300">
                    {profile?.bio || "Great to work with!"}
                  </p>
                </div>
                <p className="text-right text-xs text-gray-400 font-medium mt-1">
                  - {profile?.full_name || "User"}, Recently
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
