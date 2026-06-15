import { prisma } from "@/lib/prisma";
import EditLinkForm from "./EditLinkForm";
import { notFound } from "next/navigation";

export default async function Page({ params }: { params: { id: string } }) {
  const link = await prisma.link.findUnique({ where: { id: params.id } });
  if (!link) {
    notFound();
  }
  return <EditLinkForm link={link!} />;
}
