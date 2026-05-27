import api from './client';
import type { AuthResponse, User, PaginatedResponse, Transaction, Subscription, Tariff, PaymentMethod, Ticket, TicketMessage, ReferralStats, Referral, NewsArticle, WheelConfig, WheelSpin, Poll, Contest, ServerInfo } from '@/types';

export const authApi = {
  me: () => api.get<User>('/auth/me').then(r => r.data),
  login: (data: { email: string; password: string }) => api.post<AuthResponse>('/auth/login', data).then(r => r.data),
  register: (data: { email: string; password: string; referral_code?: string }) => api.post<AuthResponse>('/auth/register', data).then(r => r.data),
  telegram: (data: { init_data: string }) => api.post<AuthResponse>('/auth/telegram', data).then(r => r.data),
  telegramOidc: (data: { id_token: string; referral_code?: string; campaign_slug?: string }) => api.post<AuthResponse>('/auth/telegram-oidc', data).then(r => r.data),
  telegramWidget: (data: Record<string, unknown>) => api.post<AuthResponse>('/auth/telegram-widget', data).then(r => r.data),
  refresh: (refreshToken: string) => api.post<AuthResponse>('/auth/refresh', { refresh_token: refreshToken }).then(r => r.data),
  logout: () => api.post('/auth/logout'),
  forgotPassword: (email: string) => api.post('/auth/password/forgot', { email }),
  resetPassword: (token: string, password: string) => api.post('/auth/password/reset', { token, password }),
  getWidgetConfig: () => api.get('/branding/telegram-widget').then(r => r.data),
};

export const balanceApi = {
  get: () => api.get<{ balance_kopeks: number }>('/balance').then(r => r.data),
  transactions: (params?: { page?: number; size?: number; type?: string }) => api.get<PaginatedResponse<Transaction>>('/balance/transactions', { params }).then(r => r.data),
  topup: (data: { method: string; amount_kopeks: number }) => api.post('/balance/topup', data).then(r => r.data),
  paymentMethods: () => api.get<PaymentMethod[]>('/balance/payment-methods').then(r => r.data),
};

export const subscriptionApi = {
  get: () => api.get<Subscription[]>('/subscription').then(r => r.data),
  status: () => api.get<Subscription>('/subscription/status').then(r => r.data),
  tariffs: () => api.get<Tariff[]>('/tariffs').then(r => r.data),
  servers: () => api.get<ServerInfo[]>('/servers').then(r => r.data),
  purchase: (data: { tariff_id?: number; period_days: number; servers?: string[]; traffic_gb?: number; device_limit?: number; promocode?: string; payment_method: string }) => api.post('/subscription/purchase', data).then(r => r.data),
  preview: (data: { tariff_id?: number; period_days: number; servers?: string[]; traffic_gb?: number; device_limit?: number; promocode?: string }) => api.post('/subscription/purchase/preview', data).then(r => r.data),
  renew: (id: number) => api.post(`/subscription/renew`, { subscription_id: id }).then(r => r.data),
  renewPreview: (id: number) => api.post(`/subscription/renew/preview`, { subscription_id: id }).then(r => r.data),
  revoke: (id: number) => api.post(`/subscription/revoke`, { subscription_id: id }).then(r => r.data),
  trafficTopup: (data: { subscription_id: number; traffic_gb: number }) => api.post('/subscription/traffic/topup', data).then(r => r.data),
  autopayEnable: (id: number) => api.post('/subscription/autopay/enable', { subscription_id: id }).then(r => r.data),
  autopayDisable: (id: number) => api.post('/subscription/autopay/disable', { subscription_id: id }).then(r => r.data),
  tariffSwitch: (data: { subscription_id: number; tariff_id: number }) => api.post('/subscription/tariff/switch', data).then(r => r.data),
  tariffSwitchPreview: (data: { subscription_id: number; tariff_id: number }) => api.post('/subscription/tariff/switch/preview', data).then(r => r.data),
};

export const referralApi = {
  stats: () => api.get<ReferralStats>('/referral').then(r => r.data),
  list: (params?: { page?: number }) => api.get<PaginatedResponse<Referral>>('/referral/list', { params }).then(r => r.data),
  withdrawals: () => api.get('/referral/withdrawals').then(r => r.data),
  requestWithdrawal: (data: { amount_kopeks: number; requisites: string }) => api.post('/referral/withdrawal', data).then(r => r.data),
  cancelWithdrawal: (id: number) => api.post(`/referral/withdrawal/${id}/cancel`).then(r => r.data),
  partnerApply: (data: { company_name: string; website?: string; description: string }) => api.post('/referral/partner/apply', data).then(r => r.data),
};

export const ticketsApi = {
  list: () => api.get<Ticket[]>('/tickets').then(r => r.data),
  get: (id: number) => api.get<{ ticket: Ticket; messages: TicketMessage[] }>(`/tickets/${id}`).then(r => r.data),
  create: (data: { title: string; message: string }) => api.post('/tickets', data).then(r => r.data),
  reply: (id: number, data: { message: string }) => api.post(`/tickets/${id}/reply`, data).then(r => r.data),
  close: (id: number) => api.post(`/tickets/${id}/close`).then(r => r.data),
};

export const promocodeApi = {
  activate: (code: string) => api.post('/promocode/activate', { code }).then(r => r.data),
};

export const newsApi = {
  list: (params?: { page?: number; category_id?: number }) => api.get<PaginatedResponse<NewsArticle>>('/news', { params }).then(r => r.data),
  get: (id: number) => api.get<NewsArticle>(`/news/${id}`).then(r => r.data),
};

export const infoApi = {
  rules: () => api.get('/info/rules').then(r => r.data),
  privacy: () => api.get('/info/privacy').then(r => r.data),
  faq: () => api.get('/info/faq').then(r => r.data),
  offer: () => api.get('/info/public-offer').then(r => r.data),
};

export const wheelApi = {
  config: () => api.get<WheelConfig>('/wheel/config').then(r => r.data),
  spin: () => api.post<WheelSpin>('/wheel/spin').then(r => r.data),
  history: () => api.get<WheelSpin[]>('/wheel/history').then(r => r.data),
};

export const pollsApi = {
  list: () => api.get<Poll[]>('/polls').then(r => r.data),
  respond: (id: number, data: { answers: Record<number, string> }) => api.post(`/polls/${id}/respond`, data).then(r => r.data),
};

export const contestsApi = {
  list: () => api.get<Contest[]>('/contests').then(r => r.data),
  attempt: (id: number) => api.post(`/contests/${id}/attempt`).then(r => r.data),
};

export const notificationsApi = {
  settings: () => api.get('/notifications/settings').then(r => r.data),
  update: (data: Record<string, boolean>) => api.put('/notifications/settings', data).then(r => r.data),
};
