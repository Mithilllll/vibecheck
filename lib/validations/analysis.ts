import { z } from "zod";

export const PERSONA_NAMES = [
  "Gen Z Trend Chaser",
  "Brand Marketer",
  "Indie Artist",
  "Casual Viewer",
  "Skeptical Critic",
  "Safety-Conscious Community Mod",
] as const;

export const personaNameSchema = z.enum(PERSONA_NAMES);
export type PersonaName = z.infer<typeof personaNameSchema>;

export const personaReactionSchema = z.object({
  persona: personaNameSchema,
  reaction: z.string().min(1).max(600),
});

const fallbackInsightBullets = [
  "The overall composition is readable, but the intended vibe is not yet fully distinct.",
  "The visual hierarchy is clear, though the emotional signal could be sharper.",
  "The piece has a solid base, but it needs stronger personality to feel more intentional."
] as const;

const fallbackImprovementSuggestions = [
  "Add a more distinctive focal point that reinforces the intended mood.",
  "Use contrast and rhythm more intentionally to increase visual impact.",
  "Refine the typography and spacing to feel more premium and less generic."
] as const;

const fallbackTrendSuggestions = [
  "Introduce a stronger asymmetrical rhythm to feel more contemporary.",
  "Use one accent color or texture to create more energy and differentiation.",
  "Lean into a more editorial layout to feel current and creator-forward."
] as const;

const normalizeString = (value: unknown, fallback: string) => {
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : fallback;
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  return fallback;
};

const normalizeStringArray = (value: unknown, fallback: readonly string[]) => {
  if (!Array.isArray(value)) return [...fallback];

  const cleaned = value
    .map((item) => (typeof item === "string" ? item.trim() : ""))
    .filter((item) => item.length > 0);

  if (cleaned.length === 0) return [...fallback];

  return cleaned.slice(0, fallback.length).length === fallback.length
    ? cleaned.slice(0, fallback.length)
    : [...cleaned, ...fallback.slice(cleaned.length)].slice(0, fallback.length);
};

export function sanitizeAnalysisInput(input: unknown) {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return {
      score: 70,
      verdict: "Needs clearer tonal direction",
      intendedVibe: "The intended mood is not fully landing yet",
      perceivedVibe: "The visual feels readable but still generic",
      insightBullets: [...fallbackInsightBullets],
      personaReactions: PERSONA_NAMES.map((persona) => ({
        persona,
        reaction: `The visual reads as ${persona.toLowerCase()}, but it needs more distinct character to feel intentional.`,
      })),
      improvementSuggestions: [...fallbackImprovementSuggestions],
      trendSuggestions: [...fallbackTrendSuggestions],
    };
  }

  const candidate = input as Record<string, unknown>;
  const rawReactions = Array.isArray(candidate.personaReactions)
    ? candidate.personaReactions
    : [];

  const personaMap = new Map<string, string>();
  for (const item of rawReactions) {
    if (!item || typeof item !== "object" || Array.isArray(item)) continue;
    const persona = normalizeString((item as Record<string, unknown>).persona, "");
    const reaction = normalizeString((item as Record<string, unknown>).reaction, "");
    if (persona && reaction) {
      personaMap.set(persona.toLowerCase(), reaction);
    }
  }

  return {
    score: Number.isFinite(candidate.score) ? Math.min(100, Math.max(0, Number(candidate.score))) : 70,
    verdict: normalizeString(candidate.verdict, "Needs clearer tonal direction"),
    intendedVibe: normalizeString(candidate.intendedVibe, "The intended mood is not fully landing yet"),
    perceivedVibe: normalizeString(candidate.perceivedVibe, "The visual feels readable but still generic"),
    insightBullets: normalizeStringArray(candidate.insightBullets, fallbackInsightBullets),
    personaReactions: PERSONA_NAMES.map((persona) => ({
      persona,
      reaction: normalizeString(
        personaMap.get(persona.toLowerCase()),
        `The visual is ${persona.toLowerCase()}, but it lacks a sharper point of view.`
      ),
    })),
    improvementSuggestions: normalizeStringArray(
      candidate.improvementSuggestions,
      fallbackImprovementSuggestions
    ),
    trendSuggestions: normalizeStringArray(
      candidate.trendSuggestions,
      fallbackTrendSuggestions
    ),
  };
}

export const vibeAnalysisSchema = z
  .object({
    score: z.number().int().min(0).max(100),
    verdict: z.string().min(1).max(400),
    intendedVibe: z.string().min(1).max(400),
    perceivedVibe: z.string().min(1).max(400),
    insightBullets: z.array(z.string().min(1).max(400)).length(3),
    personaReactions: z.array(personaReactionSchema).length(6),
    improvementSuggestions: z.array(z.string().min(1).max(400)).length(3),
    trendSuggestions: z.array(z.string().min(1).max(400)).length(3),
  })
  .strict()
  .superRefine((data, ctx) => {
    const seen = new Set<string>();
    for (const r of data.personaReactions) {
      if (seen.has(r.persona)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Duplicate persona: ${r.persona}`,
          path: ["personaReactions"],
        });
      }
      seen.add(r.persona);
    }
    for (const required of PERSONA_NAMES) {
      if (!seen.has(required)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Missing persona: ${required}`,
          path: ["personaReactions"],
        });
      }
    }
  });

export type VibeAnalysis = z.infer<typeof vibeAnalysisSchema>;
export type PersonaReaction = z.infer<typeof personaReactionSchema>;
