import { prisma } from "@/lib/prisma";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2 } from "lucide-react";

export default async function LinksManager() {
  const links = await prisma.link.findMany({
    orderBy: [
      { type: "asc" },
      { sortOrder: "asc" },
    ],
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Manage Links</h1>
        <Button disabled>Add New Link (Soon)</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Label (EN)</TableHead>
            <TableHead>URL</TableHead>
            <TableHead>Status</TableHead>
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
                {link.isActive ? (
                  <Badge variant="default" className="bg-success/20 text-success border-success/30">Active</Badge>
                ) : (
                  <Badge variant="outline">Inactive</Badge>
                )}
              </TableCell>
              <TableCell className="text-right flex justify-end gap-2">
                <Button variant="outline" size="sm" disabled>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" disabled className="text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
