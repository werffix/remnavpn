import api from './client'

export interface TelegramWidgetData {
  id: number
  first_name: string
  last_name?: string
  username?: string
  photo_url?: string
  auth_date: number
  hash: string
}

export interface TelegramWidgetConfig {
  bot_username: string
  size: 'large' | 'medium' | 'small'
  radius: number
  userpic: boolean
  request_access: boolean
  oidc_enabled: boolean
}

export const authApi = {
  loginTelegramWidget: (data: TelegramWidgetData) =>
    api.post('/auth/telegram/widget', data),
  getTelegramWidgetConfig: () =>
    api.get<TelegramWidgetConfig>('/branding/telegram-widget'),
  loginEmail: (email: string, password: string) =>
    api.post('/auth/email/login', { email, password }),
  registerEmail: (email: string, password: string) =>
    api.post('/auth/email/register/standalone', { email, password }),
  refresh: (refreshToken: string) =>
    api.post('/auth/refresh', { refresh_token: refreshToken }),
  logout: () => api.post('/auth/logout'),
  me: () => api.get('/auth/me'),
  isAdmin: () => api.get('/auth/me/is-admin'),
}
