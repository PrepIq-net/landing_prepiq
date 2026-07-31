import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import TestimonialForm from "../TestimonialForm";

export const dynamic = "force-dynamic";

export default async function EditTestimonialPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const testimonial = await prisma.testimonial.findUnique({ where: { id } });
  if (!testimonial) notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin/testimonials">← Back</Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Edit testimonial
          </h1>
          <p className="text-muted-foreground text-sm">
            {testimonial.name} — {testimonial.company}
          </p>
        </div>
      </div>

      <TestimonialForm
        testimonial={{
          id: testimonial.id,
          quoteEn: testimonial.quoteEn,
          quoteFr: testimonial.quoteFr,
          name: testimonial.name,
          role: testimonial.role,
          company: testimonial.company,
          metricEn: testimonial.metricEn,
          metricFr: testimonial.metricFr,
          isPublished: testimonial.isPublished,
          sortOrder: testimonial.sortOrder,
        }}
      />
    </div>
  );
}
