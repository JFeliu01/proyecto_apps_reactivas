import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import * as api from "./api/auth";

type AuthState = {
  user: api.User | null;
  token: string | null;
  status: "idle" | "loading" | "authenticated" | "unauthenticated";
  error: string | null;
  register: (name: string, email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
};

const AuthCtx = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<api.User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"));
  const [status, setStatus] = useState<AuthState["status"]>("idle");
  const [error, setError] = useState<string | null>(null);

  const saveToken = useCallback((t: string | null) => {
    setToken(t);
    if (t) localStorage.setItem("token", t);
    else localStorage.removeItem("token");
  }, []);

  const refresh = useCallback(async () => {
    setStatus("loading");
    setError(null);
    try {
      const { user } = await api.me(token);
      setUser(user);
      setStatus("authenticated");
    } catch (e: any) {
      setUser(null);
      setStatus("unauthenticated");
      setError(e?.message || "Session error");
    }
  }, [token]);

  useEffect(() => {
    // Try to restore session using cookie
    refresh();
  }, [refresh]);

  const register = useCallback(async (name: string, email: string, password: string) => {
    setError(null);
    const { user, token } = await api.register({ name, email, password });
    setUser(user);
    saveToken(token);
    setStatus("authenticated");
  }, [saveToken]);

  const login = useCallback(async (email: string, password: string) => {
    setError(null);
    const { user, token } = await api.login({ email, password });
    setUser(user);
    saveToken(token);
    setStatus("authenticated");
  }, [saveToken]);

  const logout = useCallback(async () => {
    setError(null);
    await api.logout();
    setUser(null);
    saveToken(null);
    setStatus("unauthenticated");
  }, [saveToken]);

  const value = useMemo<AuthState>(() => ({
    user,
    token,
    status,
    error,
    register,
    login,
    logout,
    refresh,
  }), [user, token, status, error, register, login, logout, refresh]);

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}


