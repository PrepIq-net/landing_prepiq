import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { djangoAdminFetch } from '@/lib/django-api';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { redirect } from 'next/navigation';
import {
  toggleConnectorActive,
  revokeConnectorTokens,
  retryReconciliation,
  deleteConnector,
  markSalesReconciled,
} from '@/lib/actions/connector-actions';
import { ConnectorTabs } from './ConnectorTabs';
import { LogsTab } from './LogsTab';
import { SchemaTab } from './SchemaTab';
import type { DiscoveredTable, FieldMapping } from './SchemaTab';

interface ConnectorDetail {
  id: string;
  display_name: string;
  name: string;
  organization_name: string;
  branch_name: string;
  status: string;
  db_type: string;
  connector_version: string;
  hostname: string;
  last_heartbeat_at: string | null;
  last_sync_at: string | null;
  records_synced_today: number;
  is_active: boolean;
  unreconciled_count: number;
  created_at: string;
}

interface SyncBatch {
  id: string;
  data_type: string;
  status: string;
  record_count: number;
  accepted_count: number;
  rejected_count: number;
  duplicate_count: number;
  latency_ms: number | null;
  connector_version: string;
  received_at: string;
  error_summary?: unknown[];
}

interface SyncCheckpoint {
  id: string;
  data_type: string;
  last_synced_id: string;
  last_synced_at: string | null;
  updated_at: string;
}

interface AccessToken {
  id: string;
  token_type: string;
  expires_at: string;
  is_revoked: boolean;
  revoked_at: string | null;
  is_expired: boolean;
  created_at: string;
}

interface SyncedSale {
  id: string;
  external_sale_id: string;
  sale_timestamp: string;
  item_name: string;
  quantity: string;
  amount: string;
  currency_code: string;
  is_reconciled: boolean;
}

interface Paginated<T> {
  count: number;
  results: T[];
}

interface ConnectorLog {
  id: string;
  level: 'debug' | 'info' | 'warn' | 'error';
  message: string;
  fields: Record<string, string>;
  logged_at: string;
  received_at: string;
}

const STATUS_COLOUR: Record<string, string> = {
  ONLINE: 'text-green-400',
  OFFLINE: 'text-red-400',
  ERROR: 'text-amber-400',
  PENDING: 'text-blue-400',
  DISABLED: 'text-muted-foreground',
};

const BATCH_STATUS_COLOUR: Record<string, string> = {
  COMPLETED: 'text-green-400',
  FAILED: 'text-red-400',
  PARTIAL: 'text-amber-400',
  PROCESSING: 'text-blue-400',
  RECEIVED: 'text-muted-foreground',
};

