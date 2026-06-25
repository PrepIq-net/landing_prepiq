'use client';

import { useState } from 'react';
import { createInstallationToken } from '@/lib/actions/connector-actions';

interface Branch {
  id: string;
  name: string;
  organization_name: string;
}

export function CreateTokenForm({ branches }: { branches: Branch[] }) {
  const [branchId, setBranchId] = useState('');
  const [rawToken, setRawToken] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!branchId) return;
    setPending(true);
    setError(null);
    setRawToken(null);
    try {
      const token = await createInstallationToken(branchId);
      setRawToken(token);
      setBranchId('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create token');
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="bg-[#1C1C1F] border border-[#2A2A2E] rounded-xl p-6 space-y-5">
      <div className="text-[10px] font-bold uppercase tracking-widest text-amber-500/70">
        Generate Installation Token
      </div>

      {rawToken ? (
        <div className="space-y-3">
          <p className="text-sm text-foreground font-medium">
            Token created — copy it now. It will not be shown again.
          </p>
          <div className="bg-[#232327] border border-primary/30 rounded-lg px-4 py-3 font-mono text-sm text-primary break-all select-all">
            {rawToken}
          </div>
          <p className="text-[11px] text-muted-foreground">
            Valid for 60 minutes. Hand to the technician setting up the connector on-site.
          </p>
          <button
            onClick={() => setRawToken(null)}
            className="text-xs font-semibold text-muted-foreground hover:text-foreground"
          >
            Generate another →
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex items-end gap-3">
          <div className="flex-1 space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
              Branch
            </label>
            <select
              value={branchId}
              onChange={(e) => setBranchId(e.target.value)}
              required
              className="w-full bg-[#232327] border border-[#2A2A2E] rounded-lg px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
            >
              <option value="">Select a branch…</option>
              {branches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.organization_name} — {b.name}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            disabled={!branchId || pending}
            className="px-5 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {pending ? 'Creating…' : 'Generate Token'}
          </button>
        </form>
      )}

      {error && (
        <div className="text-sm text-destructive">{error}</div>
      )}
    </div>
  );
}
