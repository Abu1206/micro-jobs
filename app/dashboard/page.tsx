"use client";

import Link from "next/link";
import { useState } from "react";
import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    getUser();
  }, []);

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

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-background-dark/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-2xl">
              school
            </span>
            <span className="text-white font-bold text-lg uppercase">
              CampusConnect
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-white font-semibold text-sm">
                {user.user_metadata?.full_name || user.email}
              </p>
              <p className="text-gray-400 text-xs">{user.email}</p>
            </div>
            <button
              onClick={async () => {
                await supabase.auth.signOut();
                window.location.href = "/";
              }}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Stats Cards */}
          <div className="bg-surface-dark border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Applied Jobs</p>
                <p className="text-white text-3xl font-bold">0</p>
              </div>
              <span className="material-symbols-outlined text-primary text-4xl">
                work
              </span>
            </div>
          </div>

          <div className="bg-surface-dark border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Events Registered</p>
                <p className="text-white text-3xl font-bold">0</p>
              </div>
              <span className="material-symbols-outlined text-primary text-4xl">
                event
              </span>
            </div>
          </div>

          <div className="bg-surface-dark border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Profile Views</p>
                <p className="text-white text-3xl font-bold">0</p>
              </div>
              <span className="material-symbols-outlined text-primary text-4xl">
                visibility
              </span>
            </div>
          </div>
        </div>

        {/* Content Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Browse Jobs */}
            <div className="bg-surface-dark border border-white/10 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-white mb-4">
                Browse Job Listings
              </h2>
              <p className="text-gray-400 mb-6">
                Explore opportunities available to students at your campus.
              </p>
              <Link href="/guest">
                <button className="px-6 py-3 bg-primary hover:bg-blue-500 text-white font-bold rounded-lg transition-colors">
                  View All Jobs
                </button>
              </Link>
            </div>

            {/* Browse Events */}
            <div className="bg-surface-dark border border-white/10 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-white mb-4">
                Discover Events
              </h2>
              <p className="text-gray-400 mb-6">
                Find and register for campus events and networking
                opportunities.
              </p>
              <button className="px-6 py-3 bg-primary hover:bg-blue-500 text-white font-bold rounded-lg transition-colors">
                Browse Events
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile Card */}
            <div className="bg-surface-dark border border-white/10 rounded-xl p-6">
              <h3 className="text-white font-bold mb-4">Profile Information</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-400">Email</p>
                  <p className="text-white font-semibold">{user.email}</p>
                </div>
                <div>
                  <p className="text-gray-400">Full Name</p>
                  <p className="text-white font-semibold">
                    {user.user_metadata?.full_name || "Not set"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400">School ID</p>
                  <p className="text-white font-semibold">
                    {user.user_metadata?.school_id || "Not set"}
                  </p>
                </div>
              </div>
              <button className="w-full mt-6 px-4 py-2 border border-white/10 text-white rounded-lg hover:bg-white/5 transition-colors font-semibold text-sm">
                Edit Profile
              </button>
            </div>

            {/* Quick Actions */}
            <div className="bg-surface-dark border border-white/10 rounded-xl p-6">
              <h3 className="text-white font-bold mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full text-left px-4 py-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors text-sm font-semibold">
                  My Applications
                </button>
                <button className="w-full text-left px-4 py-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors text-sm font-semibold">
                  Saved Jobs
                </button>
                <button className="w-full text-left px-4 py-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors text-sm font-semibold">
                  My Events
                </button>
                <button className="w-full text-left px-4 py-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors text-sm font-semibold">
                  Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
