'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { createUser } from '@/lib/actions/user-actions';

export default function NewUserPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    try {
      setError(null);
      await createUser(formData);
      router.push('/admin/users');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-display font-semibold tracking-tight text-foreground">
            New Staff Member
          </h1>
          <p className="text-muted-foreground text-sm">
            Add a new team member to administer PrepIQ.
          </p>
        </div>
        <form action={handleSubmit} className="space-y-4 bg-[#1C1C1F] border border-[#2A2A2E] rounded-xl p-6 shadow-l2">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              placeholder="staff@prepiq.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Temporary Password
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              placeholder="Secure password"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Role
            </Label>
            <Select name="role" defaultValue="EDITOR">
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ADMIN">Admin</SelectItem>
                <SelectItem value="EDITOR">Editor</SelectItem>
                <SelectItem value="VIEWER">Viewer</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              <p>{error}</p>
            </div>
          )}
          <Button type="submit" className="w-full bg-primary hover:bg-[#B8962E] text-primary-foreground font-semibold rounded-xl">
            Create User
          </Button>
        </form>
      </div>
    </div>
  );
}
