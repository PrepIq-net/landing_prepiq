'use server';

/**
 * Superadmin writes against the Django tenant-management API: organizations,
 * branches, user accounts, memberships, and support impersonation.
 *
 * Unlike the CMS actions, nothing here touches the landing database — these all
 * proxy to Django, which owns the audit trail. What this layer is responsible
 * for is the *authorization* half: `requireAdminEmail()` re-checks the caller's
 * ADMIN role on every mutation, because the service key alone would authorize
 * any signed-in landing user.
 */

import { revalidatePath } from 'next/cache';

import { auth } from '@/auth';
import { djangoAdminFetch } from '@/lib/django-api';
import { prisma } from '@/lib/prisma';
import type {
  AdminBranchBundle,
  AdminMembership,
  AdminOrganizationBundle,
  AdminSubscriptionSummary,
  AdminUserBundle,
  ImpersonationGrant,
  SuppressedEmail,
} from '@/types/admin-tenants';

async function requireAdminEmail(): Promise<string> {
  const session = await auth();
  const email = session?.user?.email;
  if (!email) throw new Error('Unauthorized');

  const user = await prisma.user.findUnique({
    where: { email },
    select: { role: true, isActive: true },
  });
  if (!user || user.role !== 'ADMIN' || !user.isActive) {
    throw new Error('Forbidden');
  }
  return email;
}

export interface ActionResult<T = undefined> {
  ok: boolean;
  error?: string;
  data?: T;
}

/**
 * Django returns either `{"detail": "..."}` for refusals or
 * `{"field": ["..."]}` for validation errors, wrapped by djangoAdminFetch into
 * an Error message. Both need to reach the form as readable text — a raw
 * "Django API 409 for /api/mgmt/..." string helps nobody.
 */
function toMessage(error: unknown): string {
  const raw = error instanceof Error ? error.message : String(error);
  const match = raw.match(/\{.*\}/s);
  if (match) {
    try {
      const body = JSON.parse(match[0]);
      if (typeof body.detail === 'string') return body.detail;
      if (typeof body.message === 'string') return body.message;
      const details = body.error?.details ?? body;
      const parts = Object.entries(details)
        .filter(([field]) => field !== 'organizations')
        .map(
          ([field, messages]) =>
            `${field}: ${Array.isArray(messages) ? messages.join(' ') : messages}`,
        );
      if (parts.length) return parts.join(' · ');
    } catch {
      /* fall through to the raw message */
    }
  }
  return raw;
}

async function mutate<T>(
  path: string,
  init: RequestInit,
  revalidate: string[],
): Promise<ActionResult<T>> {
  try {
    const email = await requireAdminEmail();
    const data = await djangoAdminFetch<T>(path, email, init);
    for (const route of revalidate) revalidatePath(route);
    return { ok: true, data };
  } catch (error) {
    return { ok: false, error: toMessage(error) };
  }
}

const ORG_ROUTES = ['/admin/organizations', '/admin'];
const BRANCH_ROUTES = ['/admin/branches', '/admin/organizations', '/admin'];
const USER_ROUTES = ['/admin/accounts', '/admin/organizations', '/admin'];

// ---------------------------------------------------------------------------
// Organizations
// ---------------------------------------------------------------------------

export async function updateOrganization(
  orgId: string,
  payload: Record<string, unknown>,
): Promise<ActionResult<AdminOrganizationBundle['organization']>> {
  return mutate(
    `/api/mgmt/organizations/${orgId}/`,
    { method: 'PATCH', body: JSON.stringify(payload) },
    [...ORG_ROUTES, `/admin/organizations/${orgId}`],
  );
}

export async function setOrganizationVerified(
  orgId: string,
  isVerified: boolean,
): Promise<ActionResult> {
  return mutate(
    `/api/mgmt/organizations/${orgId}/verify/`,
    { method: 'POST', body: JSON.stringify({ is_verified: isVerified }) },
    [...ORG_ROUTES, `/admin/organizations/${orgId}`],
  );
}

