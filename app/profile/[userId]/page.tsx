"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface Profile {
  id: string;
  user_id: string;
  full_name: string;
  headline: string;
  university: string;
  major: string;
  avatar_url: string;
  skills: string[];
  verified: boolean;
  rating: number;
  endorsements: number;
  created_at: string;
  updated_at: string;
}

export default function PublicProfile() {
  const params = useParams();
  const router = useRouter();
  const userId = params.userId as string;

  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  const supabase = createClient();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get current logged-in user
        const res = await fetch("/api/auth/check");
        const data = await res.json();
        const user = data.authenticated ? data.user : null;
        setCurrentUser(user);

        // Handle "current" as a special case for viewing own profile
        let profileUserId = userId;
        if (userId === "current") {
          if (!user) {
            router.push("/auth/login");
            return;
          }
          profileUserId = user.id;
        }

        // Fetch profile from API endpoint (uses server-side client with better permissions)
        const response = await fetch(`/api/profile/${profileUserId}`);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.details || errorData.error || `HTTP ${response.status}`,
          );
        }

        const { profile } = await response.json();

        if (!profile) {
          throw new Error("Profile not found");
        }

        setProfile(profile);
      } catch (err: any) {
        console.error("Error fetching profile:", err?.message || err);
        setError(err?.message || "Failed to load profile");
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchProfile();
    }
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

  if (error || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
        <div className="text-center">
          <h1 className="text-white text-2xl font-bold mb-4">
            {error || "Profile not found"}
          </h1>
          <Link href="/dashboard">
            <button className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors">
              Back to Dashboard
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      {/* Mobile Layout */}
      <div className="lg:hidden relative flex justify-center min-h-screen bg-black">
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
                {profile.avatar_url && (
                  <div
                    className="relative bg-center bg-no-repeat bg-cover rounded-full h-32 w-32 border-4 border-background-light dark:border-background-dark shadow-xl"
                    style={{
                      backgroundImage: `url("${profile.avatar_url}")`,
                    }}
                  />
                )}
                {!profile.avatar_url && (
                  <div className="relative w-32 h-32 rounded-full bg-primary/20 border-4 border-background-light dark:border-background-dark shadow-xl flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-6xl">
                      account_circle
                    </span>
                  </div>
                )}
              </div>

              <div className="flex flex-col items-center justify-center text-center gap-1">
                <div className="flex items-center gap-2 justify-center">
                  <h1 className="text-2xl font-bold leading-tight text-slate-900 dark:text-white">
                    {profile.full_name}
                  </h1>
                  {profile.verified && (
                    <span className="material-symbols-outlined text-blue-500 text-xl">
                      verified
                    </span>
                  )}
                </div>
                {profile.headline && (
                  <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                    {profile.headline}
                  </p>
                )}
                {profile.university && profile.major && (
                  <p className="text-gray-500 dark:text-gray-400 text-base font-medium">
                    {profile.major} @ {profile.university}
                  </p>
                )}
              </div>

              {/* Stats */}
              <div className="flex gap-8 justify-center">
                <div className="flex flex-col items-center">
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {profile.rating || "5.0"}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Rating
                  </p>
                </div>
                <div className="flex flex-col items-center">
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {profile.endorsements || 0}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Endorsements
                  </p>
                </div>
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
            {profile.skills && profile.skills.length > 0 && (
              <div className="px-4 py-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
                  Skills & Interests
                </h3>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill: string, idx: number) => (
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
            )}

            {/* Divider */}
            <div className="px-4 py-2">
              <div className="h-px bg-gray-200 dark:bg-gray-800"></div>
            </div>

            {/* Joined */}
            <div className="px-4 py-4">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Joined{" "}
                {new Date(profile.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block">
        {/* Header */}
        <div className="sticky top-0 z-50 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md border-b border-gray-200 dark:border-white/10">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/dashboard">
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors">
                <span className="material-symbols-outlined text-gray-900 dark:text-white">
                  arrow_back
                </span>
                <span className="text-gray-900 dark:text-white font-semibold">
                  Back
                </span>
              </button>
            </Link>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Profile
            </h1>
            <button className="flex items-center justify-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors">
              <span className="material-symbols-outlined text-gray-900 dark:text-white text-2xl">
                share
              </span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-3 gap-8">
            {/* Left Column - Profile Info */}
            <div className="col-span-1">
              <div className="rounded-2xl bg-white dark:bg-surface-dark p-8 shadow-lg sticky top-24">
                {/* Avatar */}
                <div className="flex justify-center mb-6">
                  <div className="relative group">
                    <div className="absolute -inset-2 bg-primary/30 rounded-full blur-md opacity-75 group-hover:opacity-100 transition duration-500"></div>
                    {profile.avatar_url ? (
                      <div
                        className="relative bg-center bg-no-repeat bg-cover rounded-full h-40 w-40 border-4 border-background-light dark:border-background-dark shadow-xl"
                        style={{
                          backgroundImage: `url("${profile.avatar_url}")`,
                        }}
                      />
                    ) : (
                      <div className="relative w-40 h-40 rounded-full bg-primary/20 border-4 border-background-light dark:border-background-dark shadow-xl flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary text-8xl">
                          account_circle
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Name and Details */}
                <div className="text-center mb-6">
                  <div className="flex items-center gap-2 justify-center mb-2">
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                      {profile.full_name}
                    </h2>
                    {profile.verified && (
                      <span className="material-symbols-outlined text-blue-500 text-2xl">
                        verified
                      </span>
                    )}
                  </div>
                  {profile.headline && (
                    <p className="text-gray-600 dark:text-gray-400 text-base font-medium mb-1">
                      {profile.headline}
                    </p>
                  )}
                  {profile.university && profile.major && (
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      {profile.major} @ {profile.university}
                    </p>
                  )}
                </div>

                {/* Divider */}
                <div className="h-px bg-gray-200 dark:bg-gray-800 mb-6"></div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center p-4 rounded-lg bg-gray-50 dark:bg-background-dark">
                    <p className="text-3xl font-bold text-slate-900 dark:text-white">
                      {profile.rating || "5.0"}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Rating
                    </p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-gray-50 dark:bg-background-dark">
                    <p className="text-3xl font-bold text-slate-900 dark:text-white">
                      {profile.endorsements || 0}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Endorsements
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-3">
                  <button
                    onClick={handleConnect}
                    className={`w-full h-12 items-center justify-center rounded-lg text-base font-bold tracking-wide transition-all ${
                      isConnected
                        ? "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600"
                        : "bg-primary text-white hover:brightness-110 shadow-lg shadow-primary/20"
                    }`}
                  >
                    {isConnected ? "Connected" : "Connect"}
                  </button>
                  <button
                    onClick={handleMessage}
                    className="w-full h-12 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-base font-bold tracking-wide hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
                  >
                    Message
                  </button>
                </div>

                {/* Joined */}
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                    Joined{" "}
                    {new Date(profile.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column - Content */}
            <div className="col-span-2 space-y-6">
              {/* Skills Section */}
              {profile.skills && profile.skills.length > 0 && (
                <div className="rounded-2xl bg-white dark:bg-surface-dark p-8 shadow-lg">
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                    Skills & Interests
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {profile.skills.map((skill: string, idx: number) => (
                      <span
                        key={idx}
                        className={`px-6 py-3 rounded-full text-base font-semibold transition-colors ${
                          idx % 2 === 0
                            ? "bg-primary/10 border border-primary/20 text-primary"
                            : "bg-gray-100 dark:bg-background-dark text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* About Section */}
              <div className="rounded-2xl bg-white dark:bg-surface-dark p-8 shadow-lg">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                  About
                </h3>
                <div className="space-y-4 text-gray-600 dark:text-gray-400">
                  {profile.headline && (
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white mb-2">
                        Professional Headline
                      </p>
                      <p className="text-base">{profile.headline}</p>
                    </div>
                  )}
                  {profile.major && (
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white mb-2">
                        Field of Study
                      </p>
                      <p className="text-base">{profile.major}</p>
                    </div>
                  )}
                  {profile.university && (
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white mb-2">
                        University
                      </p>
                      <p className="text-base">{profile.university}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Statistics Section */}
              <div className="rounded-2xl bg-white dark:bg-surface-dark p-8 shadow-lg">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                  Member Since
                </h3>
                <p className="text-base text-gray-600 dark:text-gray-400">
                  {new Date(profile.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
