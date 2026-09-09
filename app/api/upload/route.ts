import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/session";
import { getStorage } from "@/lib/uploads/storage";
import {
  ALLOWED_AUDIO_MIME,
  ALLOWED_IMAGE_MIME,
  ALLOWED_VIDEO_MIME,
  MAX_AUDIO_BYTES,
  MAX_IMAGE_BYTES,
  MAX_VIDEO_BYTES,
} from "@/lib/validations/project";

type Kind = "image" | "video" | "audio";

const RULES: Record<Kind, { mimes: readonly string[]; maxBytes: number }> = {
  image: { mimes: ALLOWED_IMAGE_MIME, maxBytes: MAX_IMAGE_BYTES },
  video: { mimes: ALLOWED_VIDEO_MIME, maxBytes: MAX_VIDEO_BYTES },
  audio: { mimes: ALLOWED_AUDIO_MIME, maxBytes: MAX_AUDIO_BYTES },
};

function isKind(s: string | null): s is Kind {
  return s === "image" || s === "video" || s === "audio";
}

/**
 * POST /api/upload
 * multipart/form-data:
 *   - file: File
 *   - kind: "image" | "video" | "audio"
 *
 * Returns: { filePath, fileUrl, fileName, mimeType, sizeBytes, kind }
 *
 * The file is saved to storage but no DB row is created here — the
 * project create endpoint links the file to a Project via MediaAsset rows.
 */
export async function POST(req: NextRequest) {
  const user = await requireUser();

  const form = await req.formData().catch(() => null);
  if (!form) {
    return NextResponse.json({ error: "Expected multipart form" }, { status: 400 });
  }

  const file = form.get("file");
  const kindRaw = form.get("kind");
  const kind = typeof kindRaw === "string" ? kindRaw : null;

  if (!isKind(kind)) {
    return NextResponse.json(
      { error: "Invalid 'kind' (must be image, video, or audio)" },
      { status: 400 }
    );
  }
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Missing file" }, { status: 400 });
  }

  const rule = RULES[kind];
  if (!rule.mimes.includes(file.type)) {
    return NextResponse.json(
      { error: `Unsupported ${kind} type: ${file.type || "unknown"}` },
      { status: 415 }
    );
  }
  if (file.size > rule.maxBytes) {
    return NextResponse.json(
      { error: `File too large (max ${(rule.maxBytes / (1024 * 1024)).toFixed(0)} MB)` },
      { status: 413 }
    );
  }
  if (file.size === 0) {
    return NextResponse.json({ error: "Empty file" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const saved = await getStorage().save({
    buffer,
    fileName: file.name || `${kind}-upload`,
    mimeType: file.type,
    prefix: `users/${user.id}`,
  });

  return NextResponse.json({ ...saved, kind });
}
