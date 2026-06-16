import { Role, ActionType, EntityType } from "@prisma/client";

type PermissionKey = `${EntityType}-${ActionType}`;

const rolePermissions: Record<Role, PermissionKey[]> = {
  [Role.ADMIN]: [
    `${EntityType.PAGE}-${ActionType.CREATE}`,
    `${EntityType.PAGE}-${ActionType.UPDATE}`,
    `${EntityType.PAGE}-${ActionType.DELETE}`,
    `${EntityType.PAGE}-${ActionType.ACTIVATE}`,
    `${EntityType.PAGE}-${ActionType.DEACTIVATE}`,
    `${EntityType.SECTION}-${ActionType.CREATE}`,
    `${EntityType.SECTION}-${ActionType.UPDATE}`,
    `${EntityType.SECTION}-${ActionType.DELETE}`,
    `${EntityType.SECTION}-${ActionType.ACTIVATE}`,
    `${EntityType.SECTION}-${ActionType.DEACTIVATE}`,
    `${EntityType.LINK}-${ActionType.CREATE}`,
    `${EntityType.LINK}-${ActionType.UPDATE}`,
    `${EntityType.LINK}-${ActionType.DELETE}`,
    `${EntityType.LINK}-${ActionType.ACTIVATE}`,
    `${EntityType.LINK}-${ActionType.DEACTIVATE}`,
    `${EntityType.USER}-${ActionType.CREATE}`,
    `${EntityType.USER}-${ActionType.UPDATE}`,
    `${EntityType.USER}-${ActionType.DELETE}`,
    `${EntityType.USER}-${ActionType.ACTIVATE}`,
    `${EntityType.USER}-${ActionType.DEACTIVATE}`,
    `${EntityType.MESSAGE}-${ActionType.UPDATE}`,
    `${EntityType.MESSAGE}-${ActionType.DELETE}`,
  ],
  [Role.EDITOR]: [
    `${EntityType.PAGE}-${ActionType.CREATE}`,
    `${EntityType.PAGE}-${ActionType.UPDATE}`,
    `${EntityType.PAGE}-${ActionType.ACTIVATE}`,
    `${EntityType.PAGE}-${ActionType.DEACTIVATE}`,
    `${EntityType.SECTION}-${ActionType.CREATE}`,
    `${EntityType.SECTION}-${ActionType.UPDATE}`,
    `${EntityType.SECTION}-${ActionType.ACTIVATE}`,
    `${EntityType.SECTION}-${ActionType.DEACTIVATE}`,
    `${EntityType.LINK}-${ActionType.CREATE}`,
    `${EntityType.LINK}-${ActionType.UPDATE}`,
    `${EntityType.LINK}-${ActionType.ACTIVATE}`,
    `${EntityType.LINK}-${ActionType.DEACTIVATE}`,
    `${EntityType.MESSAGE}-${ActionType.UPDATE}`,
  ],
  [Role.VIEWER]: [],
};

export function hasPermission(
  role: Role,
  entity: EntityType,
  action: ActionType
): boolean {
  const key: PermissionKey = `${entity}-${action}`;
  return rolePermissions[role].includes(key);
}

export const canViewUsers = (role: Role): boolean =>
  role === Role.ADMIN;
export const canCreateUsers = (role: Role): boolean =>
  role === Role.ADMIN;
export const canEditUsers = (role: Role): boolean =>
  role === Role.ADMIN;
export const canDeleteUsers = (role: Role): boolean =>
  role === Role.ADMIN;
