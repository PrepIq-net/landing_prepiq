import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus } from 'iconoir-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { deleteUser } from '@/lib/actions/user-actions';

export default async function UsersPage() {
  const session = await auth();
  const currentUser = await prisma.user.findUnique({
    where: { email: session?.user?.email! },
  });

  if (!currentUser || currentUser.role !== 'ADMIN') {
    return notFound();
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-display font-semibold tracking-tight text-foreground">Staff</h1>
          <p className="text-muted-foreground text-sm">System administrators and content editors.</p>
        </div>
        <Button asChild className="bg-primary hover:bg-[#B8962E] text-primary-foreground font-semibold px-6 rounded-xl">
          <Link href="/admin/users/new">
            <Plus className="h-4 w-4 mr-2 stroke-[2.5px]" />
            New User
          </Link>
        </Button>
      </div>

      <div className="bg-[#1C1C1F] border border-[#2A2A2E] rounded-xl overflow-hidden shadow-l2">
        <Table>
          <TableHeader className="bg-[#232327]">
            <TableRow className="hover:bg-transparent border-b border-[#2A2A2E]">
              <TableHead className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-6 py-4">
                Email
              </TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-6 py-4">
                Role
              </TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-6 py-4">
                Status
              </TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-6 py-4">
                Created At
              </TableHead>
              <TableHead className="text-right text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-6 py-4">
                Control
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow
                key={user.id}
                className="hover:bg-[#2A2A2E]/50 border-b border-[#2A2A2E] transition-colors"
              >
                <TableCell className="px-6 py-4">
                  <span className="text-sm font-medium text-foreground">{user.email}</span>
                </TableCell>
                <TableCell className="px-6 py-4">
                  <Badge
                    className={`${
                      user.role === 'ADMIN'
                        ? 'bg-primary/20 text-primary border-primary/30'
                        : 'bg-muted/20 text-muted-foreground border-muted/30'
                    }`}
                  >
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell className="px-6 py-4">
                  {user.isActive ? (
                    <div className="badge-success">
                      <span>ACTIVE</span>
                    </div>
                  ) : (
                    <div className="badge-status bg-muted/20 text-muted-foreground border border-muted/30">
                      <span>INACTIVE</span>
                    </div>
                  )}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-[11px] font-mono text-muted-foreground">
                  {user.createdAt.toLocaleString()}
                </TableCell>
                <TableCell className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm" asChild className="hover:bg-accent text-foreground h-8 w-8 p-0">
                      <Link href={`/admin/users/${user.id}`}>
                        <span className="sr-only">Edit</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5l-4 1 1-4 12.5-12.5z"/></svg>
                      </Link>
                    </Button>
                    {user.id !== currentUser.id && (
                      <form action={deleteUser.bind(null, user.id)}>
                        <Button variant="ghost" size="sm" type="submit" className="hover:bg-destructive/10 text-destructive h-8 w-8 p-0">
                          <span className="sr-only">Delete</span>
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                        </Button>
                      </form>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
