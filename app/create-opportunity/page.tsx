"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface MediaFile {
  id: string;
  file: File;
  preview: string;
  type: "image" | "file";
}

const CATEGORIES = [
  { value: "freelance", label: "🎨 Freelance Work", icon: "work" },
  { value: "internship", label: "💼 Internship", icon: "school" },
  { value: "part-time", label: "⏰ Part-time Job", icon: "schedule" },
  { value: "full-time", label: "📊 Full-time Job", icon: "business_center" },
  { value: "hackathon", label: "🏆 Hackathon", icon: "emoji_events" },
  { value: "workshop", label: "📚 Workshop", icon: "class" },
  { value: "conference", label: "🎤 Conference", icon: "mic" },
  { value: "networking", label: "🤝 Networking Event", icon: "groups" },
  { value: "competition", label: "🏅 Competition", icon: "leaderboard" },
  { value: "project-collab", label: "👥 Project Collaboration", icon: "hub" },
  { value: "startup", label: "🚀 Startup", icon: "trending_up" },
  { value: "research", label: "🔬 Research", icon: "science" },
  { value: "mentorship", label: "👨‍🏫 Mentorship", icon: "person_coach" },
  { value: "scholarship", label: "💰 Scholarship", icon: "card_giftcard" },
  { value: "housing", label: "🏠 Housing", icon: "apartment" },
  { value: "roommate", label: "🛏️ Roommate", icon: "door_back" },
  { value: "tutoring", label: "📖 Tutoring", icon: "auto_stories" },
  { value: "selling", label: "🛍️ Selling Item", icon: "shopping_cart" },
  { value: "service", label: "🔧 Service", icon: "handyman" },
  { value: "sports", label: "⚽ Sports", icon: "sports_baseball" },
  { value: "art-culture", label: "🎭 Arts & Culture", icon: "theater_comedy" },
  {
    value: "community",
    label: "💚 Community Service",
    icon: "volunteer_activism",
  },
];

