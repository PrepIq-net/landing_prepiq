"use client";

import { authenticate } from "@/lib/actions/actions";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Fingerprint, User, Key, WarningTriangle } from "iconoir-react";

export default function LoginPage() {
  const [errorMessage, dispatch, isPending] = useActionState(
    authenticate,
    undefined,
  );

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#141416] p-4">
      <div className="w-full max-w-[400px] space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20 mb-6">
            <Fingerprint className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-2xl font-display font-semibold tracking-tight text-foreground">
            Administrative Access
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your credentials to control the infrastructure.
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-[#1C1C1F] border border-[#2A2A2E] rounded-2xl p-8 shadow-l2 space-y-6">
          <form action={dispatch} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">
                Operator Email
              </Label>
              <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                  <User className="w-4 h-4" />
                </div>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  required
                  className="pl-10 bg-[#141416] border-[#2A2A2E] focus:border-primary/50 focus:ring-primary/20 transition-all h-11"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">
                Access Key
              </Label>
              <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                  <Key className="w-4 h-4" />
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="pl-10 bg-[#141416] border-[#2A2A2E] focus:border-primary/50 focus:ring-primary/20 transition-all h-11"
                />
              </div>
            </div>

            {errorMessage && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium animate-in fade-in slide-in-from-top-1">
                <WarningTriangle className="w-4 h-4 shrink-0" />
                <p>{errorMessage}</p>
              </div>
            )}

            <Button 
              className="w-full h-11 bg-primary hover:bg-[#B8962E] text-primary-foreground font-semibold rounded-xl shadow-l1 transition-all duration-200" 
              type="submit" 
              disabled={isPending}
            >
              {isPending ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Authenticating...
                </div>
              ) : (
                "Establish Connection"
              )}
            </Button>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em]">
            Secure Environment v1.0.4
          </p>
        </div>
      </div>
    </div>
  );
}
