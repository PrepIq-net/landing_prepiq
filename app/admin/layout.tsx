import Link from "next/link";
import { auth, signOut } from "@/auth";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Home, FileText, Link as LinkIcon, Mail, LogOut, LayoutDashboard, Plus } from "lucide-react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-blue-900 to-blue-950 text-white flex flex-col shadow-lg">
        <div className="p-6 border-b border-blue-800">
          <Link href="/admin" className="flex items-center gap-3 font-bold text-2xl">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <LayoutDashboard className="w-6 h-6" />
            </div>
            PrepIQ Admin
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <div className="text-xs font-semibold text-blue-300 uppercase tracking-wider mb-4 px-2">
            Content Management
          </div>
          <Link
            href="/admin"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-800/50 transition-all duration-200 font-medium"
          >
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </Link>
          <Link
            href="/admin/pages"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-800/50 transition-all duration-200 font-medium"
          >
            <FileText className="w-5 h-5" />
            Pages
          </Link>
          <Link
            href="/admin/links"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-800/50 transition-all duration-200 font-medium"
          >
            <LinkIcon className="w-5 h-5" />
            Links
          </Link>
          <Link
            href="/admin/messages"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-800/50 transition-all duration-200 font-medium"
          >
            <Mail className="w-5 h-5" />
            Messages
          </Link>
        </nav>
        <div className="p-4 border-t border-blue-800 space-y-2">
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-blue-200 hover:text-white hover:bg-blue-800/50 transition-all duration-200 text-sm"
          >
            <Home className="w-4 h-4" />
            View Site
          </Link>
          <form
            action={async () => {
              "use server";
              await signOut();
            }}
          >
            <Button
              variant="outline"
              className="w-full justify-start border-blue-700 text-blue-200 hover:bg-blue-800/50 hover:text-white hover:border-blue-600"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </form>
        </div>
        {session?.user?.email && (
          <div className="p-4 border-t border-blue-800 text-xs text-blue-300">
            <div className="font-medium">Logged in as</div>
            <div className="text-blue-200 truncate">{session.user.email}</div>
          </div>
        )}
      </aside>

      {/* Main content */}
      <main className="flex-1 min-h-screen">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
