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
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Links</h1>
        <Button asChild>
          <Link href="/admin/links/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Link
          </Link>
        </Button>
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Label (EN)</TableHead>
              <TableHead>URL</TableHead>
              <TableHead>Active</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {links.map((link) => (
              <TableRow key={link.id}>
                <TableCell className="capitalize">{link.type}</TableCell>
                <TableCell>{link.category || "-"}</TableCell>
                <TableCell>{link.labelEn}</TableCell>
                <TableCell className="font-mono text-xs">{link.url}</TableCell>
                <TableCell>
                  <form action={toggleLinkActive.bind(null, link.id)}>
                    <Button variant="ghost" size="sm" type="submit">
                      {link.isActive ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </Button>
                  </form>
                </TableCell>
                <TableCell className="text-right flex justify-end gap-1">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/admin/links/${link.id}`}>
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Link>
                  </Button>
                  <form action={deleteLink.bind(null, link.id)}>
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
