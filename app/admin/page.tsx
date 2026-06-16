import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Link, MessageSquare } from "lucide-react";

export default async function AdminDashboard() {
  const [pagesCount, linksCount, messagesCount] = await Promise.all([
    prisma.page.count(),
    prisma.link.count(),
    prisma.contactMessage.count({ where: { status: "unread" } }),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-2">Welcome back! Here's what's happening with your content.</p>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-lg">
            <CardTitle className="text-sm font-medium text-blue-900">Pages</CardTitle>
            <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center">
              <FileText className="h-5 w-5 text-blue-700" />
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="text-4xl font-bold text-gray-900">{pagesCount}</div>
            <p className="text-sm text-gray-500 mt-1">Total pages created</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-purple-50 to-purple-100 rounded-t-lg">
            <CardTitle className="text-sm font-medium text-purple-900">Links</CardTitle>
            <div className="w-10 h-10 bg-purple-200 rounded-full flex items-center justify-center">
              <Link className="h-5 w-5 text-purple-700" />
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="text-4xl font-bold text-gray-900">{linksCount}</div>
            <p className="text-sm text-gray-500 mt-1">Navigation & footer links</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-amber-50 to-amber-100 rounded-t-lg">
            <CardTitle className="text-sm font-medium text-amber-900">Unread Messages</CardTitle>
            <div className="w-10 h-10 bg-amber-200 rounded-full flex items-center justify-center">
              <MessageSquare className="h-5 w-5 text-amber-700" />
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="text-4xl font-bold text-gray-900">{messagesCount}</div>
            <p className="text-sm text-gray-500 mt-1">Requires your attention</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
