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
  deleteMeeting,
  updateMeetingStatus,
  updateMeetingLink,
} from "@/lib/actions/meeting-actions";
import { MeetingStatus } from "@prisma/client";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

function MeetingLinkEditor({
  meetingId,
  currentLink,
}: {
  meetingId: string;
  currentLink?: string | null;
}) {
  return (
    <form action={updateMeetingLink} className="flex gap-1">
      <input type="hidden" name="meetingId" value={meetingId} />
      <input
        type="text"
        name="meetingLink"
        defaultValue={currentLink || ""}
        placeholder="Add meeting link"
        className="h-8 bg-[#141416] border border-[#2A2A2E] rounded px-2 text-sm text-foreground"
      />
      <Button variant="ghost" size="sm" type="submit" className="h-8 text-xs">
        Save
      </Button>
    </form>
  );
}

function UpdateStatusButton({
  meetingId,
  status,
  label,
}: {
  meetingId: string;
  status: MeetingStatus;
  label: string;
}) {
  return (
    <form
      action={async (formData) => {
        await updateMeetingStatus(meetingId, status);
      }}
    >
      <Button
        variant="ghost"
        size="sm"
        type="submit"
        className="hover:bg-accent text-muted-foreground h-8 text-xs px-2"
      >
        {label}
      </Button>
    </form>
  );
}

export default async function MeetingsPage() {
  const session = await auth();
  const currentUser = await prisma.user.findUnique({
    where: { email: session?.user?.email! },
  });

  if (!currentUser) {
    return notFound();
  }

  const meetings = await prisma.meeting.findMany({
    orderBy: { createdAt: "desc" },
  });

  const getStatusBadge = (status: MeetingStatus) => {
    switch (status) {
      case MeetingStatus.PENDING:
        return (
          <div className="badge-warning">
            <span>PENDING</span>
          </div>
        );
      case MeetingStatus.CONFIRMED:
        return (
          <div className="badge-info">
            <span>CONFIRMED</span>
          </div>
        );
      case MeetingStatus.COMPLETED:
        return (
          <div className="badge-success">
            <span>COMPLETED</span>
          </div>
        );
      case MeetingStatus.CANCELLED:
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
          Meetings
        </h1>
        <p className="text-muted-foreground text-sm">
          Manage scheduled meetings and links
        </p>
      </div>

      <div className="bg-[#1C1C1F] border border-[#2A2A2E] rounded-xl overflow-hidden shadow-l2">
        <Table>
          <TableHeader className="bg-[#232327]">
            <TableRow className="hover:bg-transparent border-b border-[#2A2A2E]">
              <TableHead className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-6 py-4">
                Date & Time
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
                Meeting Link
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
            {meetings.map((meeting) => (
              <TableRow
                key={meeting.id}
                className="hover:bg-[#2A2A2E]/50 border-b border-[#2A2A2E] transition-colors"
              >
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                  {format(meeting.date, "MMM d, yyyy h:mm a")}
                </TableCell>
                <TableCell className="px-6 py-4 text-sm text-foreground">
                  {meeting.name}
                </TableCell>
                <TableCell className="px-6 py-4 text-sm text-muted-foreground font-mono">
                  {meeting.email}
                </TableCell>
                <TableCell className="px-6 py-4 text-sm text-muted-foreground">
                  {meeting.company || "—"}
                </TableCell>
                <TableCell className="px-6 py-4">
                  {meeting.meetingLink ? (
                    <div className="flex items-center gap-2">
                      <Link
                        href={meeting.meetingLink}
                        target="_blank"
                        className="text-primary text-sm hover:underline flex items-center gap-1"
                      >
                        Open Link
                      </Link>
                    </div>
                  ) : (
                    <span className="text-muted-foreground text-xs">
                      No link
                    </span>
                  )}
                </TableCell>
                <TableCell className="px-6 py-4">
                  {getStatusBadge(meeting.status)}
                </TableCell>
                <TableCell className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2 flex-col items-end">
                    <div className="flex gap-1">
                      <UpdateStatusButton
                        meetingId={meeting.id}
                        status={MeetingStatus.CONFIRMED}
                        label="Confirm"
                      />
                      <UpdateStatusButton
                        meetingId={meeting.id}
                        status={MeetingStatus.COMPLETED}
                        label="Complete"
                      />
                      <UpdateStatusButton
                        meetingId={meeting.id}
                        status={MeetingStatus.CANCELLED}
                        label="Cancel"
                      />
                    </div>
                    <MeetingLinkEditor
                      meetingId={meeting.id}
                      currentLink={meeting.meetingLink}
                    />
                    {currentUser.role === "ADMIN" && (
                      <form action={deleteMeeting}>
                        <input
                          type="hidden"
                          name="meetingId"
                          value={meeting.id}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          type="submit"
                          className="hover:bg-destructive/10 text-destructive h-8 w-8 p-0 mt-1"
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
