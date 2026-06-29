'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';

const TABS = [
  { key: 'summary', label: 'Summary' },
  { key: 'tokens', label: 'Tokens' },
  { key: 'schema', label: 'Schema & Fields' },
  { key: 'sales', label: 'Unreconciled Sales' },
  { key: 'logs', label: 'Logs' },
] as const;

export function ConnectorTabs({ active }: { active: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function navigate(key: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', key);
    router.push(`?${params.toString()}`);
  }

  return (
    <div className="flex gap-0 border-b border-[#2A2A2E]">
      {TABS.map((tab) => (
        <button
          key={tab.key}
          onClick={() => navigate(tab.key)}
          className={cn(
            'px-5 py-3 text-sm font-medium border-b-2 -mb-px transition-colors',
            active === tab.key
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground',
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
