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
  { value: "gigs", label: "Gigs & Jobs" },
  { value: "collab", label: "Collaborations & Teams" },
  { value: "events", label: "Campus Events" },
  { value: "housing", label: "Housing & Roommates" },
  { value: "marketplace", label: "Marketplace" },
];

export default function CreateOpportunity() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [tags, setTags] = useState<string[]>(["design", "ui/ux"]);
  const [tagInput, setTagInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const supabase = createClient();

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
    >
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
    setMediaFiles((prev) => prev.filter((m) => m.id !== id));
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

      // Upload media files
      const mediaUrls: string[] = [];
      for (const media of mediaFiles) {
        const fileName = `${user.id}-${Date.now()}-${media.file.name}`;
        const { error: uploadError } = await supabase.storage
          .from("opportunity-media")
          .upload(fileName, media.file);

        if (!uploadError) {
          const { data } = supabase.storage
            .from("opportunity-media")
            .getPublicUrl(fileName);
          mediaUrls.push(data.publicUrl);
        }
      }

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
        <Link href="/dashboard">
          <button className="text-base font-medium text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors">
            Cancel
          </button>
        </Link>
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
              <select
                className="w-full appearance-none bg-surface-light dark:bg-surface-dark border-none rounded-xl px-4 py-4 pr-10 text-base font-normal text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-primary transition-all shadow-sm cursor-pointer"
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
              >
                <option disabled value="">
                  Select a Category
                </option>
                {CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                <span className="material-symbols-outlined text-primary">
                  expand_more
                </span>
              </div>
            </div>
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
