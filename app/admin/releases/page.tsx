import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { djangoAdminFetch } from '@/lib/django-api';
import { publishRelease, toggleReleaseMandatory } from '@/lib/actions/connector-actions';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';

interface Release {
  id: string;
  version: string;
  release_notes: string;
  download_url: string;
  checksum_sha256: string;
  is_mandatory: boolean;
  min_supported_version: string;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
}

interface Paginated<T> {
  count: number;
  results: T[];
}

export default async function ReleasesPage() {
  const session = await auth();
  const currentUser = await prisma.user.findUnique({
    where: { email: session?.user?.email! },
  });
  if (!currentUser || currentUser.role !== 'ADMIN') return notFound();

  const email = session!.user!.email!;

  let data: Paginated<Release> | null = null;
  let error: string | null = null;

  try {
    data = await djangoAdminFetch<Paginated<Release>>('/api/mgmt/releases/', email);
  } catch (e) {
    error = e instanceof Error ? e.message : 'Failed to fetch releases';
  }

  const releases = data?.results ?? [];

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-display font-semibold tracking-tight text-foreground">
            Connector Releases
          </h1>
          <p className="text-muted-foreground text-sm">
            Manage PIQ Connector software versions.
            {data ? ` ${data.count} total.` : ''}
          </p>
        </div>
        <Link href="/admin/releases/new">
          <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
            + New Release
          </Button>
        </Link>
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
              {['Version', 'Status', 'Mandatory', 'Min Version', 'Published At', 'Checksum', 'Actions'].map((h) => (
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
            {releases.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="px-6 py-10 text-center text-sm text-muted-foreground"
                >
                  {error ? 'Could not load releases.' : 'No releases yet.'}
                </TableCell>
              </TableRow>
            ) : (
              releases.map((r) => (
                <TableRow
                  key={r.id}
                  className="hover:bg-[#2A2A2E]/50 border-b border-[#2A2A2E] transition-colors"
                >
                  <TableCell className="px-6 py-4">
                    <div className="text-sm font-mono font-bold text-foreground">v{r.version}</div>
                    {r.release_notes && (
                      <div className="text-[11px] text-muted-foreground mt-0.5 max-w-[200px] truncate">
                        {r.release_notes}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {r.is_published ? (
                      <span className="text-[11px] font-bold text-green-400">PUBLISHED</span>
                    ) : (
                      <span className="text-[11px] font-bold text-muted-foreground">DRAFT</span>
                    )}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {r.is_mandatory ? (
                      <span className="text-[11px] font-bold text-amber-400">YES</span>
                    ) : (
                      <span className="text-[11px] text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-[11px] font-mono text-muted-foreground">
                    {r.min_supported_version || '—'}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-[11px] font-mono text-muted-foreground whitespace-nowrap">
                    {r.published_at ? new Date(r.published_at).toLocaleDateString() : '—'}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <span className="text-[10px] font-mono text-muted-foreground truncate max-w-[80px] block" title={r.checksum_sha256}>
                      {r.checksum_sha256.slice(0, 12)}…
                    </span>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {!r.is_published && (
                        <form
                          action={async () => {
                            'use server';
                            await publishRelease(r.id);
                          }}
                        >
                          <button
                            type="submit"
                            className="text-[11px] font-semibold text-green-400 hover:text-green-300"
                          >
                            Publish
                          </button>
                        </form>
                      )}
                      <form
                        action={async () => {
                          'use server';
                          await toggleReleaseMandatory(r.id);
                        }}
                      >
                        <button
                          type="submit"
                          className={`text-[11px] font-semibold ${
                            r.is_mandatory
                              ? 'text-amber-400 hover:text-amber-300'
                              : 'text-muted-foreground hover:text-foreground'
                          }`}
                        >
                          {r.is_mandatory ? 'Un-require' : 'Mark Required'}
                        </button>
                      </form>
                    </div>
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
