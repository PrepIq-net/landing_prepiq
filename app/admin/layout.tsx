import Link from "next/link";
import { auth, signOut } from "@/auth";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Home, FileText, Link as LinkIcon, Mail, LogOut, LayoutDashboard } from "lucide-react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <div className="flex min-h-screen">
      {/* Sidebar - Django style */}
      <aside className="w-64 bg-slate-900 text-slate-200 flex flex-col">
        <div className="p-4 border-b border-slate-800">
          <Link href="/admin" className="flex items-center gap-2 font-bold text-xl text-white">
            <LayoutDashboard className="w-6 h-6" />
            PrepIQ Admin
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Content
          </div>
          <Link
            href="/admin/pages"
            className="flex items-center gap-2 px-3 py-2 rounded hover:bg-slate-800 transition-colors"
          >
            <FileText className="w-4 h-4" />
            Pages
          </Link>
          <Link
            href="/admin/links"
            className="flex items-center gap-2 px-3 py-2 rounded hover:bg-slate-800 transition-colors"
          >
            <LinkIcon className="w-4 h-4" />
            Links
          </Link>
          <Link
            href="/admin/messages"
            className="flex items-center gap-2 px-3 py-2 rounded hover:bg-slate-800 transition-colors"
          >
            <Mail className="w-4 h-4" />
            Messages
          </Link>
        </nav>
        <div className="p-4 border-t border-slate-800">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-white mb-2"
          >
            <Home className="w-4 h-4" />
            View Site
          </Link>
          <form
            action={async () => {
              "use server";
              await signOut();
            }}
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-white cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <button type="submit">Logout</button>
          </form>
        </div>
        {session?.user?.email && (
          <div className="p-4 border-t border-slate-800 text-xs text-slate-500">
            Logged in as {session.user.email}
          </div>
        )}
      </aside>

      {/* Main content */}
      <main className="flex-1 bg-slate-50 min-h-screen">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-8 py-4">
          <div className="flex items-center gap-4 text-sm">
            <Link href="/admin" className="text-slate-500 hover:text-slate-700">
              Home
            </Link>
          </div>
        </header>
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
