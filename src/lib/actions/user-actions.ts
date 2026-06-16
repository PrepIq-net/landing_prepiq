'use server';

import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { logActivity } from '@/lib/activity-logger';
import { ActionType, EntityType } from '@prisma/client';
import { revalidatePath } from 'next/cache';

const UserCreateSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(['ADMIN', 'EDITOR', 'VIEWER']),
});

const UserUpdateSchema = z.object({
  email: z.string().email(),
  role: z.enum(['ADMIN', 'EDITOR', 'VIEWER']),
  isActive: z.string().transform(val => val === 'true'),
});

const UserPasswordChangeSchema = z.object({
  userId: z.string(),
  newPassword: z.string().min(8),
});

export async function createUser(formData: FormData) {
  const session = await auth();
  if (!session?.user?.email) throw new Error('Unauthorized');

  const currentUser = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!currentUser || currentUser.role !== 'ADMIN') {
    throw new Error('Only admins can create users');
  }

  const data = Object.fromEntries(formData);
  const validated = UserCreateSchema.parse(data);

  const passwordHash = await bcrypt.hash(validated.password, 12);

  const newUser = await prisma.user.create({
    data: {
      email: validated.email,
      passwordHash,
      role: validated.role,
    },
  });

  await logActivity(
    currentUser.id,
    ActionType.CREATE,
    EntityType.USER,
    newUser.id,
    JSON.stringify({ email: newUser.email, role: newUser.role })
  );

  revalidatePath('/admin/users');
  return { success: true };
}

export async function updateUser(userId: string, formData: FormData) {
  const session = await auth();
  if (!session?.user?.email) throw new Error('Unauthorized');

  const currentUser = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!currentUser || currentUser.role !== 'ADMIN') {
    throw new Error('Only admins can edit users');
  }

  const data = Object.fromEntries(formData);
  const validated = UserUpdateSchema.parse(data);

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      email: validated.email,
      role: validated.role,
      isActive: validated.isActive,
    },
  });

  await logActivity(
    currentUser.id,
    ActionType.UPDATE,
    EntityType.USER,
    userId,
    JSON.stringify({
      newEmail: updatedUser.email,
      newRole: updatedUser.role,
      newIsActive: updatedUser.isActive,
    })
  );

  revalidatePath('/admin/users');
  return { success: true };
}

export async function changeUserPassword(userId: string, newPassword: string) {
  const session = await auth();
  if (!session?.user?.email) throw new Error('Unauthorized');

  const currentUser = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!currentUser || currentUser.role !== 'ADMIN') {
    throw new Error('Only admins can change passwords');
  }

  const passwordHash = await bcrypt.hash(newPassword, 12);

  await prisma.user.update({
    where: { id: userId },
    data: { passwordHash },
  });

  await logActivity(
    currentUser.id,
    ActionType.UPDATE,
    EntityType.USER,
    userId,
    'Password changed'
  );

  return { success: true };
}

export async function deleteUser(userId: string) {
  const session = await auth();
  if (!session?.user?.email) throw new Error('Unauthorized');

  const currentUser = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!currentUser || currentUser.role !== 'ADMIN') {
    throw new Error('Only admins can delete users');
  }

  // Don't let admin delete themselves
  if (userId === currentUser.id) {
    throw new Error('You cannot delete your own account');
  }

  await prisma.user.delete({ where: { id: userId } });

  await logActivity(
    currentUser.id,
    ActionType.DELETE,
    EntityType.USER,
    userId
  );

  revalidatePath('/admin/users');
  return { success: true };
}
