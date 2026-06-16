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
import { Trash, Check, Mail } from "iconoir-react";
import { deleteMessage, markAsRead } from "@/lib/actions/message-actions";
import { Badge } from "@/components/ui/badge";

export default async function MessagesManager() {
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="text-3xl font-display font-semibold tracking-tight text-foreground">
          Communications
        </h1>
        <p className="text-muted-foreground text-sm">
          Operator transmission logs and contact requests.
        </p>
      </div>

      <div className="bg-[#1C1C1F] border border-[#2A2A2E] rounded-xl overflow-hidden shadow-l2">
        <Table>
          <TableHeader className="bg-[#232327]">
            <TableRow className="hover:bg-transparent border-b border-[#2A2A2E]">
              <TableHead className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-6 py-4">
                Timestamp
              </TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-6 py-4">
                Origin
              </TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-6 py-4">
                Payload
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
            {messages.map((msg) => (
              <TableRow
                key={msg.id}
                className={`transition-colors duration-150 border-b border-[#2A2A2E] ${
                  msg.status === "unread"
                    ? "bg-primary/[0.03] hover:bg-primary/[0.06]"
                    : "hover:bg-[#2A2A2E]/50"
                }`}
              >
                <TableCell className="px-6 py-4 whitespace-nowrap text-[11px] font-mono text-muted-foreground">
                  {msg.createdAt.toLocaleString()}
                </TableCell>
                <TableCell className="px-6 py-4">
                  <div className="flex flex-col gap-0.5">
                    <span
                      className={`text-sm ${msg.status === "unread" ? "font-bold text-foreground" : "font-medium text-muted-foreground"}`}
                    >
                      {msg.name}
                    </span>
                    <span className="text-[11px] font-mono text-muted-foreground/60">
                      {msg.email}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4 max-w-md">
                  <p
                    className={`text-sm leading-relaxed ${msg.status === "unread" ? "font-medium text-foreground" : "text-muted-foreground"}`}
                  >
                    {msg.message}
                  </p>
                </TableCell>
                <TableCell className="px-6 py-4">
                  {msg.status === "unread" ? (
                    <div className="badge-warning">
                      <Mail className="h-3 w-3" />
                      <span>PENDING</span>
                    </div>
                  ) : (
                    <div className="badge-status bg-muted/10 text-muted-foreground border border-muted/20">
                      <Check className="h-3 w-3" />
                      <span>PROCESSED</span>
                    </div>
                  )}
                </TableCell>
                <TableCell className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    {msg.status === "unread" && (
                      <form action={markAsRead.bind(null, msg.id)}>
                        <Button
                          variant="ghost"
                          size="sm"
                          type="submit"
                          className="hover:bg-success/10 text-success h-8 w-8 p-0"
                          title="Acknowledge"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      </form>
                    )}
                    <form action={deleteMessage.bind(null, msg.id)}>
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
