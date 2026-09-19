"use client";

import { useState, useEffect, use } from "react";
import Navbar from "../../(main)/_components/Navbar";
import Link from "next/link";
import { getGigById } from "@/lib/functions/gigActions";
import { createBooking } from "@/lib/functions/bookingActions";
import { Gig, Booking } from "@/lib/types/skillswap";
import { Star, CheckCircle2, ArrowLeft, Clock, ExternalLink, Play, Copy, Check, ShieldCheck, Sparkles, Send } from "lucide-react";

export default function GigDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const gigId = resolvedParams.id;

  const [gig, setGig] = useState<Gig | null>(null);
  const [loading, setLoading] = useState(true);

  // Form states
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [briefNotes, setBriefNotes] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);

  // Confirmation modal state
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function loadGig() {
      setLoading(true);
      const data = await getGigById(gigId);
      setGig(data);
      setLoading(false);
    }
    loadGig();
  }, [gigId]);

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientEmail || !gig) return;

    setBookingLoading(true);
    const booking = await createBooking({
      gig_id: gig.id,
      creator_id: gig.creator_id,
      client_name: clientName,
      client_email: clientEmail,
      brief_notes: briefNotes,
    });
    setBookingLoading(false);
    setConfirmedBooking(booking);
  };

  const copyRefCode = () => {
    if (confirmedBooking) {
      navigator.clipboard.writeText(confirmedBooking.booking_ref);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col font-inter">
        <Navbar />
        <div className="max-w-5xl w-full mx-auto px-4 py-16 text-center">
          <div className="h-8 w-48 bg-gray-200 animate-pulse mx-auto rounded-lg mb-4"></div>
          <div className="h-64 w-full bg-gray-200 animate-pulse rounded-2xl"></div>
        </div>
      </div>
    );
  }

  if (!gig) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col font-inter">
        <Navbar />
        <div className="max-w-xl w-full mx-auto px-4 py-20 text-center">
          <h2 className="text-2xl font-bold text-gray-900">Gig Not Found</h2>
          <p className="mt-2 text-sm text-gray-600">The service listing you are looking for may have been removed.</p>
          <Link
            href="/marketplace"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white"
          >
            Back to Marketplace
          </Link>
        </div>
      </div>
    );
  }

  const creator = gig.creator;
  const details = gig.category_details as any;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-inter">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Link
          href="/marketplace"
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-indigo-600 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Marketplace</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Details Column (2 Cols) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header Card */}
            <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                  {gig.category}
                </span>
                {details?.subcategory && (
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
                    {details.subcategory}
                  </span>
                )}
              </div>

              <h1 className="text-3xl font-extrabold text-gray-900 leading-tight">{gig.title}</h1>

              <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-6">
                <div className="flex items-center gap-3">
                  <img
                    src={creator?.avatar || "/user.png"}
                    alt={creator?.full_name || "Creator"}
                    className="h-12 w-12 rounded-full object-cover border-2 border-indigo-100"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">{creator?.full_name}</h3>
                    <p className="text-xs text-gray-500 line-clamp-1">{creator?.bio}</p>
                    <div className="flex items-center gap-1 text-xs text-amber-500 font-semibold mt-0.5">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      <span>{creator?.rating || 5.0} Rating</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs text-gray-500 font-medium">Starting Rate</span>
                  <div className="text-2xl font-black text-indigo-600">
                    ₹{gig.rate}
                    <span className="text-xs font-medium text-gray-500">
                      /{gig.rate_type === "fixed" ? "fixed" : gig.rate_type === "hourly" ? "hr" : "session"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Description Card */}
            <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Service Overview & Scope</h2>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{gig.description}</p>
            </div>

            {/* Category Playbook Details Card */}
            <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50/50 to-white p-8 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-indigo-600" />
                <span>{gig.category} Specific Specifications</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                {/* DESIGN SPECIFICS */}
                {gig.category === "Design" && (
                  <>
                    <div className="bg-white p-4 rounded-xl border border-gray-200/80">
                      <span className="text-xs text-gray-500 font-medium">Revisions Included</span>
                      <p className="text-base font-bold text-gray-900 mt-1">{details?.revisionsIncluded || 2} Revisions</p>
                    </div>
                    {details?.portfolioLink && (
                      <div className="bg-white p-4 rounded-xl border border-gray-200/80">
                        <span className="text-xs text-gray-500 font-medium">Creator Portfolio</span>
                        <a
                          href={details.portfolioLink}
                          target="_blank"
                          rel="noreferrer"
                          className="text-base font-bold text-indigo-600 hover:underline mt-1 flex items-center gap-1.5"
                        >
                          <span>View Portfolio Samples</span>
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </div>
                    )}
                  </>
                )}

                {/* EDITING SPECIFICS */}
                {gig.category === "Editing" && (
                  <>
                    <div className="bg-white p-4 rounded-xl border border-gray-200/80">
                      <span className="text-xs text-gray-500 font-medium">Turnaround Time</span>
                      <p className="text-base font-bold text-gray-900 mt-1 flex items-center gap-1.5">
                        <Clock className="h-4 w-4 text-indigo-600" />
                        <span>{details?.turnaroundTime || "2 days"}</span>
                      </p>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-gray-200/80">
                      <span className="text-xs text-gray-500 font-medium">Accepted File Formats</span>
                      <p className="text-base font-bold text-gray-900 mt-1">{details?.fileFormats || "MP4, MOV, RAW"}</p>
                    </div>
                  </>
                )}

                {/* TUTORING SPECIFICS */}
                {gig.category === "Tutoring" && (
                  <>
                    <div className="bg-white p-4 rounded-xl border border-gray-200/80">
                      <span className="text-xs text-gray-500 font-medium">Subject & Level</span>
                      <p className="text-base font-bold text-gray-900 mt-1">
                        {details?.subject || "General"} ({details?.level || "All Levels"})
                      </p>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-gray-200/80">
                      <span className="text-xs text-gray-500 font-medium">Session Length & Mode</span>
                      <p className="text-base font-bold text-gray-900 mt-1">
                        {details?.sessionLength || "60 mins"} ({details?.mode || "Online"})
                      </p>
                    </div>
                  </>
                )}

                {/* MUSIC SPECIFICS */}
                {gig.category === "Music" && (
                  <>
                    <div className="bg-white p-4 rounded-xl border border-gray-200/80">
                      <span className="text-xs text-gray-500 font-medium">Genre & Subcategory</span>
                      <p className="text-base font-bold text-gray-900 mt-1">
                        {details?.genre || "Pop"} ({details?.subcategory || "Music"})
                      </p>
                    </div>
                    {details?.sampleTrackUrl && (
                      <div className="bg-white p-4 rounded-xl border border-gray-200/80 sm:col-span-2">
                        <span className="text-xs text-gray-500 font-medium mb-2 block">Audio Preview Sample</span>
                        <audio controls className="w-full h-10">
                          <source src={details.sampleTrackUrl} type="audio/mp3" />
                          Your browser does not support audio playback.
                        </audio>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Booking Form Column (1 Col) */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl border border-gray-200 bg-white p-6 shadow-md">
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-100">
                <ShieldCheck className="h-5 w-5 text-indigo-600" />
                <h2 className="text-lg font-bold text-gray-900">Book This Gig</h2>
              </div>

              <form onSubmit={handleBookingSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sarah Jenkins"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Your Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. sarah@example.com"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Project Brief / Preferred Slot / Files
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Describe your requirements, preferred delivery deadline, or raw file links..."
                    value={briefNotes}
                    onChange={(e) => setBriefNotes(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={bookingLoading}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3.5 text-sm font-semibold text-white shadow-md shadow-indigo-200 hover:bg-indigo-700 transition-all disabled:opacity-50"
                  >
                    {bookingLoading ? (
                      <span>Processing Booking...</span>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        <span>Confirm & Book Request</span>
                      </>
                    )}
                  </button>
                </div>

                <p className="text-[11px] text-gray-500 text-center mt-3">
                  ⚡ Zero payment collected now. Booking request goes directly to the creator.
                </p>
              </form>
            </div>
          </div>
        </div>
      </main>

      {/* Booking Confirmation Modal */}
      {confirmedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl text-center space-y-6">
            <div className="h-16 w-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="h-10 w-10" />
            </div>

            <div>
              <h3 className="text-2xl font-black text-gray-900">Booking Request Sent!</h3>
              <p className="text-sm text-gray-600 mt-1">
                Your request has been delivered to <strong>{creator?.full_name}</strong>.
              </p>
            </div>

            {/* Reference Code Box */}
            <div className="bg-gray-50 border-2 border-dashed border-indigo-200 rounded-2xl p-5">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">
                Your Booking Reference Code
              </span>
              <div className="flex items-center justify-center gap-3">
                <span className="text-3xl font-black tracking-wider text-indigo-600 font-mono">
                  {confirmedBooking.booking_ref}
                </span>
                <button
                  onClick={copyRefCode}
                  className="p-2 rounded-lg bg-indigo-100 text-indigo-700 hover:bg-indigo-200 transition-colors"
                  title="Copy Reference Code"
                >
                  {copied ? <Check className="h-5 w-5 text-emerald-600" /> : <Copy className="h-5 w-5" />}
                </button>
              </div>
              <p className="text-[11px] text-gray-500 mt-2">
                Save this code! Use it to track status anytime on <strong>My Bookings</strong>.
              </p>
            </div>

            <div className="flex flex-col gap-3 pt-2">
              <Link
                href="/my-bookings"
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow-md transition-all"
              >
                Track Booking Status
              </Link>
              <button
                onClick={() => setConfirmedBooking(null)}
                className="w-full py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900"
              >
                Close & Browse More Gigs
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
