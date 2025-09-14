import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db("gpt-clone");
    const userCollection = db.collection("users");

    // ...existing code...
    const foundUser = await userCollection
      .findOne({ clerkUserId: clerkUser.id }, { projection: { mem0UserId: 1, _id: 0 } });

    if (!foundUser || !foundUser.mem0UserId) {
      return NextResponse.json({ error: 'mem0UserId not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      mem0UserId: foundUser.mem0UserId
    });
// ...existing code...

  } catch (error) {
    console.error('Get Messages API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}