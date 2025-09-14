// types/chat.ts
import { ObjectId } from "mongodb";

export interface Chat {
  _id?: ObjectId;
  chatId : string;
  userId: string;      // reference to clerkUserId
  title: string;
  createdAt: Date;
  updatedAt: Date;
}
