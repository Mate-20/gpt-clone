import clientPromise from "../mongodb";
import { ObjectId } from "mongodb";

export interface User {
  _id?: ObjectId;
  clerkUserId: string;   // from Clerk
  mem0UserId: string;    // from mem0
  createdAt: Date;
  updatedAt: Date;
}

export async function getOrCreateUser(clerkUserId: string, mem0UserId: string) {
  const client = await clientPromise;
  const db = client.db("gpt-clone");
  const users = db.collection<User>("users");

  let user = await users.findOne({ clerkUserId });
  if (!user) {
    const newUser: User = {
      clerkUserId,
      mem0UserId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const result = await users.insertOne(newUser);
    user = {
      ...newUser,
      _id: result.insertedId, // ✅ attach the generated _id
    };
  }
  return user;
}
