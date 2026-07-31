import Link from "next/link";
import { Button } from "@/components/ui/button";
import TestimonialForm from "../TestimonialForm";

export default function NewTestimonialPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin/testimonials">← Back</Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">New testimonial</h1>
          <p className="text-muted-foreground text-sm">
            Add a quote from a real customer.
          </p>
        </div>
      </div>

      <TestimonialForm />
    </div>
  );
}
