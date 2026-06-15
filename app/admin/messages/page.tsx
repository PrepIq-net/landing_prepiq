import { prisma } from "@/lib/prisma";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2, CheckCircle, Mail, MailOpen } from "lucide-react";
import { deleteMessage, markAsRead } from "@/lib/actions/message-actions";
import { Badge } from "@/components/ui/badge";

export default async function MessagesManager() {
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Contact Messages</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Sender</TableHead>
            <TableHead>Message</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {messages.map((msg) => (
            <TableRow key={msg.id} className={msg.status === "unread" ? "bg-primary/5" : ""}>
              <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                {msg.createdAt.toLocaleString()}
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className={msg.status === "unread" ? "font-bold" : "font-medium"}>{msg.name}</span>
                  <span className="text-xs text-muted-foreground">{msg.email}</span>
                </div>
              </TableCell>
              <TableCell className="max-w-md">
                <p className={`text-sm ${msg.status === "unread" ? "font-semibold" : "text-muted-foreground"}`}>
                  {msg.message}
                </p>
              </TableCell>
              <TableCell>
                {msg.status === "unread" ? (
                  <Badge className="bg-blue-500 hover:bg-blue-600">
                    <Mail className="h-3 w-3 mr-1" />
                    New
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-muted-foreground">
                    <MailOpen className="h-3 w-3 mr-1" />
                    Read
                  </Badge>
                )}
              </TableCell>
              <TableCell className="text-right flex justify-end gap-2">
                {msg.status === "unread" && (
                  <form action={markAsRead.bind(null, msg.id)}>
                    <Button variant="outline" size="icon" title="Mark as read">
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                  </form>
                )}
                <form action={deleteMessage.bind(null, msg.id)}>
                  <Button variant="outline" size="icon" className="text-destructive hover:bg-destructive/10" title="Delete">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </form>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