export default function CreateOpportunity() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [tags, setTags] = useState<string[]>(["design", "ui/ux"]);
  const [tagInput, setTagInput] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [categorySearch, setCategorySearch] = useState("");
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    location: "",
    deadline: "",
  });

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/auth/login");
      } else {
        setUser(user);
        setLoading(false);
      }
    };

    checkAuth();

    // Cleanup function to revoke object URLs when component unmounts
    return () => {
      mediaFiles.forEach((media) => {
        if (media.preview) {
          URL.revokeObjectURL(media.preview);
        }
      });
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background-dark flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.toLowerCase())) {
      setTags([...tags, tagInput.toLowerCase()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const isImage = file.type.startsWith("image/");
      const preview = isImage ? URL.createObjectURL(file) : "";

      setMediaFiles((prev) => [
        ...prev,
        {
          id: Math.random().toString(36),
          file,
          preview,
          type: isImage ? "image" : "file",
        },
      ]);
    });
  };

  const handleRemoveMedia = (id: string) => {
    setMediaFiles((prev) => {
      const mediaToRemove = prev.find((m) => m.id === id);
      // Clean up object URL to prevent memory leaks
      if (mediaToRemove?.preview) {
        URL.revokeObjectURL(mediaToRemove.preview);
      }
      return prev.filter((m) => m.id !== id);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!formData.title || !formData.category || !formData.description) {
        alert("Please fill in all required fields");
        setIsSubmitting(false);
        return;
      }

      // Convert media files to base64 data URLs
      const mediaUrls: string[] = [];
      for (const media of mediaFiles) {
        try {
          const reader = new FileReader();
          const base64Data: string = await new Promise((resolve, reject) => {
            reader.onload = () => {
              const result = reader.result as string;
              resolve(result); // This is the base64 data URL
            };
            reader.onerror = () => reject(new Error("Failed to read file"));
            reader.readAsDataURL(media.file);
          });

          console.log(`Media converted to base64: ${media.file.name}`);
          mediaUrls.push(base64Data);
        } catch (mediaError: any) {
          console.error("Media conversion failed:", mediaError);
          alert(`Failed to convert media: ${mediaError.message}`);
          setIsSubmitting(false);
          return;
        }
      }

      console.log("All media data URLs ready for database");

      // Create opportunity
      const { data, error } = await supabase
        .from("opportunities")
        .insert({
          user_id: user.id,
          title: formData.title,
          category: formData.category,
          description: formData.description,
          location: formData.location || null,
          deadline: formData.deadline || null,
          tags: tags,
          media_urls: mediaUrls,
          created_at: new Date().toISOString(),
          status: "active",
        })
        .select();

      if (error) throw error;

      console.log(
        "✅ Opportunity created successfully with media URLs:",
        mediaUrls,
      );
      alert("✅ Opportunity posted successfully!");
      router.push("/dashboard");
    } catch (err: any) {
      console.error("Error creating opportunity:", err);
      alert("Failed to create opportunity. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-4 py-3 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm border-b border-gray-200 dark:border-white/10">
        <Link href="/dashboard" className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-2xl">
            school
          </span>
          <span className="text-lg font-bold text-slate-900 dark:text-white">
            Micra Jobs
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <button className="px-4 py-2 text-slate-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors">
              Back to Dashboard
            </button>
          </Link>
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
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
        <h1 className="text-lg font-bold leading-tight tracking-tight text-slate-900 dark:text-white">
          Create Opportunity
        </h1>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="bg-primary text-white px-5 py-2 rounded-full text-sm font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:scale-105 transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
          type="button"
        >
          {isSubmitting ? "Posting..." : "Post"}
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-2xl mx-auto pb-10">
        <form className="flex flex-col gap-6 p-5" onSubmit={handleSubmit}>
          {/* Title */}
          <div className="space-y-2">
            <label
              className="block text-sm font-bold text-slate-700 dark:text-slate-200"
              htmlFor="title"
            >
              Title
            </label>
            <input
              className="w-full bg-surface-light dark:bg-surface-dark border-none rounded-xl px-4 py-4 text-lg font-medium placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-primary transition-all shadow-sm text-slate-900 dark:text-white"
              id="title"
              name="title"
              placeholder="What's the opportunity?"
              type="text"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label
              className="block text-sm font-bold text-slate-700 dark:text-slate-200"
              htmlFor="category"
            >
              Category
            </label>
            <div className="relative">
              <div
                className="w-full bg-surface-light dark:bg-surface-dark border-none rounded-xl px-4 py-4 text-base font-normal text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus-ring-2 focus-ring-primary transition-all shadow-sm cursor-pointer flex items-center justify-between"
                onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
              >
                <input
                  type="text"
                  placeholder="Search or select category..."
                  value={categorySearch}
                  onChange={(e) => setCategorySearch(e.target.value)}
                  className="w-full bg-transparent border-none outline-none text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
                />
                <span className="material-symbols-outlined text-primary ml-2">
                  expand_more
                </span>
              </div>

              {/* Dropdown */}
              {showCategoryDropdown && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-white/10 rounded-xl shadow-lg z-50 max-h-64 overflow-y-auto">
                  {CATEGORIES.filter(
                    (cat) =>
                      cat.label
                        .toLowerCase()
                        .includes(categorySearch.toLowerCase()) ||
                      cat.value
                        .toLowerCase()
                        .includes(categorySearch.toLowerCase()),
                  ).map((cat) => (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          category: cat.value,
                        }));
                        setCategorySearch(cat.label);
                        setShowCategoryDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-primary/10 dark:hover:bg-primary/10 transition-colors border-l-4 ${
                        formData.category === cat.value
                          ? "border-primary bg-primary/5 dark:bg-primary/5"
                          : "border-transparent"
                      }`}
                    >
                      <span className="material-symbols-outlined text-lg">
                        {cat.icon}
                      </span>
                      <span className="text-slate-900 dark:text-white font-medium">
                        {cat.label}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            {formData.category && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Selected:{" "}
                {CATEGORIES.find((c) => c.value === formData.category)?.label}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label
              className="block text-sm font-bold text-slate-700 dark:text-slate-200"
              htmlFor="description"
            >
              Description
            </label>
            <textarea
              className="w-full bg-surface-light dark:bg-surface-dark border-none rounded-xl px-4 py-4 text-base font-normal placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-primary transition-all shadow-sm resize-none text-slate-900 dark:text-white"
              id="description"
              name="description"
              placeholder="Describe the details... Who are you looking for? What are the requirements?"
              rows={6}
              value={formData.description}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <label
              className="block text-sm font-bold text-slate-700 dark:text-slate-200"
              htmlFor="tags"
            >
              Tags
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400 dark:text-slate-500 font-bold">
                #
              </span>
              <input
                className="w-full bg-surface-light dark:bg-surface-dark border-none rounded-xl pl-8 pr-4 py-4 text-base font-normal placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-primary transition-all shadow-sm text-slate-900 dark:text-white"
                id="tags"
                placeholder="coding, design, marketing"
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
              />
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-primary/20 text-primary border border-primary/30"
                >
                  {tag}
                  <button
                    className="ml-1 hover:text-white transition-colors"
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                  >
                    <span className="material-symbols-outlined text-[14px] align-middle">
                      close
                    </span>
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Location and Deadline */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Location */}
            <div className="space-y-2">
              <label
                className="block text-sm font-bold text-slate-700 dark:text-slate-200"
                htmlFor="location"
              >
                Location{" "}
                <span className="text-xs font-normal text-slate-400">
                  (Optional)
                </span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <span className="material-symbols-outlined text-slate-400 dark:text-slate-500 text-xl">
                    location_on
                  </span>
                </div>
                <input
                  className="w-full bg-surface-light dark:bg-surface-dark border-none rounded-xl pl-10 pr-4 py-3 text-base font-normal placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-primary transition-all shadow-sm text-slate-900 dark:text-white"
                  id="location"
                  name="location"
                  placeholder="On Campus"
                  type="text"
                  value={formData.location}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* Deadline */}
            <div className="space-y-2">
              <label
                className="block text-sm font-bold text-slate-700 dark:text-slate-200"
                htmlFor="deadline"
              >
                Deadline{" "}
                <span className="text-xs font-normal text-slate-400">
                  (Optional)
                </span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <span className="material-symbols-outlined text-slate-400 dark:text-slate-500 text-xl">
                    calendar_month
                  </span>
                </div>
                <input
                  className="w-full bg-surface-light dark:bg-surface-dark border-none rounded-xl pl-10 pr-4 py-3 text-base font-normal text-slate-400 dark:text-slate-400 focus:text-slate-900 dark:focus:text-white focus:ring-2 focus:ring-primary transition-all shadow-sm"
                  id="deadline"
                  name="deadline"
                  type="date"
                  value={formData.deadline}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          {/* Media */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-200">
              Media
            </label>
            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
              {/* Add button */}
              <button
                className="shrink-0 w-24 h-24 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600 bg-surface-light dark:bg-surface-dark flex flex-col items-center justify-center gap-1 hover:border-primary hover:bg-primary/5 transition-all group"
                type="button"
                onClick={() => fileInputRef.current?.click()}
              >
                <span className="material-symbols-outlined text-slate-400 group-hover:text-primary text-3xl transition-colors">
                  add_a_photo
                </span>
                <span className="text-[10px] font-bold text-slate-400 group-hover:text-primary transition-colors">
                  Add Media
                </span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,.pdf,.doc,.docx"
                onChange={handleMediaUpload}
                className="hidden"
              />

              {/* Media previews */}
              {mediaFiles.map((media) => (
                <div
                  key={media.id}
                  className="shrink-0 w-24 h-24 rounded-xl relative group overflow-hidden bg-surface-dark"
                >
                  {media.type === "image" ? (
                    <img
                      src={media.preview}
                      alt="Uploaded media"
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                    />
                  ) : (
                    <div className="w-full h-full bg-linear-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold p-2 text-center">
                      {media.file.name.split(".").pop()?.toUpperCase()}
                    </div>
                  )}
                  <button
                    className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-md"
                    type="button"
                    onClick={() => handleRemoveMedia(media.id)}
                  >
                    <span className="material-symbols-outlined text-sm block">
                      close
                    </span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
