/**
 * Shapes returned by the Django management API
 * (backend: management/serializers/subscription_serializers.py).
 *
 * Admin-only — these carry fields the public catalog never exposes
 * (translations, inactive plans, subscriber counts, gateway config).
 */

export interface AdminPlan {
  id: string;
  name: string;
  plan_type: string;
  plan_category: string;
  tagline: string;
  description: string;
  /** Decimal strings, e.g. "49.00".  */
  monthly_price: string;
  yearly_price: string;
  yearly_discount_percentage: number;
  features: string[];
  translations: Record<string, Partial<Record<string, string | string[]>>>;
  /** Explicit limit rows; a missing code means unlimited. */
  limits: Record<string, number>;
  capability_codes: string[];
  trial_days: number;
  per_location_pricing: boolean;
  custom_pricing: boolean;
  is_active: boolean;
  is_popular: boolean;
  display_order: number;
  flutterwave_monthly_plan_id: string | null;
  flutterwave_yearly_plan_id: string | null;
  /** Branches currently subscribed on this plan. */
  active_subscription_count: number;
  created_at: string;
  updated_at: string;
}

/** PATCH/POST body. `null` in `limits` deletes the row (= unlimited). */
export interface AdminPlanWritePayload {
  name?: string;
  plan_type?: string;
  plan_category?: string;
  tagline?: string;
  description?: string;
  monthly_price?: string;
  yearly_price?: string;
  features?: string[];
  limits?: Record<string, number | null>;
  capability_codes?: string[];
  trial_days?: number;
  per_location_pricing?: boolean;
  custom_pricing?: boolean;
  is_active?: boolean;
  is_popular?: boolean;
  display_order?: number;
}

export interface AdminCapability {
  code: string;
  name: string;
  description: string;
  decision_changing: boolean;
}

export interface ChoiceOption {
  value: string;
  label: string;
}

export interface AdminPlanListResponse {
  results: AdminPlan[];
  plan_types: ChoiceOption[];
  plan_categories: ChoiceOption[];
  limit_codes: string[];
}

export interface AdminAddOn {
  id: string;
  code: string;
  name: string;
  description: string;
  monthly_price: string;
  yearly_price: string;
  per_location: boolean;
  is_active: boolean;
  eligible_plan_types: string[];
}

export interface GatewayCredentialField {
  field: string;
  env_var: string;
  secret: boolean;
  configured: boolean;
  /** Where the effective value comes from; null when nothing is set. */
  source: 'DATABASE' | 'ENVIRONMENT' | null;
  /** Last four characters only — the API never returns the secret. */
  masked_value: string | null;
}

export interface PaymentGatewayConfig {
  /** null for a gateway that has no config row yet. */
  id: string | null;
  provider: string;
  provider_label: string;
  display_name: string;
  is_enabled: boolean;
  is_default: boolean;
  environment: 'TEST' | 'LIVE';
  credential_fields: GatewayCredentialField[];
  supported_currencies: string[];
  supported_methods: string[];
  notes: string;
  created_at: string | null;
  updated_at: string | null;
}

export interface PaymentGatewayWritePayload {
  is_enabled?: boolean;
  is_default?: boolean;
  environment?: 'TEST' | 'LIVE';
  /** Only the fields sent are touched; "" clears an override. */
  credentials?: Record<string, string>;
  supported_currencies?: string[];
  supported_methods?: string[];
  notes?: string;
}
