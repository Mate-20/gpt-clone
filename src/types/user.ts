// types/user.ts
import { ObjectId } from "mongodb";

export interface User {
  _id?: ObjectId;
  clerkUserId: string;   // Clerk user id
  mem0UserId: string;    // Mem0 id
  createdAt: Date;
  updatedAt: Date;
  email: string;
}
