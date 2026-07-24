import api from './client'

export interface DeepLinkTokenResponse {
  token: string
  bot_username: string
  expires_in: number
}

export interface AuthResponse {
  access_token: string
  refresh_token: string
  token_type: string
}

export const authApi = {
  requestDeepLink: () =>
    api.post<DeepLinkTokenResponse>('/auth/deeplink/request'),
  pollDeepLink: (token: string, campaignSlug?: string) =>
    api.post<AuthResponse>('/auth/deeplink/poll', {
      token,
      ...(campaignSlug ? { campaign_slug: campaignSlug } : {}),
    }),
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
