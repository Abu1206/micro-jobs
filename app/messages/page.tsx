"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantAvatar: string;
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
  avatar: string;
  isOnline: boolean;
}

const MOCK_ACTIVE_USERS: ActiveUser[] = [
  {
    id: "1",
    name: "Sarah",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCynRdnEdv2NOdP6pSYNLQON12ct8iybpKQUAyVgvxUE7y-vBpiJrF_EIrmaMC6aT1zhHUZ8g8I8LbIOcN_aymQoOwwNaAdu-kfh0MoObujdh4H8IOYvqR5gyoeVh709sLJZi-Ogq9FQQo7AAAvPC1M7nInE1xZlGHhClD89HoM949iBVwIm9z9iftve4AsJ6WBC_g_ybf5GsmO_pRXK9sKnbilUv8kfkF2OKnWW_UCpry1opFK2tnv4hJPdmugx2aOpcp8PVfltGgP",
    isOnline: true,
  },
  {
    id: "2",
    name: "Mike",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAZ5hM7d5SRsfNSDJYhbmMNkc_RrM_Ahqy-NYjbxNBLNQSQt3O72xGL5nOFDjVoa9N5Br0FpP6nFNpKC4yWF0v-qSkxqZsZOfF2J9wMCElcMK5pgdt-OwESeJRgVauls0xWIdKfLjcJRw65o7d0C-mqkdahvv9E85dC7NklhsEd0p7o7A1BMuJWs1LteRC_A2opOGU3-wH9ak_zhdYZdWo00gRCZfFOrLx8v9hStoiHG3OK566hr4-tMftGmpPPkZwslxeC4g-0xJ-i",
    isOnline: true,
  },
  {
    id: "3",
    name: "Emily",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAGNVsB3aw9QBUqKau9ZJOhjDyIt9nqGP6yK25osywdZx1Zr3NgSwEtnqjqEvxb5qC6OaWo1Nd1E-iVrpxhqoZe9FuF4PV3Nb0Wjy0212oNyAlZrwPMB46FkH4UZx208T_p_zbWhkLBJsONqzi_tGLCWKQX1QwgOooYrxFk6s4HhJGFeU3ym28SHdYYb5L5w_9cglE0DhPo2b0yR3sK1WOlj01KrnLEr-WZdOFTS8wqhLTCoJNpITjpq_DWb3Aj7w7uyAoIfIUXcAGd",
    isOnline: false,
  },
  {
    id: "4",
    name: "David",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAlgk1eSUPN5OIap0rfnOlcf8_jAI6TV47XvR9B1tEttOKruQTVfjYugW21b7ZCXzalqwwdIjahAEQYwCOHbVf9UGKP97Rgk7uZ6c3KkHf2ujip_GIyChLwk4zMI6L0cHazLS98_iOFv_kFRjPkC_SOSMh6JssN6RHTJA30LW5QDxjkFU_mhapKNXb-X5rlxFs7Zl9iBq3ao-VdywoGSbB0qWGYCfmL8xawNN1U1RHGfw_AJ4El6lsyVz6DfTjt9gWUIknq9ZnogHbX",
    isOnline: false,
  },
];

