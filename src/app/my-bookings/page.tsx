"use client";

import { useState } from "react";
import Navbar from "../(main)/_components/Navbar";
import Link from "next/link";
import { lookupBookings } from "@/lib/functions/bookingActions";
import { Booking } from "@/lib/types/skillswap";
import { Search, Clock, CheckCircle2, XCircle, AlertCircle, ArrowRight, BookmarkCheck, Sparkles } from "lucide-react";

export default function MyBookingsPage() {
  const [query, setQuery] = useState("");
  const [bookings, setBookings] = useState<Booking[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setSearched(true);
    const results = await lookupBookings(query);
    setBookings(results);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-inter">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Title Header */}
        <div className="text-center max-w-xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3.5 py-1 text-xs font-semibold text-indigo-700 mb-3">
            <BookmarkCheck className="h-4 w-4" />
            <span>No Account Lookup</span>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Track My Bookings</h1>
          <p className="mt-2 text-sm text-gray-600">
            Enter your <strong>Booking Reference Code</strong> (e.g. <code>SKILL-8A4F</code>) or client email to check status.
          </p>
        </div>

        {/* Search Box */}
        <form onSubmit={handleLookup} className="max-w-2xl mx-auto bg-white rounded-2xl border border-gray-200 p-3 shadow-md flex items-center gap-3 mb-12">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              required
              placeholder="e.g. SKILL-8A4F or sarah@snackbrand.co"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 text-sm text-gray-900 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow-md transition-all disabled:opacity-50"
          >
            {loading ? "Searching..." : "Lookup Booking"}
          </button>
        </form>

        {/* Results List */}
        {loading ? (
          <div className="space-y-4 max-w-3xl mx-auto">
            {[1, 2].map((n) => (
              <div key={n} className="h-40 rounded-2xl bg-gray-200 animate-pulse"></div>
            ))}
          </div>
        ) : searched && bookings && bookings.length === 0 ? (
          <div className="max-w-md mx-auto text-center py-12 bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
            <AlertCircle className="h-10 w-10 text-gray-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-gray-900">No Bookings Found</h3>
            <p className="text-xs text-gray-500 mt-1">
              Double-check your reference code or email address and try again.
            </p>
          </div>
        ) : (
          bookings && (
            <div className="space-y-6 max-w-3xl mx-auto">
              {bookings.map((booking) => {
                const gig = booking.gig;
                const creator = booking.creator;
                return (
                  <div
                    key={booking.id}
                    className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-5"
                  >
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <span className="font-mono text-sm font-extrabold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg border border-indigo-100">
                            {booking.booking_ref}
                          </span>
                          <span className="text-xs text-gray-500">
                            Requested: {new Date(booking.requested_at).toLocaleDateString()}
                          </span>
                        </div>
                        <h2 className="text-lg font-bold text-gray-900 mt-1">{gig?.title || "Gig Service"}</h2>
                      </div>

                      {/* Status Badges */}
                      <div>
                        {booking.status === "pending" && (
                          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold">
                            <Clock className="h-4 w-4 text-amber-600" />
                            Pending Creator Review
                          </span>
                        )}
                        {booking.status === "accepted" && (
                          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
                            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                            Accepted by Creator
                          </span>
                        )}
                        {booking.status === "declined" && (
                          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-rose-50 text-rose-800 border border-rose-200 text-xs font-bold">
                            <XCircle className="h-4 w-4 text-rose-600" />
                            Declined by Creator
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Creator & Client Info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-gray-600">
                      <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
                        <img
                          src={creator?.avatar || "/user.png"}
                          alt="Creator"
                          className="h-9 w-9 rounded-full object-cover"
                        />
                        <div>
                          <span className="text-[10px] text-gray-400 font-semibold uppercase block">Creator</span>
                          <strong className="text-gray-900 text-xs">{creator?.full_name}</strong> ({creator?.primary_category})
                        </div>
                      </div>

                      <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                        <span className="text-[10px] text-gray-400 font-semibold uppercase block">Client Details</span>
                        <strong className="text-gray-900 text-xs">{booking.client_name}</strong> ({booking.client_email})
                      </div>
                    </div>

                    {/* Brief Notes */}
                    {booking.brief_notes && (
                      <div className="text-xs bg-gray-50 p-3 rounded-xl text-gray-700">
                        <strong className="text-gray-900">Submitted Brief:</strong> {booking.brief_notes}
                      </div>
                    )}

                    {/* DP1 DECLINE REASON & RE-DIRECTION */}
                    {booking.status === "declined" && (
                      <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-xs text-rose-900 space-y-3">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="h-4 w-4 text-rose-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <strong>Decline Note from Creator:</strong>{" "}
                            {booking.decline_reason || "The creator's schedule is currently full for this request."}
                          </div>
                        </div>

                        <div className="pt-2 border-t border-rose-200/60 flex items-center justify-between">
                          <span className="text-rose-700 font-medium">Looking for another creator in this category?</span>
                          <Link
                            href={`/marketplace?category=${gig?.category || "All"}`}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-rose-600 text-white font-bold hover:bg-rose-700 transition-colors"
                          >
                            <span>Browse Similar Gigs</span>
                            <ArrowRight className="h-3.5 w-3.5" />
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )
        )}
      </main>
    </div>
  );
}
