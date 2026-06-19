import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import SectionEditorForm from "./SectionEditorForm";
import { notFound } from "next/navigation";

export default async function SectionEditor({
  params,
}: {
  params: Promise<{ id: string; sectionId: string }>;
}) {
  const { id, sectionId } = await params;
  const section = await prisma.section.findUnique({
    where: { id: sectionId },
  });

  if (!section) notFound();

  const content = typeof section.contentJson === 'string' ? JSON.parse(section.contentJson) : section.contentJson;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/admin/pages/${id}`}>← Back to Page</Link>
        </Button>
      </div>

      <SectionEditorForm
        sectionId={section.id}
        initialContent={content}
        componentType={section.componentType}
      />
    </div>
  );
}
