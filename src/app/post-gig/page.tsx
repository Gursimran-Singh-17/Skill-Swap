"use client";

import { useState, useEffect } from "react";
import Navbar from "../(main)/_components/Navbar";
import { useRouter } from "next/navigation";
import { getAllCreators, createGig } from "@/lib/functions/gigActions";
import { Creator, CategoryType, RateType, NewGigInput } from "@/lib/types/skillswap";
import { PlusCircle, Sparkles, User, DollarSign, FileText, ArrowLeft, CheckCircle2, Wand2 } from "lucide-react";
import { toast } from "sonner";

export default function PostGigPage() {
  const router = useRouter();

  const [creators, setCreators] = useState<Creator[]>([]);
  const [selectedCreatorId, setSelectedCreatorId] = useState("");

  // AI Polish State
  const [roughNotes, setRoughNotes] = useState("");
  const [polishing, setPolishing] = useState(false);
  const [rateReasoning, setRateReasoning] = useState("");

  // Base Gig Fields
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<CategoryType>("Design");
  const [rate, setRate] = useState<number | "">(1000);
  const [rateType, setRateType] = useState<RateType>("fixed");
  const [description, setDescription] = useState("");

  // Category-specific Fields
  // Design
  const [designSub, setDesignSub] = useState<"Logo" | "UI-UX" | "Illustration" | "Branding">("Logo");
  const [portfolioLink, setPortfolioLink] = useState("");
  const [revisionsIncluded, setRevisionsIncluded] = useState(2);

  // Editing
  const [editingSub, setEditingSub] = useState<"Video" | "Photo" | "Podcast" | "Reels">("Video");
  const [turnaroundTime, setTurnaroundTime] = useState("2 days");
  const [fileFormats, setFileFormats] = useState("MP4, Premiere Pro");

  // Tutoring
  const [subject, setSubject] = useState("Mathematics");
  const [level, setLevel] = useState<"Beginner" | "Intermediate" | "Advanced">("Intermediate");
  const [sessionLength, setSessionLength] = useState("60 mins");
  const [mode, setMode] = useState<"Online" | "In-person">("Online");

  // Music
  const [musicSub, setMusicSub] = useState<"Beat Production" | "Mixing-Mastering" | "Session Musician" | "Voiceover">("Beat Production");
  const [genre, setGenre] = useState("Trap / Lo-Fi");
  const [sampleTrackUrl, setSampleTrackUrl] = useState("");

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadCreators() {
      const list = await getAllCreators();
      setCreators(list);
      if (list.length > 0) setSelectedCreatorId(list[0].id);
    }
    loadCreators();
  }, []);

  const handlePolishWithAI = async () => {
    if (!roughNotes || roughNotes.trim() === "") {
      toast.error("Please type a rough note first (e.g. 'i edit youtube vids, fast, done in 2 days')");
      return;
    }

    setPolishing(true);
    try {
      const res = await fetch("/api/ai/polish-listing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category,
          roughNotes,
          existingRate: rate ? Number(rate) : null,
        }),
      });

      const data = await res.json();
      if (res.ok && data) {
        if (data.title) setTitle(data.title);
        if (data.description) setDescription(data.description);
        if (data.suggestedRate) {
          if (data.suggestedRate.amount) setRate(data.suggestedRate.amount);
          if (data.suggestedRate.rateType) setRateType(data.suggestedRate.rateType);
          if (data.suggestedRate.reasoning) setRateReasoning(data.suggestedRate.reasoning);
        }
        toast.success("✨ Form pre-filled with AI suggestions! You can edit any field before publishing.");
      } else {
        toast.error("AI suggestion unavailable — write your listing below.");
      }
    } catch (err) {
      console.error(err);
      toast.error("AI suggestion unavailable — write your listing below.");
    } finally {
      setPolishing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCreatorId || !title || !description || !rate) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setSubmitting(true);

    let categoryDetails: any = {};
    if (category === "Design") {
      categoryDetails = { subcategory: designSub, portfolioLink, revisionsIncluded: Number(revisionsIncluded) };
    } else if (category === "Editing") {
      categoryDetails = { subcategory: editingSub, turnaroundTime, fileFormats };
    } else if (category === "Tutoring") {
      categoryDetails = { subject, level, sessionLength, mode };
    } else if (category === "Music") {
      categoryDetails = { subcategory: musicSub, genre, sampleTrackUrl };
    }

    const input: NewGigInput = {
      creator_id: selectedCreatorId,
      title,
      category,
      rate: Number(rate),
      rate_type: rateType,
      description,
      category_details: categoryDetails,
    };

    try {
      await createGig(input);
      toast.success("Gig posted successfully!");
      router.push("/marketplace");
    } catch (err) {
      console.error(err);
      toast.error("Failed to post gig.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-inter">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-xl bg-white border border-gray-200 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Post a Gig</h1>
            <p className="text-sm text-gray-600">List your skill service and start receiving bookings from clients.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm space-y-8">
          {/* Creator Selection (No Auth Handler) */}
          <div className="bg-indigo-50/60 border border-indigo-100 rounded-xl p-5">
            <label className="block text-xs font-bold text-indigo-900 uppercase tracking-wider mb-2 flex items-center gap-2">
              <User className="h-4 w-4 text-indigo-600" />
              <span>Post As Creator (No-Auth Mode)</span>
            </label>
            <select
              value={selectedCreatorId}
              onChange={(e) => setSelectedCreatorId(e.target.value)}
              className="w-full rounded-xl border border-indigo-200 bg-white px-4 py-3 text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              {creators.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.full_name} ({c.primary_category} Specialist — ⭐ {c.rating})
                </option>
              ))}
            </select>
            <p className="text-[11px] text-indigo-700 mt-2">
              Select which creator profile this service listing will be attributed to.
            </p>
          </div>

          {/* AI-Assisted Gig Writer Box */}
          <div className="bg-gradient-to-r from-violet-50 via-indigo-50 to-purple-50 border border-violet-200/80 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-violet-600 text-white shadow-sm">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <span>AI-Assisted Gig Writer</span>
                  <span className="text-[10px] uppercase tracking-wider font-extrabold bg-violet-200 text-violet-800 px-2 py-0.5 rounded-full">
                    AI Feature
                  </span>
                </h3>
                <p className="text-xs text-gray-600">
                  Type unpolished notes in your own words — AI will craft a title, description & rate recommendation.
                </p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Describe your service in your own words (Rough Notes)
              </label>
              <textarea
                rows={2}
                placeholder="e.g. i edit youtube vids, fast, good with captions, done in like 2 days"
                value={roughNotes}
                onChange={(e) => setRoughNotes(e.target.value)}
                className="w-full rounded-xl border border-violet-200 bg-white px-4 py-3 text-sm text-gray-900 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <button
                type="button"
                onClick={handlePolishWithAI}
                disabled={polishing}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-3 text-xs font-extrabold text-white shadow-md shadow-violet-200 hover:opacity-95 transition-all disabled:opacity-50"
              >
                <Wand2 className="h-4 w-4" />
                <span>{polishing ? "✨ AI is Polishing Your Listing..." : "✨ Polish with AI"}</span>
              </button>
              <span className="text-[11px] text-gray-500 italic">
                Optional · Pre-fills editable form fields below.
              </span>
            </div>
          </div>

          {/* Basic Info Form */}
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-gray-900 pb-2 border-b border-gray-100">Service Details</h2>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Gig Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Minimal Logo & Brand Identity Design"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as CategoryType)}
                  className="w-full rounded-xl border border-gray-200 px-3.5 py-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium"
                >
                  <option value="Design">🎨 Design</option>
                  <option value="Editing">✂️ Editing</option>
                  <option value="Tutoring">📚 Tutoring</option>
                  <option value="Music">🎵 Music</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Rate (₹)</label>
                <input
                  type="number"
                  required
                  min={100}
                  placeholder="1500"
                  value={rate}
                  onChange={(e) => setRate(e.target.value === "" ? "" : Number(e.target.value))}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Rate Type</label>
                <select
                  value={rateType}
                  onChange={(e) => setRateType(e.target.value as RateType)}
                  className="w-full rounded-xl border border-gray-200 px-3.5 py-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium"
                >
                  <option value="fixed">Fixed Price</option>
                  <option value="hourly">Per Hour</option>
                  <option value="per_session">Per Session</option>
                </select>
              </div>
            </div>

            {/* AI Rate Reasoning Banner */}
            {rateReasoning && (
              <div className="text-xs font-medium text-indigo-800 bg-indigo-50 border border-indigo-200/80 p-3 rounded-xl flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-indigo-600 flex-shrink-0" />
                <span>
                  <strong>AI Marketplace Rate Insight:</strong> {rateReasoning}
                </span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Full Description</label>
              <textarea
                rows={4}
                required
                placeholder="Detail what is included, deliverable formats, and your work process..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>

          {/* Dynamic Category Details */}
          <div className="space-y-6 pt-4 border-t border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-indigo-600" />
              <span>Category Specific Parameters ({category})</span>
            </h2>

            {/* DESIGN FIELDS */}
            {category === "Design" && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Subcategory</label>
                  <select
                    value={designSub}
                    onChange={(e) => setDesignSub(e.target.value as any)}
                    className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm"
                  >
                    <option value="Logo">Logo</option>
                    <option value="UI-UX">UI-UX</option>
                    <option value="Illustration">Illustration</option>
                    <option value="Branding">Branding</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Revisions Included</label>
                  <input
                    type="number"
                    value={revisionsIncluded}
                    onChange={(e) => setRevisionsIncluded(Number(e.target.value))}
                    className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Portfolio Link (Optional)</label>
                  <input
                    type="url"
                    placeholder="https://behance.net/you"
                    value={portfolioLink}
                    onChange={(e) => setPortfolioLink(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm"
                  />
                </div>
              </div>
            )}

            {/* EDITING FIELDS */}
            {category === "Editing" && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Subcategory</label>
                  <select
                    value={editingSub}
                    onChange={(e) => setEditingSub(e.target.value as any)}
                    className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm"
                  >
                    <option value="Video">Video</option>
                    <option value="Photo">Photo</option>
                    <option value="Podcast">Podcast</option>
                    <option value="Reels">Reels</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Turnaround Time</label>
                  <input
                    type="text"
                    placeholder="e.g. 2 days"
                    value={turnaroundTime}
                    onChange={(e) => setTurnaroundTime(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">File Formats</label>
                  <input
                    type="text"
                    placeholder="e.g. MP4, MOV, Premiere"
                    value={fileFormats}
                    onChange={(e) => setFileFormats(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm"
                  />
                </div>
              </div>
            )}

            {/* TUTORING FIELDS */}
            {category === "Tutoring" && (
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Subject</label>
                  <input
                    type="text"
                    placeholder="e.g. Mathematics"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Target Level</label>
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value as any)}
                    className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Session Length</label>
                  <input
                    type="text"
                    placeholder="e.g. 60 mins"
                    value={sessionLength}
                    onChange={(e) => setSessionLength(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Mode</label>
                  <select
                    value={mode}
                    onChange={(e) => setMode(e.target.value as any)}
                    className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm"
                  >
                    <option value="Online">Online</option>
                    <option value="In-person">In-person</option>
                  </select>
                </div>
              </div>
            )}

            {/* MUSIC FIELDS */}
            {category === "Music" && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Subcategory</label>
                  <select
                    value={musicSub}
                    onChange={(e) => setMusicSub(e.target.value as any)}
                    className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm"
                  >
                    <option value="Beat Production">Beat Production</option>
                    <option value="Mixing-Mastering">Mixing-Mastering</option>
                    <option value="Session Musician">Session Musician</option>
                    <option value="Voiceover">Voiceover</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Genre</label>
                  <input
                    type="text"
                    placeholder="e.g. Trap / Lo-Fi"
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Sample Track Audio URL</label>
                  <input
                    type="url"
                    placeholder="https://.../sample.mp3"
                    value={sampleTrackUrl}
                    onChange={(e) => setSampleTrackUrl(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-8 py-3 text-sm font-semibold text-white shadow-md shadow-indigo-200 hover:bg-indigo-700 transition-all disabled:opacity-50"
            >
              <PlusCircle className="h-4 w-4" />
              <span>{submitting ? "Publishing Gig..." : "Publish Service Listing"}</span>
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