export async function suspendOrganization(
  orgId: string,
  reason: string,
): Promise<ActionResult> {
  return mutate(
    `/api/mgmt/organizations/${orgId}/suspend/`,
    { method: 'POST', body: JSON.stringify({ reason }) },
    [...ORG_ROUTES, `/admin/organizations/${orgId}`],
  );
}

export async function restoreOrganization(orgId: string): Promise<ActionResult> {
  return mutate(
    `/api/mgmt/organizations/${orgId}/restore/`,
    { method: 'POST', body: JSON.stringify({}) },
    [...ORG_ROUTES, `/admin/organizations/${orgId}`],
  );
}

export async function transferOrganizationOwnership(
  orgId: string,
  userId: string,
): Promise<ActionResult> {
  return mutate(
    `/api/mgmt/organizations/${orgId}/transfer-ownership/`,
    { method: 'POST', body: JSON.stringify({ user_id: userId }) },
    [...ORG_ROUTES, `/admin/organizations/${orgId}`],
  );
}

// ---------------------------------------------------------------------------
// Memberships
// ---------------------------------------------------------------------------

export async function addOrganizationMember(
  orgId: string,
  email: string,
  roleId: string | null,
): Promise<ActionResult<AdminMembership>> {
  return mutate(
    `/api/mgmt/organizations/${orgId}/members/`,
    { method: 'POST', body: JSON.stringify({ email, role_id: roleId }) },
    [...ORG_ROUTES, `/admin/organizations/${orgId}`],
  );
}

export async function changeMemberRole(
  orgId: string,
  userId: string,
  roleId: string | null,
): Promise<ActionResult<AdminMembership>> {
  return mutate(
    `/api/mgmt/organizations/${orgId}/members/${userId}/`,
    { method: 'PATCH', body: JSON.stringify({ role_id: roleId }) },
    [...ORG_ROUTES, `/admin/organizations/${orgId}`, `/admin/accounts/${userId}`],
  );
}

export async function removeOrganizationMember(
  orgId: string,
  userId: string,
): Promise<ActionResult> {
  return mutate(
    `/api/mgmt/organizations/${orgId}/members/${userId}/`,
    { method: 'DELETE' },
    [...ORG_ROUTES, `/admin/organizations/${orgId}`, `/admin/accounts/${userId}`],
  );
}

/**
 * Grants co-owner status alongside whatever role the member already holds —
 * ownership and role are independent axes. Calls the same
 * `organizations.services.promote_co_owner` the product's own Danger Zone
 * uses, so support and self-service can never drift on what "co-owner" means.
 */
export async function promoteCoOwner(
  orgId: string,
  userId: string,
): Promise<ActionResult<AdminMembership>> {
  return mutate(
    `/api/mgmt/organizations/${orgId}/members/${userId}/co-owner/`,
    { method: 'POST', body: JSON.stringify({}) },
    [...ORG_ROUTES, `/admin/organizations/${orgId}`, `/admin/accounts/${userId}`],
  );
}

/**
 * Revokes co-owner status. Refused by the backend for the Primary Owner —
 * that seat can only change hands via `transferOrganizationOwnership`.
 */
export async function demoteCoOwner(
  orgId: string,
  userId: string,
): Promise<ActionResult<AdminMembership>> {
  return mutate(
    `/api/mgmt/organizations/${orgId}/members/${userId}/co-owner/`,
    { method: 'DELETE' },
    [...ORG_ROUTES, `/admin/organizations/${orgId}`, `/admin/accounts/${userId}`],
  );
}

// ---------------------------------------------------------------------------
// Branches
// ---------------------------------------------------------------------------

export async function createBranch(
  orgId: string,
  payload: Record<string, unknown>,
): Promise<ActionResult<AdminBranchBundle['branch']>> {
  return mutate(
    `/api/mgmt/organizations/${orgId}/branches/`,
    { method: 'POST', body: JSON.stringify(payload) },
    [...BRANCH_ROUTES, `/admin/organizations/${orgId}`],
  );
}

