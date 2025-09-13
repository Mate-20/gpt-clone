import { google } from "@ai-sdk/google";
import { streamText } from "ai";
import { NextResponse } from "next/server";
import mem0 from "@/lib/mem0";
import { cookies } from "next/headers";
// Load Gemini model
const model = google("models/gemini-2.0-flash");

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
    const cookieStore = await cookies();
    const userIdFromCookie = cookieStore.get('user_id')?.value;
    
    const memories = mem0.search(
      messages[0].content,
      { user_id: userIdFromCookie, limit: 10 },)
    // Turn them into "system" or "assistant" messages so Gemini sees them

    const memoryContext = (await memories).map((m: any) => ({
      role: "system",
      content: `Memory: ${m.memory}`,
    }));

    // Stream Gemini response
    const result = await streamText({
      model,
      messages: [...memoryContext, ...messages],
      // ✅ hook that runs when model finishes
      onFinish: async ({ text }) => {
        try {
          const saved = await mem0.add(
            [
              ...messages, // all user messages you passed in
              { role: "assistant", content: text },
            ],
            { user_id: userIdFromCookie } // replace with real user id if available
          );
        } catch (err) {
          console.error("❌ Failed to save to mem0:", err);
        }
      },
    });

    // ✅ this returns a proper streaming response for Next.js
    return result.toTextStreamResponse();
  } catch (err: any) {
    console.error("Chat API error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}


