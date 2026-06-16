import { prisma } from "@/lib/prisma";
import EditPageForm from "./EditPageForm";
import { notFound } from "next/navigation";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const page = await prisma.page.findUnique({
    where: { id },
    include: {
      sections: {
        orderBy: { sortOrder: "asc" },
      }
    }
  });

  if (!page) {
    notFound();
  }

  return <EditPageForm page={page} />;
}
