const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default API_URL;

export async function apiRequest(
  endpoint,
  method = "GET",
  body = null,
  token = null
) {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "API Error");
    }

    return data;
  } catch (error) {
    console.error("API ERROR:", error);
    throw error;
  }
}