export interface User {
  id: number; telegram_id: number | null; email: string | null;
  first_name: string; last_name: string | null; username: string | null;
  language_code: string; balance_kopeks: number; referral_code: string;
  status: 'ACTIVE' | 'BLOCKED' | 'DELETED';
  is_partner: boolean; email_verified: boolean;
  auth_type: 'telegram' | 'email' | 'both';
  created_at: string; updated_at: string;
}

export interface Subscription {
  id: number; user_id: number; tariff_id: number | null;
  status: 'TRIAL' | 'ACTIVE' | 'EXPIRED' | 'DISABLED' | 'LIMITED' | 'PENDING';
  start_date: string; end_date: string;
  traffic_limit_bytes: number; traffic_used_bytes: number;
  device_limit: number; device_count: number;
  autopay_enabled: boolean;
  remnawave_uuid: string;
  created_at: string;
  tariff?: Tariff;
}

export interface Tariff {
  id: number; name: string; description: string;
  traffic_limit_gb: number; device_limit: number;
  period_prices: Record<string, number>;
  tier_level: number; is_active: boolean;
  trial_available: boolean; sort_order: number;
}

export interface Transaction {
  id: number; type: string; amount_kopeks: number;
  balance_before_kopeks: number; balance_after_kopeks: number;
  payment_method: string; status: string;
  description: string; created_at: string;
}

export interface PaymentMethod {
  id: string; enabled: boolean; display_name: string;
  sort_order: number; min_amount_kopeks: number;
  max_amount_kopeks: number; sub_options?: Record<string, string>;
}

export interface Ticket {
  id: number; title: string; status: 'OPEN' | 'ANSWERED' | 'CLOSED' | 'PENDING';
  priority: 'low' | 'medium' | 'high';
  created_at: string; updated_at: string;
  last_message?: string;
}

export interface TicketMessage {
  id: number; user_id: number; message: string;
  is_admin: boolean; has_media: boolean; created_at: string;
}

export interface ReferralStats {
  total_invited: number; paid_referrals: number;
  active_referrals: number; conversion_rate: number;
  total_earnings_kopeks: number; monthly_earnings_kopeks: number;
}

export interface Referral {
  id: number; username: string; first_name: string;
  earnings_kopeks: number; created_at: string;
}

export interface NewsArticle {
  id: number; title: string; content: string;
  image_url: string | null; category_id: number | null;
  tags: string[]; is_published: boolean; created_at: string;
}

export interface WheelConfig {
  spin_cost_type: 'stars' | 'subscription_days';
  spin_cost_amount: number; daily_free_spins: number;
  prizes: WheelPrize[];
}

export interface WheelPrize {
  id: number; type: string; value: string;
  weight: number; is_active: boolean;
}

export interface WheelSpin {
  id: number; prize_type: string; prize_value: string;
  created_at: string;
}

export interface Poll {
  id: number; title: string; description: string;
  is_active: boolean; reward_kopeks: number;
  questions?: PollQuestion[];
}

export interface PollQuestion {
  id: number; question: string; options: string[];
}

export interface Contest {
  id: number; title: string; type: string;
  prize_type: string; prize_amount: number;
  start_date: string; end_date: string; is_active: boolean;
}

export interface ServerInfo {
  uuid: string; name: string; country_code: string;
  is_online: boolean; load_percent: number;
  user_count: number;
}

export interface AuthResponse {
  access_token: string; refresh_token: string;
  token_type: string; expires_in: number;
  user: User;
}

export interface PaginatedResponse<T> {
  items: T[]; total: number; page: number;
  size: number; pages: number;
}
