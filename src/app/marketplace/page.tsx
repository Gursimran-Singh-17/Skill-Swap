"use client";

import { useState, useEffect } from "react";
import Navbar from "../(main)/_components/Navbar";
import Link from "next/link";
import { getGigsPaginated } from "@/lib/functions/gigActions";
import { Gig, CategoryType } from "@/lib/types/skillswap";
import { Search, Star, Filter, ArrowUpRight, Palette, Scissors, GraduationCap, Music, Clock } from "lucide-react";

export default function MarketplacePage() {
  const [category, setCategory] = useState<CategoryType | "All">("All");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "price_low" | "price_high" | "rating">("newest");
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadGigs() {
      setLoading(true);
      const data = await getGigsPaginated({ category, search, sortBy });
      setGigs(data);
      setLoading(false);
    }
    loadGigs();
  }, [category, search, sortBy]);

  const categories = [
    { id: "All", label: "All Gigs", icon: Filter },
    { id: "Design", label: "Design", icon: Palette },
    { id: "Editing", label: "Editing", icon: Scissors },
    { id: "Tutoring", label: "Tutoring", icon: GraduationCap },
    { id: "Music", label: "Music", icon: Music },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-inter">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-gray-200">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Marketplace</h1>
            <p className="mt-1 text-sm text-gray-600">
              Browse services listed by talented young creators across Design, Editing, Tutoring, and Music.
            </p>
          </div>

          <Link
            href="/post-gig"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-indigo-200 hover:bg-indigo-700 transition-all"
          >
            <span>+ Post a New Gig</span>
          </Link>
        </div>

        {/* Search & Filter Bar */}
        <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = category === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setCategory(cat.id as any)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                      : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-100"
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? "text-white" : "text-gray-500"}`} />
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Search Input & Sort Selector */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search gigs or creators..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white pl-10 pr-4 py-2.5 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            {/* DP3 Discovery Sort Toggle */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm font-medium text-gray-700 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="newest">Newest First (Default)</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>

        {/* Gigs Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="h-64 rounded-2xl bg-gray-200 animate-pulse"></div>
            ))}
          </div>
        ) : gigs.length === 0 ? (
          <div className="mt-16 text-center py-16 bg-white rounded-2xl border border-gray-200 p-8 max-w-lg mx-auto">
            <Filter className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-900">No gigs found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search query or switching category filters.
            </p>
            <button
              onClick={() => {
                setCategory("All");
                setSearch("");
                setSortBy("newest");
              }}
              className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-800"
            >
              Reset all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
            {gigs.map((gig) => {
              const creator = gig.creator;
              return (
                <div
                  key={gig.id}
                  className="group flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  <div>
                    {/* Category Badge & Price */}
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                        {gig.category}
                      </span>
                      <span className="text-lg font-extrabold text-gray-900">
                        ₹{gig.rate}{" "}
                        <span className="text-xs font-medium text-gray-500">
                          /{gig.rate_type === "fixed" ? "fixed" : gig.rate_type === "hourly" ? "hr" : "session"}
                        </span>
                      </span>
                    </div>

                    {/* Gig Title */}
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-2 leading-snug">
                      {gig.title}
                    </h3>

                    {/* Description */}
                    <p className="mt-2 text-xs text-gray-600 line-clamp-3 leading-relaxed">
                      {gig.description}
                    </p>

                    {/* Category Detail Preview Pill */}
                    {gig.category_details && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {"subcategory" in gig.category_details && (
                          <span className="text-[11px] font-medium bg-gray-100 text-gray-700 px-2.5 py-1 rounded-md">
                            {(gig.category_details as any).subcategory}
                          </span>
                        )}
                        {"subject" in gig.category_details && (
                          <span className="text-[11px] font-medium bg-gray-100 text-gray-700 px-2.5 py-1 rounded-md">
                            {(gig.category_details as any).subject}
                          </span>
                        )}
                        {"turnaroundTime" in gig.category_details && (
                          <span className="text-[11px] font-medium bg-gray-100 text-gray-700 px-2.5 py-1 rounded-md flex items-center gap-1">
                            <Clock className="h-3 w-3 text-gray-500" />
                            {(gig.category_details as any).turnaroundTime}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Creator Info & Action */}
                  <div className="mt-6 border-t border-gray-100 pt-4 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={creator?.avatar || "/user.png"}
                        alt={creator?.full_name || "Creator"}
                        className="h-8 w-8 rounded-full object-cover border border-gray-200"
                      />
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-gray-900">{creator?.full_name || "Young Creator"}</span>
                        <div className="flex items-center gap-1 text-[11px] text-amber-500 font-medium">
                          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                          <span>{creator?.rating || 5.0}</span>
                        </div>
                      </div>
                    </div>

                    <Link
                      href={`/gig/${gig.id}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      <span>Book Gig</span>
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
