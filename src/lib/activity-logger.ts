'use server';

import { prisma } from '@/lib/prisma';
import { ActionType, EntityType } from '@prisma/client';

export async function logActivity(
  userId: string,
  action: ActionType,
  entity: EntityType,
  entityId?: string,
  details?: string
) {
  await prisma.activityLog.create({
    data: {
      userId,
      action,
      entity,
      entityId,
      details,
    },
  });
}
