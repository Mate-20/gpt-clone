// types/message.ts
import { ObjectId } from "mongodb";

export interface Message {
  _id?: ObjectId;
  chatId: string;      // reference to Chat._id
  role: "user" | "assistant" | "system";
  content: string;
  createdAt: Date;
  updatedAt: Date;
  userId : string;
}
