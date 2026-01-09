"use client";

import Link from "next/link";
import { useState } from "react";
import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

interface Opportunity {
  id: number;
  title: string;
  company: string;
  type: "Internship" | "Job" | "Event";
  tags: string[];
  image: string;
  timeAgo: string;
  applicants?: number;
  location: string;
  isEventCard?: boolean;
  date?: string;
  going?: number;
  imageSmall?: boolean;
  organization?: string;
}

const OPPORTUNITIES: Opportunity[] = [
  {
    id: 1,
    title: "UI/UX Designer for Student Startup",
    company: "TechNova",
    type: "Internship",
    tags: ["#Design", "#Remote", "#Paid"],
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBDrl8vSVia_48qHfvVVvhX8F7TGgWCLt58orNXOdBr06Ofcyrh1oivf9C5rp3qph73xHQQVM2wxLQ--UAxOPJ_oS56UMR2agy8SRpgUoxx66DXBm_QoRsWNiwIcJg-6tOyjOJc-KgTVAJhepAv-KomFgcl3u-Tb1dm16de1y6dqoTXDBEWIdXpEVV-UcOJHa9uE_e-PqsCxMoAm-fnZ55ENDKr5VT_elFQt2sFV86yutStOudZynRme2KEpxlg6gDpbCIG_SyBX4wM",
    timeAgo: "2h ago",
    applicants: 24,
    location: "Online",
  },
  {
    id: 2,
    title: "Annual Campus Hackathon 2024",
    company: "",
    type: "Event",
    tags: [],
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCZI9zTe_nG7qMvnV0aqI8A0MrNFRsrJOw7gdwQRnjmvO0css6y858KFFFgud1kv3r9F-maeIisRZ4crLdfsdVWOzLKiT0zpBLvnv7FcKUWuy9ilEpzg1-ic6WvYpD6h4Ewpfsv4e0hBCPWcFvf2vljOUt5TAj7q5Q_MrU93-C8O8pO4cEsxXi1FE3Agd_UOy3vHixPOXoDWwcXWVgWEN-_UOa_JY4fAQpCaaTzo_PQ5_J-sauAbxK77rNZHqBtITtSBGNhap9NIAhM",
    timeAgo: "5h ago",
    location: "Student Center, Main Hall",
    isEventCard: true,
    date: "OCT 12",
    going: 150,
    organization: "Computer Science Society",
  },
  {
    id: 3,
    title: "Weekend Study Group: Linear Algebra",
    company: "",
    type: "Event",
    tags: ["Social"],
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB4oo-2hHxPzWD82jUptOJHNXlgwCB9wFh3A4PyCMjUzp_tiBi0YhdLiSiMgFAUDaCzn59KSn6byE_IGaE4tp3cg3kAMDEb2sy5rfvLZVe9_54MSHG4_9pcYZM44S6IZwaxWwP50IjVizzrsb_XuAnVgmyR8AwS4cJNp6KIBrwH2qboSRy4VkOutYfoNgwLNX8cs60U1cOhv3wrmRNoxXm6K5Jm3M5ZfYf--hqmIABwZ477rryLa4-s1lLugrGKAXfCk7liZDkDm_b6",
    timeAgo: "1d ago",
    location: "Library Room 3B",
    imageSmall: true,
    organization: "Math Club",
  },
];

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState("All");
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

  const firstName = user.user_metadata?.full_name?.split(" ")[0] || "there";

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark transition-colors duration-200">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md border-b border-gray-200 dark:border-white/5 pb-2">
        <div className="flex items-center justify-between px-4 pt-4 pb-2 max-w-7xl mx-auto">
          <h1 className="text-slate-900 dark:text-white text-xl font-extrabold tracking-tight">
            CampusConnect
          </h1>
          <button className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors relative">
            <span className="material-symbols-outlined text-slate-900 dark:text-white">
              notifications
            </span>
            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-primary rounded-full border-2 border-background-light dark:border-background-dark"></span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="px-4 mt-2 max-w-7xl mx-auto hidden lg:block">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="material-symbols-outlined text-text-secondary-light dark:text-text-secondary-dark">
                search
              </span>
            </div>
            <input
              className="block w-full pl-10 pr-3 py-3 rounded-xl border-none bg-surface-light dark:bg-surface-dark text-slate-900 dark:text-white placeholder-text-secondary-light dark:placeholder-text-secondary-dark focus:ring-2 focus:ring-primary shadow-sm"
              placeholder="Search opportunities, events..."
              type="text"
            />
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-3 px-4 pt-3 pb-1 overflow-x-auto no-scrollbar max-w-7xl mx-auto">
          <button className="flex shrink-0 items-center justify-center h-9 w-9 rounded-lg bg-surface-light dark:bg-surface-dark border border-gray-200 dark:border-white/10 text-slate-900 dark:text-white shadow-sm hover:bg-gray-50 dark:hover:bg-white/5">
            <span className="material-symbols-outlined text-[20px]">tune</span>
          </button>
          {["All", "Trending", "Local", "Remote", "Hackathons"].map(
            (filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`flex h-9 shrink-0 items-center px-4 rounded-lg text-sm font-medium transition-colors ${
                  selectedFilter === filter
                    ? "bg-slate-900 dark:bg-white text-white dark:text-background-dark"
                    : "bg-surface-light dark:bg-surface-dark border border-gray-200 dark:border-white/5 text-slate-600 dark:text-white hover:bg-gray-50 dark:hover:bg-white/5"
                }`}
              >
                {filter}
              </button>
            )
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-col gap-6 px-4 pt-4 pb-28 max-w-7xl mx-auto lg:pb-8">
        <div className="lg:hidden">
          <h2 className="text-slate-900 dark:text-white text-2xl font-bold tracking-tight">
            Good Morning, {firstName}
          </h2>
          <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm mt-1">
            Here's what's happening around your campus.
          </p>
        </div>

        <div className="hidden lg:block">
          <h2 className="text-slate-900 dark:text-white text-3xl font-bold tracking-tight mb-2">
            Good Morning, {firstName}
          </h2>
          <p className="text-text-secondary-light dark:text-text-secondary-dark text-base">
            Here's what's happening around your campus.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {OPPORTUNITIES.map((opp) => (
            <Link key={opp.id} href={`/opportunities/${opp.id}`}>
              <article className="flex flex-col rounded-2xl bg-surface-light dark:bg-surface-dark shadow-[0_2px_8px_rgba(0,0,0,0.08)] overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                {opp.imageSmall ? (
                  // Small image layout (study group)
                  <div className="flex p-4 gap-4">
                    <div
                      className="h-24 w-24 shrink-0 rounded-xl bg-cover bg-center"
                      style={{ backgroundImage: `url('${opp.image}')` }}
                    ></div>
                    <div className="flex flex-col flex-1 justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <h3 className="text-slate-900 dark:text-white text-base font-bold leading-tight line-clamp-2">
                            {opp.title}
                          </h3>
                        </div>
                        <p className="text-text-secondary-light dark:text-text-secondary-dark text-xs mt-1">
                          {opp.organization} • {opp.location}
                        </p>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs font-semibold bg-blue-500/10 text-blue-500 px-2 py-0.5 rounded">
                          {opp.tags[0]?.replace("#", "")}
                        </span>
                        <button className="text-primary text-sm font-bold hover:underline">
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ) : opp.isEventCard ? (
                  // Event card layout
                  <>
                    <div
                      className="h-40 w-full bg-cover bg-center relative"
                      style={{ backgroundImage: `url('${opp.image}')` }}
                    >
                      <div className="absolute top-3 right-3 bg-primary text-white px-2 py-1 rounded text-xs font-bold uppercase tracking-wider">
                        Event
                      </div>
                    </div>
                    <div className="p-4 flex flex-col gap-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-slate-900 dark:text-white text-lg font-bold leading-tight">
                            {opp.title}
                          </h3>
                          <p className="text-text-secondary-light dark:text-text-secondary-dark font-medium text-sm mt-1">
                            {opp.organization}
                          </p>
                        </div>
                        <div className="flex flex-col items-center justify-center bg-gray-100 dark:bg-white/10 rounded-lg p-1 min-w-[50px]">
                          <span className="text-xs font-bold text-slate-500 dark:text-gray-300 uppercase">
                            {opp.date?.split(" ")[0]}
                          </span>
                          <span className="text-lg font-bold text-slate-900 dark:text-white leading-none">
                            {opp.date?.split(" ")[1]}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-gray-300">
                        <span className="material-symbols-outlined text-[18px] text-primary">
                          location_on
                        </span>
                        <span>{opp.location}</span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-text-secondary-light dark:text-text-secondary-dark font-medium border-t border-gray-100 dark:border-white/5 pt-3 mt-1">
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[16px]">
                            schedule
                          </span>
                          {opp.timeAgo}
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[16px]">
                            bolt
                          </span>
                          {opp.going}+ Going
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-1">
                        <button className="flex-1 bg-slate-900 dark:bg-white text-white dark:text-background-dark font-bold py-2.5 px-4 rounded-lg text-sm hover:opacity-90 transition-opacity">
                          Register
                        </button>
                        <button className="p-2.5 rounded-lg border border-gray-200 dark:border-white/10 text-slate-500 dark:text-white hover:bg-gray-50 dark:hover:bg-white/5">
                          <span className="material-symbols-outlined text-[20px]">
                            bookmark
                          </span>
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  // Job card layout
                  <>
                    <div
                      className="h-40 w-full bg-cover bg-center relative"
                      style={{ backgroundImage: `url('${opp.image}')` }}
                    >
                      <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-white uppercase tracking-wider">
                        {opp.type}
                      </div>
                    </div>
                    <div className="p-4 flex flex-col gap-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-slate-900 dark:text-white text-lg font-bold leading-tight">
                            {opp.title}
                          </h3>
                          <p className="text-primary font-medium text-sm mt-1">
                            {opp.company}
                          </p>
                        </div>
                        <div className="h-10 w-10 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center overflow-hidden">
                          <span className="material-symbols-outlined text-gray-400">
                            business
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 my-1">
                        {opp.tags.map((tag) => (
                          <span
                            key={tag}
                            className={`px-2 py-1 rounded text-xs font-semibold ${
                              tag.includes("Design")
                                ? "bg-primary/10 text-primary"
                                : "bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300"
                            }`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center gap-4 text-xs text-text-secondary-light dark:text-text-secondary-dark font-medium border-t border-gray-100 dark:border-white/5 pt-3 mt-1">
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[16px]">
                            schedule
                          </span>
                          {opp.timeAgo}
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[16px]">
                            group
                          </span>
                          {opp.applicants} Applicants
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[16px]">
                            public
                          </span>
                          {opp.location}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-1">
                        <button className="flex-1 bg-primary text-white font-bold py-2.5 px-4 rounded-lg text-sm hover:bg-primary/90 transition-colors">
                          Apply Now
                        </button>
                        <button className="p-2.5 rounded-lg border border-gray-200 dark:border-white/10 text-slate-500 dark:text-white hover:bg-gray-50 dark:hover:bg-white/5">
                          <span className="material-symbols-outlined text-[20px]">
                            bookmark
                          </span>
                        </button>
                        <button className="p-2.5 rounded-lg border border-gray-200 dark:border-white/10 text-slate-500 dark:text-white hover:bg-gray-50 dark:hover:bg-white/5">
                          <span className="material-symbols-outlined text-[20px]">
                            share
                          </span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </article>
            </Link>
          ))}
        </div>
      </main>

      {/* Floating Action Button */}
      <Link href="/create-opportunity">
        <button className="fixed bottom-24 lg:bottom-8 right-4 lg:right-8 h-14 w-14 rounded-full bg-primary text-white shadow-lg shadow-primary/25 flex items-center justify-center z-40 hover:scale-105 transition-transform cursor-pointer">
          <span className="material-symbols-outlined text-[32px]">add</span>
        </button>
      </Link>

      {/* Bottom Navigation (Mobile Only) */}
      <nav className="fixed bottom-0 w-full bg-surface-light dark:bg-surface-dark border-t border-gray-200 dark:border-white/5 pb-6 pt-3 px-6 z-50 lg:hidden">
        <ul className="flex justify-between items-center max-w-7xl mx-auto">
          <li>
            <a className="flex flex-col items-center gap-1 group" href="#">
              <span className="material-symbols-outlined text-primary text-[28px] group-hover:scale-110 transition-transform">
                home
              </span>
              <span className="text-[10px] font-bold text-primary">Home</span>
            </a>
          </li>
          <li>
            <a className="flex flex-col items-center gap-1 group" href="#">
              <span className="material-symbols-outlined text-gray-400 text-[28px] group-hover:text-primary transition-colors">
                explore
              </span>
              <span className="text-[10px] font-medium text-gray-400 group-hover:text-primary transition-colors">
                Explore
              </span>
            </a>
          </li>
          <li>
            <Link
              className="flex flex-col items-center gap-1 group"
              href="/messages"
            >
              <div className="relative">
                <span className="material-symbols-outlined text-gray-400 text-[28px] group-hover:text-primary transition-colors">
                  chat_bubble
                </span>
                <span className="absolute -top-1 -right-1 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-surface-light dark:border-surface-dark"></span>
              </div>
              <span className="text-[10px] font-medium text-gray-400 group-hover:text-primary transition-colors">
                Messages
              </span>
            </Link>
          </li>
          <li>
            <a
              className="flex flex-col items-center gap-1 group"
              href="/dashboard"
            >
              <span className="material-symbols-outlined text-gray-400 text-[28px] group-hover:text-primary transition-colors">
                person
              </span>
              <span className="text-[10px] font-medium text-gray-400 group-hover:text-primary transition-colors">
                Profile
              </span>
            </a>
          </li>
        </ul>
      </nav>

      {/* Desktop Navbar */}
      <nav className="hidden lg:fixed lg:flex bottom-0 right-0 w-64 h-full bg-surface-light dark:bg-surface-dark border-l border-gray-200 dark:border-white/5 p-6 flex-col z-40">
        <div className="flex items-center gap-2 mb-8">
          <span className="material-symbols-outlined text-primary text-2xl">
            school
          </span>
          <span className="text-slate-900 dark:text-white font-bold">
            CampusConnect
          </span>
        </div>

        {/* Navigation Tabs */}
        <div className="flex-1 space-y-2">
          <Link href="/dashboard">
            <button className="w-full text-left px-4 py-3 rounded-lg bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 transition-colors font-semibold text-sm flex items-center gap-2">
              <span className="material-symbols-outlined">home</span>
              Dashboard
            </button>
          </Link>
          <Link href="/guest">
            <button className="w-full text-left px-4 py-3 rounded-lg text-slate-600 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors font-semibold text-sm flex items-center gap-2">
              <span className="material-symbols-outlined">explore</span>
              Explore
            </button>
          </Link>
          <Link href="/messages">
            <button className="w-full text-left px-4 py-3 rounded-lg text-slate-600 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors font-semibold text-sm flex items-center gap-2">
              <span className="material-symbols-outlined">chat_bubble</span>
              Messages
            </button>
          </Link>
          <Link href="/profile/current">
            <button className="w-full text-left px-4 py-3 rounded-lg text-slate-600 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors font-semibold text-sm flex items-center gap-2">
              <span className="material-symbols-outlined">person</span>
              Profile
            </button>
          </Link>
        </div>

        <div className="space-y-2 pb-4 border-b border-gray-200 dark:border-white/10">
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              window.location.href = "/";
            }}
            className="w-full text-left px-4 py-3 rounded-lg text-slate-600 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors font-semibold text-sm flex items-center gap-2"
          >
            <span className="material-symbols-outlined">logout</span>
            Logout
          </button>
        </div>

        <div className="border-t border-gray-200 dark:border-white/10 pt-4">
          <div className="text-center">
            <p className="text-slate-900 dark:text-white font-semibold text-sm">
              {firstName}
            </p>
            <p className="text-text-secondary-light dark:text-text-secondary-dark text-xs">
              {user.email}
            </p>
          </div>
        </div>
      </nav>
    </div>
  );
}