export async function updateBranch(
  branchId: string,
  payload: Record<string, unknown>,
): Promise<ActionResult<AdminBranchBundle['branch']>> {
  return mutate(
    `/api/mgmt/organizations/branches/${branchId}/`,
    { method: 'PATCH', body: JSON.stringify(payload) },
    [...BRANCH_ROUTES, `/admin/branches/${branchId}`],
  );
}

export async function setBranchPrimary(branchId: string): Promise<ActionResult> {
  return mutate(
    `/api/mgmt/organizations/branches/${branchId}/set-primary/`,
    { method: 'POST', body: JSON.stringify({}) },
    [...BRANCH_ROUTES, `/admin/branches/${branchId}`],
  );
}

export async function setBranchActive(
  branchId: string,
  isActive: boolean,
): Promise<ActionResult> {
  return mutate(
    `/api/mgmt/organizations/branches/${branchId}/activation/`,
    { method: 'POST', body: JSON.stringify({ is_active: isActive }) },
    [...BRANCH_ROUTES, `/admin/branches/${branchId}`],
  );
}

export async function saveBranchOperatingHours(
  branchId: string,
  hours: Record<string, unknown>[],
): Promise<ActionResult> {
  return mutate(
    `/api/mgmt/organizations/branches/${branchId}/operating-hours/`,
    { method: 'PUT', body: JSON.stringify({ hours }) },
    [`/admin/branches/${branchId}`],
  );
}

export async function assignBranchPlan(
  branchId: string,
  payload: {
    plan_id: string;
    billing_cycle?: string;
    is_trial?: boolean;
    trial_days?: number;
    note?: string;
  },
): Promise<ActionResult<AdminSubscriptionSummary>> {
  return mutate(
    `/api/mgmt/organizations/branches/${branchId}/subscription/`,
    { method: 'POST', body: JSON.stringify({ action: 'assign', ...payload }) },
    [...BRANCH_ROUTES, `/admin/branches/${branchId}`, '/admin/subscriptions'],
  );
}

export async function extendBranchTrial(
  branchId: string,
  days: number,
): Promise<ActionResult<AdminSubscriptionSummary>> {
  return mutate(
    `/api/mgmt/organizations/branches/${branchId}/subscription/`,
    { method: 'POST', body: JSON.stringify({ action: 'extend_trial', days }) },
    [...BRANCH_ROUTES, `/admin/branches/${branchId}`],
  );
}

export async function assignBranchStaff(
  branchId: string,
  userId: string,
  roleId: string | null,
): Promise<ActionResult> {
  return mutate(
    `/api/mgmt/organizations/branches/${branchId}/staff/`,
    { method: 'POST', body: JSON.stringify({ user_id: userId, role_id: roleId }) },
    [`/admin/branches/${branchId}`, `/admin/accounts/${userId}`],
  );
}

export async function removeBranchStaff(
  branchId: string,
  userId: string,
): Promise<ActionResult> {
  return mutate(
    `/api/mgmt/organizations/branches/${branchId}/staff/`,
    { method: 'DELETE', body: JSON.stringify({ user_id: userId }) },
    [`/admin/branches/${branchId}`, `/admin/accounts/${userId}`],
  );
}

// ---------------------------------------------------------------------------
// User accounts
// ---------------------------------------------------------------------------

export async function updateUserAccount(
  userId: string,
  payload: Record<string, unknown>,
): Promise<ActionResult<AdminUserBundle['user']>> {
  return mutate(
    `/api/mgmt/users/${userId}/`,
    { method: 'PATCH', body: JSON.stringify(payload) },
    [...USER_ROUTES, `/admin/accounts/${userId}`],
  );
}

