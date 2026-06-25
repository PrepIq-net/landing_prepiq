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
import {
  toggleConnectorActive,
  revokeConnectorTokens,
  retryReconciliation,
} from '@/lib/actions/connector-actions';

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
}

interface SyncCheckpoint {
  id: string;
  data_type: string;
  last_synced_id: string;
  last_synced_at: string | null;
  updated_at: string;
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
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  const currentUser = await prisma.user.findUnique({
    where: { email: session?.user?.email! },
  });
  if (!currentUser || currentUser.role !== 'ADMIN') return notFound();

  const email = session!.user!.email!;

  const [connectorRes, batchesRes, checkpointsRes, salesRes] = await Promise.allSettled([
    djangoAdminFetch<ConnectorDetail>(`/api/mgmt/connectors/${id}/`, email),
    djangoAdminFetch<Paginated<SyncBatch>>(`/api/mgmt/connectors/${id}/batches/`, email),
    djangoAdminFetch<SyncCheckpoint[]>(`/api/mgmt/connectors/${id}/checkpoints/`, email),
    djangoAdminFetch<Paginated<SyncedSale>>(
      `/api/mgmt/connectors/${id}/synced-sales/?is_reconciled=false`,
      email,
    ),
  ]);

  if (connectorRes.status === 'rejected') return notFound();

  const connector = connectorRes.value;
  const batches = batchesRes.status === 'fulfilled' ? batchesRes.value.results : [];
  const checkpoints = checkpointsRes.status === 'fulfilled' ? checkpointsRes.value : [];
  const unreconciledSales =
    salesRes.status === 'fulfilled' ? salesRes.value.results : [];

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <Link
              href="/admin/connectors"
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              ← Connectors
            </Link>
          </div>
          <h1 className="text-3xl font-display font-semibold tracking-tight text-foreground">
            {connector.display_name}
          </h1>
          <p className="text-sm text-muted-foreground">
            {connector.branch_name} · {connector.organization_name}
          </p>
        </div>
        <span
          className={`text-sm font-bold ${STATUS_COLOUR[connector.status] ?? 'text-muted-foreground'}`}
        >
          ● {connector.status}
        </span>
      </div>

      {/* Info grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Hostname', value: connector.hostname || '—' },
          { label: 'DB Type', value: connector.db_type || '—' },
          { label: 'Version', value: connector.connector_version || '—' },
          { label: 'Records today', value: connector.records_synced_today.toLocaleString() },
          {
            label: 'Last heartbeat',
            value: connector.last_heartbeat_at
              ? new Date(connector.last_heartbeat_at).toLocaleString()
              : '—',
          },
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
          {
            label: 'Active',
            value: connector.is_active ? 'YES' : 'NO',
          },
        ].map((item) => (
          <div
            key={item.label}
            className="bg-[#1C1C1F] border border-[#2A2A2E] rounded-xl px-5 py-4"
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

      {/* Actions */}
      <div className="bg-[#1C1C1F] border border-[#2A2A2E] rounded-xl px-6 py-5 space-y-4">
        <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          Control
        </div>
        <div className="flex flex-wrap gap-3">
          <form
            action={async () => {
              'use server';
              await toggleConnectorActive(id, !connector.is_active);
            }}
          >
            <Button
              type="submit"
              variant="outline"
              size="sm"
              className="border-[#2A2A2E] hover:bg-accent"
            >
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

          {connector.unreconciled_count > 0 && (
            <form
              action={async () => {
                'use server';
                await retryReconciliation(id);
              }}
            >
              <Button
                type="submit"
                variant="outline"
                size="sm"
                className="border-[#2A2A2E] hover:bg-accent"
              >
                Retry Reconciliation ({connector.unreconciled_count.toLocaleString()})
              </Button>
            </form>
          )}
        </div>
      </div>

