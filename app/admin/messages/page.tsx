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
import { Trash2, CheckCircle, Mail, MailOpen } from "lucide-react";
import { deleteMessage, markAsRead } from "@/lib/actions/message-actions";
import { Badge } from "@/components/ui/badge";

export default async function MessagesManager() {
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Contact Messages</h1>
        <p className="text-gray-500 mt-1">Manage incoming contact requests</p>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="font-semibold text-gray-900">
                Date
              </TableHead>
              <TableHead className="font-semibold text-gray-900">
                Sender
              </TableHead>
              <TableHead className="font-semibold text-gray-900">
                Message
              </TableHead>
              <TableHead className="font-semibold text-gray-900">
                Status
              </TableHead>
              <TableHead className="text-right font-semibold text-gray-900">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {messages.map((msg) => (
              <TableRow
                key={msg.id}
                className={`transition-colors duration-150 ${
                  msg.status === "unread"
                    ? "bg-blue-50 hover:bg-blue-100"
                    : "hover:bg-gray-50"
                }`}
              >
                <TableCell className="whitespace-nowrap text-xs text-gray-500">
                  {msg.createdAt.toLocaleString()}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span
                      className={
                        msg.status === "unread"
                          ? "font-bold text-gray-900"
                          : "font-medium text-gray-700"
                      }
                    >
                      {msg.name}
                    </span>
                    <span className="text-xs text-gray-500">{msg.email}</span>
                  </div>
                </TableCell>
                <TableCell className="max-w-md">
                  <p
                    className={`text-sm ${msg.status === "unread" ? "font-semibold text-gray-900" : "text-gray-600"}`}
                  >
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
                    <Badge variant="outline" className="text-gray-600">
                      <MailOpen className="h-3 w-3 mr-1" />
                      Read
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    {msg.status === "unread" && (
                      <form action={markAsRead.bind(null, msg.id)}>
                        <Button
                          variant="outline"
                          size="sm"
                          type="submit"
                          title="Mark as read"
                          className="border-green-200 text-green-600 hover:bg-green-50 hover:text-green-700"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Mark as Read
                        </Button>
                      </form>
                    )}
                    <form action={deleteMessage.bind(null, msg.id)}>
                      <Button
                        variant="outline"
                        size="sm"
                        type="submit"
                        className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
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
