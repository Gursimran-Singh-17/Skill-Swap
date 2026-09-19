"use server";

import { createClient } from "@/lib/supabase/client";
import { Booking, NewBookingInput, BookingStatus } from "../types/skillswap";
import { INITIAL_BOOKINGS } from "../data/seedData";
import { getGigById, getAllCreators } from "./gigActions";

let memoryBookings: Booking[] = [...INITIAL_BOOKINGS];

function generateBookingRef(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let ref = "SKILL-";
  for (let i = 0; i < 4; i++) {
    ref += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return ref;
}

export async function createBooking(input: NewBookingInput): Promise<Booking> {
  const bookingRef = generateBookingRef();
  const newBooking: Booking = {
    id: `b_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    booking_ref: bookingRef,
    gig_id: input.gig_id,
    creator_id: input.creator_id,
    client_name: input.client_name,
    client_email: input.client_email,
    brief_notes: input.brief_notes || "",
    status: "pending",
    requested_at: new Date().toISOString(),
  };

  try {
    const supabase = createClient();
    const { data, error } = await supabase.from("bookings").insert([newBooking]).select("*").single();
    if (!error && data) {
      memoryBookings.unshift(data as Booking);
      return data as Booking;
    }
  } catch (err) {
    console.warn("Supabase insert failed for booking, saving to local store:", err);
  }

  memoryBookings.unshift(newBooking);
  return newBooking;
}

export async function getBookingsByCreator(
  creatorId: string,
  status?: BookingStatus
): Promise<Booking[]> {
  let bookings: Booking[] = [];

  try {
    const supabase = createClient();
    let query = supabase
      .from("bookings")
      .select("*, gig:gigs(*), creator:creators(*)")
      .eq("creator_id", creatorId)
      .order("requested_at", { ascending: false });

    if (status) {
      query = query.eq("status", status);
    }

    const { data, error } = await query;
    if (!error && data && data.length > 0) {
      bookings = data as Booking[];
    }
  } catch (err) {
    console.warn("Supabase fetch failed for creator bookings:", err);
  }

  if (bookings.length === 0) {
    bookings = memoryBookings.filter((b) => b.creator_id === creatorId);
    if (status) {
      bookings = bookings.filter((b) => b.status === status);
    }
    // Attach gig & creator details
    const creators = await getAllCreators();
    for (let i = 0; i < bookings.length; i++) {
      const gig = await getGigById(bookings[i].gig_id);
      bookings[i] = {
        ...bookings[i],
        gig: gig || undefined,
        creator: creators.find((c) => c.id === bookings[i].creator_id),
      };
    }
  }

  return bookings;
}

export async function updateBookingStatus(
  bookingId: string,
  status: "accepted" | "declined",
  declineReason?: string
): Promise<Booking | null> {
  const resolvedAt = new Date().toISOString();

  try {
    const supabase = createClient();
    const payload: Partial<Booking> = {
      status,
      resolved_at: resolvedAt,
    };
    if (status === "declined" && declineReason) {
      payload.decline_reason = declineReason;
    }

    const { data, error } = await supabase
      .from("bookings")
      .update(payload)
      .eq("id", bookingId)
      .select("*")
      .single();

    if (!error && data) {
      const index = memoryBookings.findIndex((b) => b.id === bookingId);
      if (index !== -1) memoryBookings[index] = data as Booking;
      return data as Booking;
    }
  } catch (err) {
    console.warn("Supabase update failed for booking status, updating memory store:", err);
  }

  const booking = memoryBookings.find((b) => b.id === bookingId);
  if (booking) {
    booking.status = status;
    booking.resolved_at = resolvedAt;
    if (status === "declined" && declineReason) {
      booking.decline_reason = declineReason;
    }
    return booking;
  }

  return null;
}

export async function lookupBookings(queryStr: string): Promise<Booking[]> {
  const q = queryStr.trim().toUpperCase();
  const qEmail = queryStr.trim().toLowerCase();

  let results: Booking[] = [];

  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("bookings")
      .select("*, gig:gigs(*), creator:creators(*)")
      .or(`booking_ref.eq.${q},client_email.ilike.${qEmail}`)
      .order("requested_at", { ascending: false });

    if (!error && data && data.length > 0) {
      results = data as Booking[];
    }
  } catch (err) {
    console.warn("Supabase lookup failed, checking local store:", err);
  }

  if (results.length === 0) {
    results = memoryBookings.filter(
      (b) => b.booking_ref.toUpperCase() === q || b.client_email.toLowerCase() === qEmail
    );
    const creators = await getAllCreators();
    for (let i = 0; i < results.length; i++) {
      const gig = await getGigById(results[i].gig_id);
      results[i] = {
        ...results[i],
        gig: gig || undefined,
        creator: creators.find((c) => c.id === results[i].creator_id),
      };
    }
  }

  return results;
}
