import { google } from "@ai-sdk/google";
import { streamText } from "ai";
import { NextResponse } from "next/server";

// Load Gemini model
const model = google("models/gemini-2.0-flash");

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    // Stream Gemini response
    const result = await streamText({
      model,
      messages,
    });

    // ✅ this returns a proper streaming response for Next.js
    return result.toTextStreamResponse();
  } catch (err: any) {
    console.error("Chat API error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