export async function verifyUserAccount(userId: string): Promise<ActionResult> {
  return mutate(
    `/api/mgmt/users/${userId}/verify/`,
    { method: 'POST', body: JSON.stringify({}) },
    [...USER_ROUTES, `/admin/accounts/${userId}`],
  );
}

export async function setUserSuspended(
  userId: string,
  isSuspended: boolean,
  reason: string,
): Promise<ActionResult> {
  return mutate(
    `/api/mgmt/users/${userId}/suspension/`,
    { method: 'POST', body: JSON.stringify({ is_suspended: isSuspended, reason }) },
    [...USER_ROUTES, `/admin/accounts/${userId}`],
  );
}

export async function sendUserPasswordReset(
  userId: string,
): Promise<ActionResult<{ detail: string }>> {
  return mutate(
    `/api/mgmt/users/${userId}/send-password-reset/`,
    { method: 'POST', body: JSON.stringify({}) },
    [`/admin/accounts/${userId}`],
  );
}

export async function revokeUserSessions(userId: string): Promise<ActionResult> {
  return mutate(
    `/api/mgmt/users/${userId}/revoke-sessions/`,
    { method: 'POST', body: JSON.stringify({}) },
    [`/admin/accounts/${userId}`],
  );
}

export async function revokeUserSession(
  userId: string,
  sid: string,
): Promise<ActionResult> {
  return mutate(
    `/api/mgmt/users/${userId}/revoke-sessions/`,
    { method: 'DELETE', body: JSON.stringify({ sid }) },
    [`/admin/accounts/${userId}`],
  );
}

export async function deleteUserAccount(
  userId: string,
  reason: string,
): Promise<ActionResult> {
  return mutate(
    `/api/mgmt/users/${userId}/deletion/`,
    { method: 'POST', body: JSON.stringify({ reason }) },
    [...USER_ROUTES, `/admin/accounts/${userId}`],
  );
}

export async function restoreUserAccount(userId: string): Promise<ActionResult> {
  return mutate(
    `/api/mgmt/users/${userId}/deletion/`,
    { method: 'DELETE' },
    [...USER_ROUTES, `/admin/accounts/${userId}`],
  );
}

// ---------------------------------------------------------------------------
// Impersonation
// ---------------------------------------------------------------------------

/**
 * Requests a single-use code and returns the dashboard URL that redeems it.
 *
 * The code — never a token — is what travels to the browser, and it is valid
 * for about a minute. The resulting session is read-only and expires in 30
 * minutes; see backend/management/impersonation.py.
 */
export async function startImpersonation(
  userId: string,
  reason: string,
): Promise<ActionResult<{ url: string; grant: ImpersonationGrant }>> {
  try {
    const email = await requireAdminEmail();
    const grant = await djangoAdminFetch<ImpersonationGrant>(
      `/api/mgmt/users/${userId}/impersonate/`,
      email,
      { method: 'POST', body: JSON.stringify({ reason }) },
    );

    const dashboardUrl = process.env.DASHBOARD_URL;
    if (!dashboardUrl) {
      return {
        ok: false,
        error: 'DASHBOARD_URL is not configured, so there is nowhere to send the session.',
      };
    }

    return {
      ok: true,
      data: {
        url: `${dashboardUrl.replace(/\/$/, '')}/impersonate?code=${encodeURIComponent(grant.code)}`,
        grant,
      },
    };
  } catch (error) {
    return { ok: false, error: toMessage(error) };
  }
}

// ---------------------------------------------------------------------------
// Provisioning
// ---------------------------------------------------------------------------

export async function createOrganization(
  payload: Record<string, unknown>,
): Promise<ActionResult<{ organization: { id: string; name: string }; owner: { email: string; account_created: boolean; invite_sent: boolean }; branch: { id: string; name: string } }>> {
  return mutate(
    '/api/mgmt/organizations/create/',
    { method: 'POST', body: JSON.stringify(payload) },
    ORG_ROUTES,
  );
}

