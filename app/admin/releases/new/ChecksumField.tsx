'use client';

import { useState } from 'react';
import { computeChecksumFromUrl } from '@/lib/actions/connector-actions';

export function ChecksumField() {
  const [checksum, setChecksum] = useState('');
  const [downloadUrl, setDownloadUrl] = useState('');
  const [computing, setComputing] = useState(false);
  const [error, setError] = useState('');

  async function handleCompute() {
    setError('');
    if (!downloadUrl) {
      setError('Enter a download URL first');
      return;
    }
    setComputing(true);
    try {
      const hash = await computeChecksumFromUrl(downloadUrl);
      setChecksum(hash);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to compute checksum');
    } finally {
      setComputing(false);
    }
  }

  return (
    <>
      <div className="space-y-1.5">
        <label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
          Download URL *
        </label>
        <input
          name="download_url"
          type="url"
          required
          value={downloadUrl}
          onChange={(e) => setDownloadUrl(e.target.value)}
          placeholder="https://releases.prepiq.com/connector/v1.5.1/piq-connector-linux-amd64"
          className="w-full bg-[#232327] border border-[#2A2A2E] rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
        />
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
            SHA-256 Checksum *
          </label>
          <button
            type="button"
            onClick={handleCompute}
            disabled={computing}
            className="text-[10px] font-semibold text-primary hover:text-primary/80 disabled:opacity-50"
          >
            {computing ? 'Computing…' : 'Compute from URL'}
          </button>
        </div>
        <input
          name="checksum_sha256"
          required
          value={checksum}
          onChange={(e) => setChecksum(e.target.value)}
          placeholder="e3b0c44298fc1c149afb…"
          className="w-full bg-[#232327] border border-[#2A2A2E] rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 font-mono"
        />
        {error ? (
          <p className="text-[10px] text-red-400">{error}</p>
        ) : (
          <p className="text-[10px] text-muted-foreground">
            Click "Compute from URL" to fetch the file and hash it automatically, or run{' '}
            <code className="font-mono">sha256sum</code> yourself.
          </p>
        )}
      </div>
    </>
  );
}
