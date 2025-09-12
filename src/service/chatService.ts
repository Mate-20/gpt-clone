// services/chatService.ts
export const sendMessageService = async (
  inputMessage: string,
  onMessage: (partial: string) => void
) => {
  const userMessage = {
    id: crypto.randomUUID(),
    role: "user" as const,
    content: inputMessage,
  };

  const res = await fetch("/api/chat", {
    method: "POST",
    body: JSON.stringify({
      messages: [userMessage], // only current prompt
    }),
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

  return botReply; // final reply
};
