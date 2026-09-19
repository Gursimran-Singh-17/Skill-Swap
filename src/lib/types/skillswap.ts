export type CategoryType = "Design" | "Editing" | "Tutoring" | "Music";
export type RateType = "fixed" | "hourly" | "per_session";
export type BookingStatus = "pending" | "accepted" | "declined";

export interface Creator {
  id: string;
  full_name: string;
  avatar: string;
  bio: string;
  primary_category: CategoryType;
  rating: number;
  created_at?: string;
}

export interface DesignDetails {
  subcategory: "Logo" | "UI-UX" | "Illustration" | "Branding";
  portfolioLink?: string;
  revisionsIncluded: number;
}

export interface EditingDetails {
  subcategory: "Video" | "Photo" | "Podcast" | "Reels";
  turnaroundTime: string; // e.g. "2 days"
  fileFormats: string; // e.g. "MP4, MOV, Premiere Pro"
}

export interface TutoringDetails {
  subject: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  sessionLength: string; // e.g. "60 mins"
  mode: "Online" | "In-person";
}

export interface MusicDetails {
  subcategory: "Beat Production" | "Mixing-Mastering" | "Session Musician" | "Voiceover";
  genre: string;
  sampleTrackUrl?: string;
}

export type CategoryDetails = DesignDetails | EditingDetails | TutoringDetails | MusicDetails | Record<string, any>;

export interface Gig {
  id: string;
  creator_id: string;
  title: string;
  category: CategoryType;
  rate: number;
  rate_type: RateType;
  description: string;
  category_details: CategoryDetails;
  status: "active" | "paused";
  created_at: string;
  creator?: Creator;
}

export interface Booking {
  id: string;
  booking_ref: string; // e.g. "SKILL-8A4F"
  gig_id: string;
  creator_id: string;
  client_name: string;
  client_email: string;
  brief_notes?: string;
  status: BookingStatus;
  decline_reason?: string;
  requested_at: string;
  resolved_at?: string;
  gig?: Gig;
  creator?: Creator;
}

export interface NewGigInput {
  creator_id: string;
  title: string;
  category: CategoryType;
  rate: number;
  rate_type: RateType;
  description: string;
  category_details: CategoryDetails;
}

export interface NewBookingInput {
  gig_id: string;
  creator_id: string;
  client_name: string;
  client_email: string;
  brief_notes?: string;
}
