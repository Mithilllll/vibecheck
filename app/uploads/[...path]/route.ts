import { NextRequest, NextResponse } from "next/server";
import { readFileSync } from "fs";
import path from "path";
import { auth } from "@/lib/auth/config";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path: pathSegments } = await params;
    const filePath = pathSegments.join("/");

    // Security: only allow files under users/<userId>/
    if (!filePath.startsWith("users/")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Get authenticated user
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Security: only allow users to access their own uploads
    const userPrefix = `users/${session.user.id}`;
    if (!filePath.startsWith(userPrefix)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Read file from disk
    const uploadDir = process.env.LOCAL_UPLOAD_DIR || "./uploads";
    const fullPath = path.join(process.cwd(), uploadDir, filePath);

    // Prevent path traversal attacks
    const normalized = path.normalize(fullPath);
    const uploadDirAbsolute = path.normalize(
      path.join(process.cwd(), uploadDir)
    );
    if (!normalized.startsWith(uploadDirAbsolute)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const buffer = readFileSync(fullPath);

    // Guess MIME type based on extension
    const ext = path.extname(filePath).toLowerCase();
    const mimeTypes: Record<string, string> = {
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".png": "image/png",
      ".gif": "image/gif",
      ".webp": "image/webp",
      ".mp4": "video/mp4",
      ".webm": "video/webm",
      ".mp3": "audio/mpeg",
      ".wav": "audio/wav",
    };
    const contentType = mimeTypes[ext] || "application/octet-stream";

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    console.error("[UPLOADS_ROUTE_ERROR]", error);
    return NextResponse.json(
      { error: "File not found" },
      { status: 404 }
    );
  }
}
