// import { google } from "@ai-sdk/google";
// import { streamText } from "ai";
// import { NextResponse } from "next/server";
// import mem0 from "@/lib/mem0";
// import { cookies } from "next/headers";
// // Load Gemini model
// const model = google("models/gemini-2.0-flash");

// export async function POST(req: Request) {
//   try {
//     const { messages } = await req.json();

//     if (!messages || !Array.isArray(messages)) {
//       return NextResponse.json({ error: "Invalid request" }, { status: 400 });
//     }
//     const cookieStore = await cookies();
//     const userIdFromCookie = cookieStore.get('user_id')?.value;

//     const memories = mem0.search(
//       messages[0].content,
//       { user_id: userIdFromCookie, limit: 10 },)
//     // Turn them into "system" or "assistant" messages so Gemini sees them

//     const memoryContext = (await memories).map((m: any) => ({
//       role: "system",
//       content: `Memory: ${m.memory}`,
//     }));

//     // Stream Gemini response
//     const result = await streamText({
//       model,
//       messages: [...memoryContext, ...messages],
//       // ✅ hook that runs when model finishes
//       onFinish: async ({ text }) => {
//         try {
//           const saved = await mem0.add(
//             [
//               ...messages, // all user messages you passed in
//               { role: "assistant", content: text },
//             ],
//             { user_id: userIdFromCookie } // replace with real user id if available
//           );
//         } catch (err) {
//           console.error("❌ Failed to save to mem0:", err);
//         }
//       },
//     });

//     // ✅ this returns a proper streaming response for Next.js
//     return result.toTextStreamResponse();
//   } catch (err: any) {
//     console.error("Chat API error:", err);
//     return NextResponse.json({ error: err.message }, { status: 500 });
//   }
// }



import { google } from "@ai-sdk/google";
import { streamText } from "ai";
import { NextResponse } from "next/server";
import mem0 from "@/lib/mem0";
import clientPromise from "@/lib/mongodb"; // ✅ Mongo connection
import { currentUser } from '@clerk/nextjs/server';
// Load Gemini model
const model = google("models/gemini-2.0-flash");

export async function POST(req: Request) {
  try {
    const { messages, mem0Id, chatId } = await req.json();
    const clerkUser = await currentUser();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    // ✅ Get Clerk user ID
    if (!clerkUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const clerkUserId = clerkUser.id;

    // ✅ Connect Mongo
    const client = await clientPromise;
    const db = client.db("gpt-clone");
    const messagesCol = db.collection("messages");

    // 3. Save the user’s message
    const userMessage = {
      chatId: chatId,
      role: "user",
      content: messages[0].content,
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: clerkUserId,
    };
    await messagesCol.insertOne(userMessage);

    // 4. Pull memory context from mem0
    const memories = await mem0.search(messages[0].content, {
      user_id: mem0Id,
      limit: 10,
    });
    const memoryContext = memories.map((m: any) => ({
      role: "system",
      content: `Memory: ${m.memory}`,
    }));

    // 5. Stream Gemini response
    const result = await streamText({
      model,
      messages: [...memoryContext, ...messages],
      onFinish: async ({ text }) => {
        try {
          // Save assistant message in DB
          const assistantMessage = {
            chatId: chatId,
            role: "assistant",
            content: text,
            createdAt: new Date(),
            updatedAt: new Date(),
            userId: clerkUserId,
          };
          await messagesCol.insertOne(assistantMessage);

          // Save to mem0
          await mem0.add(
            [...messages, { role: "assistant", content: text }],
            { user_id: mem0Id }
          );
        } catch (err) {
          console.error("❌ Failed to save:", err);
        }
      },
    });

    return result.toTextStreamResponse();
  } catch (err: any) {
    console.error("Chat API error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
