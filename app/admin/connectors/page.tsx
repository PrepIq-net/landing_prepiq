import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { djangoAdminFetch } from '@/lib/django-api';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface ConnectorData {
  id: string;
  display_name: string;
  organization_name: string;
  branch_name: string;
  status: string;
  db_type: string;
  connector_version: string;
  hostname: string;
  last_heartbeat_at: string | null;
  records_synced_today: number;
  is_active: boolean;
  unreconciled_count: number;
}

interface PaginatedConnectors {
  count: number;
  results: ConnectorData[];
}

const STATUS_COLOUR: Record<string, string> = {
  ONLINE: 'text-green-400',
  OFFLINE: 'text-red-400',
  ERROR: 'text-amber-400',
  PENDING: 'text-blue-400',
  DISABLED: 'text-muted-foreground',
};

export default async function ConnectorsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; status?: string }>;
}) {
  const session = await auth();
  const currentUser = await prisma.user.findUnique({
    where: { email: session?.user?.email! },
  });
  if (!currentUser || currentUser.role !== 'ADMIN') return notFound();

  const sp = await searchParams;
  const params = new URLSearchParams();
  if (sp.search) params.set('search', sp.search);
  if (sp.status) params.set('status', sp.status);
  const qs = params.toString() ? `?${params}` : '';

  let data: PaginatedConnectors | null = null;
  let error: string | null = null;

  try {
    data = await djangoAdminFetch<PaginatedConnectors>(
      `/api/mgmt/connectors/${qs}`,
      session!.user!.email!,
    );
  } catch (e) {
    error = e instanceof Error ? e.message : 'Failed to fetch connectors';
  }

  const connectors = data?.results ?? [];

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="text-3xl font-display font-semibold tracking-tight text-foreground">
          PIQ Connectors
        </h1>
        <p className="text-muted-foreground text-sm">
          Active POS database sync agents.
          {data ? ` ${data.count} registered.` : ''}
        </p>
      </div>

      {error && (
        <div className="bg-destructive/10 border border-destructive/30 rounded-xl px-5 py-4 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="bg-[#1C1C1F] border border-[#2A2A2E] rounded-xl overflow-hidden shadow-l2">
        <Table>
          <TableHeader className="bg-[#232327]">
            <TableRow className="hover:bg-transparent border-b border-[#2A2A2E]">
              {[
                'Connector',
                'Branch / Org',
                'Status',
                'DB / Version',
                'Last Heartbeat',
                'Today',
                'Unreconciled',
                '',
              ].map((h) => (
                <TableHead
                  key={h}
                  className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-6 py-4"
                >
                  {h}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {connectors.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="px-6 py-10 text-center text-sm text-muted-foreground"
                >
                  {error ? 'Could not load connectors.' : 'No connectors registered yet.'}
                </TableCell>
              </TableRow>
            ) : (
              connectors.map((c) => (
                <TableRow
                  key={c.id}
                  className="hover:bg-[#2A2A2E]/50 border-b border-[#2A2A2E] transition-colors"
                >
                  <TableCell className="px-6 py-4">
                    <div className="text-sm font-medium text-foreground">{c.display_name}</div>
                    <div className="text-[11px] font-mono text-muted-foreground">
                      {c.hostname || '—'}
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <div className="text-sm text-foreground">{c.branch_name}</div>
                    <div className="text-[11px] text-muted-foreground">{c.organization_name}</div>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <span
                      className={`text-sm font-bold ${STATUS_COLOUR[c.status] ?? 'text-muted-foreground'}`}
                    >
                      ● {c.status}
                    </span>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-[11px] font-mono text-muted-foreground">
                    <div>{c.db_type || '—'}</div>
                    <div>{c.connector_version || '—'}</div>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-[11px] font-mono text-muted-foreground whitespace-nowrap">
                    {c.last_heartbeat_at
                      ? new Date(c.last_heartbeat_at).toLocaleString()
                      : '—'}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm font-mono text-foreground">
                    {c.records_synced_today.toLocaleString()}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {c.unreconciled_count === 0 ? (
                      <span className="text-[11px] font-mono text-green-400">0</span>
                    ) : (
                      <span className="text-[11px] font-bold font-mono text-red-400">
                        {c.unreconciled_count.toLocaleString()}
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-right">
                    <Link
                      href={`/admin/connectors/${c.id}`}
                      className="text-xs font-semibold text-primary hover:text-primary/80"
                    >
                      Manage →
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
