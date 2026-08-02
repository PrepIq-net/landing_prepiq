/**
 * Shapes returned by the Django tenant-management API (`/api/mgmt/...`).
 * Mirrors backend/management/serializers/tenant_serializers.py — keep the two
 * in step when either changes.
 */

export interface ChoiceOption {
  value: string;
  label: string;
}

export interface Paginated<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface MiniUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  is_verified: boolean;
  is_deleted: boolean;
}

export interface AdminRole {
  id: string;
  name: string;
  slug: string;
  description: string;
  is_system: boolean;
  permission_count: number;
}

export interface AdminSubscriptionSummary {
  id: string;
  plan_name: string;
  plan_type: string;
  status: string;
  billing_cycle: string;
  is_trial: boolean;
  trial_ends_at: string | null;
  end_date: string | null;
  next_billing_date: string | null;
  price_at_subscription: string;
}

// -- Organizations ----------------------------------------------------------

export interface AdminOrganization {
  id: string;
  name: string;
  slug: string;
  industry_type: string | null;
  business_type: string | null;
  country: string | null;
  currency: string;
  timezone: string;
  phone: string | null;
  email: string | null;
  is_verified: boolean;
  is_active: boolean;
  deleted_at: string | null;
  purge_after: string | null;
  branch_count: number;
  active_branch_count: number;
  member_count: number;
  active_subscription_count: number;
  owner_email: string | null;
  created_at: string;
}

export interface AdminOrganizationDetail extends AdminOrganization {
  description: string | null;
  website: string | null;
  tagline: string | null;
  default_language: string;
  brand_color: string;
  receipt_name: string | null;
  capacity: number | null;
  default_prep_buffer_minutes: number;
  forecast_horizon_days: number;
  deletion_reason: string | null;
  updated_at: string;
}

export interface AdminMembership {
  id: string;
  user: MiniUser;
  role: AdminRole | null;
  is_active: boolean;
  joined_at: string;
  branch_assignments: {
    branch_id: string;
    branch_name: string;
    role_name: string | null;
    is_primary_branch: boolean;
    is_active: boolean;
  }[];
}

export interface AdminOrganizationBundle {
  organization: AdminOrganizationDetail;
  branches: AdminBranch[];
  members: AdminMembership[];
  roles: AdminRole[];
  recent_activity: AdminAuditEntry[];
}

// -- Branches ---------------------------------------------------------------

export interface BranchReadiness {
  /**
   * Index signature so the flags can be iterated generically. The backend owns
   * this set and may add to it; a new flag then renders as an extra dot rather
   * than a type error.
   */
  [flag: string]: boolean;
  has_operating_hours: boolean;
  has_staff: boolean;
  has_connector: boolean;
  has_subscription: boolean;
  has_expected_covers: boolean;
  has_coordinates: boolean;
}

export interface AdminBranch {
  id: string;
  name: string;
  code: string;
  organization_id: string;
  organization_name: string;
  address: string;
  phone: string;
  email: string;
  timezone: string;
  currency: string;
  is_primary: boolean;
  is_active: boolean;
  deleted_at: string | null;
  staff_count: number;
  subscription: AdminSubscriptionSummary | null;
  readiness: BranchReadiness;
  created_at: string;
}

export interface AdminOperatingHours {
  id?: string;
  day_of_week: string;
  opens_at: string | null;
  closes_at: string | null;
  is_closed: boolean;
}

export interface AdminBranchStaff {
  id: string;
  user: MiniUser;
  role: AdminRole | null;
  is_primary_branch: boolean;
  is_active: boolean;
  assigned_at: string;
}

export interface AdminBranchDetail extends AdminBranch {
  latitude: number | null;
  longitude: number | null;
  capacity: number | null;
  average_prep_time_minutes: number;
  service_start_time: string | null;
  service_end_time: string | null;
  expected_daily_covers: number | null;
  nearby_event_venues: unknown[];
  nearby_event_radius_km: number;
  seasonality_profile: string | null;
  local_demand_patterns: Record<string, unknown>;
  shows_live_sports: boolean;
  sports_profile: Record<string, unknown>;
  min_stock_buffer: number;
  waste_threshold: number;
  reorder_buffer: number;
  operating_hours: AdminOperatingHours[];
  branch_manager: MiniUser | null;
  staff: AdminBranchStaff[];
  updated_at: string;
}

export interface AdminBranchBundle {
  branch: AdminBranchDetail;
  subscription_history: (AdminSubscriptionSummary | null)[];
  connectors: {
    id: string;
    display_name: string;
    status: string;
    last_heartbeat_at: string | null;
    is_active: boolean;
  }[];
  recent_activity: AdminAuditEntry[];
}

