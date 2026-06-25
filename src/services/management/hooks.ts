"use client";

import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
} from "@tanstack/react-query";
import {
  getConnectors,
  getConnector,
  updateConnector,
  revokeConnectorTokens,
  retryConnectorReconciliation,
  getConnectorBatches,
  getConnectorCheckpoints,
  getConnectorSyncedSales,
  getReleases,
  createRelease,
  publishRelease,
  toggleReleaseMandatory,
} from "@/services/management/service";
import type {
  Connector,
  ConnectorListResponse,
  ConnectorUpdatePayload,
  CreateReleasePayload,
} from "@/services/management/types";

// ── Query keys ────────────────────────────────────────────────────────────────

export const mgmtQueryKeys = {
  root: ["mgmt"] as const,
  connectors: {
    all: () => [...mgmtQueryKeys.root, "connectors"] as const,
    list: (params?: object) =>
      [...mgmtQueryKeys.connectors.all(), "list", params] as const,
    detail: (id: string) =>
      [...mgmtQueryKeys.connectors.all(), "detail", id] as const,
    batches: (id: string) =>
      [...mgmtQueryKeys.connectors.all(), id, "batches"] as const,
    checkpoints: (id: string) =>
      [...mgmtQueryKeys.connectors.all(), id, "checkpoints"] as const,
    syncedSales: (id: string, params?: object) =>
      [...mgmtQueryKeys.connectors.all(), id, "synced-sales", params] as const,
  },
  releases: {
    all: () => [...mgmtQueryKeys.root, "releases"] as const,
    list: (params?: object) =>
      [...mgmtQueryKeys.releases.all(), "list", params] as const,
  },
};

// ── Connectors ────────────────────────────────────────────────────────────────

export function useConnectors(params?: {
  search?: string;
  status?: string;
  page?: number;
}) {
  return useQuery({
    queryKey: mgmtQueryKeys.connectors.list(params),
    queryFn: () => getConnectors(params),
  });
}

export function useConnector(id: string) {
  return useQuery({
    queryKey: mgmtQueryKeys.connectors.detail(id),
    queryFn: () => getConnector(id),
    enabled: Boolean(id),
  });
}

export function useConnectorBatches(id: string, params?: { page?: number }) {
  return useQuery({
    queryKey: mgmtQueryKeys.connectors.batches(id),
    queryFn: () => getConnectorBatches(id, params),
    enabled: Boolean(id),
  });
}

export function useConnectorCheckpoints(id: string) {
  return useQuery({
    queryKey: mgmtQueryKeys.connectors.checkpoints(id),
    queryFn: () => getConnectorCheckpoints(id),
    enabled: Boolean(id),
  });
}

export function useConnectorSyncedSales(
  id: string,
  params?: { is_reconciled?: boolean; page?: number },
) {
  return useQuery({
    queryKey: mgmtQueryKeys.connectors.syncedSales(id, params),
    queryFn: () => getConnectorSyncedSales(id, params),
    enabled: Boolean(id),
  });
}

export function useToggleConnector() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      updateConnector(id, { is_active: isActive }),
    onSuccess: (updated) => {
      qc.invalidateQueries({ queryKey: mgmtQueryKeys.connectors.all() });
      qc.setQueryData(mgmtQueryKeys.connectors.detail(updated.id), updated);
    },
  });
}

export function useRevokeConnectorTokens() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => revokeConnectorTokens(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: mgmtQueryKeys.connectors.detail(id) });
    },
  });
}

export function useRetryReconciliation() {
  return useMutation({
    mutationFn: (id: string) => retryConnectorReconciliation(id),
  });
}

// ── Releases ──────────────────────────────────────────────────────────────────

export function useReleases(params?: { page?: number }) {
  return useQuery({
    queryKey: mgmtQueryKeys.releases.list(params),
    queryFn: () => getReleases(params),
  });
}

export function useCreateRelease() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateReleasePayload) => createRelease(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: mgmtQueryKeys.releases.all() });
    },
  });
}

export function usePublishRelease() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => publishRelease(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: mgmtQueryKeys.releases.all() });
    },
  });
}

export function useToggleReleaseMandatory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => toggleReleaseMandatory(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: mgmtQueryKeys.releases.all() });
    },
  });
}
