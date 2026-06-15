import { prisma } from "@/lib/prisma";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Edit, ArrowUp, ArrowDown, Eye, EyeOff } from "lucide-react";
import { toggleSection, moveSection } from "@/lib/actions/section-actions";
import { Badge } from "@/components/ui/badge";

export default async function PageSectionsManager({ params }: { params: { id: string } }) {
  const page = await prisma.page.findUnique({
    where: { id: params.id },
    include: {
      sections: {
        orderBy: { sortOrder: "asc" },
      },
    },
  });

  if (!page) return <div>Page not found</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin/pages">← Back</Link>
        </Button>
        <h1 className="text-3xl font-bold">Sections for {page.titleEn}</h1>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>Title (EN)</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Order</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {page.sections.map((section, index) => (
            <TableRow key={section.id} className={!section.isActive ? "opacity-50 grayscale" : ""}>
              <TableCell className="font-mono text-xs">{section.componentType}</TableCell>
              <TableCell>{section.titleEn}</TableCell>
              <TableCell>
                {section.isActive ? (
                  <Badge variant="default" className="bg-success/20 text-success border-success/30">Live</Badge>
                ) : (
                  <Badge variant="outline" className="bg-muted text-muted-foreground">Hidden</Badge>
                )}
              </TableCell>
              <TableCell>{section.sortOrder}</TableCell>
              <TableCell className="text-right flex justify-end gap-2">
                <form action={moveSection.bind(null, section.id, "up")}>
                   <Button variant="outline" size="icon" disabled={index === 0} type="submit"><ArrowUp className="h-4 w-4" /></Button>
                </form>
                <form action={moveSection.bind(null, section.id, "down")}>
                   <Button variant="outline" size="icon" disabled={index === page.sections.length - 1} type="submit"><ArrowDown className="h-4 w-4" /></Button>
                </form>
                <form action={toggleSection.bind(null, section.id)}>
                   <Button variant="outline" size="icon" type="submit" title={section.isActive ? "Hide" : "Show"}>
                     {section.isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                   </Button>
                </form>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/admin/pages/${page.id}/sections/${section.id}`}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
