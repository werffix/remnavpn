import api from '../client'

export const adminUsersApi = {
  list: (params?: Record<string, unknown>) => api.get('/admin/users', { params }),
  get: (id: number) => api.get(`/admin/users/${id}`),
  update: (id: number, data: Record<string, unknown>) => api.patch(`/admin/users/${id}`, data),
  ban: (id: number) => api.post(`/admin/users/${id}/ban`),
  unban: (id: number) => api.post(`/admin/users/${id}/unban`),
}

export const adminTariffsApi = {
  list: () => api.get('/admin/tariffs'),
  get: (id: number) => api.get(`/admin/tariffs/${id}`),
  create: (data: Record<string, unknown>) => api.post('/admin/tariffs', data),
  update: (id: number, data: Record<string, unknown>) => api.patch(`/admin/tariffs/${id}`, data),
  delete: (id: number) => api.delete(`/admin/tariffs/${id}`),
}

export const adminPaymentsApi = {
  list: (params?: Record<string, unknown>) => api.get('/admin/payments', { params }),
  get: (id: string) => api.get(`/admin/payments/${id}`),
}

export const adminStatsApi = {
  dashboard: () => api.get('/admin/stats'),
  sales: (params?: Record<string, unknown>) => api.get('/admin/stats/sales', { params }),
}

export const adminBroadcastsApi = {
  list: () => api.get('/admin/broadcasts'),
  create: (data: Record<string, unknown>) => api.post('/admin/broadcasts', data),
}

export const adminPromocodesApi = {
  list: (params?: Record<string, unknown>) => api.get('/admin/promocodes', { params }),
  create: (data: Record<string, unknown>) => api.post('/admin/promocodes', data),
}
