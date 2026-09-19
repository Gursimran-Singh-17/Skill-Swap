"use client";

import { useState, useEffect } from "react";
import Navbar from "../(main)/_components/Navbar";
import { getAllCreators } from "@/lib/functions/gigActions";
import { getBookingsByCreator, updateBookingStatus } from "@/lib/functions/bookingActions";
import { Creator, Booking, BookingStatus } from "@/lib/types/skillswap";
import { User, CheckCircle2, XCircle, Clock, MessageSquare, AlertCircle, Sparkles, Filter, X } from "lucide-react";
import { toast } from "sonner";

export default function CreatorDashboardPage() {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [selectedCreatorId, setSelectedCreatorId] = useState("");

  const [activeTab, setActiveTab] = useState<BookingStatus>("pending");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  // Decline modal state
  const [declineBookingId, setDeclineBookingId] = useState<string | null>(null);
  const [declineReason, setDeclineReason] = useState("");

  useEffect(() => {
    async function loadCreators() {
      const list = await getAllCreators();
      setCreators(list);
      if (list.length > 0) {
        setSelectedCreatorId(list[0].id);
      }
    }
    loadCreators();
  }, []);

  useEffect(() => {
    if (!selectedCreatorId) return;
    async function fetchBookings() {
      setLoading(true);
      const data = await getBookingsByCreator(selectedCreatorId);
      setBookings(data);
      setLoading(false);
    }
    fetchBookings();
  }, [selectedCreatorId]);

  const handleAccept = async (bookingId: string) => {
    const updated = await updateBookingStatus(bookingId, "accepted");
    if (updated) {
      toast.success("Booking request ACCEPTED!");
      setBookings((prev) => prev.map((b) => (b.id === bookingId ? { ...b, status: "accepted" } : b)));
    }
  };

  const handleDeclineSubmit = async () => {
    if (!declineBookingId) return;
    const updated = await updateBookingStatus(declineBookingId, "declined", declineReason);
    if (updated) {
      toast.success("Booking request DECLINED.");
      setBookings((prev) =>
        prev.map((b) => (b.id === declineBookingId ? { ...b, status: "declined", decline_reason: declineReason } : b))
      );
    }
    setDeclineBookingId(null);
    setDeclineReason("");
  };

  const filteredBookings = bookings.filter((b) => b.status === activeTab);
  const selectedCreator = creators.find((c) => c.id === selectedCreatorId);

  const pendingCount = bookings.filter((b) => b.status === "pending").length;
  const acceptedCount = bookings.filter((b) => b.status === "accepted").length;
  const declinedCount = bookings.filter((b) => b.status === "declined").length;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-inter">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Creator Switcher Banner (No Auth Mode) */}
        <div className="bg-gradient-to-r from-indigo-900 to-indigo-950 text-white rounded-2xl p-6 sm:p-8 shadow-xl mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={selectedCreator?.avatar || "/user.png"}
              alt="Creator"
              className="h-16 w-16 rounded-full object-cover border-2 border-indigo-400 shadow-md"
            />
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-500/30 text-indigo-300 border border-indigo-400/30 mb-1">
                <Sparkles className="h-3 w-3" />
                <span>Creator Dashboard</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">{selectedCreator?.full_name}</h1>
              <p className="text-xs text-indigo-200 mt-1 max-w-md">{selectedCreator?.bio}</p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl">
            <label className="block text-xs font-semibold text-indigo-200 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-indigo-400" />
              <span>Switch Creator Profile (No Auth)</span>
            </label>
            <select
              value={selectedCreatorId}
              onChange={(e) => setSelectedCreatorId(e.target.value)}
              className="w-full rounded-lg border border-white/20 bg-gray-900 text-white px-3.5 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              {creators.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.full_name} ({c.primary_category})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Dashboard Metric Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div
            onClick={() => setActiveTab("pending")}
            className={`cursor-pointer rounded-2xl border p-6 transition-all ${
              activeTab === "pending"
                ? "bg-amber-50/80 border-amber-300 shadow-md"
                : "bg-white border-gray-200 hover:bg-gray-50"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700">Pending Requests</span>
              <Clock className="h-5 w-5 text-amber-500" />
            </div>
            <div className="text-3xl font-black text-amber-900 mt-2">{pendingCount}</div>
          </div>

          <div
            onClick={() => setActiveTab("accepted")}
            className={`cursor-pointer rounded-2xl border p-6 transition-all ${
              activeTab === "accepted"
                ? "bg-emerald-50/80 border-emerald-300 shadow-md"
                : "bg-white border-gray-200 hover:bg-gray-50"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Accepted Bookings</span>
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            </div>
            <div className="text-3xl font-black text-emerald-900 mt-2">{acceptedCount}</div>
          </div>

          <div
            onClick={() => setActiveTab("declined")}
            className={`cursor-pointer rounded-2xl border p-6 transition-all ${
              activeTab === "declined"
                ? "bg-rose-50/80 border-rose-300 shadow-md"
                : "bg-white border-gray-200 hover:bg-gray-50"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-700">Declined Requests</span>
              <XCircle className="h-5 w-5 text-rose-500" />
            </div>
            <div className="text-3xl font-black text-rose-900 mt-2">{declinedCount}</div>
          </div>
        </div>

        {/* Tab Filters & Bookings List */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-4 mb-6">
            <button
              onClick={() => setActiveTab("pending")}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeTab === "pending"
                  ? "bg-amber-500 text-white shadow-md shadow-amber-200"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Pending ({pendingCount})
            </button>
            <button
              onClick={() => setActiveTab("accepted")}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeTab === "accepted"
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-200"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Accepted ({acceptedCount})
            </button>
            <button
              onClick={() => setActiveTab("declined")}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeTab === "declined"
                  ? "bg-rose-600 text-white shadow-md shadow-rose-200"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Declined ({declinedCount})
            </button>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-28 rounded-xl bg-gray-100 animate-pulse"></div>
              ))}
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Filter className="h-10 w-10 text-gray-400 mx-auto mb-2" />
              <p className="text-sm font-medium">No {activeTab} bookings for this creator profile.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredBookings.map((b) => {
                const gig = b.gig;
                return (
                  <div
                    key={b.id}
                    className="flex flex-col md:flex-row md:items-center justify-between gap-6 border border-gray-200 rounded-xl p-5 hover:border-indigo-200 transition-colors bg-gray-50/50"
                  >
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs font-extrabold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100">
                          {b.booking_ref}
                        </span>
                        <span className="text-xs font-semibold text-gray-500">
                          Requested: {new Date(b.requested_at).toLocaleDateString()}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-gray-900">{gig?.title || "Gig Service"}</h3>

                      <div className="text-xs text-gray-700 font-medium">
                        Client: <strong className="text-gray-900">{b.client_name}</strong> ({b.client_email})
                      </div>

                      {b.brief_notes && (
                        <div className="flex items-start gap-2 bg-white p-3 rounded-lg border border-gray-200/80 text-xs text-gray-600">
                          <MessageSquare className="h-4 w-4 text-indigo-500 flex-shrink-0 mt-0.5" />
                          <span>{b.brief_notes}</span>
                        </div>
                      )}

                      {/* DP1 DECLINE REASON DISPLAY */}
                      {b.status === "declined" && b.decline_reason && (
                        <div className="flex items-start gap-2 bg-rose-50 p-3 rounded-lg border border-rose-200 text-xs text-rose-800">
                          <AlertCircle className="h-4 w-4 text-rose-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <strong>Decline Reason Provided:</strong> {b.decline_reason}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action Controls */}
                    <div className="flex items-center gap-3 flex-shrink-0">
                      {b.status === "pending" && (
                        <>
                          <button
                            onClick={() => handleAccept(b.id)}
                            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 shadow-sm transition-all"
                          >
                            <CheckCircle2 className="h-4 w-4" />
                            <span>Accept</span>
                          </button>
                          <button
                            onClick={() => {
                              setDeclineBookingId(b.id);
                              setDeclineReason("");
                            }}
                            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 shadow-sm transition-all"
                          >
                            <XCircle className="h-4 w-4" />
                            <span>Decline</span>
                          </button>
                        </>
                      )}

                      {b.status === "accepted" && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold">
                          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                          Accepted
                        </span>
                      )}

                      {b.status === "declined" && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-100 text-rose-800 text-xs font-bold">
                          <XCircle className="h-4 w-4 text-rose-600" />
                          Declined
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Decline Reason Modal (DP1 implementation) */}
      {declineBookingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-lg font-bold text-gray-900">Decline Booking Request</h3>
              <button onClick={() => setDeclineBookingId(null)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="text-xs text-gray-600">
              Provide an optional one-line decline reason for the client (DP1 feature).
            </p>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Decline Reason</label>
              <textarea
                rows={3}
                placeholder="e.g. Schedule fully booked for this week, please re-book next week!"
                value={declineReason}
                onChange={(e) => setDeclineReason(e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeclineBookingId(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 border border-gray-200 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeclineSubmit}
                className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 shadow-sm"
              >
                Confirm Decline
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
