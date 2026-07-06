'use client';

import { useEffect, useMemo, useRef, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  confirmTable,
  confirmMapping,
  confirmAllMappings,
  requestSchemaRefresh,
  requestSyncNow,
} from '@/lib/actions/connector-actions';

export interface DiscoveredColumn {
  id: string;
  column_name: string;
  data_type: string;
  is_nullable: boolean;
  is_primary_key: boolean;
  ai_field_guess: string;
  ai_confidence: number | null;
}

export interface DiscoveredTable {
  id: string;
  schema_name: string;
  table_name: string;
  row_count_estimate: number | null;
  sample_rows: Record<string, string>[];
  ai_entity_guess: string;
  ai_confidence: number | null;
  is_confirmed: boolean;
  confirmed_entity: string;
  column_count: number;
  columns: DiscoveredColumn[];
}

export interface FieldMapping {
  id: string;
  table_id: string;
  table_name: string;
  column_name: string;
  canonical_entity: string;
  canonical_field: string;
  transform_expression: string;
  is_ai_suggested: boolean;
  is_confirmed: boolean;
  confirmed_at: string | null;
}

export interface SyncCheckpoint {
  id: string;
  data_type: string;
  last_synced_id: string;
  last_synced_at: string | null;
  updated_at: string;
}

interface SchemaTabProps {
  connectorId: string;
  tables: DiscoveredTable[];
  fieldMappings: FieldMapping[];
  checkpoints: SyncCheckpoint[];
}

const ENTITY_OPTIONS = [
  { value: 'sales', label: 'Sales' },
  { value: 'products', label: 'Products' },
  { value: 'inventory', label: 'Inventory' },
];

const ENTITY_REQUIRED_FIELDS: Record<string, string[]> = {
  sales: ['sale_id', 'timestamp', 'item_name', 'quantity', 'amount'],
  products: ['product_id', 'name', 'category'],
  inventory: ['ingredient_id', 'stock_level'],
};

const ENTITY_COLOR: Record<string, string> = {
  sales: 'text-green-400',
  products: 'text-blue-400',
  inventory: 'text-amber-400',
};

