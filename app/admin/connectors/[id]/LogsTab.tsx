'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface ConnectorLog {
  id: string;
  level: LogLevel;
  message: string;
  fields: Record<string, string>;
  logged_at: string;
  received_at: string;
}

const LEVEL_CLASS: Record<LogLevel, string> = {
  debug: 'text-muted-foreground',
  info: 'text-blue-400',
  warn: 'text-amber-400',
  error: 'text-red-400 font-bold',
};

interface Props {
  connectorId: string;
  initialLogs: ConnectorLog[];
  initialCount: number;
}

export function LogsTab({ connectorId, initialLogs, initialCount }: Props) {
  const [logs, setLogs] = useState<ConnectorLog[]>(initialLogs);
  const [count, setCount] = useState(initialCount);
  const [levelFilter, setLevelFilter] = useState('');
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [loading, setLoading] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchLogs = useCallback(async (level: string) => {
    setLoading(true);
    try {
      const qs = level ? `?level=${level}&page_size=50` : '?page_size=50';
      const res = await fetch(`/api/mgmt/connectors/${connectorId}/remote-logs/${qs}`);
      if (!res.ok) return;
      const data: { count: number; results: ConnectorLog[] } = await res.json();
      setLogs(data.results);
      setCount(data.count);
    } catch {
      // silently leave stale data
    } finally {
      setLoading(false);
    }
  }, [connectorId]);

  useEffect(() => {
    if (autoRefresh) {
      timerRef.current = setInterval(() => fetchLogs(levelFilter), 30_000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [autoRefresh, levelFilter, fetchLogs]);

  function handleLevelChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const v = e.target.value;
    setLevelFilter(v);
    fetchLogs(v);
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-base font-display font-semibold text-foreground">
          Remote Logs
          {count > 0 && (
            <span className="ml-2 text-xs font-mono text-muted-foreground">({count})</span>
          )}
        </h2>
        <div className="flex items-center gap-3">
          <select
            value={levelFilter}
            onChange={handleLevelChange}
            className="text-xs bg-[#1C1C1F] border border-[#2A2A2E] rounded px-2 py-1.5 text-foreground"
          >
            <option value="">All levels</option>
            <option value="error">Error</option>
            <option value="warn">Warn</option>
            <option value="info">Info</option>
            <option value="debug">Debug</option>
          </select>

          <Button
            variant="outline"
            size="sm"
            className="border-[#2A2A2E] hover:bg-accent text-xs"
            onClick={() => fetchLogs(levelFilter)}
            disabled={loading}
          >
            {loading ? 'Refreshing…' : 'Refresh'}
          </Button>

          <label className="flex items-center gap-1.5 text-xs text-muted-foreground cursor-pointer">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="accent-primary"
            />
            Auto (30s)
          </label>
        </div>
      </div>

      <div className="bg-[#1C1C1F] border border-[#2A2A2E] rounded-xl overflow-hidden">
        <Table>
          <TableHeader className="bg-[#232327]">
            <TableRow className="hover:bg-transparent border-b border-[#2A2A2E]">
              {['Timestamp', 'Level', 'Message', 'Fields'].map((h) => (
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
            {logs.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="px-6 py-6 text-center text-sm text-muted-foreground"
                >
                  No log entries yet. The connector ships logs automatically when errors occur.
                </TableCell>
              </TableRow>
            ) : (
              logs.map((log) => (
                <TableRow
                  key={log.id}
                  className="border-b border-[#2A2A2E] hover:bg-[#2A2A2E]/50"
                >
                  <TableCell className="px-6 py-2 text-[11px] font-mono text-muted-foreground whitespace-nowrap">
                    {new Date(log.logged_at).toLocaleString()}
                  </TableCell>
                  <TableCell className="px-6 py-2">
                    <span className={`text-[11px] font-mono ${LEVEL_CLASS[log.level]}`}>
                      {log.level.toUpperCase()}
                    </span>
                  </TableCell>
                  <TableCell className="px-6 py-2 text-[11px] text-foreground max-w-[400px] truncate">
                    {log.message}
                  </TableCell>
                  <TableCell className="px-6 py-2 text-[11px] font-mono text-muted-foreground max-w-[200px] truncate">
                    {Object.keys(log.fields).length > 0
                      ? JSON.stringify(log.fields)
                      : '—'}
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
