export async function getMessages(chatId: string) {
  if (!chatId) throw new Error('chatId is required');

  const res = await fetch(`/api/getMessages?chatId=${encodeURIComponent(chatId)}`);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'Failed to fetch messages');
  }

  return data.messages;
}