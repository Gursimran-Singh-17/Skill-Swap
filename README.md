# ⚡ SkillSwap — Creator Economy Gig Marketplace

> **Hackathon Submission**: Code2Career Hackathon (`hackathon.azisly.ai`)  
> **Track**: Track 2 — Web Product  
> **Hackathon ID**: NA (We didn't get the Hackathon ID)

---

## 🌟 Overview

**SkillSwap** is a gig marketplace designed for young creators — across **Design**, **Video Editing**, **Tutoring**, and **Music** — to monetize their skills, while enabling clients to seamlessly discover and book their services.

### 🔒 Hard Constraint Compliance: Zero Authentication
SkillSwap strictly requires **NO authentication (login/signup) anywhere**. Evaluators and graders can reach and test every feature immediately without creating an account.
- **Posting Gigs**: Creators select their profile from a creator picker ("Post as Creator").
- **Booking Gigs**: Clients fill in their name and email, and receive a unique **Booking Reference Code** (`SKILL-XXXX`).
- **Dashboard**: Creators switch profiles via a header picker to manage incoming bookings.
- **My Bookings**: Clients track request status by searching their reference code or email address.

---

## ✨ 5 Required Core Features

1. ➕ **Post a Gig** (`/post-gig`): List services with title, category, rate, description, and category-specific detail specifications.
2. 🏪 **Browse & Search** (`/marketplace`): Explore gigs filtered by domain (Design, Editing, Tutoring, Music), text search, and ranking controls.
3. ⚡ **Book a Gig** (`/gig/[id]`): Detailed service scope with category playbooks & client booking form generating unique reference codes.
4. 📊 **Creator Dashboard** (`/dashboard`): Manage incoming bookings, switch creator views, accept or decline with custom decline reasons.
5. 🔍 **My Bookings** (`/my-bookings`): Instant status lookup by reference code or email with DP1 decline reason display & similar gig recommendations.

---

## 📐 Decision Points (`DECISIONS.md`)

- **DP1 · Rejection**: Client sees "Declined" status + creator's decline reason + "Browse similar gigs" category link. No payment/refund required.
- **DP2 · Double Booking**: Gigs remain open for multiple pending requests. Creators manually manage capacity by accepting or declining.
- **DP3 · Discovery**: Default ranking is "Newest First" to give new/young creators equal exposure, with Price & Rating sort toggles.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16.1 (Turbopack) & React 19
- **Styling**: Tailwind CSS v4 & Lucide React Icons
- **Database**: Supabase PostgreSQL (Public RLS) & Local Store Fallback
- **Language**: TypeScript 5

---

Open https://skill-swap-gursimran.vercel.app/ with your browser.
