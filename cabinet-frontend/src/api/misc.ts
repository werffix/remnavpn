import api from './client'

export const ticketsApi = {
  list: (params?: { status?: string; page?: number; limit?: number }) =>
    api.get('/tickets', { params }),
  create: (subject: string, message: string) => api.post('/tickets', { subject, message }),
  get: (id: number) => api.get(`/tickets/${id}`),
  sendMessage: (id: number, message: string) => api.post(`/tickets/${id}/messages`, { message }),
}

export const newsApi = {
  list: (params?: { category?: string; page?: number }) => api.get('/news', { params }),
  categories: () => api.get('/news/categories'),
  get: (slug: string) => api.get(`/news/${slug}`),
}

export const promoApi = {
  activate: (code: string) => api.post('/promocode/activate', { code }),
  deactivate: () => api.post('/promocode/deactivate'),
  activeOffers: () => api.get('/promo/active'),
  claimOffer: (offerId: string) => api.post('/promo/claim', { offer_id: offerId }),
}

export const infoApi = {
  faq: () => api.get('/info/faq'),
  rules: () => api.get('/info/rules'),
  privacy: () => api.get('/info/privacy-policy'),
  service: () => api.get('/info/service'),
  languages: () => api.get('/info/languages'),
}

export const notificationsApi = {
  settings: () => api.get('/notifications'),
  updateSettings: (settings: Record<string, boolean>) => api.patch('/notifications', settings),
  history: () => api.get('/notifications/history'),
}
