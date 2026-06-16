import Link from "next/link";
import { auth, signOut } from "@/auth";
import { Button } from "@/components/ui/button";
import {
  ViewGrid,
  Page,
  Link as LinkIcon,
  Mail,
  LogOut,
  Home,
  Plus,
  User,
  Clock,
  Calendar,
} from "iconoir-react";
import { prisma } from "@/lib/prisma";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // If no session, just render children (which will be the login page)
  if (!session) {
    return <div className="min-h-screen bg-background">{children}</div>;
  }

  // Get current user's role
  const currentUser = await prisma.user.findUnique({
    where: { email: session.user?.email! },
  });

  return (
    <div className="flex min-h-screen bg-background text-foreground font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border flex flex-col shadow-l2">
        <div className="p-6 border-b border-border">
          <Link
            href="/admin"
            className="flex items-center gap-3 font-display font-bold text-xl tracking-tight text-primary"
          >
            <div className="w-8 h-8 bg-primary/10 rounded flex items-center justify-center border border-primary/20">
              <ViewGrid className="w-5 h-5 text-primary" />
            </div>
            PrepIQ Admin
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1.5">
          <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3 px-3">
            Operational Control
          </div>
          <Link
            href="/admin"
            className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-accent hover:text-accent-foreground transition-all duration-200 text-sm font-medium"
          >
            <ViewGrid className="w-4.5 h-4.5 opacity-70" />
            Dashboard
          </Link>
          <Link
            href="/admin/pages"
            className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-accent hover:text-accent-foreground transition-all duration-200 text-sm font-medium"
          >
            <Page className="w-4.5 h-4.5 opacity-70" />
            Pages
          </Link>
          <Link
            href="/admin/links"
            className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-accent hover:text-accent-foreground transition-all duration-200 text-sm font-medium"
          >
            <LinkIcon className="w-4.5 h-4.5 opacity-70" />
            Links
          </Link>
          <Link
            href="/admin/messages"
            className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-accent hover:text-accent-foreground transition-all duration-200 text-sm font-medium"
          >
            <Mail className="w-4.5 h-4.5 opacity-70" />
            Communications
          </Link>
          <Link
            href="/admin/meetings"
            className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-accent hover:text-accent-foreground transition-all duration-200 text-sm font-medium"
          >
            <Calendar className="w-4.5 h-4.5 opacity-70" />
            Meetings
          </Link>

          {currentUser?.role === "ADMIN" && (
            <>
              <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3 mt-6 px-3">
                System Administration
              </div>
              <Link
                href="/admin/users"
                className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-accent hover:text-accent-foreground transition-all duration-200 text-sm font-medium"
              >
                <User className="w-4.5 h-4.5 opacity-70" />
                Staff
              </Link>
              <Link
                href="/admin/activity"
                className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-accent hover:text-accent-foreground transition-all duration-200 text-sm font-medium"
              >
                <Clock className="w-4.5 h-4.5 opacity-70" />
                Activity Log
              </Link>
            </>
          )}
        </nav>

        <div className="p-4 border-t border-border space-y-1.5">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-200 text-sm"
          >
            <Home className="w-4.5 h-4.5 opacity-70" />
            View Site
          </Link>
          <form
            action={async () => {
              "use server";
              await signOut();
            }}
          >
            <button
              type="submit"
              className="flex w-full items-center gap-3 px-3 py-2.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-all duration-200 text-sm font-medium"
            >
              <LogOut className="w-4.5 h-4.5 opacity-70" />
              Logout
            </button>
          </form>
        </div>

        <div className="p-4 border-t border-border flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary border border-primary/20">
            {session.user?.email?.[0].toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold truncate text-foreground">
              {session.user?.email?.split("@")[0]}
            </div>
            <div className="text-[10px] text-muted-foreground truncate uppercase tracking-wider">
              Administrator
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-h-screen overflow-y-auto">
        <div className="max-w-[1440px] mx-auto p-8">{children}</div>
      </main>
    </div>
  );
}
