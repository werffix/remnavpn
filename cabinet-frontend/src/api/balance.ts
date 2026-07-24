import api from './client'

export const balanceApi = {
  get: () => api.get('/balance'),
  transactions: (params?: { type?: string; page?: number; limit?: number }) =>
    api.get('/balance/transactions', { params }),
  paymentMethods: () => api.get('/balance/payment-methods'),
  topup: (amountKopeks: number, method: string) =>
    api.post('/balance/topup', { amount_kopeks: amountKopeks, method }),
  starsInvoice: (amountKopeks: number) => api.post('/balance/stars-invoice', { amount_kopeks: amountKopeks }),
  pendingPayments: () => api.get('/balance/pending-payments'),
  checkPayment: (paymentId: string) => api.post(`/balance/pending-payments/${paymentId}/check`),
  savedCards: () => api.get('/balance/saved-cards'),
  deleteCard: (cardId: string) => api.delete(`/balance/saved-cards/${cardId}`),
}
