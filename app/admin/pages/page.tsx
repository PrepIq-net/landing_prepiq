import { prisma } from "@/lib/prisma";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Edit, Layers, Trash2, EyeOff, Eye, Plus } from "lucide-react";
import { deletePage, togglePageActive } from "@/lib/actions/page-actions";

export default async function PagesManager() {
  const pages = await prisma.page.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Pages</h1>
        <Button asChild>
          <Link href="/admin/pages/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Page
          </Link>
        </Button>
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
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
                <TableCell>
                  <form action={togglePageActive.bind(null, page.id)}>
                    <Button variant="ghost" size="sm" type="submit">
                      {page.isActive ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </Button>
                  </form>
                </TableCell>
                <TableCell className="text-right flex justify-end gap-1">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/admin/pages/${page.id}/sections`}>
                      <Layers className="h-4 w-4 mr-1" />
                      Sections
                    </Link>
                  </Button>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/admin/pages/${page.id}`}>
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Link>
                  </Button>
                  <form action={deletePage.bind(null, page.id)}>
                    <Button variant="ghost" size="sm" type="submit" className="text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </form>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
