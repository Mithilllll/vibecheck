import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireUser } from "@/lib/auth/session";
import { getStorage } from "@/lib/uploads/storage";
import { analyzeContent } from "@/lib/analysis/service";
import {
  reserveAnalysis,
  releaseAnalysis,
  AnalysisQuotaError,
} from "@/lib/analysis/quota";
import {
  buildUserPrompt,
  VIBECHECK_SYSTEM_PROMPT,
} from "@/lib/openai/prompts";
import {
  sanitizeAnalysisInput,
  vibeAnalysisSchema,
} from "@/lib/validations/analysis";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await requireUser();
  let quotaReserved = false;

  try {
    const { id } = await params;

    const project = await prisma.project.findFirst({
      where: {
        id,
        userId: user.id,
      },
      include: {
        mediaAssets: {
          where: {
            type: "IMAGE",
          },
          orderBy: {
            createdAt: "asc",
          },
          take: 1,
        },
      },
    });

    if (!project) {
      return NextResponse.json(
        { error: "Project not found." },
        { status: 404 }
      );
    }

    const image = project.mediaAssets[0];

    if (!image) {
      return NextResponse.json(
        { error: "This project does not contain an image." },
        { status: 400 }
      );
    }

    const storage = getStorage();
    const imageBuffer = await storage.readBuffer(image.filePath);

    await reserveAnalysis(user.id);
    quotaReserved = true;

    const prompt = buildUserPrompt({
      intendedVibe: project.intendedVibe,
      platformContext: project.platformContext,
      targetAudience: project.targetAudience,
      captionContext: project.captionContext,
    });

    const text = await analyzeContent(
      `${VIBECHECK_SYSTEM_PROMPT}\n\n${prompt}`,
      imageBuffer,
      image.mimeType
    );

    let analysisJson: unknown;

    try {
      analysisJson = JSON.parse(text);
    } catch {
      analysisJson = sanitizeAnalysisInput(text);
    }

    const analysis = vibeAnalysisSchema.parse(
      sanitizeAnalysisInput(analysisJson)
    );

    const analysisResult = await prisma.analysisResult.create({
      data: {
        projectId: project.id,
        score: analysis.score,
        verdict: analysis.verdict,
        intendedVibe: analysis.intendedVibe,
        perceivedVibe: analysis.perceivedVibe,
        insightBullets: JSON.stringify(analysis.insightBullets),
        personaReactions: JSON.stringify(analysis.personaReactions),
        improvementSuggestions: JSON.stringify(
          analysis.improvementSuggestions
        ),
        trendSuggestions: JSON.stringify(analysis.trendSuggestions),
        rawModelResponse: JSON.stringify(analysis),
      },
    });

    quotaReserved = false;

    return NextResponse.json(analysisResult, { status: 201 });
  } catch (error) {
    if (quotaReserved) {
      await releaseAnalysis(user.id).catch(() => {});
    }

    if (error instanceof AnalysisQuotaError) {
      return NextResponse.json(
        { error: error.message },
        { status: 429 }
      );
    }

    const errorMessage =
      error instanceof Error ? error.message : String(error);

    console.error("[ANALYZE_ROUTE_ERROR]", errorMessage);
    console.error(
      "[ANALYZE_ROUTE_STACK]",
      error instanceof Error ? error.stack : "No stack"
    );

    return NextResponse.json(
      {
        error: "Analysis failed. Please try again later.",
      },
      { status: 500 }
    );
  }
}