function TableCard({
  table,
  mappings,
  connectorId,
  checkpoint,
}: {
  table: DiscoveredTable;
  mappings: FieldMapping[];
  connectorId: string;
  checkpoint?: SyncCheckpoint;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [selectedEntity, setSelectedEntity] = useState(
    table.confirmed_entity || table.ai_entity_guess || 'sales',
  );
  const [actionStatus, setActionStatus] = useState<{ text: string; isError: boolean } | null>(null);

  const requiredFields = ENTITY_REQUIRED_FIELDS[table.confirmed_entity] ?? [];
  const confirmedFields = new Set(mappings.filter((m) => m.is_confirmed).map((m) => m.canonical_field));
  const missingFields = requiredFields.filter((f) => !confirmedFields.has(f));
  const unconfirmedMappings = mappings.filter((m) => !m.is_confirmed);
  const allReady = table.is_confirmed && requiredFields.length > 0 && missingFields.length === 0;

  const act = (fn: () => Promise<unknown>, successText: string) =>
    startTransition(async () => {
      try {
        await fn();
        setActionStatus({ text: successText, isError: false });
        router.refresh();
      } catch (err) {
        setActionStatus({
          text: err instanceof Error ? err.message : 'Action failed',
          isError: true,
        });
      }
    });

  // Auto-poll while the table is confirmed but mappings haven't landed yet —
  // AI field-mapping runs async (Celery), so without this the "No field
  // mappings yet" message never clears itself.
  const pollAttempts = useRef(0);
  useEffect(() => {
    if (!table.is_confirmed || mappings.length > 0) {
      pollAttempts.current = 0;
      return;
    }
    if (pollAttempts.current >= 10) return;
    const t = setTimeout(() => {
      pollAttempts.current += 1;
      router.refresh();
    }, 3000);
    return () => clearTimeout(t);
  }, [table.is_confirmed, mappings.length, router]);

  return (
    <div className="bg-[#1C1C1F] border border-[#2A2A2E] rounded-xl overflow-hidden">
      {/* Table header */}
      <div className="flex items-center justify-between px-6 py-4 bg-[#232327] border-b border-[#2A2A2E]">
        <div className="flex items-center gap-3">
          <span className="font-mono text-sm text-foreground font-bold">
            {table.schema_name ? `${table.schema_name}.` : ''}
            {table.table_name}
          </span>
          {table.row_count_estimate != null && (
            <span className="text-[10px] font-mono text-muted-foreground">
              ~{table.row_count_estimate.toLocaleString()} rows
            </span>
          )}
          <span className="text-[10px] text-muted-foreground">{table.column_count} cols</span>
          {allReady && (
            <span className="text-[10px] text-green-400 border border-green-400/30 rounded px-1.5 py-0.5">
              ready
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {table.ai_entity_guess && !table.is_confirmed && (
            <span className="text-[10px] text-muted-foreground">
              AI guess: {table.ai_entity_guess}
              {table.ai_confidence != null && ` (${Math.round(table.ai_confidence * 100)}%)`}
            </span>
          )}
          {table.is_confirmed && (
            <span className={`text-[11px] font-semibold ${ENTITY_COLOR[table.confirmed_entity] ?? 'text-foreground'}`}>
              ✓ {table.confirmed_entity}
            </span>
          )}
          <select
            value={selectedEntity}
            onChange={(e) => setSelectedEntity(e.target.value)}
            disabled={isPending}
            className="text-xs bg-[#2A2A2E] border border-[#3A3A3E] rounded px-2 py-1 text-foreground disabled:opacity-50"
          >
            {ENTITY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <Button
            variant="outline"
            size="sm"
            className={`text-xs border-[#2A2A2E] ${table.is_confirmed ? 'hover:bg-accent' : 'hover:bg-green-500/10 hover:border-green-500/30 hover:text-green-400'}`}
            onClick={() =>
              act(
                () => confirmTable(connectorId, table.id, selectedEntity),
                table.is_confirmed ? 'Updated — re-running AI field mapping…' : 'Confirmed — generating field mappings…',
              )
            }
            disabled={isPending}
          >
            {isPending ? '…' : table.is_confirmed ? 'Update' : 'Confirm'}
          </Button>
        </div>
      </div>

      {(checkpoint || actionStatus) && (
        <div className="px-6 py-1.5 bg-[#18181B] border-b border-[#2A2A2E] flex items-center justify-between text-[10px]">
          <span className="text-muted-foreground" suppressHydrationWarning>
            {checkpoint
              ? `Last synced: ${checkpoint.last_synced_at ? new Date(checkpoint.last_synced_at).toLocaleString() : 'never'}`
              : ''}
          </span>
          {actionStatus && (
            <span className={actionStatus.isError ? 'text-red-400' : 'text-green-400'}>
              {actionStatus.text}
            </span>
          )}
        </div>
      )}

      {/* Sample data — real example rows so admins can verify before confirming */}
      {table.sample_rows && table.sample_rows.length > 0 && (
        <div className="px-6 py-4 border-b border-[#2A2A2E] bg-[#18181B] overflow-x-auto">
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-2">
            Sample data
          </span>
          <table className="text-[11px] font-mono">
            <thead>
              <tr>
                {table.columns.map((col) => (
                  <th
                    key={col.id}
                    className="text-left text-muted-foreground font-normal pr-4 pb-1 whitespace-nowrap"
                  >
                    {col.column_name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {table.sample_rows.map((row, i) => (
                <tr key={i}>
                  {table.columns.map((col) => (
                    <td key={col.id} className="text-foreground pr-4 py-0.5 whitespace-nowrap">
                      {row[col.column_name] ?? '—'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Field mappings — only shown after table is confirmed */}
      {table.is_confirmed && (
        <div className="px-6 py-4 border-b border-[#2A2A2E] bg-[#18181B]">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Field Mappings
              </span>
              {missingFields.length > 0 ? (
                <span className="text-[10px] text-amber-400">
                  Need: {missingFields.join(', ')}
                </span>
              ) : mappings.length > 0 ? (
                <span className="text-[10px] text-green-400">All required fields mapped</span>
              ) : null}
            </div>
            {unconfirmedMappings.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                className="text-xs border-[#2A2A2E] hover:bg-green-500/10 hover:border-green-500/30 hover:text-green-400"
                onClick={() => act(() => confirmAllMappings(connectorId, table.id), 'All fields confirmed — sync requested')}
                disabled={isPending}
              >
                Confirm All ({unconfirmedMappings.length})
              </Button>
            )}
          </div>

          {mappings.length === 0 ? (
            <p className="text-[11px] text-muted-foreground italic">
              No field mappings yet — AI analysis may still be running. Refresh in a moment, or
              re-confirm the table to generate mappings from column AI suggestions.
            </p>
          ) : (
            <div className="space-y-1">
              {mappings.map((m) => (
                <div key={m.id} className="flex items-center justify-between py-0.5">
                  <div className="flex items-center gap-3 text-[11px]">
                    <span className="text-muted-foreground font-mono w-28 truncate">
                      {m.canonical_field}
                    </span>
                    <span className="text-muted-foreground/50">←</span>
                    <span className="text-foreground font-mono">{m.column_name}</span>
                    {m.is_ai_suggested && (
                      <span className="text-[9px] text-amber-400/60 border border-amber-400/20 px-1 rounded">
                        AI
                      </span>
                    )}
                  </div>
                  {m.is_confirmed ? (
                    <span className="text-[10px] text-green-400">✓ confirmed</span>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 text-[10px] px-2 text-muted-foreground hover:text-green-400"
                      onClick={() => act(() => confirmMapping(connectorId, m.id), 'Field confirmed')}
                      disabled={isPending}
                    >
                      Confirm
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Discovered columns */}
      {table.columns.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-b border-[#2A2A2E]">
              {['Column', 'Type', 'PK', 'AI Field Guess', 'Confidence'].map((h) => (
                <TableHead
                  key={h}
                  className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-6 py-2"
                >
                  {h}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {table.columns.map((col) => (
              <TableRow
                key={col.id}
                className="border-b border-[#2A2A2E]/50 hover:bg-[#2A2A2E]/30"
              >
                <TableCell className="px-6 py-2 font-mono text-[11px] text-foreground">
                  {col.column_name}
                  {!col.is_nullable && <span className="text-red-400 ml-1">*</span>}
                </TableCell>
                <TableCell className="px-6 py-2 font-mono text-[11px] text-muted-foreground">
                  {col.data_type || '—'}
                </TableCell>
                <TableCell className="px-6 py-2 text-[11px] text-muted-foreground">
                  {col.is_primary_key ? '✓' : ''}
                </TableCell>
                <TableCell className="px-6 py-2 text-[11px] text-amber-400/80 font-mono">
                  {col.ai_field_guess || '—'}
                </TableCell>
                <TableCell className="px-6 py-2 text-[11px] text-muted-foreground">
                  {col.ai_confidence != null ? `${Math.round(col.ai_confidence * 100)}%` : '—'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

export function SchemaTab({ connectorId, tables, fieldMappings, checkpoints }: SchemaTabProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [actionStatus, setActionStatus] = useState<{ text: string; isError: boolean } | null>(null);
  const [isSyncPolling, setIsSyncPolling] = useState(false);

  const mappingsByTableId = useMemo(() => {
    const map = new Map<string, FieldMapping[]>();
    for (const m of fieldMappings) {
      const list = map.get(m.table_id) ?? [];
      list.push(m);
      map.set(m.table_id, list);
    }
    return map;
  }, [fieldMappings]);

  const checkpointByDataType = useMemo(() => {
    const map = new Map<string, SyncCheckpoint>();
    for (const c of checkpoints) map.set(c.data_type, c);
    return map;
  }, [checkpoints]);

  const act = (fn: () => Promise<unknown>, successText: string, pollAfter = false) =>
    startTransition(async () => {
      try {
        await fn();
        setActionStatus({ text: successText, isError: false });
        router.refresh();
        if (pollAfter) setIsSyncPolling(true);
      } catch (err) {
        setActionStatus({ text: err instanceof Error ? err.message : 'Action failed', isError: true });
      }
    });

  // After "Sync Now", briefly poll so newly-synced checkpoints / record
  // counts show up here without a manual refresh.
  const syncPollAttempts = useRef(0);
  useEffect(() => {
    if (!isSyncPolling) {
      syncPollAttempts.current = 0;
      return;
    }
    if (syncPollAttempts.current >= 8) {
      setIsSyncPolling(false);
      return;
    }
    const t = setTimeout(() => {
      syncPollAttempts.current += 1;
      router.refresh();
    }, 3000);
    return () => clearTimeout(t);
  }, [isSyncPolling, checkpoints, router]);

  const confirmedTables = tables.filter((t) => t.is_confirmed);
  const readyCount = confirmedTables.filter((t) => {
    const required = ENTITY_REQUIRED_FIELDS[t.confirmed_entity] ?? [];
    const mps = mappingsByTableId.get(t.id) ?? [];
    const confirmed = new Set(mps.filter((m) => m.is_confirmed).map((m) => m.canonical_field));
    return required.length > 0 && required.every((f) => confirmed.has(f));
  }).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h2 className="text-base font-display font-semibold text-foreground">
            Schema & Field Mappings
          </h2>
          <p className="text-[11px] text-muted-foreground">
            Confirm which table is "Sales", map its columns to canonical fields, then data flows
            automatically.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {tables.length > 0 && (
            <span className="text-[11px] text-muted-foreground mr-1">
              {readyCount}/{tables.length} ready
            </span>
          )}
          {actionStatus && (
            <span className={`text-[11px] ${actionStatus.isError ? 'text-red-400' : 'text-green-400'}`}>
              {actionStatus.text}
            </span>
          )}
          <Button
            variant="outline"
            size="sm"
            className="border-[#2A2A2E] hover:bg-accent text-xs"
            onClick={() => act(() => requestSchemaRefresh(connectorId), 'Schema refresh requested — connector will re-submit on its next heartbeat')}
            disabled={isPending}
          >
            Request Schema Refresh
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-[#2A2A2E] hover:bg-accent text-xs"
            onClick={() => act(() => requestSyncNow(connectorId), isSyncPolling ? 'Syncing…' : 'Sync requested', true)}
            disabled={isPending}
          >
            {isSyncPolling ? 'Syncing…' : 'Sync Now'}
          </Button>
        </div>
      </div>

      {tables.length === 0 ? (
        <div className="bg-[#1C1C1F] border border-[#2A2A2E] rounded-xl px-6 py-10 text-center space-y-2">
          <div className="text-sm text-foreground font-medium">No schema discovered yet</div>
          <p className="text-[12px] text-muted-foreground max-w-sm mx-auto">
            The connector will enumerate available tables on its first connection. Once discovered,
            confirm which table represents "Sales" and map its columns to start receiving data.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* How it works callout */}
          {readyCount === 0 && (
            <div className="bg-amber-400/5 border border-amber-400/20 rounded-xl px-5 py-3">
              <div className="text-[11px] text-amber-400 font-semibold mb-1">Action needed to start data flow</div>
              <ol className="text-[11px] text-muted-foreground space-y-0.5 list-decimal list-inside">
                <li>Select the entity type for each table (Sales / Products / Inventory)</li>
                <li>Click <strong className="text-foreground">Confirm</strong> — this generates field mappings from AI suggestions</li>
                <li>Click <strong className="text-foreground">Confirm All</strong> on the mappings to approve them</li>
                <li>The connector picks up mappings on its next heartbeat and starts syncing</li>
              </ol>
            </div>
          )}

          {tables.map((table) => (
            <TableCard
              key={table.id}
              table={table}
              mappings={mappingsByTableId.get(table.id) ?? []}
              connectorId={connectorId}
              checkpoint={checkpointByDataType.get(table.confirmed_entity)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
