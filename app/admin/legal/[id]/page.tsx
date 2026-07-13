import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import EditLegalForm from "./EditLegalForm";

export default async function EditLegalDocumentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const doc = await prisma.legalDocument.findUnique({
    where: { id },
    include: {
      versions: {
        orderBy: { version: "desc" },
        take: 10,
        select: {
          id: true,
          version: true,
          effectiveDate: true,
          publishedAt: true,
          publishedBy: true,
        },
      },
    },
  });

  if (!doc) notFound();

  return <EditLegalForm doc={doc} />;
}
