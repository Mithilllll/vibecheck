import { prisma } from "@/lib/db/prisma";

const USER_LIMIT = Number(process.env.PER_USER_ANALYSES_PER_DAY ?? 5);
const GLOBAL_LIMIT = Number(process.env.GLOBAL_ANALYSES_PER_DAY ?? 50);

function today() {
  return new Date().toISOString().slice(0, 10);
}

export class AnalysisQuotaError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AnalysisQuotaError";
  }
}

export async function reserveAnalysis(userId: string) {
  const usageDate = today();
  const userScope = `user:${userId}`;
  const globalScope = "global";

  await prisma.$transaction(async (tx) => {
    const userUsage = await tx.analysisUsage.findUnique({
      where: {
        scope_usageDate: {
          scope: userScope,
          usageDate,
        },
      },
    });

    if ((userUsage?.count ?? 0) >= USER_LIMIT) {
      throw new AnalysisQuotaError(
        `You have reached your daily limit of ${USER_LIMIT} analyses. Try again tomorrow.`
      );
    }

    const globalUsage = await tx.analysisUsage.findUnique({
      where: {
        scope_usageDate: {
          scope: globalScope,
          usageDate,
        },
      },
    });

    if ((globalUsage?.count ?? 0) >= GLOBAL_LIMIT) {
      throw new AnalysisQuotaError(
        "Today’s demo limit has been reached. Please try again tomorrow."
      );
    }

    await tx.analysisUsage.upsert({
      where: {
        scope_usageDate: {
          scope: userScope,
          usageDate,
        },
      },
      create: {
        scope: userScope,
        usageDate,
        count: 1,
      },
      update: {
        count: {
          increment: 1,
        },
      },
    });

    await tx.analysisUsage.upsert({
      where: {
        scope_usageDate: {
          scope: globalScope,
          usageDate,
        },
      },
      create: {
        scope: globalScope,
        usageDate,
        count: 1,
      },
      update: {
        count: {
          increment: 1,
        },
      },
    });
  });
}

export async function releaseAnalysis(userId: string) {
  const usageDate = today();

  await prisma.analysisUsage.updateMany({
    where: {
      scope: `user:${userId}`,
      usageDate,
      count: {
        gt: 0,
      },
    },
    data: {
      count: {
        decrement: 1,
      },
    },
  });

  await prisma.analysisUsage.updateMany({
    where: {
      scope: "global",
      usageDate,
      count: {
        gt: 0,
      },
    },
    data: {
      count: {
        decrement: 1,
      },
    },
  });
}