import api from './client'

export interface TelegramWidgetConfig {
  bot_username: string
  size: 'large' | 'medium' | 'small'
  radius: number
  userpic: boolean
  request_access: boolean
  oidc_enabled: boolean
  oidc_client_id: string
}

export interface AuthResponse {
  access_token: string
  refresh_token: string
  token_type: string
}

export const authApi = {
  getTelegramWidgetConfig: () =>
    api.get<TelegramWidgetConfig>('/branding/telegram-widget'),
  loginTelegramOidc: (idToken: string, referralCode?: string) =>
    api.post<AuthResponse>('/auth/telegram/oidc', {
      id_token: idToken,
      ...(referralCode ? { referral_code: referralCode } : {}),
    }),
  loginEmail: (email: string, password: string) =>
    api.post('/auth/email/login', { email, password }),
  refresh: (refreshToken: string) =>
    api.post('/auth/refresh', { refresh_token: refreshToken }),
  logout: () => api.post('/auth/logout'),
  me: () => api.get('/auth/me'),
  isAdmin: () => api.get('/auth/me/is-admin'),
}
