export const mgmtEndpoints = {
  connectors: {
    list: "/connectors/",
    detail: (id: string) => `/connectors/${id}/`,
    revokeTokens: (id: string) => `/connectors/${id}/revoke-tokens/`,
    batches: (id: string) => `/connectors/${id}/batches/`,
    checkpoints: (id: string) => `/connectors/${id}/checkpoints/`,
    syncedSales: (id: string) => `/connectors/${id}/synced-sales/`,
    retryReconciliation: (id: string) =>
      `/connectors/${id}/retry-reconciliation/`,
  },
  releases: {
    list: "/releases/",
    create: "/releases/",
    publish: (id: string) => `/releases/${id}/publish/`,
    markMandatory: (id: string) => `/releases/${id}/mark-mandatory/`,
  },
} as const;
