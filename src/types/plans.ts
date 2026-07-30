/**
 * Shapes returned by the backend's public pricing catalog,
 * `GET /api/v1/subscriptions/plans/` (Django: payment/public_serializers.py).
 *
 * Keep these in step with that serializer — it is the contract, and the
 * marketing site is the only consumer.
 */

/** Limit codes the backend may publish. A code absent from `limits` is unlimited. */
export const LIMIT_MAX_STAFF_PER_BRANCH = "MAX_STAFF_PER_BRANCH";
export const LIMIT_MAX_TOTAL_STAFF = "MAX_TOTAL_STAFF";
export const LIMIT_MAX_BRANCHES = "MAX_BRANCHES";

export interface PlanCapability {
  code: string;
  name: string;
  description: string;
  decision_changing: boolean;
}

export type PricingMode =
  | "PUBLISHED"
  | "HYBRID_BASE_PLUS_CUSTOM"
  | "CUSTOM_ONLY";

export interface PlanPricing {
  mode: PricingMode;
  details: {
    mode: PricingMode;
    published_base_price?: boolean;
    custom_quote_required_above_locations?: number;
  };
  /** Always "branch": every published price buys one kitchen branch. */
  unit: string;
}

export interface PublicPlan {
  id: string;
  name: string;
  plan_type: string;
  plan_category: string;
  tagline: string;
  description: string;
  /** Decimal strings, e.g. "49.00". */
  monthly_price: string;
  yearly_price: string;
  yearly_discount_percentage: number;
  features: string[];
  capabilities: PlanCapability[];
  capability_codes: string[];
  /** Explicit limits only — a missing code means unlimited. */
  limits: Record<string, number>;
  pricing: PlanPricing;
  trial_days: number;
  custom_pricing: boolean;
  per_location_pricing: boolean;
  is_popular: boolean;
  display_order: number;
}

export interface PublicAddOn {
  code: string;
  name: string;
  description: string;
  monthly_price: string;
  yearly_price: string;
  per_location: boolean;
  eligible_plan_types: string[];
}

export interface FeatureMatrixRow {
  code: string;
  name: string;
  description: string;
  decision_changing: boolean;
  /** Plan types that grant this capability. */
  plans: string[];
}

export interface PublicPlanCatalog {
  currency: string;
  /** "branch" — one plan governs one active kitchen branch. */
  billing_scope: string;
  billing_scope_label: string;
  plans: PublicPlan[];
  add_ons: PublicAddOn[];
  feature_matrix: {
    plan_types: string[];
    capabilities: FeatureMatrixRow[];
    limit_codes: string[];
  };
}
