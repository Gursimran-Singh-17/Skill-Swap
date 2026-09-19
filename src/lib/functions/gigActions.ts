"use server";

import { createClient } from "@/lib/supabase/client";
import { Gig, Creator, NewGigInput, CategoryType } from "../types/skillswap";
import { INITIAL_GIGS, INITIAL_CREATORS } from "../data/seedData";

// In-memory runtime state for smooth fallback
let memoryGigs: Gig[] = [...INITIAL_GIGS];
let memoryCreators: Creator[] = [...INITIAL_CREATORS];

export async function getAllCreators(): Promise<Creator[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.from("creators").select("*");
    if (!error && data && data.length > 0) {
      return data as Creator[];
    }
  } catch (err) {
    console.warn("Supabase fetch failed for creators, falling back to local seed data:", err);
  }
  return memoryCreators;
}

export async function getGigsPaginated({
  category,
  search,
  sortBy = "newest",
}: {
  category?: CategoryType | "All";
  search?: string;
  sortBy?: "newest" | "price_low" | "price_high" | "rating";
}): Promise<Gig[]> {
  let gigs: Gig[] = [];

  try {
    const supabase = createClient();
    let query = supabase.from("gigs").select("*, creator:creators(*)");

    if (category && category !== "All") {
      query = query.eq("category", category);
    }

    if (search && search.trim() !== "") {
      const q = search.trim().toLowerCase();
      query = query.or(`title.ilike.%${q}%,description.ilike.%${q}%`);
    }

    if (sortBy === "newest") {
      query = query.order("created_at", { ascending: false });
    } else if (sortBy === "price_low") {
      query = query.order("rate", { ascending: true });
    } else if (sortBy === "price_high") {
      query = query.order("rate", { ascending: false });
    }

    const { data, error } = await query;
    if (!error && data && data.length > 0) {
      gigs = data as Gig[];
    }
  } catch (err) {
    console.warn("Supabase fetch failed for gigs, using local store:", err);
  }

  // Fallback / in-memory filtering if DB returns empty
  if (gigs.length === 0) {
    const creators = memoryCreators;
    gigs = memoryGigs.map((gig) => ({
      ...gig,
      creator: creators.find((c) => c.id === gig.creator_id),
    }));

    if (category && category !== "All") {
      gigs = gigs.filter((g) => g.category === category);
    }

    if (search && search.trim() !== "") {
      const q = search.trim().toLowerCase();
      gigs = gigs.filter(
        (g) =>
          g.title.toLowerCase().includes(q) ||
          g.description.toLowerCase().includes(q) ||
          (g.creator && g.creator.full_name.toLowerCase().includes(q)) ||
          (g.category_details && JSON.stringify(g.category_details).toLowerCase().includes(q))
      );
    }

    // Sort control (DP3 implementation)
    if (sortBy === "newest") {
      gigs.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } else if (sortBy === "price_low") {
      gigs.sort((a, b) => a.rate - b.rate);
    } else if (sortBy === "price_high") {
      gigs.sort((a, b) => b.rate - a.rate);
    } else if (sortBy === "rating") {
      gigs.sort((a, b) => (b.creator?.rating || 0) - (a.creator?.rating || 0));
    }
  }

  return gigs;
}

export async function getGigById(id: string): Promise<Gig | null> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("gigs")
      .select("*, creator:creators(*)")
      .eq("id", id)
      .single();

    if (!error && data) {
      return data as Gig;
    }
  } catch (err) {
    console.warn(`Supabase fetch failed for gig ${id}, checking memory store:`, err);
  }

  const found = memoryGigs.find((g) => g.id === id);
  if (found) {
    const creator = memoryCreators.find((c) => c.id === found.creator_id);
    return { ...found, creator };
  }
  return null;
}

export async function createGig(input: NewGigInput): Promise<Gig> {
  const newGig: Gig = {
    id: `g_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    creator_id: input.creator_id,
    title: input.title,
    category: input.category,
    rate: Number(input.rate),
    rate_type: input.rate_type,
    description: input.description,
    category_details: input.category_details,
    status: "active",
    created_at: new Date().toISOString(),
  };

  try {
    const supabase = createClient();
    const { data, error } = await supabase.from("gigs").insert([newGig]).select("*").single();
    if (!error && data) {
      memoryGigs.unshift(data as Gig);
      return data as Gig;
    }
  } catch (err) {
    console.warn("Supabase insert failed for gig, saving to memory:", err);
  }

  memoryGigs.unshift(newGig);
  return newGig;
}
