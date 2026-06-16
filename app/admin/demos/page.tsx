import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { notFound } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash } from "iconoir-react";
import {
  deleteDemoBooking,
  updateDemoBookingStatus,
} from "@/lib/actions/demo-booking-actions";
import { DemoStatus } from "@prisma/client";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

export default async function DemosPage() {
  const session = await auth();
  const currentUser = await prisma.user.findUnique({
    where: { email: session?.user?.email! },
  });

  if (!currentUser) {
    return notFound();
  }

  const demos = await prisma.demoBooking.findMany({
    orderBy: { createdAt: "desc" },
  });

  const getStatusBadge = (status: DemoStatus) => {
    switch (status) {
      case DemoStatus.PENDING:
        return (
          <div className="badge-warning">
            <span>PENDING</span>
          </div>
        );
      case DemoStatus.CONFIRMED:
        return (
          <div className="badge-info">
            <span>CONFIRMED</span>
          </div>
        );
      case DemoStatus.COMPLETED:
        return (
          <div className="badge-success">
            <span>COMPLETED</span>
          </div>
        );
      case DemoStatus.CANCELLED:
        return (
          <div className="badge-critical">
            <span>CANCELLED</span>
          </div>
        );
    }
  };

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="text-3xl font-display font-semibold tracking-tight text-foreground">
          Demos
        </h1>
        <p className="text-muted-foreground text-sm">
          Manage demo booking requests
        </p>
      </div>

      <div className="bg-[#1C1C1F] border border-[#2A2A2E] rounded-xl overflow-hidden shadow-l2">
        <Table>
          <TableHeader className="bg-[#232327]">
            <TableRow className="hover:bg-transparent border-b border-[#2A2A2E]">
              <TableHead className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-6 py-4">
                Date
              </TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-6 py-4">
                Name
              </TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-6 py-4">
                Email
              </TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-6 py-4">
                Company
              </TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-6 py-4">
                Status
              </TableHead>
              <TableHead className="text-right text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-6 py-4">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {demos.map((demo) => (
              <TableRow
                key={demo.id}
                className="hover:bg-[#2A2A2E]/50 border-b border-[#2A2A2E] transition-colors"
              >
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                  {format(demo.date, "MMM d, yyyy h:mm a")}
                </TableCell>
                <TableCell className="px-6 py-4 text-sm text-foreground">
                  {demo.name}
                </TableCell>
                <TableCell className="px-6 py-4 text-sm text-muted-foreground font-mono">
                  {demo.email}
                </TableCell>
                <TableCell className="px-6 py-4 text-sm text-muted-foreground">
                  {demo.company || "—"}
                </TableCell>
                <TableCell className="px-6 py-4">
                  {getStatusBadge(demo.status)}
                </TableCell>
                <TableCell className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <div className="flex gap-1">
                      <form
                        action={updateDemoBookingStatus.bind(
                          null,
                          demo.id,
                          DemoStatus.CONFIRMED,
                        )}
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          type="submit"
                          className="hover:bg-accent text-muted-foreground h-8 text-xs px-2"
                        >
                          Confirm
                        </Button>
                      </form>
                      <form
                        action={updateDemoBookingStatus.bind(
                          null,
                          demo.id,
                          DemoStatus.COMPLETED,
                        )}
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          type="submit"
                          className="hover:bg-accent text-muted-foreground h-8 text-xs px-2"
                        >
                          Complete
                        </Button>
                      </form>
                      <form
                        action={updateDemoBookingStatus.bind(
                          null,
                          demo.id,
                          DemoStatus.CANCELLED,
                        )}
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          type="submit"
                          className="hover:bg-accent text-muted-foreground h-8 text-xs px-2"
                        >
                          Cancel
                        </Button>
                      </form>
                    </div>
                    {currentUser.role === "ADMIN" && (
                      <form action={deleteDemoBooking.bind(null, demo.id)}>
                        <Button
                          variant="ghost"
                          size="sm"
                          type="submit"
                          className="hover:bg-destructive/10 text-destructive h-8 w-8 p-0"
                          title="Delete"
                        >
                          <Trash className="w-4 h-4" />
                        </Button>
                      </form>
                    )}
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
