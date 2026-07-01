import { z } from "zod";

// ── Paginated wrapper ──────────────────────────────────────────────────────────

export function paginatedSchema<T extends z.ZodTypeAny>(itemSchema: T) {
  return z.object({
    count: z.number(),
    next: z.string().url().nullable(),
    previous: z.string().url().nullable(),
    results: z.array(itemSchema),
  });
}

// ── Connector ─────────────────────────────────────────────────────────────────

export const connectorSchema = z.object({
  id: z.string().uuid(),
  display_name: z.string(),
  name: z.string(),
  organization_name: z.string(),
  branch_name: z.string(),
  status: z.enum(["ONLINE", "OFFLINE", "ERROR", "PENDING", "DISABLED"]),
  db_type: z.string(),
  connector_version: z.string(),
  hostname: z.string(),
  last_heartbeat_at: z.string().datetime({ offset: true }).nullable(),
  last_sync_at: z.string().datetime({ offset: true }).nullable(),
  records_synced_today: z.number(),
  is_active: z.boolean(),
  unreconciled_count: z.number(),
  created_at: z.string().datetime({ offset: true }),
});

export const connectorListResponseSchema = paginatedSchema(connectorSchema);

export const connectorUpdatePayloadSchema = z.object({
  is_active: z.boolean(),
});

export const revokeTokensResponseSchema = z.object({
  revoked: z.number(),
});

// ── SyncBatch ─────────────────────────────────────────────────────────────────

export const syncBatchSchema = z.object({
  id: z.string().uuid(),
  data_type: z.string(),
  status: z.enum(["RECEIVED", "PROCESSING", "COMPLETED", "FAILED", "PARTIAL"]),
  record_count: z.number(),
  accepted_count: z.number(),
  rejected_count: z.number(),
  duplicate_count: z.number(),
  latency_ms: z.number().nullable(),
  connector_version: z.string(),
  received_at: z.string().datetime({ offset: true }),
  processed_at: z.string().datetime({ offset: true }).nullable(),
});

export const syncBatchListResponseSchema = paginatedSchema(syncBatchSchema);

// ── SyncCheckpoint ────────────────────────────────────────────────────────────

export const syncCheckpointSchema = z.object({
  id: z.string().uuid(),
  data_type: z.string(),
  last_synced_id: z.string(),
  last_synced_at: z.string().datetime({ offset: true }).nullable(),
  updated_at: z.string().datetime({ offset: true }),
});

// ── SyncedSale ────────────────────────────────────────────────────────────────

export const syncedSaleSchema = z.object({
  id: z.string().uuid(),
  external_sale_id: z.string(),
  sale_timestamp: z.string().datetime({ offset: true }),
  item_name: z.string(),
  quantity: z.string(),
  amount: z.string(),
  currency_code: z.string(),
  is_reconciled: z.boolean(),
  reconciled_sale_id: z.string().uuid().nullable(),
  created_at: z.string().datetime({ offset: true }),
});

export const syncedSaleListResponseSchema = paginatedSchema(syncedSaleSchema);

// ── ConnectorRelease ──────────────────────────────────────────────────────────

export const connectorReleaseSchema = z.object({
  id: z.string().uuid(),
  version: z.string(),
  release_notes: z.string(),
  download_url: z.string().url(),
  checksum_sha256: z.string(),
  is_mandatory: z.boolean(),
  min_supported_version: z.string(),
  is_published: z.boolean(),
  published_at: z.string().datetime({ offset: true }).nullable(),
  created_at: z.string().datetime({ offset: true }),
});

export const connectorReleaseListResponseSchema = paginatedSchema(
  connectorReleaseSchema,
);

export const createReleasePayloadSchema = z.object({
  version: z.string().min(1),
  release_notes: z.string().optional().default(""),
  download_url: z.string().url(),
  checksum_sha256: z.string().length(64),
  is_mandatory: z.boolean().optional().default(false),
  min_supported_version: z.string().optional().default(""),
});

// ── Inferred types ────────────────────────────────────────────────────────────

export type Connector = z.infer<typeof connectorSchema>;
export type ConnectorListResponse = z.infer<typeof connectorListResponseSchema>;
export type ConnectorUpdatePayload = z.infer<typeof connectorUpdatePayloadSchema>;

export type SyncBatch = z.infer<typeof syncBatchSchema>;
export type SyncBatchListResponse = z.infer<typeof syncBatchListResponseSchema>;

export type SyncCheckpoint = z.infer<typeof syncCheckpointSchema>;

export type SyncedSale = z.infer<typeof syncedSaleSchema>;
export type SyncedSaleListResponse = z.infer<typeof syncedSaleListResponseSchema>;

export type ConnectorRelease = z.infer<typeof connectorReleaseSchema>;
export type ConnectorReleaseListResponse = z.infer<typeof connectorReleaseListResponseSchema>;
export type CreateReleasePayload = z.infer<typeof createReleasePayloadSchema>;
