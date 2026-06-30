'use server';

import { auth } from '@/auth';
import { djangoAdminFetch } from '@/lib/django-api';
import { revalidatePath } from 'next/cache';
import { createHash } from 'crypto';

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

export async function requestSchemaRefresh(connectorId: string) {
  const email = await requireAdminEmail();
  await djangoAdminFetch(`/api/mgmt/connectors/${connectorId}/request-schema/`, email, {
    method: 'POST',
  });
  revalidatePath(`/admin/connectors/${connectorId}`);
}

export async function requestSyncNow(connectorId: string) {
  const email = await requireAdminEmail();
  await djangoAdminFetch(`/api/mgmt/connectors/${connectorId}/request-sync/`, email, {
    method: 'POST',
  });
  revalidatePath(`/admin/connectors/${connectorId}`);
}

export async function confirmTable(connectorId: string, tableId: string, entity: string) {
  const email = await requireAdminEmail();
  await djangoAdminFetch(
    `/api/mgmt/connectors/${connectorId}/schema/${tableId}/confirm/`,
    email,
    { method: 'POST', body: JSON.stringify({ confirmed_entity: entity }) },
  );
  revalidatePath(`/admin/connectors/${connectorId}`);
}

export async function confirmMapping(connectorId: string, mappingId: string) {
  const email = await requireAdminEmail();
  await djangoAdminFetch(
    `/api/mgmt/connectors/${connectorId}/field-mappings/${mappingId}/confirm/`,
    email,
    { method: 'POST' },
  );
  revalidatePath(`/admin/connectors/${connectorId}`);
}

export async function confirmAllMappings(connectorId: string, tableId?: string) {
  const email = await requireAdminEmail();
  const body = tableId ? JSON.stringify({ table_id: tableId }) : undefined;
  await djangoAdminFetch(
    `/api/mgmt/connectors/${connectorId}/field-mappings/bulk-confirm/`,
    email,
    { method: 'POST', body },
  );
  revalidatePath(`/admin/connectors/${connectorId}`);
}

export async function retryReconciliation(connectorId: string) {
  const email = await requireAdminEmail();
  await djangoAdminFetch(
    `/api/mgmt/connectors/${connectorId}/retry-reconciliation/`,
    email,
    { method: 'POST' },
  );
  revalidatePath(`/admin/connectors/${connectorId}`);
}

export async function publishRelease(releaseId: string) {
  const email = await requireAdminEmail();
  await djangoAdminFetch(`/api/mgmt/releases/${releaseId}/publish/`, email, {
    method: 'POST',
  });
  revalidatePath('/admin/releases');
}

export async function toggleReleaseMandatory(releaseId: string) {
  const email = await requireAdminEmail();
  await djangoAdminFetch(`/api/mgmt/releases/${releaseId}/mark-mandatory/`, email, {
    method: 'POST',
  });
  revalidatePath('/admin/releases');
}

export async function createRelease(formData: FormData) {
  const email = await requireAdminEmail();
  const payload = {
    version: formData.get('version'),
    download_url: formData.get('download_url'),
    checksum_sha256: formData.get('checksum_sha256'),
    release_notes: formData.get('release_notes') || '',
    min_supported_version: formData.get('min_supported_version') || '',
  };
  await djangoAdminFetch('/api/mgmt/releases/', email, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  revalidatePath('/admin/releases');
}

export async function computeChecksumFromUrl(downloadUrl: string): Promise<string> {
  await requireAdminEmail();
  if (!downloadUrl) throw new Error('Download URL is required');
  const res = await fetch(downloadUrl);
  if (!res.ok || !res.body) {
    throw new Error(`Could not fetch download URL (${res.status})`);
  }
  const hash = createHash('sha256');
  const reader = res.body.getReader();
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    hash.update(value);
  }
  return hash.digest('hex');
}

export async function createInstallationToken(branchId: string): Promise<string> {
  const email = await requireAdminEmail();
  const data = await djangoAdminFetch<{ raw_token: string }>(
    '/api/mgmt/installation-tokens/',
    email,
    { method: 'POST', body: JSON.stringify({ branch_id: branchId }) },
  );
  revalidatePath('/admin/installation-tokens');
  return data.raw_token;
}
