import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { currentUser } from '@clerk/nextjs/server';

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const chatId = searchParams.get("chatId");
    const clerkUser = await currentUser();

    if (!clerkUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const clerkUserId = clerkUser.id;

    const client = await clientPromise;
    const db = client.db("gpt-clone");
    const messagesCol = db.collection("messages");
    const chatsCol = db.collection("chats");

    // Delete the chat                 
    const chatDeleteResult = await chatsCol.deleteOne({ chatId, userId: clerkUserId });

    // Delete all messages for this chat
    const messagesDeleteResult = await messagesCol.deleteMany({ chatId, userId: clerkUserId });

    return NextResponse.json({
      success: true,
      chatDeleted: chatDeleteResult.deletedCount,
      messagesDeleted: messagesDeleteResult.deletedCount
    });
  }
  catch (err: any) {
    console.error("Delete Chat API error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}