const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: "1",
    participantId: "alex-johnson",
    participantName: "Alex Johnson",
    participantAvatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDUl1y93l0Xii93aAIQldxlCMsxkCCAXRdsFEw7HMjSf0A1a3j0ZZLDHYnrgX-loDwyefhk60FWQshLvjAS5azrD_4db74fSS8SMK8Z-Npiheq8YqxAXV85FnlDnOB8KQrZIkiDF-01IPPBRRlpoHTYLuvqcqDiBrUcuhRjSXRKK9ZMCLPOBml0oaytsEzgvXBslBrLv6Us1lea_ETOe72dcZLrKNASWr-S7GTWk5dJEzLCrT3JsGVxqehWZaoUkPHIU-tYg0z2qFmL",
    lastMessage:
      "Hey! Are you free to discuss the portfolio requirements? I have some updates on the timeline.",
    lastMessageTime: "2m",
    isOnline: true,
    unread: true,
    opportunityContext: {
      id: "1",
      title: "Graphic Design Internship",
      icon: "work",
    },
  },
  {
    id: "2",
    participantId: "jessica-lee",
    participantName: "Jessica Lee",
    participantAvatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDCRznaMNurYE0MjYg79qrPr82KHyh0t06aCKjpo3tnOaY-BiGq1u6Sb9ApAqrMYcmi-uwEQsONKe8EAGGLNAXQ5GUmJopcXS-5t4NYDfBzdsMcgXH6O-4heT3nxXuHER195pt_iWjVobi7h8pVZM48PEd4kc9LgbkIdT0VlplEGE2gnH8VOyHwoi3fVKS-iiBP2bWb4rvUaKtElzyggkNQiZggiEM3zLdnWND1xRnFjRgOWk_2MuJdK2EfHl6s5KjD5YaX1wApt53z",
    lastMessage:
      "See you at the kickoff event tomorrow! Don't forget your laptop.",
    lastMessageTime: "1h",
    isOnline: false,
    unread: false,
    opportunityContext: {
      id: "2",
      title: "Spring Hackathon",
      icon: "code",
    },
  },
  {
    id: "3",
    participantId: "mark-peterson",
    participantName: "Mark Peterson",
    participantAvatar: undefined,
    lastMessage:
      "Thanks for sharing that link. I'll check it out later tonight.",
    lastMessageTime: "3h",
    isOnline: false,
    unread: false,
  },
  {
    id: "4",
    participantId: "ryan-co",
    participantName: "Ryan Co",
    participantAvatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBdc0-AXAd5IJod1P33bXLmzxp-uQiCLLkWPcZClo8nyKxpkdZTNZNkYtpDV4dGkDOhPRGwBy0kBonyzx8PxU01jNwrohQgCZUdm_VpU8MLK6ZEueF2V2XOYl-oZGbHlUtUfvUM71hEvOSzEA9LCYeehVO1KB21EFB_ff5By4RK1o0thUUgt5zRK1n2pJSPgmSAKaESL8dlY7YADQhH8MXqpA9LaGoL3KZpufE1F4J6iALXlSsf6aY2jvKiXnLf5XooQj2avHtTAYul",
    lastMessage: "Should we bring our own gloves?",
    lastMessageTime: "Yesterday",
    isOnline: false,
    unread: false,
    opportunityContext: {
      id: "3",
      title: "Campus Garden Clean-up",
      icon: "volunteer_activism",
    },
  },
  {
    id: "5",
    participantId: "chloe-davis",
    participantName: "Chloe Davis",
    participantAvatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC5Rm3pp1Upf-kEd0I0kPRHmYtiU6prM5DH2lQOaCjudtZr-xb0l2JKDwQiMe0OQwHNc7Lf91zmk4mTO3cA6YWYeDsDtJHdi5LqhMhg-CuXaMmRoyfyWMlo79hljKhzI43N7KWM-eJ4V5cUakJH3yBgMbatvID5vfh54qwF8nhOUsTUI2Eesud6iPzmeR3cwTi5NwLNUVAQXacKvil_7huJb1aIgJy54zu_yctBgBF1MXy2O6qjhFjleuSYlp6LvcWtbjkuTGgW9V4F",
    lastMessage: "Sent an image",
    lastMessageTime: "Yesterday",
    isOnline: false,
    unread: false,
  },
];

export default function Messages() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [conversations, setConversations] = useState(MOCK_CONVERSATIONS);
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/auth/login");
        return;
      }

      setUser(user);
      setLoading(false);
    };

    getUser();
  }, []);

  const filteredConversations = conversations.filter((conv) =>
    conv.participantName.toLowerCase().includes(searchQuery.toLowerCase())
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
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight leading-tight">
              Messages
            </h1>
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
              You have {unreadCount} unread chats
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-surface-dark transition-colors text-gray-900 dark:text-white">
              <span className="material-symbols-outlined text-[24px]">
                tune
              </span>
            </button>
            <button className="flex items-center justify-center h-10 w-10 rounded-full bg-primary text-white hover:opacity-90 transition-opacity shadow-lg shadow-primary/25 group">
              <span className="material-symbols-outlined text-[22px] font-semibold group-hover:scale-110 transition-transform">
                edit_square
              </span>
            </button>
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
              <div className="flex flex-col items-center space-y-1.5 min-w-[64px]">
                <div className="w-16 h-16 rounded-full border-2 border-dashed border-gray-300 dark:border-gray-700 flex items-center justify-center bg-gray-50 dark:bg-surface-dark text-gray-400 hover:border-primary hover:text-primary transition-colors cursor-pointer">
                  <span className="material-symbols-outlined">add</span>
                </div>
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400 text-center truncate w-full">
                  Your Note
                </span>
              </div>

              {/* Active Users */}
              {MOCK_ACTIVE_USERS.map((activeUser) => (
                <div
                  key={activeUser.id}
                  className="flex flex-col items-center space-y-1.5 min-w-[64px] relative group cursor-pointer"
                >
                  <div className="relative">
                    {activeUser.isOnline && (
                      <div className="p-0.5 rounded-full bg-gradient-to-tr from-primary to-transparent">
                        <img
                          alt={activeUser.name}
                          src={activeUser.avatar}
                          className="w-[60px] h-[60px] rounded-full object-cover border-2 border-background-light dark:border-background-dark"
                        />
                      </div>
                    )}
                    {!activeUser.isOnline && (
                      <img
                        alt={activeUser.name}
                        src={activeUser.avatar}
                        className="w-[60px] h-[60px] rounded-full object-cover border-2 border-transparent group-hover:border-gray-300 dark:group-hover:border-gray-700 transition-all"
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
                            !conv.isOnline ? "grayscale-[20%]" : ""
                          }`}
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-gray-700 to-black dark:from-gray-600 dark:to-gray-900 flex items-center justify-center text-white font-bold text-lg shadow-inner">
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
