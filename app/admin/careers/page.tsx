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
import { Plus, HeadsetHelp } from "iconoir-react";
import RoleRowActions from "./RoleRowActions";

export const dynamic = "force-dynamic";

export default async function CareersManager() {
  const [roles, applicationCount] = await Promise.all([
    prisma.jobRole.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      select: {
        id: true,
        slug: true,
        titleEn: true,
        department: true,
        location: true,
        employmentType: true,
        isPublished: true,
        _count: { select: { applications: true } },
      },
    }),
    prisma.jobApplication.count(),
  ]);

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-display font-semibold tracking-tight text-foreground">
            Careers
          </h1>
          <p className="text-muted-foreground text-sm">
            Create and publish job roles shown on the public /about page, and
            review applications.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/admin/careers/applications">
              <HeadsetHelp className="mr-2 h-4 w-4" />
              Applications ({applicationCount})
            </Link>
          </Button>
          <Button asChild className="bg-primary text-primary-foreground hover:bg-[#B8962E]">
            <Link href="/admin/careers/new">
              <Plus className="mr-2 h-4 w-4" />
              New role
            </Link>
          </Button>
        </div>
      </div>

      <div className="bg-[#1C1C1F] border border-[#2A2A2E] rounded-xl overflow-hidden shadow-l2">
        <Table>
          <TableHeader className="bg-[#232327]">
            <TableRow className="hover:bg-transparent border-b border-[#2A2A2E]">
              <TableHead className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Title</TableHead>
              <TableHead className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Department</TableHead>
              <TableHead className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Location</TableHead>
              <TableHead className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Applications</TableHead>
              <TableHead className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Status</TableHead>
              <TableHead className="px-6 py-4 text-right text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Control</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {roles.map((role) => (
              <TableRow key={role.id} className="hover:bg-[#2A2A2E]/50 border-b border-[#2A2A2E] transition-colors">
                <TableCell className="px-6 py-4">
                  <div className="font-medium text-foreground">{role.titleEn}</div>
                  <div className="font-mono text-xs text-muted-foreground">/careers/{role.slug}</div>
                </TableCell>
                <TableCell className="px-6 py-4 text-sm text-muted-foreground">{role.department}</TableCell>
                <TableCell className="px-6 py-4 text-sm text-muted-foreground">{role.location}</TableCell>
                <TableCell className="px-6 py-4 text-sm text-muted-foreground">{role._count.applications}</TableCell>
                <TableCell className="px-6 py-4">
                  {role.isPublished ? (
                    <Badge className="bg-success/15 text-success border border-success/20">Published</Badge>
                  ) : (
                    <Badge variant="outline">Draft</Badge>
                  )}
                </TableCell>
                <TableCell className="px-6 py-4 text-right">
                  <RoleRowActions id={role.id} slug={role.slug} isPublished={role.isPublished} />
                </TableCell>
              </TableRow>
            ))}
            {roles.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="px-6 py-10 text-center text-sm text-muted-foreground">
                  No roles yet. Create your first one, or run{" "}
                  <span className="font-mono text-xs">npm run db:seed:careers</span> to bootstrap samples.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
