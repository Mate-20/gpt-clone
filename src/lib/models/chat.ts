import clientPromise from "../mongodb";
import { ObjectId } from "mongodb";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  createdAt: Date;
}

export interface Chat {
  _id?: ObjectId;
  chatId: string;
  userId: string; // link to clerkUserId
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

export async function createChat(userId: string, chatId: string) {
  const client = await clientPromise;
  const db = client.db("gpt-clone");
  const chats = db.collection<Chat>("chats");

  const newChat: Chat = {
    chatId,
    userId,
    messages: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  await chats.insertOne(newChat);
  return newChat;
}

export async function getChat(chatId: string) {
  const client = await clientPromise;
  const db = client.db("gpt-clone");
  const chats = db.collection<Chat>("chats");

  return chats.findOne({ chatId });
}

export async function addMessage(chatId: string, role: "user" | "assistant", content: string) {
  const client = await clientPromise;
  const db = client.db("gpt-clone");
  const chats = db.collection<Chat>("chats");

  await chats.updateOne(
    { chatId },
    {
      $push: { messages: { role, content, createdAt: new Date() } },
      $set: { updatedAt: new Date() }
    }
  );
}
