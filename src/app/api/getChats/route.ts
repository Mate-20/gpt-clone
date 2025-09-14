import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    // Get the authenticated user ID
    const clerkUser = await currentUser();


    if (!clerkUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db("gpt-clone");

    // Option 1: If you have a conversations collection
    const conversations = db.collection("chats");

    const userChats = await conversations
      .find({ userId: clerkUser.id })
      .sort({ updatedAt: -1 }) // Most recent first
      .project({
        _id: 1,
        userId: 1,
        title: 1,
        createdAt: 1,
        updatedAt: 1,
        chatId : 1
      })
      .limit(5) // Limit to last 50 conversations
      .toArray();

    return NextResponse.json({
      success: true,
      chats: userChats.map(chat => ({
        _id: chat._id,
        userId: chat.userId || 'New Chat',
        title: chat.title || 0,
        createdAt: chat.createdAt,
        updatedAt: chat.updatedAt,
        chatId : chat.chatId
      }))
    });

  } catch (error) {
    console.error('Get Chats API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}