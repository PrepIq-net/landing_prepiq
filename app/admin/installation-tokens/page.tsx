import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { djangoAdminFetch } from '@/lib/django-api';
import { CreateTokenForm } from './CreateTokenForm';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface Branch {
  id: string;
  name: string;
  organization_name: string;
}

interface InstallationToken {
  id: string;
  organization_name: string;
  branch_name: string;
  expires_at: string;
  is_used: boolean;
  used_at: string | null;
  created_by_email: string | null;
  is_valid: boolean;
  created_at: string;
}

interface Paginated<T> {
  count: number;
  results: T[];
}

export default async function InstallationTokensPage() {
  const session = await auth();
  const currentUser = await prisma.user.findUnique({
    where: { email: session?.user?.email! },
  });
  if (!currentUser || currentUser.role !== 'ADMIN') return notFound();

  const email = session!.user!.email!;

  const [tokensResult, branchesResult] = await Promise.allSettled([
    djangoAdminFetch<Paginated<InstallationToken>>('/api/mgmt/installation-tokens/', email),
    djangoAdminFetch<Branch[]>('/api/mgmt/branches/', email),
  ]);

  const tokens = tokensResult.status === 'fulfilled' ? tokensResult.value.results : [];
  const branches = branchesResult.status === 'fulfilled' ? branchesResult.value : [];
  const tokenError = tokensResult.status === 'rejected' ? String(tokensResult.reason) : null;

  function tokenStatus(t: InstallationToken) {
    if (t.is_used) return { label: 'USED', cls: 'text-muted-foreground' };
    if (!t.is_valid) return { label: 'EXPIRED', cls: 'text-red-400' };
    return { label: 'VALID', cls: 'text-green-400 font-bold' };
  }

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="text-3xl font-display font-semibold tracking-tight text-foreground">
          Installation Tokens
        </h1>
        <p className="text-muted-foreground text-sm">
          One-time tokens used to register a new PIQ Connector machine on-site.
        </p>
      </div>

      <CreateTokenForm branches={branches} />

      {tokenError && (
        <div className="bg-destructive/10 border border-destructive/30 rounded-xl px-5 py-4 text-sm text-destructive">
          {tokenError}
        </div>
      )}

      <div className="bg-[#1C1C1F] border border-[#2A2A2E] rounded-xl overflow-hidden shadow-l2">
        <Table>
          <TableHeader className="bg-[#232327]">
            <TableRow className="hover:bg-transparent border-b border-[#2A2A2E]">
              {['Branch / Org', 'Status', 'Expires', 'Used At', 'Created By', 'Created'].map((h) => (
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
            {tokens.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="px-6 py-10 text-center text-sm text-muted-foreground"
                >
                  No installation tokens yet.
                </TableCell>
              </TableRow>
            ) : (
              tokens.map((t) => {
                const st = tokenStatus(t);
                return (
                  <TableRow
                    key={t.id}
                    className="hover:bg-[#2A2A2E]/50 border-b border-[#2A2A2E] transition-colors"
                  >
                    <TableCell className="px-6 py-4">
                      <div className="text-sm font-medium text-foreground">{t.branch_name}</div>
                      <div className="text-[11px] text-muted-foreground">{t.organization_name}</div>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <span className={`text-[11px] font-bold ${st.cls}`}>{st.label}</span>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-[11px] font-mono text-muted-foreground whitespace-nowrap">
                      {new Date(t.expires_at).toLocaleString()}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-[11px] font-mono text-muted-foreground whitespace-nowrap">
                      {t.used_at ? new Date(t.used_at).toLocaleString() : '—'}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-[11px] text-muted-foreground">
                      {t.created_by_email ?? 'admin panel'}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-[11px] font-mono text-muted-foreground whitespace-nowrap">
                      {new Date(t.created_at).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
