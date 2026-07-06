import { mgmtFetch } from "@/lib/management-client";
import { mgmtEndpoints } from "@/services/management/endpoints";
import {
  connectorListResponseSchema,
  connectorSchema,
  connectorUpdatePayloadSchema,
  revokeTokensResponseSchema,
  syncBatchListResponseSchema,
  syncCheckpointSchema,
  syncedSaleListResponseSchema,
  connectorReleaseListResponseSchema,
  connectorReleaseSchema,
  createReleasePayloadSchema,
  type ConnectorUpdatePayload,
  type CreateReleasePayload,
} from "@/services/management/types";
import { z } from "zod";

// ── Connectors ────────────────────────────────────────────────────────────────

export async function getConnectors(params?: {
  search?: string;
  status?: string;
  page?: number;
}) {
  const qs = new URLSearchParams();
  if (params?.search) qs.set("search", params.search);
  if (params?.status) qs.set("status", params.status);
  if (params?.page) qs.set("page", String(params.page));
  const query = qs.toString() ? `?${qs}` : "";
  const data = await mgmtFetch(
    `${mgmtEndpoints.connectors.list}${query}`,
  );
  return connectorListResponseSchema.parse(data);
}

export async function getConnector(id: string) {
  const data = await mgmtFetch(mgmtEndpoints.connectors.detail(id));
  return connectorSchema.parse(data);
}

export async function updateConnector(
  id: string,
  payload: ConnectorUpdatePayload,
) {
  const body = connectorUpdatePayloadSchema.parse(payload);
  const data = await mgmtFetch(mgmtEndpoints.connectors.detail(id), {
    method: "PATCH",
    body: JSON.stringify(body),
  });
  return connectorSchema.parse(data);
}

export async function revokeConnectorTokens(id: string) {
  const data = await mgmtFetch(mgmtEndpoints.connectors.revokeTokens(id), {
    method: "POST",
  });
  return revokeTokensResponseSchema.parse(data);
}

export async function retryConnectorReconciliation(id: string) {
  await mgmtFetch(mgmtEndpoints.connectors.retryReconciliation(id), {
    method: "POST",
  });
}

export async function getConnectorBatches(
  id: string,
  params?: { page?: number },
) {
  const qs = params?.page ? `?page=${params.page}` : "";
  const data = await mgmtFetch(
    `${mgmtEndpoints.connectors.batches(id)}${qs}`,
  );
  return syncBatchListResponseSchema.parse(data);
}

export async function getConnectorCheckpoints(id: string) {
  const data = await mgmtFetch(mgmtEndpoints.connectors.checkpoints(id));
  return z.array(syncCheckpointSchema).parse(data);
}

export async function getConnectorSyncedSales(
  id: string,
  params?: { is_reconciled?: boolean; page?: number },
) {
  const qs = new URLSearchParams();
  if (params?.is_reconciled !== undefined)
    qs.set("is_reconciled", String(params.is_reconciled));
  if (params?.page) qs.set("page", String(params.page));
  const query = qs.toString() ? `?${qs}` : "";
  const data = await mgmtFetch(
    `${mgmtEndpoints.connectors.syncedSales(id)}${query}`,
  );
  return syncedSaleListResponseSchema.parse(data);
}

// ── Releases ──────────────────────────────────────────────────────────────────

export async function getReleases(params?: { page?: number }) {
  const qs = params?.page ? `?page=${params.page}` : "";
  const data = await mgmtFetch(`${mgmtEndpoints.releases.list}${qs}`);
  return connectorReleaseListResponseSchema.parse(data);
}

export async function createRelease(payload: CreateReleasePayload) {
  const body = createReleasePayloadSchema.parse(payload);
  const data = await mgmtFetch(mgmtEndpoints.releases.create, {
    method: "POST",
    body: JSON.stringify(body),
  });
  return connectorReleaseSchema.parse(data);
}

export async function publishRelease(id: string) {
  const data = await mgmtFetch(mgmtEndpoints.releases.publish(id), {
    method: "POST",
  });
  return connectorReleaseSchema.parse(data);
}

export async function toggleReleaseMandatory(id: string) {
  const data = await mgmtFetch(mgmtEndpoints.releases.markMandatory(id), {
    method: "POST",
  });
  return (data as { is_mandatory: boolean }).is_mandatory;
}
