const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

export default API_URL;

export async function apiRequest(
  endpoint,
  method = "GET",
  body = null,
  token = null
) {
  try {
    if (!API_URL) {
      throw new Error("NEXT_PUBLIC_API_URL is not defined");
    }

    // Гарантируем правильный слэш
    const url = `${API_URL}${endpoint.startsWith("/") ? endpoint : "/" + endpoint}`;

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });

    // Проверяем, есть ли тело ответа
    const text = await response.text();
    const data = text ? JSON.parse(text) : {};

    if (!response.ok) {
      throw new Error(data.error || "API Error");
    }

    return data;

  } catch (error) {
    console.error("API ERROR:", error.message);
    throw error;
  }
}