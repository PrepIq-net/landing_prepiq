import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { createRelease } from '@/lib/actions/connector-actions';

export default async function NewReleasePage() {
  const session = await auth();
  const currentUser = await prisma.user.findUnique({
    where: { email: session?.user?.email! },
  });
  if (!currentUser || currentUser.role !== 'ADMIN') return notFound();

  async function handleCreate(formData: FormData) {
    'use server';
    await createRelease(formData);
    redirect('/admin/releases');
  }

  return (
    <div className="space-y-8 max-w-2xl">
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <Link href="/admin/releases" className="text-xs text-muted-foreground hover:text-foreground">
            ← Releases
          </Link>
        </div>
        <h1 className="text-3xl font-display font-semibold tracking-tight text-foreground">
          New Release
        </h1>
        <p className="text-muted-foreground text-sm">
          Create a new connector release. It starts as a draft — publish when ready.
        </p>
      </div>

      <form action={handleCreate} className="bg-[#1C1C1F] border border-[#2A2A2E] rounded-xl p-6 space-y-5">
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
            Version *
          </label>
          <input
            name="version"
            required
            placeholder="1.5.1"
            className="w-full bg-[#232327] border border-[#2A2A2E] rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 font-mono"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
            Download URL *
          </label>
          <input
            name="download_url"
            type="url"
            required
            placeholder="https://releases.prepiq.com/connector/v1.5.1/piq-connector-linux-amd64"
            className="w-full bg-[#232327] border border-[#2A2A2E] rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
            SHA-256 Checksum *
          </label>
          <input
            name="checksum_sha256"
            required
            placeholder="e3b0c44298fc1c149afb…"
            className="w-full bg-[#232327] border border-[#2A2A2E] rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 font-mono"
          />
          <p className="text-[10px] text-muted-foreground">Run: <code className="font-mono">sha256sum piq-connector-linux-amd64</code></p>
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
            Min Supported Version
          </label>
          <input
            name="min_supported_version"
            placeholder="1.2.0"
            className="w-full bg-[#232327] border border-[#2A2A2E] rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 font-mono"
          />
          <p className="text-[10px] text-muted-foreground">Oldest version that may skip this release (leave blank to require all to upgrade).</p>
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
            Release Notes
          </label>
          <textarea
            name="release_notes"
            rows={4}
            placeholder="Bug fixes and improvements…"
            className="w-full bg-[#232327] border border-[#2A2A2E] rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 resize-none"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="px-5 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors"
          >
            Create Draft
          </button>
          <Link
            href="/admin/releases"
            className="px-5 py-2.5 border border-[#2A2A2E] rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
