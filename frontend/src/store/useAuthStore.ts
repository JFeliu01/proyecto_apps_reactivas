import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import * as api from '../api/auth';

export interface User {
  _id: string;
  name: string;
  email: string;
}

interface AuthState {
  // State
  user: User | null;
  token: string | null;
  status: 'idle' | 'loading' | 'authenticated' | 'unauthenticated';
  error: string | null;

  // Actions
  setUser: (user: User | null, token?: string) => void;
  setToken: (token: string | null) => void;
  setStatus: (status: AuthState['status']) => void;
  setError: (error: string | null) => void;
  
  // Async actions
  register: (name: string, email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refresh: () => Promise<void>;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      token: null,
      status: 'idle',
      error: null,

      // Setters
      setUser: (user, token) => {
        set({ user, status: 'authenticated' });
        if (token) {
          set({ token });
          localStorage.setItem('token', token);
        }
      },
      setToken: (token) => {
        set({ token });
        if (token) {
          localStorage.setItem('token', token);
        } else {
          localStorage.removeItem('token');
        }
      },
      setStatus: (status) => set({ status }),
      setError: (error) => set({ error }),

      // Register
      register: async (name: string, email: string, password: string) => {
        set({ status: 'loading', error: null });
        try {
          const { user, token } = await api.register({ name, email, password });
          set({ 
            user, 
            token, 
            status: 'authenticated', 
            error: null 
          });
          localStorage.setItem('token', token);
        } catch (e: any) {
          set({ 
            status: 'unauthenticated', 
            error: e?.message || 'Registration failed' 
          });
          throw e;
        }
      },

      // Login
      login: async (email: string, password: string) => {
        set({ status: 'loading', error: null });
        try {
          const { user, token } = await api.login({ email, password });
          set({ 
            user, 
            token, 
            status: 'authenticated', 
            error: null 
          });
          localStorage.setItem('token', token);
        } catch (e: any) {
          set({ 
            status: 'unauthenticated', 
            error: e?.message || 'Login failed' 
          });
          throw e;
        }
      },

  // Logout
  logout: () => {
    // Call API in background but don't wait for it
    api.logout().catch(() => {});
    
    // Immediately clear local state
    set({ 
      user: null, 
      token: null, 
      status: 'unauthenticated', 
      error: null 
    });
    localStorage.removeItem('token');
  },      // Refresh session
      refresh: async () => {
        const { token } = get();
        if (!token) {
          set({ status: 'unauthenticated' });
          return;
        }

        set({ status: 'loading', error: null });
        try {
          const { user } = await api.me(token);
          set({ 
            user, 
            status: 'authenticated', 
            error: null 
          });
        } catch (e: any) {
          set({ 
            user: null, 
            token: null,
            status: 'unauthenticated', 
            error: e?.message || 'Session expired' 
          });
          localStorage.removeItem('token');
        }
      },

      // Clear auth state
      clearAuth: () => {
        set({ 
          user: null, 
          token: null, 
          status: 'unauthenticated', 
          error: null 
        });
        localStorage.removeItem('token');
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        token: state.token,
        user: state.user 
      }),
    }
  )
);
