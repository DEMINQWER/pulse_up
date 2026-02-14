const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  console.error("NEXT_PUBLIC_API_URL is not defined");
}

// ===============================
// REGISTER
// ===============================
export async function register(email, password) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email.trim(),
      password,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Ошибка регистрации");
  }

  localStorage.setItem("token", data.token);

  return data;
}

// ===============================
// LOGIN
// ===============================
export async function login(email, password) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email.trim(),
      password: password,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Ошибка входа");
  }

console.log("NEW TOKEN:", data.token);

  localStorage.setItem("token", data.token);

  return data;
}

// ===============================
// LOGOUT
// ===============================
export function logout() {
  localStorage.removeItem("token");
}

// ===============================
// GET TOKEN
// ===============================
export function getToken() {
  return localStorage.getItem("token");
}

// ===============================
// CHECK AUTH
// ===============================
export function isAuthenticated() {
  return !!localStorage.getItem("token");
}

// ===============================
// AUTH HEADERS
// ===============================
export function getAuthHeaders() {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

// ===============================
// AUTH FETCH (универсальный)
// ===============================
export async function authFetch(url, options = {}) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });

  if (res.status === 401) {
    logout();
    window.location.href = "/login";
    return;
  }

  return res.json();
}