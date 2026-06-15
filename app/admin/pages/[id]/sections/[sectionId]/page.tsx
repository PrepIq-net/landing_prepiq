import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import SectionEditorForm from "./SectionEditorForm";

export default async function SectionEditor({ params }: { params: { id: string, sectionId: string } }) {
  const section = await prisma.section.findUnique({
    where: { id: params.sectionId },
  });

  if (!section) return <div>Section not found</div>;

  const content = JSON.parse(section.contentJson);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/admin/pages/${params.id}/sections`}>← Back</Link>
        </Button>
        <h1 className="text-3xl font-bold">Edit Section: {section.componentType}</h1>
      </div>

      <SectionEditorForm sectionId={section.id} initialContent={content} />
    </div>
  );
}
