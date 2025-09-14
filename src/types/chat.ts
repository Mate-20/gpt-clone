// types/chat.ts
import { ObjectId } from "mongodb";

export interface Chat {
  _id?: ObjectId;
  userId: string;      // reference to clerkUserId
  title: string;
  createdAt: Date;
  updatedAt: Date;
}
