import api from './client'

export const subscriptionApi = {
  info: () => api.get('/subscription/info'),
  purchaseOptions: () => api.get('/subscription/purchase-options'),
  purchaseTariff: (tariffId: number) => api.post('/subscription/purchase-tariff', { tariff_id: tariffId }),
  renewalOptions: () => api.get('/subscription/renewal-options'),
  renew: (periodDays?: number) => api.post('/subscription/renew', { period_days: periodDays }),
  trial: () => api.get('/subscription/trial'),
  activateTrial: () => api.post('/subscription/trial'),
  connectionLink: () => api.get('/subscription/connection-link'),
  trafficPackages: () => api.get('/subscription/traffic-packages'),
  buyTraffic: (packageGb: number) => api.post('/subscription/traffic', { package_gb: packageGb }),
  devices: () => api.get('/subscription/devices'),
  deleteDevice: (hwid: string) => api.delete(`/subscription/devices/${hwid}`),
  deleteAllDevices: () => api.delete('/subscription/devices'),
  countries: () => api.get('/subscription/countries'),
  autopay: (enabled: boolean) => api.patch('/subscription/autopay', { enabled }),
  revoke: () => api.post('/subscription/revoke'),
  tariffSwitchPreview: (tariffId: number) => api.post('/subscription/tariff/switch/preview', { tariff_id: tariffId }),
  tariffSwitch: (tariffId: number) => api.post('/subscription/tariff/switch', { tariff_id: tariffId }),
}

export const subscriptionsApi = {
  list: () => api.get('/subscriptions'),
  get: (id: number) => api.get(`/subscriptions/${id}`),
  delete: (id: number) => api.delete(`/subscriptions/${id}`),
}
