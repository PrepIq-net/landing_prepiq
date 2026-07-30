import { notFound } from "next/navigation";

import { auth } from "@/auth";
import { djangoAdminFetch } from "@/lib/django-api";
import { prisma } from "@/lib/prisma";
import { PaymentGatewaysManager } from "@/components/admin/PaymentGatewaysManager";
import type { PaymentGatewayConfig } from "@/types/admin-plans";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Payment Gateways — PrepIQ Admin",
};

export default async function PaymentGatewaysPage() {
  const session = await auth();
  const currentUser = await prisma.user.findUnique({
    where: { email: session?.user?.email! },
  });
  if (!currentUser || currentUser.role !== "ADMIN") return notFound();

  const email = session!.user!.email!;

  let gateways: PaymentGatewayConfig[] = [];
  let error: string | null = null;

  try {
    const response = await djangoAdminFetch<{ results: PaymentGatewayConfig[] }>(
      "/api/mgmt/payment-gateways/",
      email,
    );
    gateways = response.results;
  } catch (e) {
    error = e instanceof Error ? e.message : "Failed to load payment gateways";
  }

  if (error) {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-display font-semibold tracking-tight text-foreground">
          Payment Gateways
        </h1>
        <div
          role="alert"
          className="rounded-xl border border-destructive/30 bg-destructive/10 p-6"
        >
          <p className="text-foreground font-medium">
            Could not reach the PrepIQ backend
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Gateway configuration lives in Django. Check that{" "}
            <code className="font-mono text-xs">DJANGO_API_URL</code> and{" "}
            <code className="font-mono text-xs">ADMIN_SERVICE_KEY</code> are set
            and that the backend is running.
          </p>
          <p className="text-xs text-muted-foreground/70 mt-3 font-mono break-all">
            {error}
          </p>
        </div>
      </div>
    );
  }

  return <PaymentGatewaysManager gateways={gateways} />;
}
