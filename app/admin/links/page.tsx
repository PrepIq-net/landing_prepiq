import { prisma } from "@/lib/prisma";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Plus, Eye, EyeOff } from "lucide-react";
import { deleteLink, toggleLinkActive } from "@/lib/actions/link-actions";
import Link from "next/link";

export default async function LinksManager() {
  const links = await prisma.link.findMany({
    orderBy: [
      { type: "asc" },
      { sortOrder: "asc" },
    ],
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Links</h1>
          <p className="text-gray-500 mt-1">Manage navigation and footer links</p>
        </div>
        <Button asChild className="bg-blue-600 hover:bg-blue-700">
          <Link href="/admin/links/new">
            <Plus className="h-4 w-4 mr-2" />
            Add New Link
          </Link>
        </Button>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="font-semibold text-gray-900">Type</TableHead>
              <TableHead className="font-semibold text-gray-900">Category</TableHead>
              <TableHead className="font-semibold text-gray-900">Label (EN)</TableHead>
              <TableHead className="font-semibold text-gray-900">URL</TableHead>
              <TableHead className="font-semibold text-gray-900">Status</TableHead>
              <TableHead className="text-right font-semibold text-gray-900">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {links.map((link) => (
              <TableRow key={link.id} className="hover:bg-gray-50 transition-colors duration-150">
                <TableCell>
                  <Badge variant={link.type === "nav" ? "default" : "outline"} className={
                    link.type === "nav" ? "bg-blue-100 text-blue-700 hover:bg-blue-200" : "text-gray-600"
                  }>
                    {link.type}
                  </Badge>
                </TableCell>
                <TableCell className="text-gray-700">{link.category || "-"}</TableCell>
                <TableCell className="font-medium text-gray-900">{link.labelEn}</TableCell>
                <TableCell className="font-mono text-xs text-gray-600">{link.url}</TableCell>
                <TableCell>
                  <form action={toggleLinkActive.bind(null, link.id)}>
                    <Button variant="ghost" size="sm" type="submit">
                      {link.isActive ? (
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
                      <Link href={`/admin/links/${link.id}`}>
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Link>
                    </Button>
                    <form action={deleteLink.bind(null, link.id)}>
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
