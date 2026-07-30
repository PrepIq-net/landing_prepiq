'use server';

/**
 * Superadmin writes against the Django management API for the commercial
 * catalog (plans, limits, capabilities, add-ons, payment gateways).
 *
 * Every mutation revalidates the `subscription-plans` cache tag as well as the
 * admin route, so an edit here lands on the public /pricing page immediately
 * rather than waiting out the 5-minute fetch window.
 */

import { revalidatePath } from 'next/cache';

import { auth } from '@/auth';
import { djangoAdminFetch } from '@/lib/django-api';
import { PLANS_CACHE_TAG } from '@/lib/plans';
// Next 16 changed revalidateTag's signature; this wrapper absorbs that.
import { revalidateTag } from '@/lib/revalidate';
import { prisma } from '@/lib/prisma';
import type {
  AdminPlan,
  AdminPlanWritePayload,
  PaymentGatewayConfig,
  PaymentGatewayWritePayload,
} from '@/types/admin-plans';

async function requireAdminEmail(): Promise<string> {
  const session = await auth();
  const email = session?.user?.email;
  if (!email) throw new Error('Unauthorized');

  // The Django key alone would authorize any signed-in user; the ADMIN check
  // is what actually gates pricing changes, so it belongs on every mutation.
  const user = await prisma.user.findUnique({
    where: { email },
    select: { role: true, isActive: true },
  });
  if (!user || user.role !== 'ADMIN' || !user.isActive) {
    throw new Error('Forbidden');
  }
  return email;
}

/** Public pricing + the admin views that read the same rows. */
function revalidatePricingSurfaces() {
  revalidateTag(PLANS_CACHE_TAG);
  revalidatePath('/admin/subscriptions');
  revalidatePath('/pricing');
  revalidatePath('/');
}

export interface ActionResult<T = undefined> {
  ok: boolean;
  error?: string;
  data?: T;
}

/** Turns a Django validation error into something the form can show. */
function toMessage(error: unknown): string {
  const raw = error instanceof Error ? error.message : String(error);
  const match = raw.match(/\{.*\}/s);
  if (match) {
    try {
      const body = JSON.parse(match[0]);
      if (typeof body.message === 'string') return body.message;
      const details = body.error?.details ?? body;
      const parts = Object.entries(details).map(
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

export async function updateSubscriptionPlan(
  planId: string,
  payload: AdminPlanWritePayload,
): Promise<ActionResult<AdminPlan>> {
  try {
    const email = await requireAdminEmail();
    const plan = await djangoAdminFetch<AdminPlan>(
      `/api/mgmt/subscription-plans/${planId}/`,
      email,
      { method: 'PATCH', body: JSON.stringify(payload) },
    );
    revalidatePricingSurfaces();
    return { ok: true, data: plan };
  } catch (error) {
    return { ok: false, error: toMessage(error) };
  }
}

export async function createSubscriptionPlan(
  payload: AdminPlanWritePayload,
): Promise<ActionResult<AdminPlan>> {
  try {
    const email = await requireAdminEmail();
    const plan = await djangoAdminFetch<AdminPlan>(
      '/api/mgmt/subscription-plans/',
      email,
      { method: 'POST', body: JSON.stringify(payload) },
    );
    revalidatePricingSurfaces();
    return { ok: true, data: plan };
  } catch (error) {
    return { ok: false, error: toMessage(error) };
  }
}

export async function toggleSubscriptionPlanActive(
  planId: string,
  isActive: boolean,
): Promise<ActionResult<AdminPlan>> {
  try {
    const email = await requireAdminEmail();
    const plan = await djangoAdminFetch<AdminPlan>(
      `/api/mgmt/subscription-plans/${planId}/toggle-active/`,
      email,
      { method: 'POST', body: JSON.stringify({ is_active: isActive }) },
    );
    revalidatePricingSurfaces();
    return { ok: true, data: plan };
  } catch (error) {
    return { ok: false, error: toMessage(error) };
  }
}

export async function deleteSubscriptionPlan(
  planId: string,
): Promise<ActionResult> {
  try {
    const email = await requireAdminEmail();
    await djangoAdminFetch(`/api/mgmt/subscription-plans/${planId}/`, email, {
      method: 'DELETE',
    });
    revalidatePricingSurfaces();
    return { ok: true };
  } catch (error) {
    return { ok: false, error: toMessage(error) };
  }
}

export async function savePaymentGateway(
  provider: string,
  payload: PaymentGatewayWritePayload,
): Promise<ActionResult<PaymentGatewayConfig>> {
  try {
    const email = await requireAdminEmail();
    const gateway = await djangoAdminFetch<PaymentGatewayConfig>(
      `/api/mgmt/payment-gateways/${provider}/`,
      email,
      { method: 'PUT', body: JSON.stringify(payload) },
    );
    revalidatePath('/admin/payment-gateways');
    return { ok: true, data: gateway };
  } catch (error) {
    return { ok: false, error: toMessage(error) };
  }
}
