import { API_URI } from "../runtimeConfig";

export type User = {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
};

type RegisterBody = { name: string; email: string; password: string };
type LoginBody = { email: string; password: string };

type ApiError = { message: string };

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try {
      const data = (await res.json()) as ApiError;
      if (data?.message) msg = data.message;
    } catch {}
    throw new Error(msg);
  }
  // 204 no content
  if (res.status === 204) return undefined as unknown as T;
  return (await res.json()) as T;
}

export async function register(body: RegisterBody) {
  const res = await fetch(`${API_URI}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(body),
  });
  return handle<{ user: User; token: string }>(res);
}

export async function login(body: LoginBody) {
  const res = await fetch(`${API_URI}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(body),
  });
  return handle<{ user: User; token: string }>(res);
}

export async function logout() {
  const res = await fetch(`${API_URI}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });
  return handle<void>(res);
}

export async function me(token?: string | null) {
  const headers: Record<string, string> = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${API_URI}/auth/me`, {
    method: "GET",
    credentials: "include",
    headers,
  });
  return handle<{ user: User }>(res);
}


