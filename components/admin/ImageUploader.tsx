'use client';
import { useRef, useState, useCallback } from 'react';
import { uploadAction } from '@/app/admin/actions';

const MAX_BYTES = 8 * 1024 * 1024; // 8 MB
const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];

export function ImageUploader({
  value,
  onChange,
  prefix,
  label = 'Image',
  hint,
}: {
  value: string | null;
  onChange: (url: string | null) => void;
  prefix: string;
  label?: string;
  hint?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = useCallback(
    async (file: File) => {
      setError(null);
      if (!ACCEPTED.includes(file.type)) {
        setError('Unsupported format. Use JPEG, PNG, WEBP, GIF, or SVG.');
        return;
      }
      if (file.size > MAX_BYTES) {
        setError(`Max size 8 MB (got ${(file.size / 1024 / 1024).toFixed(1)} MB).`);
        return;
      }
      setUploading(true);
      try {
        const fd = new FormData();
        fd.append('file', file);
        fd.append('prefix', prefix);
        const result = await uploadAction(fd);
        if (!result.ok) {
          setError(result.error);
          return;
        }
        onChange(result.url);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Upload failed');
      } finally {
        setUploading(false);
      }
    },
    [onChange, prefix]
  );

  return (
    <div>
      <div className="text-[11px] font-mono uppercase tracking-[0.12em] text-fg2 mb-1.5">{label}</div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          const file = e.dataTransfer.files?.[0];
          if (file) handleFile(file);
        }}
        onClick={() => inputRef.current?.click()}
        className={`relative cursor-pointer rounded-md border-2 border-dashed p-4 transition-colors ${
          dragOver ? 'border-accent bg-accent/5' : 'border-line bg-bg1 hover:border-fg2'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED.join(',')}
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
            e.target.value = ''; // allow re-selecting the same file
          }}
        />
        {value ? (
          <div className="flex items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value}
              alt=""
              className="h-20 w-20 rounded object-cover border border-line"
            />
            <div className="flex-1 min-w-0">
              <div className="truncate text-[13px] text-fg1">{value.split('/').pop()}</div>
              <div className="mt-2 flex gap-2">
                <button
                  type="button"
                  className="text-[12px] text-fg2 hover:text-fg0"
                  onClick={(e) => {
                    e.stopPropagation();
                    inputRef.current?.click();
                  }}
                >
                  Replace
                </button>
                <button
                  type="button"
                  className="text-[12px] text-red-400 hover:text-red-300"
                  onClick={(e) => {
                    e.stopPropagation();
                    onChange(null);
                  }}
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-6 text-center">
            <div className="text-[13px] text-fg1">
              {uploading ? 'Uploading…' : 'Drag an image here, or click to choose'}
            </div>
            <div className="mt-1 text-[11px] text-fg2">JPEG · PNG · WEBP · SVG · max 8 MB</div>
          </div>
        )}
        {uploading && (
          <div className="absolute inset-0 bg-bg0/60 rounded-md flex items-center justify-center">
            <span className="inline-block w-4 h-4 rounded-full border-2 border-accent border-r-transparent animate-spin" />
          </div>
        )}
      </div>
      {hint && <div className="mt-1 text-[11px] text-fg2">{hint}</div>}
      {error && <div className="mt-1.5 text-[12px] text-red-400">{error}</div>}
    </div>
  );
}
