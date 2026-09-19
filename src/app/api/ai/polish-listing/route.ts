import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { jsonrepair } from "jsonrepair";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { category, roughNotes, existingRate } = body;

    if (!roughNotes || roughNotes.trim() === "") {
      return NextResponse.json(
        { error: "Rough notes are required to generate AI suggestions." },
        { status: 400 }
      );
    }

    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

    if (!apiKey || apiKey.includes("your_gemini_api_key")) {
      // Fallback generator when API key is not configured
      return NextResponse.json(generateFallbackAIResponse(category, roughNotes, existingRate));
    }

    const ai = new GoogleGenAI({ apiKey });

    const systemInstruction = `
You write short, clear, professional marketplace listings for SkillSwap, a gig platform where young creators (Design, Editing, Tutoring, Music) offer services to clients.
Given a creator's rough notes and their category, produce:
1. a title (under 60 characters, specific, engaging, no clickbait)
2. a description (2-4 sentences, plain language, states what's included and turnaround if mentioned)
3. a suggested rate with a one-sentence reasoning, using the category's typical range as a guide:
   - Design: fixed ₹800–2,500
   - Editing: fixed ₹400–1,800
   - Tutoring: hourly/session ₹250–400/hr
   - Music: fixed ₹500–1,500
Respond ONLY with raw valid JSON: {"title": "...", "description": "...", "suggestedRate": {"amount": N, "rateType": "fixed"|"hourly"|"per_session", "reasoning": "..."}}
`;

    const userPrompt = `
Category: ${category || "Design"}
Rough notes: ${roughNotes}
Existing rate (if creator already typed one, keep it and explain it): ${existingRate || "None"}
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction,
        temperature: 0.4,
        maxOutputTokens: 600,
      },
    });

    let rawText = response.text || "";
    // Clean up code block ticks if LLM returned markdown code fences
    rawText = rawText.replace(/```json/g, "").replace(/```/g, "").trim();

    let parsedResult;
    try {
      parsedResult = JSON.parse(jsonrepair(rawText));
    } catch {
      parsedResult = generateFallbackAIResponse(category, roughNotes, existingRate);
    }

    return NextResponse.json(parsedResult);
  } catch (error: any) {
    console.warn("AI Polish Error, using fallback:", error?.message);
    const body = await req.json().catch(() => ({}));
    return NextResponse.json(
      generateFallbackAIResponse(body.category, body.roughNotes, body.existingRate)
    );
  }
}

function generateFallbackAIResponse(category: string, roughNotes: string, existingRate?: number) {
  const cat = category || "Design";
  const notes = roughNotes.trim();

  let title = `${cat} Service — ${notes.substring(0, 30)}...`;
  let description = `Professional ${cat} service tailored to your project requirements. ${notes}`;
  let amount = existingRate || 1000;
  let rateType = "fixed";
  let reasoning = `Suggested based on average ${cat} marketplace listings on SkillSwap.`;

  if (cat === "Design") {
    title = `Professional Design & Branding Concepts`;
    description = `I will create modern, custom ${notes.toLowerCase()} tailored to your brand identity. Includes vector source files and fast delivery.`;
    amount = existingRate || 1200;
    rateType = "fixed";
    reasoning = `Similar Design gigs on the marketplace range ₹800–2,500.`;
  } else if (cat === "Editing") {
    title = `Fast Video Editing with Captions & Sound Design`;
    description = `I'll edit your raw video footage with clean cuts, background music, dynamic captions, and fast 2-day turnaround.`;
    amount = existingRate || 1000;
    rateType = "fixed";
    reasoning = `Similar Editing gigs on the marketplace range ₹400–1,800 per video.`;
  } else if (cat === "Tutoring") {
    title = `1-on-1 Interactive Tutoring & Practice Sessions`;
    description = `Structured 1-on-1 coaching covering core concepts, doubt solving, and practical problem sets tailored to your learning pace.`;
    amount = existingRate || 300;
    rateType = "hourly";
    reasoning = `Similar Tutoring sessions on the marketplace range ₹250–400 per hour.`;
  } else if (cat === "Music") {
    title = `Custom Music Beat Production & Mixing`;
    description = `High-quality audio production delivered as 24-bit untagged WAV + stems, tailored to your reference track styles.`;
    amount = existingRate || 1500;
    rateType = "fixed";
    reasoning = `Similar Music production gigs range ₹500–1,500 per track.`;
  }

  return {
    title,
    description,
    suggestedRate: {
      amount,
      rateType,
      reasoning,
    },
  };
}
