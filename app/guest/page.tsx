"use client";

import Link from "next/link";
import { useState } from "react";

const jobListings = [
  {
    id: 1,
    title: "Campus Tour Guide",
    company: "Student Services",
    location: "Main Campus",
    salary: "$15/hour",
    type: "Part-time",
    category: "Campus",
  },
  {
    id: 2,
    title: "Library Assistant",
    company: "University Library",
    location: "Central Library",
    salary: "$14/hour",
    type: "Part-time",
    category: "On-Campus",
  },
  {
    id: 3,
    title: "Tutor - Math",
    company: "Academic Support",
    location: "Online",
    salary: "$20/hour",
    type: "Flexible",
    category: "Online",
  },
  {
    id: 4,
    title: "Event Coordinator",
    company: "Student Activities",
    location: "Student Center",
    salary: "$16/hour",
    type: "Part-time",
    category: "Campus",
  },
];

const upcomingEvents = [
  {
    id: 1,
    title: "Career Fair 2026",
    date: "Jan 15, 2026",
    time: "10:00 AM",
    location: "Convention Center",
    attendees: 250,
  },
  {
    id: 2,
    title: "Networking Mixer",
    date: "Jan 18, 2026",
    time: "6:00 PM",
    location: "Student Lounge",
    attendees: 85,
  },
  {
    id: 3,
    title: "Tech Talk - AI in Campus Life",
    date: "Jan 22, 2026",
    time: "2:00 PM",
    location: "Tech Building Room 101",
    attendees: 120,
  },
];

export default function GuestBrowse() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredJobs = selectedCategory
    ? jobListings.filter((job) => job.category === selectedCategory)
    : jobListings;

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-[#111418] dark:text-white">
      {/* Header/Navigation */}
      <header className="sticky top-0 z-20 bg-background-dark/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-2xl">
              school
            </span>
            <span className="text-white font-bold text-lg uppercase hidden sm:inline">
              CampusConnect
            </span>
          </Link>

          <nav className="flex items-center gap-4">
            <Link
              href="/auth/login"
              className="text-sm font-semibold text-primary hover:text-blue-400 transition-colors"
            >
              Log In
            </Link>
            <Link
              href="/auth/signup"
              className="px-6 py-2 bg-primary hover:bg-blue-500 text-white font-semibold rounded-lg transition-colors"
            >
              Sign Up
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/20 to-transparent py-12 lg:py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">
            Browse Campus Opportunities
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Explore jobs, events, and community opportunities available to
            students. Create an account to apply for positions.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-surface-dark rounded-xl p-6 border border-white/10 sticky top-24">
              <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined">filter_alt</span>
                Filters
              </h3>

              <div className="space-y-4">
                <div>
                  <h4 className="text-white font-semibold mb-3 text-sm uppercase">
                    Job Type
                  </h4>
                  <div className="space-y-2">
                    {["All", "Campus", "On-Campus", "Online"].map(
                      (category) => (
                        <button
                          key={category}
                          onClick={() =>
                            setSelectedCategory(
                              category === "All" ? null : category
                            )
                          }
                          className={`w-full text-left px-3 py-2 rounded-lg transition-colors text-sm ${
                            selectedCategory === category ||
                            (category === "All" && !selectedCategory)
                              ? "bg-primary text-white"
                              : "text-gray-400 hover:text-white hover:bg-white/10"
                          }`}
                        >
                          {category}
                        </button>
                      )
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <h4 className="text-white font-semibold mb-3 text-sm uppercase">
                    Salary Range
                  </h4>
                  <select className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary">
                    <option>Any</option>
                    <option>$10-$15/hour</option>
                    <option>$15-$20/hour</option>
                    <option>$20+/hour</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Jobs Section */}
          <div className="lg:col-span-2 space-y-8">
            {/* Jobs */}
            <div>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">
                  work
                </span>
                Job Listings
              </h2>

              <div className="space-y-4">
                {filteredJobs.map((job) => (
                  <div
                    key={job.id}
                    className="bg-surface-dark border border-white/10 rounded-xl p-6 hover:border-primary/50 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors">
                          {job.title}
                        </h3>
                        <p className="text-gray-400 text-sm">{job.company}</p>
                      </div>
                      <span className="text-xs font-semibold text-primary bg-primary/20 px-3 py-1 rounded-full">
                        {job.type}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-400">
                      <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">
                          location_on
                        </span>
                        {job.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">
                          attach_money
                        </span>
                        {job.salary}
                      </div>
                    </div>

                    <div className="text-xs text-gray-500">
                      Sign up to view full details and apply
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Events */}
            <div>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">
                  event
                </span>
                Upcoming Events
              </h2>

              <div className="space-y-4">
                {upcomingEvents.map((event) => (
                  <div
                    key={event.id}
                    className="bg-surface-dark border border-white/10 rounded-xl p-6 hover:border-primary/50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-white">
                          {event.title}
                        </h3>
                        <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-400">
                          <div className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">
                              calendar_today
                            </span>
                            {event.date}
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">
                              schedule
                            </span>
                            {event.time}
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">
                              location_on
                            </span>
                            {event.location}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-primary font-bold">
                          {event.attendees}
                        </p>
                        <p className="text-xs text-gray-400">attending</p>
                      </div>
                    </div>
                    <button className="w-full mt-4 py-2 border border-white/10 rounded-lg text-white hover:bg-white/5 transition-colors text-sm font-semibold">
                      View Details
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary/20 to-transparent py-12 lg:py-16 px-6 mt-12">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-gray-400 text-lg mb-8">
            Create an account to apply for jobs, attend events, and connect with
            your campus community.
          </p>
          <Link href="/auth/signup">
            <button className="px-8 py-3 bg-primary hover:bg-blue-500 text-white font-bold rounded-lg transition-colors">
              Create Account
            </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-surface-dark border-t border-white/10 py-8 px-6">
        <div className="max-w-7xl mx-auto text-center text-gray-400 text-sm">
          <p>© 2026 CampusConnect. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
