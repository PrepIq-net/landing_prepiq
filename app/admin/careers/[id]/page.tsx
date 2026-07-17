import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import RoleForm from "../RoleForm";

export const dynamic = "force-dynamic";

export default async function EditRolePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const role = await prisma.jobRole.findUnique({ where: { id } });
  if (!role) notFound();

  return (
    <RoleForm
      role={{
        id: role.id,
        slug: role.slug,
        titleEn: role.titleEn,
        titleFr: role.titleFr,
        department: role.department,
        location: role.location,
        employmentType: role.employmentType,
        summaryEn: role.summaryEn,
        summaryFr: role.summaryFr,
        bodyEn: role.bodyEn,
        bodyFr: role.bodyFr,
        sortOrder: role.sortOrder,
        isPublished: role.isPublished,
      }}
    />
  );
}
