import { create } from 'zustand'
import { authApi } from '@/api/auth'

interface User {
  id: number
  telegram_id: number
  full_name: string
  username?: string
  email?: string
  balance_kopeks: number
  is_admin: boolean
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  fetchUser: () => Promise<void>
  setTokens: (access: string, refresh: string) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: !!localStorage.getItem('access_token'),
  isLoading: false,

  setTokens: (access, refresh) => {
    localStorage.setItem('access_token', access)
    localStorage.setItem('refresh_token', refresh)
    set({ isAuthenticated: true })
  },

  login: async (email, password) => {
    set({ isLoading: true })
    try {
      const { data } = await authApi.loginEmail(email, password)
      localStorage.setItem('access_token', data.access_token)
      localStorage.setItem('refresh_token', data.refresh_token)
      set({ isAuthenticated: true, isLoading: false })
      await useAuthStore.getState().fetchUser()
    } catch (e) {
      set({ isLoading: false })
      throw e
    }
  },

  logout: async () => {
    try { await authApi.logout() } catch {}
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    set({ user: null, isAuthenticated: false })
  },

  fetchUser: async () => {
    try {
      const { data } = await authApi.me()
      set({ user: data })
    } catch {}
  },
}))
