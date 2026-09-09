"use client";

import * as React from "react";
import { Upload, X, ImageIcon, Video, Music, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Badge } from "@/components/ui/badge";

export type UploadKind = "image" | "video" | "audio";

export interface UploadedRef {
  filePath: string;
  fileUrl: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  kind: UploadKind;
}

interface UploadCardProps {
  kind: UploadKind;
  required?: boolean;
  comingSoonNote?: string;
  accept: string;
  maxBytes: number;
  value: UploadedRef | null;
  onChange: (ref: UploadedRef | null) => void;
  onError: (msg: string | null) => void;
}

const KIND_LABELS: Record<UploadKind, string> = {
  image: "Primary image",
  video: "Video clip",
  audio: "Audio sample",
};

const KIND_DESCRIPTIONS: Record<UploadKind, string> = {
  image: "JPG, PNG, WebP, or GIF — up to 10 MB",
  video: "MP4, MOV, or WebM — up to 100 MB",
  audio: "MP3, WAV, M4A, or OGG — up to 25 MB",
};

const KIND_ICONS: Record<UploadKind, React.ComponentType<{ className?: string }>> = {
  image: ImageIcon,
  video: Video,
  audio: Music,
};

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function UploadCard({
  kind,
  required,
  comingSoonNote,
  accept,
  maxBytes,
  value,
  onChange,
  onError,
}: UploadCardProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = React.useState(false);
  const [dragOver, setDragOver] = React.useState(false);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);

  const Icon = KIND_ICONS[kind];

  // Local preview for image
  React.useEffect(() => {
    if (kind !== "image") return;
    if (!value) {
      setPreviewUrl(null);
      return;
    }
    setPreviewUrl(value.fileUrl);
  }, [value, kind]);

  async function handleFile(file: File) {
    onError(null);
    if (file.size > maxBytes) {
      onError(`That file is larger than ${formatBytes(maxBytes)}.`);
      return;
    }
    setUploading(true);

    // Optimistic local preview for images
    if (kind === "image") {
      setPreviewUrl(URL.createObjectURL(file));
    }

    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("kind", kind);

      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const json = await res.json().catch(() => ({}));

      if (!res.ok) {
        onError(json.error ?? "Upload failed.");
        setUploading(false);
        if (kind === "image") setPreviewUrl(null);
        return;
      }

      onChange({
        filePath: json.filePath,
        fileUrl: json.fileUrl,
        fileName: json.fileName,
        mimeType: json.mimeType,
        sizeBytes: json.sizeBytes,
        kind,
      });
    } catch {
      onError("Upload failed. Try again.");
      if (kind === "image") setPreviewUrl(null);
    } finally {
      setUploading(false);
    }
  }

  function clear() {
    onChange(null);
    setPreviewUrl(null);
    if (inputRef.current) inputRef.current.value = "";
    onError(null);
  }

  return (
    <div
      className={cn(
        "relative rounded-xl border bg-bg-raised transition-colors",
        dragOver
          ? "border-accent/50 bg-accent-subtle"
          : "border-border-default hover:border-border-strong"
      )}
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files?.[0];
        if (file) void handleFile(file);
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void handleFile(file);
        }}
      />

      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-bg-elevated border border-border-subtle text-accent">
              <Icon className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-semibold tracking-tight">
                  {KIND_LABELS[kind]}
                </h4>
                {required && (
                  <Badge variant="accent" className="text-[10px]">Required</Badge>
                )}
              </div>
              <p className="text-xs text-text-tertiary mt-0.5">
                {KIND_DESCRIPTIONS[kind]}
              </p>
            </div>
          </div>
          {value && (
            <button
              type="button"
              onClick={clear}
              className="text-text-tertiary hover:text-text-primary transition-colors p-1 rounded-md focus-ring"
              aria-label="Remove file"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {comingSoonNote && (
          <div className="mt-3 rounded-md border border-border-subtle bg-bg-elevated/50 px-3 py-2 text-xs text-text-secondary">
            {comingSoonNote}
          </div>
        )}

        {/* Body */}
        {value ? (
          <div className="mt-4">
            {kind === "image" && previewUrl && (
              <div className="rounded-lg overflow-hidden border border-border-subtle bg-bg-elevated mb-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewUrl}
                  alt="Upload preview"
                  className="w-full h-auto max-h-72 object-contain"
                />
              </div>
            )}
            <div className="flex items-center justify-between rounded-md border border-border-subtle bg-bg-elevated/40 px-3 py-2 text-xs">
              <span className="font-medium text-text-primary truncate max-w-[60%]">
                {value.fileName}
              </span>
              <span className="text-text-tertiary tabular-nums">
                {formatBytes(value.sizeBytes)}
              </span>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className={cn(
              "mt-4 flex w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border-default bg-bg-elevated/40 py-8 text-center transition-colors hover:border-accent/40 hover:bg-accent-subtle/40 focus-ring",
              uploading && "pointer-events-none opacity-70"
            )}
          >
            {uploading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin text-accent" />
                <span className="text-sm text-text-secondary">Uploading…</span>
              </>
            ) : (
              <>
                <Upload className="h-5 w-5 text-text-tertiary" />
                <span className="text-sm text-text-secondary">
                  <span className="text-text-primary font-medium">
                    Click to upload
                  </span>{" "}
                  or drag and drop
                </span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
