// services/chatService.ts

export const sendMessageService = async (
  chatId: string,
  mem0Id: string,
  inputMessage: string,
  imageUrl : string,
  onMessage: (partial: string) => void
) => {
  // const userMessage = {
  //   role: "user" as const,
  //   content: inputMessage,
  // };

  const res = await fetch("/api/chat", {
    method: "POST",
    body: JSON.stringify({ chatId, mem0Id, messages: [{ role: "user", content: inputMessage, imageUrl }] }),
  });

  if (!res.ok) {
    throw new Error("Chat request failed");
  }

  const reader = res.body?.getReader();
  const decoder = new TextDecoder();
  if (!reader) return;

  let botReply = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    botReply += decoder.decode(value, { stream: true });
    onMessage(botReply); // push updates back to UI
  }

  // Return final AI message in DB format
  return {
    role: "assistant",
    content: botReply,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};
