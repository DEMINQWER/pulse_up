const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://pulse-9ui4.onrender.com";

export async function apiRequest(endpoint, method = "GET", body = null, token = null) {

  const res = await fetch(`${API_URL}${endpoint}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` })
    },
    ...(body && { body: JSON.stringify(body) })
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Ошибка запроса");
  }

  return res.json();
}