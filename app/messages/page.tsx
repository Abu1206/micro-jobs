"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantAvatar?: string;
  lastMessage: string;
  lastMessageTime: string;
  isOnline: boolean;
  unread: boolean;
  opportunityContext?: {
    id: string;
    title: string;
    icon: string;
  };
}

interface ActiveUser {
  id: string;
  name: string;
  avatar?: string;
  isOnline: boolean;
}

export default function Messages() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeUsers, setActiveUsers] = useState<ActiveUser[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        // Fetch conversations from database
        const { data: convData } = await supabase
          .from("conversations")
          .select("*")
          .or(`participant_1_id.eq.${user.id},participant_2_id.eq.${user.id}`)
          .order("last_message_at", { ascending: false });

        if (convData) {
          // Transform raw conversation data to match interface
          const transformedConversations = await Promise.all(
            convData.map(async (conv: any) => {
              const otherParticipantId =
                conv.participant_1_id === user.id
                  ? conv.participant_2_id
                  : conv.participant_1_id;

              const { data: participant } = await supabase
                .from("user_profiles")
                .select("full_name, avatar_url")
                .eq("user_id", otherParticipantId)
                .single();

              // Fetch last message
              const { data: lastMsg } = await supabase
                .from("messages")
                .select("content, created_at")
                .eq("conversation_id", conv.id)
                .order("created_at", { ascending: false })
                .limit(1)
                .single();

              return {
                id: conv.id,
                participantId: otherParticipantId,
                participantName: participant?.full_name || "Unknown",
                participantAvatar: participant?.avatar_url || undefined,
                lastMessage: lastMsg?.content || "",
                lastMessageTime: lastMsg?.created_at || conv.last_message_at,
                isOnline: Math.random() > 0.5,
                unread: false,
                opportunityContext: conv.opportunity_id
                  ? { id: conv.opportunity_id, title: "Opportunity", icon: "💼" }
                  : undefined,
              };
            })
          );
          setConversations(transformedConversations);
        }

        // Fetch online users from user_profiles
        const { data: usersData } = await supabase
          .from("user_profiles")
          .select("user_id, full_name, avatar_url")
          .neq("user_id", user.id)
          .limit(8);

        if (usersData) {
          setActiveUsers(
            usersData.map((u: any) => ({
              id: u.user_id,
              name: u.full_name,
              avatar: u.avatar_url,
              isOnline: Math.random() > 0.5,
            })),
          );
        }
      }

      setLoading(false);
    };

    getUser();
  }, []);

  const filteredConversations = conversations.filter((conv) =>
    conv.participantName?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const unreadCount = conversations.filter((c) => c.unread).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="relative flex justify-center min-h-screen bg-black">
      <div className="relative flex h-full min-h-screen w-full max-w-2xl flex-col bg-background-light dark:bg-background-dark">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md px-5 py-3 pt-4 flex items-center justify-between border-b border-gray-200 dark:border-white/10">
          <div className="flex flex-col">
            <Link href="/dashboard" className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-primary text-xl">
                school
              </span>
              <h1 className="text-lg font-bold text-slate-900 dark:text-white">
                Micra Jobs
              </h1>
            </Link>
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
              {unreadCount} unread
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-surface-dark transition-colors text-gray-900 dark:text-white">
              <span className="material-symbols-outlined text-[24px]">
                tune
              </span>
            </button>
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
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto pb-24 scroll-smooth no-scrollbar">
          {/* Search Bar */}
          <div className="px-5 py-4">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-gray-400 group-focus-within:text-primary transition-colors">
                  search
                </span>
              </div>
              <input
                type="text"
                placeholder="Search messages or people..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-3.5 border-none rounded-xl bg-gray-100 dark:bg-surface-dark text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all shadow-sm"
              />
            </div>
          </div>

          {/* Active Now Section */}
          <section className="mb-6">
            <div className="px-5 mb-3 flex items-center justify-between">
              <h2 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                Active Now
              </h2>
            </div>
            <div className="flex overflow-x-auto no-scrollbar px-5 gap-4 pb-2">
              {/* Add Note */}
              <div className="flex flex-col items-center space-y-1.5 min-w-16">
                <div className="w-16 h-16 rounded-full border-2 border-dashed border-gray-300 dark:border-gray-700 flex items-center justify-center bg-gray-50 dark:bg-surface-dark text-gray-400 hover:border-primary hover:text-primary transition-colors cursor-pointer">
                  <span className="material-symbols-outlined">add</span>
                </div>
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400 text-center truncate w-full">
                  Your Note
                </span>
              </div>

              {/* Active Users */}
              {activeUsers.map((activeUser) => (
                <div
                  key={activeUser.id}
                  className="flex flex-col items-center space-y-1.5 min-w-16 relative group cursor-pointer"
                >
                  <div className="relative">
                    {activeUser.isOnline && (
                      <div className="p-0.5 rounded-full bg-linear-to-tr from-primary to-transparent">
                        <img
                          alt={activeUser.name}
                          src={activeUser.avatar}
                          className="w-15 h-15 rounded-full object-cover border-2 border-background-light dark:border-background-dark"
                        />
                      </div>
                    )}
                    {!activeUser.isOnline && (
                      <img
                        alt={activeUser.name}
                        src={activeUser.avatar}
                        className="w-15 h-15 rounded-full object-cover border-2 border-transparent group-hover:border-gray-300 dark:group-hover:border-gray-700 transition-all"
                      />
                    )}
                    {activeUser.isOnline && (
                      <div className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 bg-[#10b981] border-2 border-background-light dark:border-background-dark rounded-full"></div>
                    )}
                  </div>
                  <span className="text-xs font-medium text-gray-900 dark:text-white text-center truncate w-full">
                    {activeUser.name}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Recent Conversations Section */}
          <section>
            <div className="px-5 mb-2 sticky top-0 z-10 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm py-2">
              <h2 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                Recent Conversations
              </h2>
            </div>

            <div className="flex flex-col">
              {filteredConversations.length > 0 ? (
                filteredConversations.map((conv) => (
                  <div
                    key={conv.id}
                    className={`relative group flex items-start gap-4 px-5 py-4 hover:bg-gray-50 dark:hover:bg-surface-dark transition-all cursor-pointer border-l-[3px] ${
                      conv.unread
                        ? "border-primary bg-primary/5 dark:bg-primary/5"
                        : "border-transparent"
                    }`}
                  >
                    {/* Avatar */}
                    <div className="relative shrink-0 pt-1">
                      {conv.participantAvatar ? (
                        <img
                          alt={conv.participantName}
                          src={conv.participantAvatar}
                          className={`w-14 h-14 rounded-full object-cover shadow-sm ${
                            !conv.isOnline ? "grayscale-20" : ""
                          }`}
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-full bg-linear-to-br from-gray-700 to-black dark:from-gray-600 dark:to-gray-900 flex items-center justify-center text-white font-bold text-lg shadow-inner">
                          {conv.participantName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                      )}
                      {conv.isOnline && (
                        <div className="absolute bottom-0 -right-1 w-4 h-4 bg-[#10b981] border-[3px] border-background-light dark:border-background-dark rounded-full"></div>
                      )}
                    </div>

                    {/* Message Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline mb-1">
                        <h3
                          className={`text-[17px] font-bold text-slate-900 dark:text-white truncate ${
                            conv.unread ? "font-extrabold" : ""
                          }`}
                        >
                          {conv.participantName}
                        </h3>
                        <span
                          className={`text-xs font-semibold ${
                            conv.unread
                              ? "bg-primary/10 text-primary px-2 py-0.5 rounded-full"
                              : "text-gray-500"
                          }`}
                        >
                          {conv.lastMessageTime}
                        </span>
                      </div>

                      {/* Opportunity Context */}
                      {conv.opportunityContext && (
                        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-primary/10 mb-2 border border-primary/20">
                          <span className="material-symbols-outlined text-[14px] text-primary">
                            {conv.opportunityContext.icon}
                          </span>
                          <span className="text-[10px] font-bold uppercase tracking-wide text-primary">
                            {conv.opportunityContext.title}
                          </span>
                        </div>
                      )}

                      {/* Last Message */}
                      <p
                        className={`text-[15px] line-clamp-2 leading-snug ${
                          conv.unread
                            ? "text-slate-900 dark:text-white font-semibold"
                            : "text-gray-500 dark:text-gray-400 font-normal"
                        }`}
                      >
                        {conv.lastMessage}
                      </p>
                    </div>

                    {/* Unread Indicator */}
                    {conv.unread && (
                      <div className="shrink-0 self-center pl-2">
                        <div className="w-2.5 h-2.5 bg-primary rounded-full shadow-lg shadow-primary/50"></div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center py-12">
                  <p className="text-gray-500 dark:text-gray-400 text-center">
                    No conversations found
                  </p>
                </div>
              )}
            </div>
          </section>
        </main>

        {/* Bottom Navigation (Mobile Only) */}
        <nav className="fixed bottom-0 w-full max-w-2xl bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-xl border-t border-gray-200 dark:border-white/10 pb-5 pt-3 px-6 z-50 lg:hidden">
          <ul className="flex justify-between items-center">
            <li>
              <Link
                href="/dashboard"
                className="group flex flex-col items-center gap-1.5 text-gray-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                <span className="material-symbols-outlined text-[26px] group-hover:-translate-y-0.5 transition-transform">
                  home
                </span>
                <span className="text-[10px] font-medium tracking-wide">
                  Home
                </span>
              </Link>
            </li>
            <li>
              <a
                href="#"
                className="group flex flex-col items-center gap-1.5 text-gray-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                <span className="material-symbols-outlined text-[26px] group-hover:-translate-y-0.5 transition-transform">
                  explore
                </span>
                <span className="text-[10px] font-medium tracking-wide">
                  Explore
                </span>
              </a>
            </li>
            <li>
              <a
                href="#"
                className="group flex flex-col items-center gap-1.5 text-primary"
              >
                <div className="relative">
                  <span className="material-symbols-outlined text-[26px] fill-current">
                    chat_bubble
                  </span>
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                  </span>
                </div>
                <span className="text-[10px] font-bold tracking-wide">
                  Messages
                </span>
              </a>
            </li>
            <li>
              <Link
                href="/dashboard"
                className="group flex flex-col items-center gap-1.5 text-gray-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                <span className="material-symbols-outlined text-[26px] group-hover:-translate-y-0.5 transition-transform">
                  person
                </span>
                <span className="text-[10px] font-medium tracking-wide">
                  Profile
                </span>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
