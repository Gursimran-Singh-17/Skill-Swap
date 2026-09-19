"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Zap, Store, PlusCircle, LayoutDashboard, BookmarkCheck } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { href: "/marketplace", label: "Marketplace", icon: Store },
    { href: "/post-gig", label: "Post a Gig", icon: PlusCircle },
    { href: "/dashboard", label: "Creator Dashboard", icon: LayoutDashboard },
    { href: "/my-bookings", label: "My Bookings", icon: BookmarkCheck },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-90">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 text-white shadow-md shadow-indigo-200">
            <Zap className="h-5 w-5 fill-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold tracking-tight text-gray-900 text-xl font-inter">
              Skill<span className="text-indigo-600">Swap</span>
            </span>
            <span className="text-[10px] font-medium text-gray-500 uppercase tracking-widest -mt-1">
              Creator Marketplace
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-gray-100/80 p-1.5 rounded-full border border-gray-200/60">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                  isActive
                    ? "bg-white text-indigo-600 shadow-sm font-semibold"
                    : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? "text-indigo-600" : "text-gray-500"}`} />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Action Button for Post Gig */}
        <div className="flex items-center gap-3">
          <Link
            href="/post-gig"
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-200 hover:bg-indigo-700 transition-all active:scale-[0.98]"
          >
            <PlusCircle className="h-4 w-4" />
            <span>List Your Skill</span>
          </Link>
        </div>
      </div>

      {/* Mobile Bar */}
      <div className="md:hidden flex items-center justify-around border-t border-gray-100 bg-white py-2 px-2">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center gap-1 text-[11px] font-medium py-1 px-2 rounded-lg ${
                isActive ? "text-indigo-600 font-semibold" : "text-gray-500"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </div>
    </header>
  );
}
