import api from './client'

export const authApi = {
  loginTelegram: (initData: string) => api.post('/auth/telegram', { init_data: initData }),
  loginEmail: (email: string, password: string) => api.post('/auth/email/login', { email, password }),
  registerEmail: (email: string, password: string) => api.post('/auth/email/register/standalone', { email, password }),
  refresh: (refreshToken: string) => api.post('/auth/refresh', { refresh_token: refreshToken }),
  logout: () => api.post('/auth/logout'),
  me: () => api.get('/auth/me'),
  isAdmin: () => api.get('/auth/me/is-admin'),
}