export default async function ConnectorDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const { id } = await params;
  const { tab = 'summary' } = await searchParams;

  const session = await auth();
  const currentUser = await prisma.user.findUnique({
    where: { email: session?.user?.email! },
  });
  if (!currentUser || currentUser.role !== 'ADMIN') return notFound();

  const email = session!.user!.email!;

  const connectorRes = await djangoAdminFetch<ConnectorDetail>(
    `/api/mgmt/connectors/${id}/`,
    email,
  ).catch(() => null);

  if (!connectorRes) return notFound();
  const connector = connectorRes;

  // Fetch tab-specific data
  let batches: SyncBatch[] = [];
  let checkpoints: SyncCheckpoint[] = [];
  let tokens: AccessToken[] = [];
  let tables: DiscoveredTable[] = [];
  let fieldMappings: FieldMapping[] = [];
  let unreconciledSales: SyncedSale[] = [];
  let unreconciledCount = 0;
  let initialLogs: ConnectorLog[] = [];
  let initialLogsCount = 0;
  let schemaCheckpoints: SyncCheckpoint[] = [];

  if (tab === 'summary') {
    const [batchesRes, checkpointsRes] = await Promise.allSettled([
      djangoAdminFetch<Paginated<SyncBatch>>(`/api/mgmt/connectors/${id}/batches/?page_size=10`, email),
      djangoAdminFetch<SyncCheckpoint[]>(`/api/mgmt/connectors/${id}/checkpoints/`, email),
    ]);
    batches = batchesRes.status === 'fulfilled' ? batchesRes.value.results : [];
    checkpoints = checkpointsRes.status === 'fulfilled' ? checkpointsRes.value : [];
  } else if (tab === 'tokens') {
    const res = await djangoAdminFetch<Paginated<AccessToken>>(
      `/api/mgmt/connectors/${id}/tokens/`,
      email,
    ).catch(() => ({ count: 0, results: [] }));
    tokens = res.results;
  } else if (tab === 'schema') {
    const [tablesRes, mappingsRes, checkpointsRes] = await Promise.allSettled([
      djangoAdminFetch<DiscoveredTable[]>(`/api/mgmt/connectors/${id}/schema/`, email),
      djangoAdminFetch<FieldMapping[]>(`/api/mgmt/connectors/${id}/field-mappings/`, email),
      djangoAdminFetch<SyncCheckpoint[]>(`/api/mgmt/connectors/${id}/checkpoints/`, email),
    ]);
    tables = tablesRes.status === 'fulfilled' ? tablesRes.value : [];
    fieldMappings = mappingsRes.status === 'fulfilled' ? mappingsRes.value : [];
    schemaCheckpoints = checkpointsRes.status === 'fulfilled' ? checkpointsRes.value : [];
  } else if (tab === 'sales') {
    const res = await djangoAdminFetch<Paginated<SyncedSale>>(
      `/api/mgmt/connectors/${id}/synced-sales/?is_reconciled=false`,
      email,
    ).catch(() => ({ count: 0, results: [] }));
    unreconciledSales = res.results;
    unreconciledCount = res.count;
  } else if (tab === 'logs') {
    const res = await djangoAdminFetch<Paginated<ConnectorLog>>(
      `/api/mgmt/connectors/${id}/remote-logs/?page_size=50`,
      email,
    ).catch(() => ({ count: 0, results: [] }));
    initialLogs = res.results;
    initialLogsCount = res.count;
  }

  const heartbeatMs = connector.last_heartbeat_at
    ? Date.now() - new Date(connector.last_heartbeat_at).getTime()
    : null;
  const heartbeatAge = heartbeatMs != null
    ? heartbeatMs < 60_000 ? 'just now'
      : heartbeatMs < 3_600_000 ? `${Math.round(heartbeatMs / 60_000)}m ago`
      : heartbeatMs < 86_400_000 ? `${Math.round(heartbeatMs / 3_600_000)}h ago`
      : `${Math.round(heartbeatMs / 86_400_000)}d ago`
    : '—';

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <Link href="/admin/connectors" className="text-xs text-muted-foreground hover:text-foreground">
            ← Machines
          </Link>
          <h1 className="text-3xl font-display font-semibold tracking-tight text-foreground">
            {connector.display_name}
          </h1>
          <p className="text-sm text-muted-foreground">
            {connector.branch_name} · {connector.organization_name}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className={`text-sm font-bold ${STATUS_COLOUR[connector.status] ?? 'text-muted-foreground'}`}>
              ● {connector.status}
            </div>
            <div className="text-[11px] text-muted-foreground mt-0.5">
              heartbeat {heartbeatAge}
            </div>
          </div>
        </div>
      </div>

      {/* Machine Info Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Hostname', value: connector.hostname || '—' },
          { label: 'DB Type', value: connector.db_type || '—' },
          { label: 'Version', value: connector.connector_version || '—' },
          { label: 'Records today', value: connector.records_synced_today.toLocaleString() },
          {
            label: 'Last sync',
            value: connector.last_sync_at
              ? new Date(connector.last_sync_at).toLocaleString()
              : '—',
          },
          {
            label: 'Unreconciled',
            value: connector.unreconciled_count,
            highlight: connector.unreconciled_count > 0,
          },
          { label: 'Active', value: connector.is_active ? 'YES' : 'NO' },
          {
            label: 'Registered',
            value: new Date(connector.created_at).toLocaleDateString(),
          },
        ].map((item) => (
          <div
            key={item.label}
            className="bg-[#1C1C1F] border border-[#2A2A2E] rounded-xl px-4 py-3"
          >
            <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">
              {item.label}
            </div>
            <div
              className={`text-sm font-mono font-medium ${
                'highlight' in item && item.highlight ? 'text-red-400' : 'text-foreground'
              }`}
            >
              {String(item.value)}
            </div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="bg-[#1C1C1F] border border-[#2A2A2E] rounded-xl px-6 py-4">
        <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">
          Control
        </div>
        <div className="flex flex-wrap gap-3">
          <form
            action={async () => {
              'use server';
              await toggleConnectorActive(id, !connector.is_active);
            }}
          >
            <Button type="submit" variant="outline" size="sm" className="border-[#2A2A2E] hover:bg-accent">
              {connector.is_active ? 'Disable Connector' : 'Enable Connector'}
            </Button>
          </form>

          <form
            action={async () => {
              'use server';
              await revokeConnectorTokens(id);
            }}
          >
            <Button
              type="submit"
              variant="outline"
              size="sm"
              className="border-[#2A2A2E] hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30"
            >
              Revoke All Tokens
            </Button>
          </form>

          <form
            action={async () => {
              'use server';
              await deleteConnector(id);
              redirect('/admin/connectors');
            }}
          >
            <Button
              type="submit"
              variant="outline"
              size="sm"
              className="border-red-900/50 text-red-400 hover:bg-red-950/30 hover:border-red-700/50"
            >
              Delete Machine
            </Button>
          </form>

          {connector.unreconciled_count > 0 && (
            <form
              action={async () => {
                'use server';
                await retryReconciliation(id);
              }}
            >
              <Button type="submit" variant="outline" size="sm" className="border-[#2A2A2E] hover:bg-accent">
                Retry Reconciliation ({connector.unreconciled_count.toLocaleString()})
              </Button>
            </form>
          )}
        </div>
      </div>

      {/* Tabs */}
      <ConnectorTabs active={tab} />

      {/* Tab: Summary */}
      {tab === 'summary' && (
        <div className="space-y-8">
          <section className="space-y-3">
            <h2 className="text-base font-display font-semibold text-foreground">Sync Checkpoints</h2>
            <div className="bg-[#1C1C1F] border border-[#2A2A2E] rounded-xl overflow-hidden">
              <Table>
                <TableHeader className="bg-[#232327]">
                  <TableRow className="hover:bg-transparent border-b border-[#2A2A2E]">
                    {['Data Type', 'Last Synced ID', 'Last Synced At', 'Updated'].map((h) => (
                      <TableHead key={h} className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-6 py-3">
                        {h}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {checkpoints.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="px-6 py-6 text-center text-sm text-muted-foreground">
                        No checkpoints yet — connector hasn't synced.
                      </TableCell>
                    </TableRow>
                  ) : (
                    checkpoints.map((cp) => (
                      <TableRow key={cp.id} className="border-b border-[#2A2A2E] hover:bg-[#2A2A2E]/50">
                        <TableCell className="px-6 py-3 text-sm font-mono text-foreground">{cp.data_type}</TableCell>
                        <TableCell className="px-6 py-3 text-[11px] font-mono text-muted-foreground">{cp.last_synced_id || '—'}</TableCell>
                        <TableCell className="px-6 py-3 text-[11px] font-mono text-muted-foreground whitespace-nowrap">
                          {cp.last_synced_at ? new Date(cp.last_synced_at).toLocaleString() : '—'}
                        </TableCell>
                        <TableCell className="px-6 py-3 text-[11px] font-mono text-muted-foreground whitespace-nowrap">
                          {new Date(cp.updated_at).toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-display font-semibold text-foreground">Recent Sync Batches</h2>
            <div className="bg-[#1C1C1F] border border-[#2A2A2E] rounded-xl overflow-hidden">
              <Table>
                <TableHeader className="bg-[#232327]">
                  <TableRow className="hover:bg-transparent border-b border-[#2A2A2E]">
                    {['Type', 'Status', 'Records', 'Accepted', 'Dupes', 'Latency', 'Received'].map((h) => (
                      <TableHead key={h} className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-6 py-3">
                        {h}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {batches.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="px-6 py-6 text-center text-sm text-muted-foreground">
                        No sync batches yet.
                      </TableCell>
                    </TableRow>
                  ) : (
                    batches.map((b) => (
                      <TableRow key={b.id} className="border-b border-[#2A2A2E] hover:bg-[#2A2A2E]/50">
                        <TableCell className="px-6 py-3 text-[11px] font-mono text-muted-foreground">{b.data_type}</TableCell>
                        <TableCell className="px-6 py-3">
                          <span className={`text-[11px] font-bold ${BATCH_STATUS_COLOUR[b.status] ?? 'text-muted-foreground'}`}>
                            {b.status}
                          </span>
                        </TableCell>
                        <TableCell className="px-6 py-3 text-[11px] font-mono text-foreground">{b.record_count}</TableCell>
                        <TableCell className="px-6 py-3 text-[11px] font-mono text-green-400">{b.accepted_count}</TableCell>
                        <TableCell className="px-6 py-3 text-[11px] font-mono text-muted-foreground">{b.duplicate_count}</TableCell>
                        <TableCell className="px-6 py-3 text-[11px] font-mono text-muted-foreground">
                          {b.latency_ms != null ? `${b.latency_ms}ms` : '—'}
                        </TableCell>
                        <TableCell className="px-6 py-3 text-[11px] font-mono text-muted-foreground whitespace-nowrap">
                          {new Date(b.received_at).toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </section>
        </div>
      )}

      {/* Tab: Tokens */}
      {tab === 'tokens' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-display font-semibold text-foreground">Access Tokens</h2>
            <p className="text-[11px] text-muted-foreground">
              Token values are hashed — only metadata shown. Use "Revoke All" above to invalidate.
            </p>
          </div>
          <div className="bg-[#1C1C1F] border border-[#2A2A2E] rounded-xl overflow-hidden">
            <Table>
              <TableHeader className="bg-[#232327]">
                <TableRow className="hover:bg-transparent border-b border-[#2A2A2E]">
                  {['Type', 'State', 'Expires', 'Revoked At', 'Created'].map((h) => (
                    <TableHead key={h} className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-6 py-3">
                      {h}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {tokens.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="px-6 py-6 text-center text-sm text-muted-foreground">
                      No tokens yet — connector hasn't registered.
                    </TableCell>
                  </TableRow>
                ) : (
                  tokens.map((t) => {
                    const state = t.is_revoked ? { label: 'REVOKED', cls: 'text-red-400' }
                      : t.is_expired ? { label: 'EXPIRED', cls: 'text-muted-foreground' }
                      : { label: 'ACTIVE', cls: 'text-green-400 font-bold' };
                    return (
                      <TableRow key={t.id} className="border-b border-[#2A2A2E] hover:bg-[#2A2A2E]/50">
                        <TableCell className="px-6 py-3 text-[11px] font-mono text-muted-foreground">{t.token_type}</TableCell>
                        <TableCell className="px-6 py-3">
                          <span className={`text-[11px] ${state.cls}`}>{state.label}</span>
                        </TableCell>
                        <TableCell className="px-6 py-3 text-[11px] font-mono text-muted-foreground whitespace-nowrap">
                          {new Date(t.expires_at).toLocaleString()}
                        </TableCell>
                        <TableCell className="px-6 py-3 text-[11px] font-mono text-muted-foreground whitespace-nowrap">
                          {t.revoked_at ? new Date(t.revoked_at).toLocaleString() : '—'}
                        </TableCell>
                        <TableCell className="px-6 py-3 text-[11px] font-mono text-muted-foreground whitespace-nowrap">
                          {new Date(t.created_at).toLocaleString()}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* Tab: Schema */}
      {tab === 'schema' && (
        <SchemaTab
          connectorId={id}
          tables={tables}
          fieldMappings={fieldMappings}
          checkpoints={schemaCheckpoints}
        />
      )}

      {/* Tab: Logs */}
      {tab === 'logs' && (
        <LogsTab
          connectorId={id}
          initialLogs={initialLogs}
          initialCount={initialLogsCount}
        />
      )}

      {/* Tab: Unreconciled Sales */}
      {tab === 'sales' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-display font-semibold text-foreground">
              Unreconciled Sales
              {unreconciledCount > 0 && (
                <span className="ml-2 text-red-400 text-sm font-mono">({unreconciledCount})</span>
              )}
            </h2>
            {connector.unreconciled_count > 0 && (
              <div className="flex gap-2">
                <form
                  action={async () => {
                    'use server';
                    await retryReconciliation(id);
                  }}
                >
                  <Button type="submit" variant="outline" size="sm" className="border-[#2A2A2E] hover:bg-accent text-xs">
                    Retry Reconciliation
                  </Button>
                </form>
                <form
                  action={async () => {
                    'use server';
                    await markSalesReconciled(id);
                  }}
                >
                  <Button type="submit" variant="outline" size="sm" className="border-[#2A2A2E] hover:bg-accent text-xs">
                    Force Mark All Reconciled
                  </Button>
                </form>
              </div>
            )}
          </div>
          <div className="bg-[#1C1C1F] border border-[#2A2A2E] rounded-xl overflow-hidden">
            <Table>
              <TableHeader className="bg-[#232327]">
                <TableRow className="hover:bg-transparent border-b border-[#2A2A2E]">
                  {['Item', 'Qty', 'Amount', 'Sale Time', 'External ID'].map((h) => (
                    <TableHead key={h} className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-6 py-3">
                      {h}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {unreconciledSales.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="px-6 py-6 text-center text-sm text-muted-foreground">
                      No unreconciled sales — everything is clean.
                    </TableCell>
                  </TableRow>
                ) : (
                  unreconciledSales.map((s) => (
                    <TableRow key={s.id} className="border-b border-[#2A2A2E] hover:bg-[#2A2A2E]/50">
                      <TableCell className="px-6 py-3 text-sm text-foreground max-w-[200px] truncate">{s.item_name}</TableCell>
                      <TableCell className="px-6 py-3 text-[11px] font-mono text-muted-foreground">{s.quantity}</TableCell>
                      <TableCell className="px-6 py-3 text-[11px] font-mono text-foreground">{s.currency_code} {s.amount}</TableCell>
                      <TableCell className="px-6 py-3 text-[11px] font-mono text-muted-foreground whitespace-nowrap">
                        {new Date(s.sale_timestamp).toLocaleString()}
                      </TableCell>
                      <TableCell className="px-6 py-3 text-[11px] font-mono text-muted-foreground truncate max-w-[120px]">
                        {s.external_sale_id}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
}
