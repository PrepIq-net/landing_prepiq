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
import { EditPencil, OpenNewWindow } from "iconoir-react";

export default async function LegalDocumentsManager() {
  const docs = await prisma.legalDocument.findMany({
    orderBy: { slug: "asc" },
    select: {
      id: true,
      slug: true,
      titleEn: true,
      titleFr: true,
      version: true,
      effectiveDate: true,
      updatedAt: true,
    },
  });

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="text-3xl font-display font-semibold tracking-tight text-foreground">
          Legal Documents
        </h1>
        <p className="text-muted-foreground text-sm">
          Single source of truth for the privacy policy, terms of service, and
          security page — served to the landing site, web dashboard, and
          mobile app.
        </p>
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
                Version
              </TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-6 py-4">
                Effective
              </TableHead>
              <TableHead className="text-right text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-6 py-4">
                Control
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {docs.map((doc) => (
              <TableRow
                key={doc.id}
                className="hover:bg-[#2A2A2E]/50 border-b border-[#2A2A2E] transition-colors"
              >
                <TableCell className="px-6 py-4">
                  <span className="font-mono text-xs text-primary bg-primary/5 px-2 py-1 rounded border border-primary/10">
                    /{doc.slug}
                  </span>
                </TableCell>
                <TableCell className="px-6 py-4 font-medium text-foreground">
                  {doc.titleEn}
                </TableCell>
                <TableCell className="px-6 py-4 text-muted-foreground font-mono text-xs">
                  v{doc.version}
                </TableCell>
                <TableCell className="px-6 py-4 text-muted-foreground text-xs">
                  {doc.effectiveDate.toISOString().slice(0, 10)}
                </TableCell>
                <TableCell className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                      className="hover:bg-accent text-foreground h-8 w-8 p-0"
                      title="View Live"
                    >
                      <Link href={`/${doc.slug}`} target="_blank">
                        <OpenNewWindow className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                      className="hover:bg-accent text-foreground h-8 w-8 p-0"
                      title="Edit Content"
                    >
                      <Link href={`/admin/legal/${doc.id}`}>
                        <EditPencil className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {docs.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="px-6 py-8 text-center text-sm text-muted-foreground"
                >
                  No legal documents yet. Run{" "}
                  <span className="font-mono text-xs">npm run db:seed:legal</span>{" "}
                  to bootstrap them.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
