import { create } from 'zustand';
import { api } from '@/api';
import type { User } from '@/types';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  setAuth: (access: string, refresh: string, user: User) => void;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<boolean>;
  loadUser: () => Promise<void>;
  init: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: localStorage.getItem('access_token'),
  refreshToken: localStorage.getItem('refresh_token'),
  isLoading: true,
  isAuthenticated: false,

  setAuth: (access, refresh, user) => {
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
    set({ accessToken: access, refreshToken: refresh, user, isAuthenticated: true, isLoading: false });
  },

  logout: async () => {
    try { await api.auth.logout(); } catch {}
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false, isLoading: false });
  },

  refreshAuth: async () => {
    const refreshToken = get().refreshToken;
    if (!refreshToken) return false;
    try {
      const res = await api.auth.refresh(refreshToken);
      get().setAuth(res.access_token, res.refresh_token, res.user);
      return true;
    } catch {
      get().logout();
      return false;
    }
  },

  loadUser: async () => {
    try {
      const user = await api.auth.me();
      set({ user, isAuthenticated: true, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  init: async () => {
    const token = get().accessToken;
    if (!token) {
      set({ isLoading: false });
      return;
    }
    const ok = await get().refreshAuth();
    if (ok) await get().loadUser();
    else set({ isLoading: false });
  },
}));
