// services/chatService.ts

export const getChatsService = async () => {
  const res = await fetch("/api/getChats")

  if (!res.ok) {
    throw new Error("Chat request failed");
  }

  const json = await res.json();
  return json?.chats || [];
};
