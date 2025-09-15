import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import clientPromise from '@/lib/mongodb';

export async function GET(request: Request) {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get chatId from query params
    const { searchParams } = new URL(request.url);
    const chatId = searchParams.get('chatId');
    if (!chatId) {
      return NextResponse.json({ error: 'chatId is required' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("gpt-clone");
    const messagesCollection = db.collection("messages");

    // Find messages for this chatId and user
    const userMessages = await messagesCollection
      .find({ chatId, userId: clerkUser.id })
      .sort({ createdAt: 1 }) // Oldest first
      .project({
        _id: 1,
        chatId: 1,
        role: 1,
        content: 1,
        createdAt: 1,
        updatedAt: 1,
        userId: 1,
        imageUrl : 1,
        fileContent : 1
      })
      .toArray();

    return NextResponse.json({
      success: true,
      messages: userMessages.map(message => ({
        _id: message._id,
        chatId: message.chatId || 'New Chat',
        role: message.role || 0,
        content: message.content,
        createdAt: message.createdAt,
        updatedAt:message.updatedAt,
        userId : message.userId,
        imageUrl : message.imageUrl,
        fileContent : message.fileContent
      }))
    });

  } catch (error) {
    console.error('Get Messages API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}