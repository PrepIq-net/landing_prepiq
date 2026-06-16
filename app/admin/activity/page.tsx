import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { notFound } from 'next/navigation';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

export default async function ActivityLogPage() {
  const session = await auth();
  const currentUser = await prisma.user.findUnique({
    where: { email: session?.user?.email! },
  });

  if (!currentUser || currentUser.role !== 'ADMIN') {
    return notFound();
  }

  const logs = await prisma.activityLog.findMany({
    include: { user: true },
    orderBy: { createdAt: 'desc' },
    take: 100,
  });

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="text-3xl font-display font-semibold tracking-tight text-foreground">Activity Log</h1>
        <p className="text-muted-foreground text-sm">System and user action history.</p>
      </div>

      <div className="bg-[#1C1C1F] border border-[#2A2A2E] rounded-xl overflow-hidden shadow-l2">
        <Table>
          <TableHeader className="bg-[#232327]">
            <TableRow className="hover:bg-transparent border-b border-[#2A2A2E]">
              <TableHead className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-6 py-4">
                Timestamp
              </TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-6 py-4">
                User
              </TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-6 py-4">
                Action
              </TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-6 py-4">
                Entity
              </TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-6 py-4">
                Details
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((log) => (
              <TableRow
                key={log.id}
                className="hover:bg-[#2A2A2E]/50 border-b border-[#2A2A2E] transition-colors"
              >
                <TableCell className="px-6 py-4 whitespace-nowrap text-[11px] font-mono text-muted-foreground">
                  {format(new Date(log.createdAt), 'yyyy-MM-dd HH:mm:ss')}
                </TableCell>
                <TableCell className="px-6 py-4 text-sm text-foreground">
                  {log.user.email}
                </TableCell>
                <TableCell className="px-6 py-4">
                  <Badge
                    className={`${
                      log.action === 'CREATE'
                        ? 'bg-primary/20 text-primary border-primary/30'
                        : log.action === 'DELETE'
                        ? 'bg-destructive/20 text-destructive border-destructive/30'
                        : 'bg-muted/20 text-muted-foreground border-muted/30'
                    }`}
                  >
                    {log.action}
                  </Badge>
                </TableCell>
                <TableCell className="px-6 py-4 text-sm text-foreground">
                  {log.entity}
                </TableCell>
                <TableCell className="px-6 py-4 text-sm text-muted-foreground max-w-xs truncate">
                  {log.details}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