      {/* Sync Checkpoints */}
      <section className="space-y-4">
        <h2 className="text-lg font-display font-semibold text-foreground">Sync Checkpoints</h2>
        <div className="bg-[#1C1C1F] border border-[#2A2A2E] rounded-xl overflow-hidden">
          <Table>
            <TableHeader className="bg-[#232327]">
              <TableRow className="hover:bg-transparent border-b border-[#2A2A2E]">
                {['Data Type', 'Last Synced ID', 'Last Synced At', 'Updated'].map((h) => (
                  <TableHead
                    key={h}
                    className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-6 py-3"
                  >
                    {h}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {checkpoints.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="px-6 py-6 text-center text-sm text-muted-foreground">
                    No checkpoints yet.
                  </TableCell>
                </TableRow>
              ) : (
                checkpoints.map((cp) => (
                  <TableRow
                    key={cp.id}
                    className="border-b border-[#2A2A2E] hover:bg-[#2A2A2E]/50"
                  >
                    <TableCell className="px-6 py-3 text-sm font-mono text-foreground">
                      {cp.data_type}
                    </TableCell>
                    <TableCell className="px-6 py-3 text-[11px] font-mono text-muted-foreground">
                      {cp.last_synced_id || '—'}
                    </TableCell>
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

      {/* Recent Sync Batches */}
      <section className="space-y-4">
        <h2 className="text-lg font-display font-semibold text-foreground">Recent Sync Batches</h2>
        <div className="bg-[#1C1C1F] border border-[#2A2A2E] rounded-xl overflow-hidden">
          <Table>
            <TableHeader className="bg-[#232327]">
              <TableRow className="hover:bg-transparent border-b border-[#2A2A2E]">
                {['Type', 'Status', 'Records', 'Accepted', 'Dupes', 'Latency', 'Received'].map(
                  (h) => (
                    <TableHead
                      key={h}
                      className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-6 py-3"
                    >
                      {h}
                    </TableHead>
                  ),
                )}
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
                  <TableRow
                    key={b.id}
                    className="border-b border-[#2A2A2E] hover:bg-[#2A2A2E]/50"
                  >
                    <TableCell className="px-6 py-3 text-[11px] font-mono text-muted-foreground">
                      {b.data_type}
                    </TableCell>
                    <TableCell className="px-6 py-3">
                      <span
                        className={`text-[11px] font-bold ${BATCH_STATUS_COLOUR[b.status] ?? 'text-muted-foreground'}`}
                      >
                        {b.status}
                      </span>
                    </TableCell>
                    <TableCell className="px-6 py-3 text-[11px] font-mono text-foreground">
                      {b.record_count}
                    </TableCell>
                    <TableCell className="px-6 py-3 text-[11px] font-mono text-green-400">
                      {b.accepted_count}
                    </TableCell>
                    <TableCell className="px-6 py-3 text-[11px] font-mono text-muted-foreground">
                      {b.duplicate_count}
                    </TableCell>
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

      {/* Unreconciled Sales */}
      {unreconciledSales.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-lg font-display font-semibold text-foreground">
            Unreconciled Sales{' '}
            <span className="text-red-400 text-sm font-mono">({unreconciledSales.length})</span>
          </h2>
          <div className="bg-[#1C1C1F] border border-[#2A2A2E] rounded-xl overflow-hidden">
            <Table>
              <TableHeader className="bg-[#232327]">
                <TableRow className="hover:bg-transparent border-b border-[#2A2A2E]">
                  {['Item', 'Qty', 'Amount', 'Sale Time', 'External ID'].map((h) => (
                    <TableHead
                      key={h}
                      className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-6 py-3"
                    >
                      {h}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {unreconciledSales.map((s) => (
                  <TableRow
                    key={s.id}
                    className="border-b border-[#2A2A2E] hover:bg-[#2A2A2E]/50"
                  >
                    <TableCell className="px-6 py-3 text-sm text-foreground max-w-[200px] truncate">
                      {s.item_name}
                    </TableCell>
                    <TableCell className="px-6 py-3 text-[11px] font-mono text-muted-foreground">
                      {s.quantity}
                    </TableCell>
                    <TableCell className="px-6 py-3 text-[11px] font-mono text-foreground">
                      {s.currency_code} {s.amount}
                    </TableCell>
                    <TableCell className="px-6 py-3 text-[11px] font-mono text-muted-foreground whitespace-nowrap">
                      {new Date(s.sale_timestamp).toLocaleString()}
                    </TableCell>
                    <TableCell className="px-6 py-3 text-[11px] font-mono text-muted-foreground truncate max-w-[120px]">
                      {s.external_sale_id}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>
      )}
    </div>
  );
}