export async function createUserAccount(
  payload: Record<string, unknown>,
): Promise<ActionResult<{ user: { id: string; email: string }; invite_sent: boolean }>> {
  return mutate(
    '/api/mgmt/users/create/',
    { method: 'POST', body: JSON.stringify(payload) },
    USER_ROUTES,
  );
}

export async function resendSetPasswordInvite(
  userId: string,
): Promise<ActionResult<{ detail: string }>> {
  return mutate(
    `/api/mgmt/users/${userId}/resend-invite/`,
    { method: 'POST', body: JSON.stringify({}) },
    [`/admin/accounts/${userId}`],
  );
}

export async function resendVerification(
  userId: string,
): Promise<ActionResult<{ detail: string }>> {
  return mutate(
    `/api/mgmt/users/${userId}/resend-verification/`,
    { method: 'POST', body: JSON.stringify({}) },
    [`/admin/accounts/${userId}`],
  );
}

// ---------------------------------------------------------------------------
// Offline payments
// ---------------------------------------------------------------------------

const PAYMENT_ROUTES = ['/admin/payments', '/admin'];

export async function approveManualPayment(
  requestId: string,
  note: string,
): Promise<ActionResult> {
  return mutate(
    `/api/mgmt/manual-payments/${requestId}/approve/`,
    { method: 'POST', body: JSON.stringify({ note }) },
    [...PAYMENT_ROUTES, '/admin/branches', '/admin/organizations'],
  );
}

export async function rejectManualPayment(
  requestId: string,
  note: string,
): Promise<ActionResult> {
  return mutate(
    `/api/mgmt/manual-payments/${requestId}/reject/`,
    { method: 'POST', body: JSON.stringify({ note }) },
    PAYMENT_ROUTES,
  );
}

export async function recordManualPayment(
  payload: Record<string, unknown>,
): Promise<ActionResult> {
  return mutate(
    '/api/mgmt/manual-payments/',
    { method: 'POST', body: JSON.stringify(payload) },
    PAYMENT_ROUTES,
  );
}

/**
 * Switch a payment route on or off for every customer at once.
 *
 * The backend refuses to leave both off, so a failed result here is a real
 * message worth showing rather than a generic error.
 */
export async function updatePaymentMethods(
  payload: Record<string, unknown>,
): Promise<ActionResult> {
  return mutate(
    '/api/mgmt/payment-methods/',
    { method: 'PATCH', body: JSON.stringify(payload) },
    PAYMENT_ROUTES,
  );
}

export async function savePaymentInstruction(
  instructionId: string | null,
  payload: Record<string, unknown>,
): Promise<ActionResult> {
  return mutate(
    instructionId
      ? `/api/mgmt/payment-instructions/${instructionId}/`
      : '/api/mgmt/payment-instructions/',
    {
      method: instructionId ? 'PATCH' : 'POST',
      body: JSON.stringify(payload),
    },
    PAYMENT_ROUTES,
  );
}

export async function deletePaymentInstruction(
  instructionId: string,
): Promise<ActionResult> {
  return mutate(
    `/api/mgmt/payment-instructions/${instructionId}/`,
    { method: 'DELETE' },
    PAYMENT_ROUTES,
  );
}

const SUPPRESSED_EMAIL_ROUTES = ['/admin/suppressed-emails', '/admin'];

export async function addSuppressedEmail(
  email: string,
  description: string,
): Promise<ActionResult<SuppressedEmail>> {
  return mutate(
    '/api/mgmt/suppressed-emails/',
    { method: 'POST', body: JSON.stringify({ email, description }) },
    SUPPRESSED_EMAIL_ROUTES,
  );
}

export async function removeSuppressedEmail(
  suppressedEmailId: string,
): Promise<ActionResult> {
  return mutate(
    `/api/mgmt/suppressed-emails/${suppressedEmailId}/`,
    { method: 'DELETE' },
    SUPPRESSED_EMAIL_ROUTES,
  );
}
