import { create } from 'zustand'
import { subscriptionApi } from '@/api/subscription'

interface Subscription {
  id: number
  status: string
  end_date?: string
  traffic_limit_gb: number
  traffic_used_gb: number
  device_limit: number
  devices_used: number
  tariff_id?: number
  tariff_name?: string
  is_trial: boolean
  created_at: string
}

interface SubscriptionState {
  subscription: Subscription | null
  isLoading: boolean
  fetch: () => Promise<void>
}

export const useSubscriptionStore = create<SubscriptionState>((set) => ({
  subscription: null,
  isLoading: false,

  fetch: async () => {
    set({ isLoading: true })
    try {
      const { data } = await subscriptionApi.info()
      set({ subscription: data, isLoading: false })
    } catch {
      set({ subscription: null, isLoading: false })
    }
  },
}))
