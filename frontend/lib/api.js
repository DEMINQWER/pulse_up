const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function apiRequest(
  endpoint,
  method = "GET",
  body = null,
  token = null
) {
  if (!API_URL) {
    throw new Error("NEXT_PUBLIC_API_URL не задан");
  }

  const url = `${API_URL}${
    endpoint.startsWith("/") ? endpoint : "/" + endpoint
  }`;

  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(url, options);

  const text = await response.text();
  const data = text ? JSON.parse(text) : {};

  if (!response.ok) {
    throw new Error(data.error || "Ошибка API");
  }

  return data;
}