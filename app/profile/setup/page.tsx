"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const SKILLS_SUGGESTIONS = [
  "ProductDesign",
  "React",
  "Marketing",
  "Python",
  "JavaScript",
  "UI/UX",
  "Data Science",
  "Project Management",
  "Content Writing",
  "Graphic Design",
  "Mobile Development",
  "Web Development",
];

export default function ProfileSetup() {
  const [step, setStep] = useState(1);
  const [selectedSkills, setSelectedSkills] = useState(["ProductDesign", "React"]);
  const [skillInput, setSkillInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    headline: "",
    university: "",
    major: "",
    profilePhoto: null as File | null,
    github: "",
    behance: "",
    linkedin: "",
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const supabase = createClient(); // ✅ singleton client

  // --- Check authentication ---
  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/auth/login");
      } else {
        setIsAuthenticated(true);
        setAuthLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background-dark flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  // --- Input Handlers ---
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setFormData((prev) => ({ ...prev, profilePhoto: file }));
  };

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const addSkill = (skill: string) => {
    if (skill && !selectedSkills.includes(skill)) {
      setSelectedSkills((prev) => [...prev, skill]);
      setSkillInput("");
    }
  };

  // --- Form Submit ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) throw userError;
      if (!user) {
        router.push("/auth/login");
        return;
      }

      // --- Upload profile photo ---
      let avatarUrl: string | null = null;
      if (formData.profilePhoto) {
        const fileExt = formData.profilePhoto.name.split(".").pop();
        const fileName = `${user.id}-${Date.now()}.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("profile-photos")
          .upload(filePath, formData.profilePhoto, { cacheControl: "3600", upsert: true });

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage.from("profile-photos").getPublicUrl(filePath);
        avatarUrl = publicUrlData.publicUrl;
      }

      // --- Upsert profile ---
      const { error: upsertError } = await supabase
        .from("user_profiles")
        .upsert(
          {
            user_id: user.id,
            full_name: formData.fullName,
            headline: formData.headline,
            university: formData.university,
            major: formData.major,
            avatar_url: avatarUrl,
            skills: selectedSkills,
            github_url: formData.github,
            behance_url: formData.behance,
            linkedin_url: formData.linkedin,
            verified: false,
            rating: 0,
            endorsements: 0,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id" }
        );

      if (upsertError) throw upsertError;

      // --- Update user metadata ---
      const { error: metaError } = await supabase.auth.updateUser({
        data: {
          full_name: formData.fullName,
          headline: formData.headline,
          university: formData.university,
          major: formData.major,
          avatar_url: avatarUrl,
        },
      });

      if (metaError) throw metaError;

      router.push("/dashboard");
    } catch (err: any) {
      console.error("❌ Error saving profile:", err.message);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="relative flex h-full min-h-screen w-full flex-col overflow-x-hidden bg-background-light dark:bg-background-dark">
      {/* Desktop Layout */}
      <div className="hidden lg:flex h-screen">
        {/* Left Panel - Info */}
        <div className="w-1/2 bg-linear-to-br from-primary/20 to-background-dark flex flex-col items-center justify-center p-12">
          <div className="max-w-md text-center">
            <h1 className="text-5xl font-bold text-white mb-6">
              Complete Your Profile
            </h1>
            <p className="text-gray-300 text-lg mb-8">
              Stand out to employers and make genuine connections with fellow
              students by completing your profile.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-white">
                    image
                  </span>
                </div>
                <div className="text-left">
                  <h3 className="text-white font-bold mb-1">Add Photo</h3>
                  <p className="text-gray-400 text-sm">
                    Make a great first impression with a profile picture
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-white">
                    person
                  </span>
                </div>
                <div className="text-left">
                  <h3 className="text-white font-bold mb-1">Tell Your Story</h3>
                  <p className="text-gray-400 text-sm">
                    Share your background, interests, and what you're looking
                    for
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-white">
                    work
                  </span>
                </div>
                <div className="text-left">
                  <h3 className="text-white font-bold mb-1">Showcase Work</h3>
                  <p className="text-gray-400 text-sm">
                    Connect your GitHub, portfolio, and professional links
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Form */}
        <div className="w-1/2 flex flex-col p-28 overflow-y-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">
              Create Profile
            </h2>
            <div className="flex gap-2">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`h-2 w-8 rounded-full ${
                    s <= step ? "bg-primary" : "bg-slate-600"
                  }`}
                />
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex-1 space-y-8">
            {/* Profile Photo Upload Section */}
            <section className="flex flex-col items-center space-y-3">
              <div className="relative group cursor-pointer">
                <div
                  className="h-32 w-32 rounded-full bg-surface-dark border-4 border-slate-700 overflow-hidden bg-cover bg-center"
                  style={{
                    backgroundImage: formData.profilePhoto
                      ? `url(${URL.createObjectURL(formData.profilePhoto)})`
                      : `url('/default-avatar.png')`, // fallback image
                  }}
                  onClick={() => fileInputRef.current?.click()}
                ></div>

                <div className="absolute bottom-1 right-1 h-9 w-9 bg-primary rounded-full flex items-center justify-center border-2 border-background-dark shadow-md">
                  <span className="material-symbols-outlined text-white text-[20px]">
                    edit
                  </span>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
              </div>

              <p className="text-sm text-slate-400 text-center">
                Click the image to upload your profile photo
              </p>
            </section>

            {/* Personal Details Section */}
            <section className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="e.g. Alex Johnson"
                  className="w-full rounded-lg bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-700 px-4 py-3 text-base text-slate-900 dark:text-white placeholder-slate-400 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                  Headline
                </label>
                <input
                  type="text"
                  name="headline"
                  value={formData.headline}
                  onChange={handleInputChange}
                  placeholder="e.g. CS Student @ MIT | UX Enthusiast"
                  className="w-full rounded-lg bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-700 px-4 py-3 text-base text-slate-900 dark:text-white placeholder-slate-400 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                    University
                  </label>
                  <input
                    type="text"
                    name="university"
                    value={formData.university}
                    onChange={handleInputChange}
                    placeholder="e.g. Stanford"
                    className="w-full rounded-lg bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-700 px-4 py-3 text-base text-slate-900 dark:text-white placeholder-slate-400 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                    Major
                  </label>
                  <input
                    type="text"
                    name="major"
                    value={formData.major}
                    onChange={handleInputChange}
                    placeholder="e.g. Computer Science"
                    className="w-full rounded-lg bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-700 px-4 py-3 text-base text-slate-900 dark:text-white placeholder-slate-400 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all"
                  />
                </div>
              </div>
            </section>

            {/* Skills Section */}
            <section className="space-y-4">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Skills & Interests
              </label>
              <div className="flex flex-wrap gap-2">
                {selectedSkills.map((skill) => (
                  <div
                    key={skill}
                    className="flex items-center gap-2 rounded-full bg-primary/20 border border-primary/30 px-3 py-1.5 text-sm font-medium text-primary"
                  >
                    <span>#{skill}</span>
                    <button
                      type="button"
                      onClick={() => toggleSkill(skill)}
                      className="cursor-pointer hover:text-white"
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        close
                      </span>
                    </button>
                  </div>
                ))}
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addSkill(skillInput);
                    }
                  }}
                  placeholder="Add skills..."
                  className="flex-1 min-w-30 bg-transparent border-none p-2 text-sm text-slate-900 dark:text-white placeholder-slate-500 focus:ring-0"
                />
              </div>
            </section>

            {/* Work Links Section */}
            <section className="space-y-4">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Connect Your Work
              </label>

              <div className="space-y-3">
                <div className="flex items-center gap-3 rounded-lg bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-700 p-3">
                  <span className="text-xl">💻</span>
                  <input
                    type="url"
                    name="github"
                    value={formData.github}
                    onChange={handleInputChange}
                    placeholder="github.com/username"
                    className="w-full bg-transparent border-none p-0 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:ring-0"
                  />
                </div>

                <div className="flex items-center gap-3 rounded-lg bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-700 p-3">
                  <span className="text-xl">🎨</span>
                  <input
                    type="url"
                    name="behance"
                    value={formData.behance}
                    onChange={handleInputChange}
                    placeholder="behance.net/username"
                    className="w-full bg-transparent border-none p-0 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:ring-0"
                  />
                </div>

                <div className="flex items-center gap-3 rounded-lg bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-700 p-3">
                  <span className="text-xl">💼</span>
                  <input
                    type="url"
                    name="linkedin"
                    value={formData.linkedin}
                    onChange={handleInputChange}
                    placeholder="linkedin.com/in/username"
                    className="w-full bg-transparent border-none p-0 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:ring-0"
                  />
                </div>
              </div>
            </section>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-primary h-12 flex items-center justify-center text-white font-bold text-base hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Saving Profile..." : "Complete Profile"}
            </button>
          </form>

          <button
            onClick={() => router.push("/dashboard")}
            className="mt-4 text-center text-primary font-semibold hover:text-blue-400"
          >
            Skip for now
          </button>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden flex flex-col h-screen max-w-md mx-auto w-full">
        {/* Header */}
        <header className="flex items-center justify-between p-4 pb-2 sticky top-0 z-10 bg-background-light dark:bg-background-dark/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-700">
          <button className="flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer transition-colors">
            <span className="material-symbols-outlined text-slate-900 dark:text-white">
              arrow_back
            </span>
          </button>

          <div className="flex flex-col items-center">
            <h2 className="text-lg font-bold leading-tight tracking-tight">
              Create Profile
            </h2>
            <div className="flex gap-1 mt-1">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`h-1.5 w-1.5 rounded-full ${
                    s <= step ? "bg-primary" : "bg-slate-300 dark:bg-slate-700"
                  }`}
                />
              ))}
            </div>
          </div>

          <button className="flex h-10 items-center justify-center px-2 text-primary text-sm font-bold tracking-wide hover:text-primary/80 transition-colors">
            Skip
          </button>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex flex-col px-4 pb-24 pt-2 overflow-y-auto">
          {/* Profile Photo */}
          <section className="flex flex-col items-center py-6">
            <div className="relative group cursor-pointer">
              <div
                className="h-32 w-32 rounded-full bg-surface-dark bg-cover bg-center border-4 border-background-light dark:border-background-dark shadow-lg transition-transform group-hover:scale-105"
                onClick={() => fileInputRef.current?.click()}
              />
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
              <div className="absolute bottom-1 right-1 h-9 w-9 bg-primary rounded-full flex items-center justify-center border-2 border-background-light dark:border-background-dark shadow-md">
                <span className="material-symbols-outlined text-white text-[20px]">
                  edit
                </span>
              </div>
            </div>
            <div className="mt-4 text-center">
              <p className="text-sm font-medium text-primary">Upload Photo</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Make a good first impression
              </p>
            </div>
          </section>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Details */}
            <section className="flex flex-col gap-5">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white border-l-4 border-primary pl-3">
                Personal Details
              </h3>
              <div className="space-y-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Full Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="e.g. Alex Johnson"
                      className="w-full rounded-lg bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-700 px-4 py-3 text-base text-slate-900 dark:text-white placeholder-slate-400 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all shadow-sm"
                      required
                    />
                    <span className="material-symbols-outlined absolute right-4 top-3.5 text-slate-400">
                      person
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Headline
                  </label>
                  <input
                    type="text"
                    name="headline"
                    value={formData.headline}
                    onChange={handleInputChange}
                    placeholder="e.g. CS Student @ MIT | UX Enthusiast"
                    className="w-full rounded-lg bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-700 px-4 py-3 text-base text-slate-900 dark:text-white placeholder-slate-400 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all shadow-sm"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      University / Org
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="university"
                        value={formData.university}
                        onChange={handleInputChange}
                        placeholder="e.g. Stanford"
                        className="w-full rounded-lg bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-700 px-4 py-3 text-base text-slate-900 dark:text-white placeholder-slate-400 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all shadow-sm"
                      />
                      <span className="material-symbols-outlined absolute right-4 top-3.5 text-slate-400 text-[20px]">
                        school
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Major / Focus
                    </label>
                    <input
                      type="text"
                      name="major"
                      value={formData.major}
                      onChange={handleInputChange}
                      placeholder="e.g. Computer Science"
                      className="w-full rounded-lg bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-700 px-4 py-3 text-base text-slate-900 dark:text-white placeholder-slate-400 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all shadow-sm"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Skills Section */}
            <section className="flex flex-col gap-4">
              <div className="flex justify-between items-end">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white border-l-4 border-primary pl-3">
                  Skills & Interests
                </h3>
                <button
                  type="button"
                  className="text-xs text-primary font-bold uppercase tracking-wide"
                >
                  Browse All
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedSkills.map((skill) => (
                  <div
                    key={skill}
                    className="flex items-center gap-1.5 rounded-full bg-primary/20 border border-primary/30 px-3 py-1.5 text-sm font-medium text-primary"
                  >
                    <span>#{skill}</span>
                    <button
                      type="button"
                      onClick={() => toggleSkill(skill)}
                      className="cursor-pointer hover:text-white"
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        close
                      </span>
                    </button>
                  </div>
                ))}
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addSkill(skillInput);
                    }
                  }}
                  placeholder="Add skills..."
                  className="flex-1 min-w-30 bg-transparent border-none p-2 text-sm text-slate-900 dark:text-white placeholder-slate-500 focus:ring-0"
                />
              </div>
            </section>

            {/* Connect Work Section */}
            <section className="flex flex-col gap-5 mb-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white border-l-4 border-primary pl-3">
                  Connect Your Work
                </h3>
                <span className="text-xs text-slate-500 dark:text-slate-500 bg-surface-light dark:bg-surface-dark px-2 py-1 rounded">
                  Optional
                </span>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3 rounded-lg bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-700 p-3">
                  <span className="text-xl">💻</span>
                  <input
                    type="url"
                    name="github"
                    value={formData.github}
                    onChange={handleInputChange}
                    placeholder="github.com/username"
                    className="w-full bg-transparent border-none p-0 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:ring-0"
                  />
                </div>

                <div className="flex items-center gap-3 rounded-lg bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-700 p-3">
                  <span className="text-xl">🎨</span>
                  <input
                    type="url"
                    name="behance"
                    value={formData.behance}
                    onChange={handleInputChange}
                    placeholder="behance.net/username"
                    className="w-full bg-transparent border-none p-0 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:ring-0"
                  />
                </div>

                <div className="flex items-center gap-3 rounded-lg bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-700 p-3">
                  <span className="text-xl">💼</span>
                  <input
                    type="url"
                    name="linkedin"
                    value={formData.linkedin}
                    onChange={handleInputChange}
                    placeholder="linkedin.com/in/username"
                    className="w-full bg-transparent border-none p-0 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:ring-0"
                  />
                </div>
              </div>
            </section>
          </form>
        </main>

        {/* Bottom Button */}
        <div className="fixed bottom-0 left-0 right-0 z-20 w-full max-w-md mx-auto bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-lg border-t border-slate-200 dark:border-slate-700 p-4">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full rounded-xl bg-primary h-12 flex items-center justify-center text-white font-bold text-base hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Saving..." : "Complete Profile"}
          </button>
        </div>
      </div>
    </div>
  );
}
