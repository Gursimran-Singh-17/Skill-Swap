import Link from "next/link";
import Navbar from "./(main)/_components/Navbar";
import { ArrowRight, Palette, Scissors, GraduationCap, Music, CheckCircle2, ShieldCheck, Sparkles, Star } from "lucide-react";

export default function LandingPage() {
  const categories = [
    {
      id: "Design",
      name: "Design & Creative",
      icon: Palette,
      color: "from-pink-500 to-rose-500",
      bgColor: "bg-rose-50 text-rose-600 border-rose-200",
      description: "Logos, UI/UX wireframes, Instagram templates & custom illustrations.",
      popular: "Logos • UI/UX • Branding",
    },
    {
      id: "Editing",
      name: "Video & Audio Editing",
      icon: Scissors,
      color: "from-purple-500 to-indigo-500",
      bgColor: "bg-purple-50 text-purple-600 border-purple-200",
      description: "YouTube vlogs, Podcast noise cleanup, Reels transitions & photo retouching.",
      popular: "YouTube • Reels • Podcasts",
    },
    {
      id: "Tutoring",
      name: "Tutoring & Mentorship",
      icon: GraduationCap,
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50 text-blue-600 border-blue-200",
      description: "1-on-1 Math coaching, Python live coding packs & spoken English.",
      popular: "Math • Python • English",
    },
    {
      id: "Music",
      name: "Music & Audio Production",
      icon: Music,
      color: "from-amber-500 to-orange-500",
      bgColor: "bg-amber-50 text-amber-600 border-amber-200",
      description: "Custom Trap/LoFi beats, vocal tuning, session guitar & commercial voiceovers.",
      popular: "Beats • Vocal Mix • Voiceover",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col font-inter">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-indigo-900 via-indigo-950 to-slate-950 py-24 text-white">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f46e515_1px,transparent_1px),linear-gradient(to_bottom,#4f46e515_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-sm font-medium text-indigo-300 backdrop-blur-md mb-8">
              <Sparkles className="h-4 w-4 text-indigo-400" />
              <span>Track 2 · Creator Economy Marketplace</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight">
              Where Young Creators Monetize Skills & <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-sky-300 to-pink-400">Clients Book Them</span>
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto font-normal">
              Book skilled talent across Design, Video Editing, Tutoring, and Music — instantly with zero account signup needed.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/marketplace"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-8 py-4 text-base font-semibold text-white shadow-xl shadow-indigo-600/30 hover:bg-indigo-500 transition-all active:scale-[0.98]"
              >
                <span>Explore Marketplace</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/post-gig"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-gray-700 bg-gray-900/60 backdrop-blur-md px-8 py-4 text-base font-semibold text-white hover:bg-gray-800 transition-all"
              >
                <span>Post Your Skill</span>
              </Link>
            </div>

            {/* Quick Feature Badges */}
            <div className="mt-16 border-t border-gray-800/80 pt-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-left max-w-4xl mx-auto">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-indigo-400 flex-shrink-0" />
                <span className="text-sm text-gray-300">No Account Required</span>
              </div>
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-indigo-400 flex-shrink-0" />
                <span className="text-sm text-gray-300">Direct Booking Reference</span>
              </div>
              <div className="flex items-center gap-3">
                <Star className="h-5 w-5 text-indigo-400 flex-shrink-0" />
                <span className="text-sm text-gray-300">Vetted Young Talent</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-indigo-400 flex-shrink-0" />
                <span className="text-sm text-gray-300">Fair Discovery Ranking</span>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Grid */}
        <section className="py-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Explore Creator Gig Categories</h2>
            <p className="mt-3 text-gray-600">Choose from four primary domains tailored for young creators and clients alike.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.id}
                  href={`/marketplace?category=${cat.id}`}
                  className="group relative flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  <div>
                    <div className={`inline-flex p-3.5 rounded-xl border ${cat.bgColor} mb-5`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                      {cat.name}
                    </h3>
                    <p className="mt-2 text-sm text-gray-600 leading-relaxed">{cat.description}</p>
                  </div>

                  <div className="mt-6 border-t border-gray-100 pt-4 flex items-center justify-between text-xs font-medium text-gray-500">
                    <span>{cat.popular}</span>
                    <ArrowRight className="h-4 w-4 text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </main>

      <footer className="border-t border-gray-200 bg-white py-8 text-center text-sm text-gray-500">
        <div className="mx-auto max-w-7xl px-4">
          <p>© 2026 SkillSwap — Code2Career Hackathon Track 2 Submission.</p>
        </div>
      </footer>
    </div>
  );
}
