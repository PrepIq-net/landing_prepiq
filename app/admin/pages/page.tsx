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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pages</h1>
          <p className="text-gray-500 mt-1">Manage all your site pages</p>
        </div>
        <Button asChild className="bg-blue-600 hover:bg-blue-700">
          <Link href="/admin/pages/new">
            <Plus className="h-4 w-4 mr-2" />
            Add New Page
          </Link>
        </Button>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="font-semibold text-gray-900">Slug</TableHead>
              <TableHead className="font-semibold text-gray-900">Title (EN)</TableHead>
              <TableHead className="font-semibold text-gray-900">Title (FR)</TableHead>
              <TableHead className="font-semibold text-gray-900">Status</TableHead>
              <TableHead className="text-right font-semibold text-gray-900">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pages.map((page) => (
              <TableRow key={page.id} className="hover:bg-gray-50 transition-colors duration-150">
                <TableCell className="font-medium text-gray-900">{page.slug}</TableCell>
                <TableCell className="text-gray-700">{page.titleEn}</TableCell>
                <TableCell className="text-gray-700">{page.titleFr}</TableCell>
                <TableCell>
                  <form action={togglePageActive.bind(null, page.id)}>
                    <Button variant="ghost" size="sm" type="submit">
                      {page.isActive ? (
                        <span className="flex items-center gap-1.5 text-green-600">
                          <Eye className="h-4 w-4" />
                          <span className="text-xs font-medium">Active</span>
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-gray-500">
                          <EyeOff className="h-4 w-4" />
                          <span className="text-xs font-medium">Inactive</span>
                        </span>
                      )}
                    </Button>
                  </form>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" asChild className="border-gray-300 hover:bg-gray-100">
                      <Link href={`/admin/pages/${page.id}/sections`}>
                        <Layers className="h-4 w-4 mr-1" />
                        Sections
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild className="border-gray-300 hover:bg-gray-100">
                      <Link href={`/admin/pages/${page.id}`}>
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Link>
                    </Button>
                    <form action={deletePage.bind(null, page.id)}>
                      <Button variant="outline" size="sm" type="submit" className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </form>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
