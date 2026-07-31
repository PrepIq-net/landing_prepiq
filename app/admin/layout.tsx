import Link from "next/link";
import { auth, signOut } from "@/auth";
import { ViewGrid, LogOut, Home } from "iconoir-react";
import { prisma } from "@/lib/prisma";
import { AdminNav } from "@/components/AdminNav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    return <div className="min-h-screen bg-background">{children}</div>;
  }

  const currentUser = await prisma.user.findUnique({
    where: { email: session.user?.email! },
  });

  const isAdmin = currentUser?.role === "ADMIN";

  return (
    <div className="flex min-h-screen bg-background text-foreground font-sans">
      {/*
        Pinned to the viewport at exactly one screen tall, so a long page in the
        main column can never push the sign-out button and user chip out of
        reach — only the nav list in the middle scrolls.
      */}
      <aside className="sticky top-0 h-screen w-64 shrink-0 bg-card border-r border-border flex flex-col shadow-l2">
        {/* Logo */}
        <div className="p-5 border-b border-border shrink-0">
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

        {/* Nav — client component for active state */}
        <AdminNav isAdmin={isAdmin} />

        {/* Footer actions */}
        <div className="p-3 border-t border-border space-y-1 shrink-0">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-200 text-sm"
          >
            <Home className="w-4 h-4 opacity-70" />
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
              className="flex w-full items-center gap-3 px-3 py-2 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-all duration-200 text-sm font-medium"
            >
              <LogOut className="w-4 h-4 opacity-70" />
              Logout
            </button>
          </form>
        </div>

        {/* User identity */}
        <div className="p-3 border-t border-border flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary border border-primary/20">
            {session.user?.email?.[0].toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold truncate text-foreground">
              {session.user?.email?.split("@")[0]}
            </div>
            <div className="text-[10px] text-muted-foreground truncate uppercase tracking-wider">
              {isAdmin ? "Admin" : currentUser?.role ?? "Staff"}
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      {/* min-w-0 so wide tables scroll inside the column instead of stretching it */}
      <main className="flex-1 min-w-0">
        <div className="max-w-[1440px] mx-auto p-8">{children}</div>
      </main>
    </div>
  );
}
