import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { notFound } from 'next/navigation';
import { EditUserForm } from './EditUserForm';

export default async function EditUserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const session = await auth();
  if (!session?.user?.email) return notFound();

  const currentUser = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!currentUser || currentUser.role !== 'ADMIN') {
    return notFound();
  }

  const user = await prisma.user.findUnique({
    where: { id: resolvedParams.id },
  });
  if (!user) return notFound();

  return (
    <EditUserForm user={user} currentUserId={currentUser.id} />
  );
}
