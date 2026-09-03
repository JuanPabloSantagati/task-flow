const API_URL = import.meta.env.VITE_API_URL as string;

let accessToken: string | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
}

async function rawFetch(path: string, options: RequestInit = {}): Promise<Response> {
  return fetch(`${API_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...options.headers,
    },
  });
}

export async function apiFetch(path: string, options: RequestInit = {}): Promise<Response> {
  let res = await rawFetch(path, options);
  if (res.status === 401 && path !== "/auth/refresh") {
    const refreshRes = await rawFetch("/auth/refresh", { method: "POST" });
    if (refreshRes.ok) {
      const { accessToken: newToken } = await refreshRes.json();
      setAccessToken(newToken);
      res = await rawFetch(path, options);
    }
  }
  return res;
}
