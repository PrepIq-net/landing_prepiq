import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import ApplicationRow from "./ApplicationRow";

export const dynamic = "force-dynamic";

export default async function ApplicationsInbox({
  searchParams,
}: {
  searchParams: Promise<{ role?: string; status?: string }>;
}) {
  const { role: roleFilter, status } = await searchParams;

  const [roles, applications] = await Promise.all([
    prisma.jobRole.findMany({
      orderBy: { titleEn: "asc" },
      select: { id: true, titleEn: true },
    }),
    prisma.jobApplication.findMany({
      where: {
        ...(roleFilter ? { roleId: roleFilter } : {}),
        ...(status ? { status: status as any } : {}),
      },
      orderBy: { createdAt: "desc" },
      include: { role: { select: { titleEn: true } } },
    }),
  ]);

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin/careers">← Back</Link>
        </Button>
        <div className="space-y-1">
          <h1 className="text-3xl font-display font-semibold tracking-tight text-foreground">
            Applications
          </h1>
          <p className="text-muted-foreground text-sm">
            {applications.length} application{applications.length === 1 ? "" : "s"}
            {roleFilter ? " for this role" : ""}.
          </p>
        </div>
      </div>

      {/* Role filter */}
      <div className="flex flex-wrap gap-2">
        <Button variant={!roleFilter ? "default" : "outline"} size="sm" asChild>
          <Link href="/admin/careers/applications">All roles</Link>
        </Button>
        {roles.map((r) => (
          <Button
            key={r.id}
            variant={roleFilter === r.id ? "default" : "outline"}
            size="sm"
            asChild
          >
            <Link href={`/admin/careers/applications?role=${r.id}`}>{r.titleEn}</Link>
          </Button>
        ))}
      </div>

      <div className="space-y-3">
        {applications.map((a) => (
          <ApplicationRow
            key={a.id}
            app={{
              id: a.id,
              refNo: a.refNo,
              name: a.name,
              email: a.email,
              resumeUrl: a.resumeUrl,
              linkedinUrl: a.linkedinUrl,
              coverNote: a.coverNote,
              status: a.status,
              roleTitle: a.role.titleEn,
              createdAt: a.createdAt.toISOString(),
            }}
          />
        ))}
        {applications.length === 0 && (
          <div className="rounded-xl border border-[#2A2A2E] bg-[#1C1C1F] p-10 text-center text-sm text-muted-foreground">
            No applications yet.
          </div>
        )}
      </div>
    </div>
  );
}
