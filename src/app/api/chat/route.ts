import { google } from "@ai-sdk/google";
import { streamText } from "ai";
import { NextResponse } from "next/server";
import mem0 from "@/lib/mem0";
import clientPromise from "@/lib/mongodb"; // ✅ Mongo connection
import { currentUser } from '@clerk/nextjs/server';
// Load Gemini model
const model = google("models/gemini-2.5-flash");


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
    const clerkemail = clerkUser.emailAddresses[0].emailAddress;

    // ✅ Connect Mongo
    const client = await clientPromise;
    const db = client.db("gpt-clone");
    const messagesCol = db.collection("messages");
    const usersCol = db.collection("users");
    const chatsCol = db.collection("chats");

    // 1. if user is not stored in DB, store it
    let foundUser = await usersCol.findOne({ clerkUserId: clerkUserId });
    // const randommem0UserId = uuidv4();
    if (!foundUser) {
      const newUser = {
        clerkUserId: clerkUserId,
        mem0UserId: mem0Id,
        createdAt: new Date(),
        updatedAt: new Date(),
        email: clerkemail
      }
      const insertRes = await usersCol.insertOne(newUser);
      foundUser = { ...newUser, _id: insertRes.insertedId };
    }
    // 2. Find the user's most recent chat (by user._id). If none, create one.
    let chat = await chatsCol.findOne({ userId: clerkUserId, chatId: chatId }, { sort: { createdAt: -1 } });
    if (!chat) {
      const newChat = {
        userId: clerkUserId,
        title: `${messages[0].content.substring(0, 25)} ${messages[0].content.length > 25 ? "..." : ""}`,
        createdAt: new Date(),
        updatedAt: new Date(),
        chatId: chatId
      };
      const chatRes = await chatsCol.insertOne(newChat);
      chat = { ...newChat, _id: chatRes.insertedId };
    }

    // 3. Save the user’s message
    let userMessage;
    if (messages[0].fileContent?.type?.includes("pdf")) {
      userMessage = {
        chatId: chatId,
        role: "user",
        content: messages[0].content,
        fileContent: messages[0].fileContent,
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: clerkUserId,
      }
    }
    else if (messages[0].imageUrl) {
      userMessage = {
        chatId: chatId,
        role: "user",
        content: messages[0].content,
        imageUrl: messages[0].imageUrl,
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: clerkUserId,
      }
    } else {
      userMessage = {
        chatId: chatId,
        role: "user",
        content: messages[0].content,
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: clerkUserId,
      };
    }

    await messagesCol.insertOne(userMessage);

    // Convert to Gemini-compatible format
    const formattedMessages = messages.map((msg: any) => {
      // If any document pdf is there
      if (msg?.fileContent?.type?.includes("pdf")) {
        return {
          role: msg.role,
          content: [
            { type: "text", text: msg.content },
            {
              type: "text",
              text: `Attached document (${msg.fileContent.name}):\n\n${msg.fileContent.content}`,
            },
          ],
        };
      }
      // If any image is there
      else if (msg.imageUrl) {
        return {
          role: msg.role,
          content: [
            { type: "text", text: msg.content },
            { type: "image", image: msg.imageUrl }
          ]
        };
      }
      else {
        return msg
      } // normal text-only
    });
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
      messages: [...memoryContext, ...formattedMessages],
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
           const assistantMessage = {
            chatId: chatId,
            role: "assistant",
            content: "⚠️ Something went wrong. Please try again",
            createdAt: new Date(),
            updatedAt: new Date(),
            userId: clerkUserId,
          };
          await messagesCol.insertOne(assistantMessage);
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
