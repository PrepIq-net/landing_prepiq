"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Lock, WarningTriangle } from "iconoir-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { savePaymentGateway } from "@/lib/actions/subscription-actions";
import type {
  PaymentGatewayConfig,
  PaymentGatewayWritePayload,
} from "@/types/admin-plans";
import { cn } from "@/lib/utils";

const FIELD_LABELS: Record<string, string> = {
  public_key: "Public key",
  secret_key: "Secret key",
  secret_hash: "Webhook secret hash",
  webhook_secret: "Webhook secret",
  company_token: "Company token",
  service_id: "Service ID",
  api_token: "API token",
};

export function PaymentGatewaysManager({
  gateways,
}: {
  gateways: PaymentGatewayConfig[];
}) {
  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="text-3xl font-display font-semibold tracking-tight text-foreground">
          Payment Gateways
        </h1>
        <p className="text-sm text-muted-foreground max-w-2xl">
          Which processors are live, which one takes a checkout that does not
          name a gateway, and where each credential resolves from. Values saved
          here override the deployed environment variables — leave a field blank
          to keep using the environment.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card p-4 flex items-start gap-3">
        <Lock className="h-4 w-4 text-primary shrink-0 mt-0.5" />
        <p className="text-xs text-muted-foreground leading-relaxed">
          Saved credentials are never returned by the API — only the last four
          characters are shown. To rotate a key, type the new one and save; to
          fall back to the environment variable, clear the field and save.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {gateways.map((gateway) => (
          <GatewayCard key={gateway.provider} gateway={gateway} />
        ))}
      </div>
    </div>
  );
}

function GatewayCard({ gateway }: { gateway: PaymentGatewayConfig }) {
  const [isEnabled, setIsEnabled] = useState(gateway.is_enabled);
  const [isDefault, setIsDefault] = useState(gateway.is_default);
  const [environment, setEnvironment] = useState(gateway.environment);
  const [credentials, setCredentials] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const dirty =
    isEnabled !== gateway.is_enabled ||
    isDefault !== gateway.is_default ||
    environment !== gateway.environment ||
    Object.keys(credentials).length > 0;

  const missingCredentials = gateway.credential_fields.filter(
    (field) => !field.configured,
  );

  const save = () => {
    setError(null);
    const payload: PaymentGatewayWritePayload = {
      is_enabled: isEnabled,
      is_default: isDefault,
      environment,
    };
    if (Object.keys(credentials).length > 0) {
      payload.credentials = credentials;
    }
    startTransition(async () => {
      const result = await savePaymentGateway(gateway.provider, payload);
      if (result.ok) {
        setCredentials({});
        toast.success(`${gateway.provider_label} updated`);
      } else {
        setError(result.error ?? "Could not save gateway settings");
      }
    });
  };

  return (
    <div
      className={cn(
        "rounded-xl border bg-card p-6 space-y-5",
        gateway.is_default ? "border-primary/40" : "border-border",
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-display font-semibold text-foreground">
              {gateway.provider_label}
            </h2>
            {gateway.is_default && (
              <span className="text-[10px] uppercase tracking-wider font-semibold text-primary border border-primary/30 bg-primary/10 rounded-full px-2 py-0.5">
                Default
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground font-mono mt-0.5">
            {gateway.provider}
          </p>
        </div>
        <span
          className={cn(
            "text-[10px] uppercase tracking-wider font-semibold rounded-full px-2.5 py-1 border",
            environment === "LIVE"
              ? "text-[hsl(var(--warning))] border-[hsl(var(--warning)/.3)] bg-[hsl(var(--warning)/.1)]"
              : "text-muted-foreground border-border bg-accent",
          )}
        >
          {environment === "LIVE" ? "Live" : "Test"}
        </span>
      </div>

      {isEnabled && missingCredentials.length > 0 && (
        <p className="text-xs rounded-md border border-[hsl(var(--warning)/.3)] bg-[hsl(var(--warning)/.08)] text-foreground px-3 py-2 flex items-start gap-2">
          <WarningTriangle className="h-3.5 w-3.5 text-[hsl(var(--warning))] shrink-0 mt-px" />
          <span>
            Enabled but missing{" "}
            {missingCredentials
              .map((f) => FIELD_LABELS[f.field] ?? f.field)
              .join(", ")}
            . Checkouts routed here will fail.
          </span>
        </p>
      )}

      <div className="space-y-2.5">
        <label className="flex items-center justify-between gap-4">
          <span className="text-sm text-foreground">Enabled</span>
          <Switch
            checked={isEnabled}
            onCheckedChange={(next) => {
              setIsEnabled(next);
              // The backend refuses a disabled default; mirror that here so the
              // toggle can't produce a state the save will bounce.
              if (!next) setIsDefault(false);
            }}
            aria-label={`Enable ${gateway.provider_label}`}
          />
        </label>
        <label className="flex items-center justify-between gap-4">
          <span className="text-sm text-foreground">
            Default gateway
            <span className="block text-xs text-muted-foreground">
              Used when a checkout does not name a processor.
            </span>
          </span>
          <Switch
            checked={isDefault}
            disabled={!isEnabled}
            onCheckedChange={setIsDefault}
            aria-label={`Make ${gateway.provider_label} the default gateway`}
          />
        </label>
        <label className="flex items-center justify-between gap-4">
          <span className="text-sm text-foreground">Live mode</span>
          <Switch
            checked={environment === "LIVE"}
            onCheckedChange={(next) => setEnvironment(next ? "LIVE" : "TEST")}
            aria-label={`Put ${gateway.provider_label} in live mode`}
          />
        </label>
      </div>

      <div className="space-y-3 border-t border-border pt-4">
        {gateway.credential_fields.map((field) => (
          <div key={field.field} className="space-y-1.5">
            <div className="flex items-center justify-between gap-2">
              <Label htmlFor={`${gateway.provider}-${field.field}`}>
                {FIELD_LABELS[field.field] ?? field.field}
              </Label>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                {field.source === "DATABASE"
                  ? `Saved · ${field.masked_value}`
                  : field.source === "ENVIRONMENT"
                    ? `From ${field.env_var}`
                    : "Not set"}
              </span>
            </div>
            <Input
              id={`${gateway.provider}-${field.field}`}
              type={field.secret ? "password" : "text"}
              autoComplete="off"
              placeholder={
                field.configured ? "Leave blank to keep current" : "Not set"
              }
              value={credentials[field.field] ?? ""}
              onChange={(e) =>
                setCredentials((prev) => ({
                  ...prev,
                  [field.field]: e.target.value,
                }))
              }
            />
          </div>
        ))}
        {gateway.credential_fields.length === 0 && (
          <p className="text-xs text-muted-foreground">
            This gateway takes no credentials through the admin panel.
          </p>
        )}
      </div>

      {error && (
        <p
          role="alert"
          className="text-sm rounded-md border border-destructive/30 bg-destructive/10 text-foreground px-3 py-2"
        >
          {error}
        </p>
      )}

      <div className="flex justify-end">
        <Button onClick={save} disabled={!dirty || pending}>
          {pending ? "Saving…" : "Save"}
        </Button>
      </div>
    </div>
  );
}
