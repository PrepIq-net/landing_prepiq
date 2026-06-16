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
import { Switch } from '@/components/ui/switch';
import { User } from '@prisma/client';
import { updateUser, changeUserPassword } from '@/lib/actions/user-actions';

interface EditUserFormProps {
  user: User;
  currentUserId: string;
}

export function EditUserForm({ user, currentUserId }: EditUserFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [isPasswordChanging, setIsPasswordChanging] = useState(false);
  const [newPassword, setNewPassword] = useState('');

  async function handleSubmit(formData: FormData) {
    try {
      setError(null);
      await updateUser(user.id, formData);
      router.push('/admin/users');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    }
  }

  async function handlePasswordChange() {
    if (!newPassword) return;
    try {
      setPasswordError(null);
      await changeUserPassword(user.id, newPassword);
      setNewPassword('');
      setIsPasswordChanging(false);
    } catch (err) {
      setPasswordError(err instanceof Error ? err.message : 'Something went wrong');
    }
  }

  return (
    <div className="max-w-2xl space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-display font-semibold tracking-tight text-foreground">
          Edit Staff Member
        </h1>
        <p className="text-muted-foreground text-sm">
          Update settings for {user.email}.
        </p>
      </div>

      <div className="space-y-6 bg-[#1C1C1F] border border-[#2A2A2E] rounded-xl p-6 shadow-l2">
        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              defaultValue={user.email}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Role
            </Label>
            <Select name="role" defaultValue={user.role}>
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
          <div className="space-y-2 flex items-center gap-3">
            <Label htmlFor="isActive" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Account Active
            </Label>
            <input
              type="hidden"
              name="isActive"
              value="false"
            />
            <Switch
              id="isActive"
              name="isActive"
              defaultChecked={user.isActive}
            />
            <span className="text-sm text-muted-foreground">
              {user.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              <p>{error}</p>
            </div>
          )}
          <div className="flex gap-2">
            <Button
              type="submit"
              className="bg-primary hover:bg-[#B8962E] text-primary-foreground font-semibold rounded-xl"
            >
              Save Changes
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => router.push('/admin/users')}
            >
              Cancel
            </Button>
          </div>
        </form>

        {currentUserId !== user.id && (
          <div className="border-t border-[#2A2A2E] pt-6">
            <h3 className="text-sm font-semibold text-foreground mb-4">
              Password Management
            </h3>
            {isPasswordChanging ? (
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="newPassword" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    New Temporary Password
                  </Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                  />
                </div>
                {passwordError && (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                    <p>{passwordError}</p>
                  </div>
                )}
                <div className="flex gap-2">
                  <Button
                    type="button"
                    onClick={handlePasswordChange}
                    className="bg-destructive hover:bg-destructive/90 text-destructive-foreground font-semibold rounded-xl"
                  >
                    Confirm Change
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      setIsPasswordChanging(false);
                      setNewPassword('');
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                type="button"
                variant="outline"
                className="border-border hover:bg-accent"
                onClick={() => setIsPasswordChanging(true)}
              >
                Change Password
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
