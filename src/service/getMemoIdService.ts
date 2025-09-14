export async function getMemoIdService() {
  const res = await fetch(`/api/getMemo`);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'Failed to fetch memoId');
  }

  return data;
}