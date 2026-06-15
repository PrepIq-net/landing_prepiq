import { prisma } from "@/lib/prisma";
import EditPageForm from "./EditPageForm";
import { notFound } from "next/navigation";

export default async function Page({ params }: { params: { id: string } }) {
  const page = await prisma.page.findUnique({ where: { id: params.id } });
  if (!page) {
    notFound();
  }
  return <EditPageForm page={page!} />;
}
