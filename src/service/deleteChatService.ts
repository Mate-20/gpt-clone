export const deleteChatService = async (chatId: string) => {
  const res = await fetch(`/api/deleteChat?chatId=${chatId}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("Chat request failed");
  }

  const json = await res.json();
  return json;
};