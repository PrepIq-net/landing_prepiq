import { prisma } from "@/lib/prisma";
import Link from "next/link";
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
import { Plus, Quote } from "iconoir-react";
import TestimonialRowActions from "./TestimonialRowActions";

export const dynamic = "force-dynamic";

export default async function TestimonialsManager() {
  const testimonials = await prisma.testimonial.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });

  const publishedCount = testimonials.filter((t) => t.isPublished).length;

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-display font-semibold tracking-tight text-foreground">
            Testimonials
          </h1>
          <p className="text-muted-foreground text-sm max-w-[62ch]">
            Real customer quotes shown on the home page. The site has no
            placeholder quotes — with nothing published here, the home page
            simply omits the testimonials section.
          </p>
        </div>
        <Button
          asChild
          className="bg-primary text-primary-foreground hover:bg-[#B8962E]"
        >
          <Link href="/admin/testimonials/new">
            <Plus className="mr-2 h-4 w-4" />
            New testimonial
          </Link>
        </Button>
      </div>

      {testimonials.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card px-8 py-14 text-center">
          <div className="mx-auto mb-5 flex h-11 w-11 items-center justify-center rounded-xl border border-primary/25 bg-primary/[0.08]">
            <Quote className="h-5 w-5 text-primary" />
          </div>
          <p className="font-medium text-foreground">No testimonials yet</p>
          <p className="mt-2 text-sm text-muted-foreground max-w-[46ch] mx-auto">
            Add one as soon as a customer gives written permission to be quoted.
            Until then the home page leaves the section out entirely.
          </p>
          <Button variant="outline" asChild className="mt-6">
            <Link href="/admin/testimonials/new">Add the first one</Link>
          </Button>
        </div>
      ) : (
        <>
          <p className="text-xs text-muted-foreground">
            {publishedCount} of {testimonials.length} published and live on the
            home page.
          </p>
          <div className="bg-card border border-border rounded-xl overflow-hidden shadow-l2">
            <Table>
              <TableHeader className="bg-accent/40">
                <TableRow className="hover:bg-transparent border-b border-border">
                  <TableHead className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    Who
                  </TableHead>
                  <TableHead className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    Quote
                  </TableHead>
                  <TableHead className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    Figure
                  </TableHead>
                  <TableHead className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    Status
                  </TableHead>
                  <TableHead className="px-6 py-4 text-right text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    Control
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {testimonials.map((item) => (
                  <TableRow
                    key={item.id}
                    className="hover:bg-accent/40 border-b border-border transition-colors"
                  >
                    <TableCell className="px-6 py-4">
                      <div className="font-medium text-foreground">
                        {item.name}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {item.role}, {item.company}
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4 max-w-[380px]">
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {item.quoteEn}
                      </p>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-sm text-muted-foreground">
                      {item.metricEn || "—"}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      {item.isPublished ? (
                        <Badge className="bg-success/20 text-success border-success/30">
                          Live
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="bg-muted text-muted-foreground"
                        >
                          Draft
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-right">
                      <TestimonialRowActions
                        id={item.id}
                        isPublished={item.isPublished}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
      )}
    </div>
  );
}
