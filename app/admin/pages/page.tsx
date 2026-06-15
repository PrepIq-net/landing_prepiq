import { prisma } from "@/lib/prisma";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Edit, Layers } from "lucide-react";

export default async function PagesManager() {
  const pages = await prisma.page.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Manage Pages</h1>
        <Button disabled>Add New Page (Soon)</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Slug</TableHead>
            <TableHead>Title (EN)</TableHead>
            <TableHead>Title (FR)</TableHead>
            <TableHead>Active</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pages.map((page) => (
            <TableRow key={page.id}>
              <TableCell className="font-medium">{page.slug}</TableCell>
              <TableCell>{page.titleEn}</TableCell>
              <TableCell>{page.titleFr}</TableCell>
              <TableCell>{page.isActive ? "Yes" : "No"}</TableCell>
              <TableCell className="text-right flex justify-end gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/admin/pages/${page.id}/sections`}>
                    <Layers className="h-4 w-4 mr-2" />
                    Sections
                  </Link>
                </Button>
                <Button variant="outline" size="sm" disabled>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
