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
import Link from "next/link";
import {
  EditPencil,
  NavArrowRight,
  Trash,
  Eye,
  EyeClosed,
  Plus,
} from "iconoir-react";
import { deletePage, togglePageActive } from "@/lib/actions/page-actions";

export default async function PagesManager() {
  const pages = await prisma.page.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-display font-semibold tracking-tight text-foreground">
            Pages
          </h1>
          <p className="text-muted-foreground text-sm">
            Configure site hierarchy and content nodes.
          </p>
        </div>
        <Button
          asChild
          className="bg-primary hover:bg-[#B8962E] text-primary-foreground font-semibold px-6 rounded-xl"
        >
          <Link href="/admin/pages/new">
            <Plus className="h-4 w-4 mr-2 stroke-[2.5px]" />
            New Page
          </Link>
        </Button>
      </div>

      <div className="bg-[#1C1C1F] border border-[#2A2A2E] rounded-xl overflow-hidden shadow-l2">
        <Table>
          <TableHeader className="bg-[#232327]">
            <TableRow className="hover:bg-transparent border-b border-[#2A2A2E]">
              <TableHead className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-6 py-4">
                Slug
              </TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-6 py-4">
                Title (EN)
              </TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-6 py-4">
                Title (FR)
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
            {pages.map((page) => (
              <TableRow
                key={page.id}
                className="hover:bg-[#2A2A2E]/50 border-b border-[#2A2A2E] transition-colors"
              >
                <TableCell className="px-6 py-4">
                  <span className="font-mono text-xs text-primary bg-primary/5 px-2 py-1 rounded border border-primary/10">
                    /{page.slug}
                  </span>
                </TableCell>
                <TableCell className="px-6 py-4 font-medium text-foreground">
                  {page.titleEn}
                </TableCell>
                <TableCell className="px-6 py-4 text-muted-foreground">
                  {page.titleFr}
                </TableCell>
                <TableCell className="px-6 py-4">
                  <form action={togglePageActive.bind(null, page.id)}>
                    <button
                      type="submit"
                      className="group flex items-center gap-2"
                    >
                      {page.isActive ? (
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
                      title="Edit Structure"
                    >
                      <Link href={`/admin/pages/${page.id}/sections`}>
                        <NavArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                      className="hover:bg-accent text-foreground h-8 w-8 p-0"
                      title="Edit Content"
                    >
                      <Link href={`/admin/pages/${page.id}`}>
                        <EditPencil className="h-4 w-4" />
                      </Link>
                    </Button>
                    <form action={deletePage.bind(null, page.id)}>
                      <Button
                        variant="ghost"
                        size="sm"
                        type="submit"
                        className="hover:bg-destructive/10 text-destructive h-8 w-8 p-0"
                        title="Purge"
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
