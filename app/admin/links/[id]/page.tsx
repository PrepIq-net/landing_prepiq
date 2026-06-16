import { prisma } from "@/lib/prisma";
import EditLinkForm from "./EditLinkForm";
import { notFound } from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const link = await prisma.link.findUnique({ where: { id } });
  if (!link) {
    notFound();
  }
  return <EditLinkForm link={link!} />;
}
