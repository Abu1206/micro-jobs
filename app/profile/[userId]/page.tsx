"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function PublicProfile() {
  const params = useParams();
  const userId = params.userId as string;
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data, error } = await supabase
          .from("user_profiles")
          .select("*")
          .eq("user_id", userId)
          .single();

        if (error) throw error;
        setProfile(data);
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchProfile();
    }
  }, [userId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background-dark flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background-dark flex items-center justify-center">
        <div className="text-white">Profile not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-background-dark/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/guest" className="flex items-center gap-2">
            <span className="material-symbols-outlined text-gray-400">
              arrow_back
            </span>
            <span className="text-white font-semibold">Back</span>
          </Link>
          <h1 className="text-white font-bold text-lg">{profile.full_name}</h1>
          <div className="w-10"></div>
        </div>
      </header>

      {/* Profile Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-surface-dark border border-white/10 rounded-2xl p-6 sticky top-20">
              {/* Profile Photo */}
              <div className="w-full aspect-square rounded-xl bg-surface-dark/50 border border-white/10 mb-6 overflow-hidden">
                {profile.profile_photo_url ? (
                  <img
                    src={profile.profile_photo_url}
                    alt={profile.full_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-4xl text-gray-600">
                      person
                    </span>
                  </div>
                )}
              </div>

              <h2 className="text-white text-2xl font-bold mb-1">
                {profile.full_name}
              </h2>
              <p className="text-primary text-sm font-semibold mb-4">
                {profile.headline}
              </p>

              {/* Info */}
              <div className="space-y-4 mb-6 pb-6 border-b border-white/10">
                {profile.university && (
                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-primary mt-1">
                      school
                    </span>
                    <div>
                      <p className="text-gray-400 text-xs">University</p>
                      <p className="text-white font-semibold">
                        {profile.university}
                      </p>
                    </div>
                  </div>
                )}

                {profile.major && (
                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-primary mt-1">
                      trending_up
                    </span>
                    <div>
                      <p className="text-gray-400 text-xs">Major</p>
                      <p className="text-white font-semibold">
                        {profile.major}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Social Links */}
              <div className="flex gap-2">
                {profile.github && (
                  <a
                    href={`https://${profile.github}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2 bg-primary/20 hover:bg-primary/30 text-primary rounded-lg text-sm font-semibold transition-colors text-center"
                  >
                    GitHub
                  </a>
                )}
                {profile.linkedin && (
                  <a
                    href={`https://${profile.linkedin}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2 bg-primary/20 hover:bg-primary/30 text-primary rounded-lg text-sm font-semibold transition-colors text-center"
                  >
                    LinkedIn
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Skills */}
            {profile.skills && profile.skills.length > 0 && (
              <div className="bg-surface-dark border border-white/10 rounded-xl p-6">
                <h3 className="text-white text-xl font-bold mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined">star</span>
                  Skills & Interests
                </h3>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill: string, idx: number) => (
                    <div
                      key={idx}
                      className="bg-primary/20 border border-primary/30 text-primary px-4 py-2 rounded-full text-sm font-semibold"
                    >
                      #{skill}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Portfolio Links */}
            {profile.behance && (
              <div className="bg-surface-dark border border-white/10 rounded-xl p-6">
                <h3 className="text-white text-xl font-bold mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined">portfolio</span>
                  Portfolio
                </h3>
                <a
                  href={`https://${profile.behance}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-blue-400 break-all"
                >
                  {profile.behance}
                </a>
              </div>
            )}

            {/* Call to Action */}
            <div className="bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 rounded-xl p-6">
              <h3 className="text-white text-lg font-bold mb-2">
                Want to connect?
              </h3>
              <p className="text-gray-300 mb-4">
                Sign up to send a message and explore opportunities together.
              </p>
              <Link href="/auth/signup">
                <button className="px-6 py-2 bg-primary hover:bg-blue-500 text-white font-bold rounded-lg transition-colors">
                  Create Account
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
