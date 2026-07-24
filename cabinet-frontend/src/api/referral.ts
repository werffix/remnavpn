import api from './client'

export const referralApi = {
  info: () => api.get('/referral'),
  list: (params?: { page?: number; limit?: number }) => api.get('/referral/list', { params }),
  earnings: (params?: { page?: number; limit?: number }) => api.get('/referral/earnings', { params }),
  terms: () => api.get('/referral/terms'),
}
