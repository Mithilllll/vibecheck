import { NextRequest, NextResponse } from "next/server";
import { ZodError, z } from "zod";
import { prisma } from "@/lib/db/prisma";
import { requireUser } from "@/lib/auth/session";
import { projectCreateSchema } from "@/lib/validations/project";

const mediaRefSchema = z.object({
  type: z.enum(["IMAGE", "VIDEO", "AUDIO"]),
  fileName: z.string().min(1).max(200),
  mimeType: z.string().min(1).max(120),
  filePath: z.string().min(1).max(500),
  fileUrl: z.string().min(1).max(800),
  sizeBytes: z.number().int().nonnegative().default(0),
});

const projectCreatePayloadSchema = projectCreateSchema.extend({
  media: z
    .array(mediaRefSchema)
    .min(1, "At least one media file is required")
    .refine(
      (media) => media.some((item) => item.type === "IMAGE"),
      "An image is required for analysis"
    ),
});

export async function POST(req: NextRequest) {
  const user = await requireUser();

  let body: unknown;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON" },
      { status: 400 }
    );
  }

  try {
    const data = projectCreatePayloadSchema.parse(body);

    const project = await prisma.project.create({
      data: {
        userId: user.id,
        title: data.title,
        intendedVibe: data.intendedVibe,
        targetAudience: data.targetAudience || null,
        platformContext: data.platformContext || null,
        captionContext: data.captionContext || null,
        mediaAssets: {
          createMany: {
            data: data.media.map((media) => ({
              type: media.type,
              fileName: media.fileName,
              mimeType: media.mimeType,
              filePath: media.filePath,
              fileUrl: media.fileUrl,
              sizeBytes: media.sizeBytes,
            })),
          },
        },
      },
      select: {
        id: true,
      },
    });

    return NextResponse.json(
      { id: project.id },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    console.error("[projects POST]", error);

    return NextResponse.json(
      { error: "Could not create project" },
      { status: 500 }
    );
  }
}

export async function GET() {
  const user = await requireUser();

  const projects = await prisma.project.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      analysisResults: {
        orderBy: {
          createdAt: "desc",
        },
        take: 1,
        select: {
          id: true,
          score: true,
          verdict: true,
          createdAt: true,
        },
      },
      mediaAssets: {
        where: {
          type: "IMAGE",
        },
        take: 1,
        select: {
          fileUrl: true,
          fileName: true,
        },
      },
    },
  });

  return NextResponse.json({ projects });
}