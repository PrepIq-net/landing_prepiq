'use server';

import { auth } from '@/auth';
import { djangoAdminFetch } from '@/lib/django-api';
import { revalidatePath } from 'next/cache';

async function requireAdminEmail(): Promise<string> {
  const session = await auth();
  if (!session?.user?.email) throw new Error('Unauthorized');
  return session.user.email;
}

export async function toggleConnectorActive(connectorId: string, isActive: boolean) {
  const email = await requireAdminEmail();
  await djangoAdminFetch(`/api/mgmt/connectors/${connectorId}/`, email, {
    method: 'PATCH',
    body: JSON.stringify({ is_active: isActive }),
  });
  revalidatePath(`/admin/connectors/${connectorId}`);
  revalidatePath('/admin/connectors');
}

export async function revokeConnectorTokens(connectorId: string) {
  const email = await requireAdminEmail();
  await djangoAdminFetch(`/api/mgmt/connectors/${connectorId}/revoke-tokens/`, email, {
    method: 'POST',
  });
  revalidatePath(`/admin/connectors/${connectorId}`);
}

export async function retryReconciliation(connectorId: string) {
  const email = await requireAdminEmail();
  await djangoAdminFetch(
    `/api/mgmt/connectors/${connectorId}/retry-reconciliation/`,
    email,
    { method: 'POST' },
  );
}

export async function publishRelease(releaseId: string) {
  const email = await requireAdminEmail();
  await djangoAdminFetch(`/api/mgmt/releases/${releaseId}/publish/`, email, {
    method: 'POST',
  });
  revalidatePath('/admin/connectors');
}

export async function toggleReleaseMandatory(releaseId: string) {
  const email = await requireAdminEmail();
  await djangoAdminFetch(`/api/mgmt/releases/${releaseId}/mark-mandatory/`, email, {
    method: 'POST',
  });
  revalidatePath('/admin/connectors');
}
