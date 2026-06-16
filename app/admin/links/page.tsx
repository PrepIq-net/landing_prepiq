import { prisma } from "@/lib/prisma";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EditPencil, Trash, Plus, Eye, EyeClosed } from "iconoir-react";
import { deleteLink, toggleLinkActive } from "@/lib/actions/link-actions";
import Link from "next/link";

export default async function LinksManager() {
  const links = await prisma.link.findMany({
    orderBy: [{ type: "asc" }, { sortOrder: "asc" }],
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-display font-semibold tracking-tight text-foreground">
            Links
          </h1>
          <p className="text-muted-foreground text-sm">
            Manage navigation hierarchy and global routing endpoints.
          </p>
        </div>
        <Button
          asChild
          className="bg-primary hover:bg-[#B8962E] text-primary-foreground font-semibold px-6 rounded-xl"
        >
          <Link href="/admin/links/new">
            <Plus className="h-4 w-4 mr-2 stroke-[2.5px]" />
            New Link
          </Link>
        </Button>
      </div>

      <div className="bg-[#1C1C1F] border border-[#2A2A2E] rounded-xl overflow-hidden shadow-l2">
        <Table>
          <TableHeader className="bg-[#232327]">
            <TableRow className="hover:bg-transparent border-b border-[#2A2A2E]">
              <TableHead className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-6 py-4">
                Type
              </TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-6 py-4">
                Category
              </TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-6 py-4">
                Label (EN)
              </TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-6 py-4">
                URL
              </TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-6 py-4">
                Status
              </TableHead>
              <TableHead className="text-right text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-6 py-4">
                Control
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {links.map((link) => (
              <TableRow
                key={link.id}
                className="hover:bg-[#2A2A2E]/50 border-b border-[#2A2A2E] transition-colors"
              >
                <TableCell className="px-6 py-4">
                  <Badge
                    variant={link.type === "nav" ? "default" : "outline"}
                    className={
                      link.type === "nav"
                        ? "bg-primary/10 text-primary border-primary/20 hover:bg-primary/20"
                        : "bg-muted/10 text-muted-foreground border-muted/20"
                    }
                  >
                    {link.type.toUpperCase()}
                  </Badge>
                </TableCell>
                <TableCell className="px-6 py-4 text-muted-foreground uppercase text-[10px] font-bold tracking-wider">
                  {link.category || "—"}
                </TableCell>
                <TableCell className="px-6 py-4 font-medium text-foreground">
                  {link.labelEn}
                </TableCell>
                <TableCell className="px-6 py-4">
                  <span className="font-mono text-[11px] text-muted-foreground bg-muted/5 px-2 py-0.5 rounded">
                    {link.url}
                  </span>
                </TableCell>
                <TableCell className="px-6 py-4">
                  <form action={toggleLinkActive.bind(null, link.id)}>
                    <button
                      type="submit"
                      className="group flex items-center gap-2"
                    >
                      {link.isActive ? (
                        <div className="badge-success">
                          <Eye className="h-3 w-3" />
                          <span>ACTIVE</span>
                        </div>
                      ) : (
                        <div className="badge-status bg-muted/20 text-muted-foreground border border-muted/30">
                          <EyeClosed className="h-3 w-3" />
                          <span>INACTIVE</span>
                        </div>
                      )}
                    </button>
                  </form>
                </TableCell>
                <TableCell className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                      className="hover:bg-accent text-foreground h-8 w-8 p-0"
                      title="Edit Link"
                    >
                      <Link href={`/admin/links/${link.id}`}>
                        <EditPencil className="h-4 w-4" />
                      </Link>
                    </Button>
                    <form action={deleteLink.bind(null, link.id)}>
                      <Button
                        variant="ghost"
                        size="sm"
                        type="submit"
                        className="hover:bg-destructive/10 text-destructive h-8 w-8 p-0"
                        title="Delete"
                      >
                        <Trash className="h-4 w-4" />
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