// -- Users ------------------------------------------------------------------

export interface AdminUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  phone: string | null;
  is_verified: boolean;
  is_active: boolean;
  is_deleted: boolean;
  deleted_at: string | null;
  purge_after: string | null;
  is_suspended: boolean;
  google_linked: boolean;
  organization_count: number;
  organizations: {
    id: string;
    name: string;
    role: string | null;
    is_active: boolean;
  }[];
  last_login: string | null;
  created_at: string;
}

export interface AdminUserDetail extends AdminUser {
  job_title: string | null;
  phone_verified: boolean;
  preferred_language: string | null;
  deletion_reason: string | null;
  security: {
    is_suspended: boolean;
    suspension_reason: string;
    suspension_date: string | null;
    google_linked_at: string | null;
    has_usable_password: boolean;
  };
  branch_assignments: {
    id: string;
    branch_id: string;
    branch_name: string;
    organization_id: string;
    organization_name: string;
    role_name: string | null;
    is_primary_branch: boolean;
    is_active: boolean;
  }[];
  updated_at: string;
}

export interface AdminLoginSession {
  id: string;
  user_id: string;
  ip: string;
  device: string;
  platform: string;
  client: string;
  user_agent: string;
  created_at: number;
  last_seen: number;
}

export interface AdminUserBundle {
  user: AdminUserDetail;
  sessions: AdminLoginSession[];
  recent_activity: AdminAuditEntry[];
}

// -- Cross-cutting ----------------------------------------------------------

export interface AdminAuditEntry {
  id: string;
  actor_email: string;
  action: string;
  action_label: string;
  target_type: string;
  target_id: string;
  target_label: string;
  context_type: string;
  context_id: string;
  context_label: string;
  summary: string;
  changes: Record<string, unknown>;
  ip_address: string | null;
  created_at: string;
}

export interface TenantOverview {
  organizations: {
    total: number;
    active: number;
    suspended: number;
    verified: number;
    new_this_week: number;
  };
  branches: {
    total: number;
    active: number;
    subscribed: number;
    missing_hours: number;
  };
  users: {
    total: number;
    active: number;
    unverified: number;
    suspended: number;
    deleted: number;
    new_this_week: number;
  };
  trials_ending_soon: {
    branch_id: string;
    branch_name: string;
    organization_name: string;
    plan_name: string;
    trial_ends_at: string;
  }[];
}

export interface ImpersonationGrant {
  code: string;
  expires_in: number;
  token_ttl_seconds: number;
  user: { id: string; email: string; full_name: string };
}

// -- Offline payments -------------------------------------------------------

export interface PaymentInstruction {
  id: string;
  method: string;
  method_label: string;
  label: string;
  account_details: Record<string, string>;
  instructions: string;
  currency: string;
  is_active: boolean;
  display_order: number;
}

/** Which ways of paying checkout offers, platform-wide. */
export interface PaymentMethodSettings {
  online_enabled: boolean;
  offline_enabled: boolean;
  offline_review_hours: number;
  offline_note: string;
  updated_by_email: string;
  updated_at: string;
}

export interface ManualPaymentRequest {
  id: string;
  reference_code: string;
  organization: string;
  organization_name: string;
  branch: string;
  branch_name: string;
  plan: string;
  plan_name: string;
  billing_cycle: string;
  method: string;
  method_label: string;
  declared_amount: string;
  declared_currency: string;
  expected_amount: string;
  /** null when the customer paid in a different currency to the plan's. */
  amount_matches: boolean | null;
  payer_reference: string;
  payer_name: string;
  payer_phone: string;
  proof_url: string | null;
  customer_note: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  status_label: string;
  submitted_by_email: string | null;
  reviewed_by_email: string;
  reviewed_at: string | null;
  review_note: string;
  payment: string | null;
  subscription: string | null;
  invoice_number: string | null;
  created_at: string;
  updated_at: string;
}

export interface ManualPaymentQueue extends Paginated<ManualPaymentRequest> {
  pending_count: number;
  statuses: ChoiceOption[];
}

// -- Login troubleshooting --------------------------------------------------

export interface LoginCheck {
  key: string;
  label: string;
  ok: boolean;
  detail: string;
  remedy: { action: string; label: string } | null;
  blocking: boolean;
}

export interface LoginDiagnostics {
  user: { id: string; email: string; full_name: string };
  can_sign_in: boolean;
  checks: LoginCheck[];
  blockers: LoginCheck[];
  context: {
    has_usable_password: boolean;
    google_linked: boolean;
    pending_reset_code: boolean;
    last_login: string | null;
    active_sessions: number;
  };
}
