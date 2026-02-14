const API_URL = process.env.NEXT_PUBLIC_API_URL;

// ===============================
// GET CHATS
// ===============================
export async function getChats() {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/chats`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Ошибка загрузки чатов");
  }

  return data.chats;
}
