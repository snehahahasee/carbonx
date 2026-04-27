const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? "/api" : "http://127.0.0.1:5000/api");

export function getToken() {
  return localStorage.getItem("carbonx_token");
}

export function setSession({ token, user }) {
  localStorage.setItem("carbonx_token", token);
  localStorage.setItem("carbonx_user", JSON.stringify(user));
}

export function clearSession() {
  localStorage.removeItem("carbonx_token");
  localStorage.removeItem("carbonx_user");
}

export function storedUser() {
  const raw = localStorage.getItem("carbonx_user");
  return raw ? JSON.parse(raw) : null;
}

export async function api(path, options = {}) {
  const token = getToken();
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers
    }
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}
