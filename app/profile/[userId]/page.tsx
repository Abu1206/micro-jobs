"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

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
    const fetchProfile = async () => {
      try {
        // Get current logged-in user
        const {
          data: { user },
        } = await supabase.auth.getUser();
        setCurrentUser(user);

        // Fetch profile by userId
        const { data: profileData, error } = await supabase
          .from("user_profiles")
          .select("*")
          .eq("user_id", userId)
          .single();

        if (error) throw error;

        setProfile(profileData);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  const handleConnect = () => setIsConnected(!isConnected);

  const handleMessage = () => {
    if (!currentUser) {
      router.push("/auth/login");
      return;
    }
    router.push("/messages");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
        <div className="text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
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
            <button className="flex items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
              <span
                className="material-symbols-outlined text-gray-900 dark:text-white"
                style={{ fontSize: "24px" }}
              >
                arrow_back
              </span>
            </button>
          </Link>
          <h2 className="text-gray-900 dark:text-white text-lg font-bold">
            Profile
          </h2>
          <button className="flex items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
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
          {/* Profile Hero */}
          <div className="px-4 pb-6 pt-2 flex flex-col items-center gap-6">
            <div className="relative group">
              <div className="absolute -inset-1 bg-primary/30 rounded-full blur-md opacity-75 group-hover:opacity-100 transition duration-500"></div>
              <div
                className="relative bg-center bg-no-repeat bg-cover rounded-full h-32 w-32 border-4 border-background-light dark:border-background-dark shadow-xl"
                style={{ backgroundImage: `url("${profile.profile_photo_url}")` }}
              ></div>
            </div>

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

          {/* Skills */}
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

          {/* Portfolio */}
          <div className="px-4 py-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Portfolio
              </h3>
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
                  </div>
                </a>
              )}
            </div>
          </div>

          {/* Achievements */}
          <div className="py-4 px-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
              Achievements
            </h3>
            <div className="flex overflow-x-auto gap-4 no-scrollbar pb-2">
              {profile.achievements?.length > 0 ? (
                profile.achievements.map((ach: any) => (
                  <div key={ach.id} className="flex flex-col items-center gap-2 min-w-20">
                    <div
                      className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg border-2 border-background-light dark:border-background-dark bg-linear-to-br from-primary/50 to-primary/20 ring-2 ring-primary/30`}
                    >
                      <span
                        className="material-symbols-outlined text-white"
                        style={{ fontSize: "32px" }}
                      >
                        {ach.icon || "verified"}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-center text-slate-900 dark:text-white">
                      {ach.title}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-sm">No achievements yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
