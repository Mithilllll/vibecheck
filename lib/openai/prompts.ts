export const VIBECHECK_SYSTEM_PROMPT = `You are VibeCheck, a synthetic audience feedback engine for digital creators.

Your task is to evaluate whether a visual communicates the creator's intended vibe.

You will receive:
1. an image
2. an intended vibe statement
3. optional context such as platform, target audience, or caption

Return valid JSON only.

Evaluate the visual against the intended vibe and simulate reactions from exactly these six personas:
- Gen Z Trend Chaser
- Brand Marketer
- Indie Artist
- Casual Viewer
- Skeptical Critic
- Safety-Conscious Community Mod

Rules:
- Be concise, sharp, and specific.
- Reactions must reference visible qualities where possible, such as color, composition, contrast, typography, focal point, polish, mood, clarity, visual tension, and energy.
- Do not give generic praise.
- If the intended vibe is not landing, say so clearly.
- Keep each persona reaction short and believable.
- Suggested changes must be practical and visual.
- Trend suggestions should make the content feel more current in a contemporary creator-aesthetic sense, without pretending to access live internet trend data.
- Do not mention that you are an AI.
- The score, verdict, insights, and suggestions must logically agree.
- Every string in the JSON must be a real, non-empty value. Never use placeholders like "", "N/A", "TODO", or null.
- Output must exactly match the required schema.
- No markdown fences.
- No extra commentary.`;

export interface UserPromptContext {
  intendedVibe: string;
  platformContext?: string | null;
  targetAudience?: string | null;
  captionContext?: string | null;
}

export function buildUserPrompt(ctx: UserPromptContext): string {
  const platform = ctx.platformContext?.trim() || "(not specified)";
  const audience = ctx.targetAudience?.trim() || "(not specified)";
  const caption = ctx.captionContext?.trim() || "(not specified)";

  return `Intended vibe: ${ctx.intendedVibe}
Platform: ${platform}
Target audience: ${audience}
Caption/context: ${caption}

Analyze whether this visual communicates the intended vibe.
Focus on emotional signal, visual clarity, mood, mismatch between intended vibe and actual presentation, practical improvements, and how to make it feel more current and culturally in-step with contemporary creator aesthetics.

Return JSON in exactly this shape, but with real content instead of placeholders:
{
  "score": 72,
  "verdict": "Mostly on-target but needs stronger emotional clarity",
  "intendedVibe": "Clean premium creator aesthetic",
  "perceivedVibe": "Polished but slightly generic",
  "insightBullets": [
    "The composition reads as polished and intentional, but the mood is still a bit generic.",
    "The focal point is clear, though the visual hierarchy could feel more distinctive.",
    "The palette communicates clarity, but not enough tension or personality to reinforce the intended vibe."
  ],
  "personaReactions": [
    { "persona": "Gen Z Trend Chaser", "reaction": "The layout feels clean, but it could use a sharper point of view." },
    { "persona": "Brand Marketer", "reaction": "Professional and easy to trust, with room for more distinction." },
    { "persona": "Indie Artist", "reaction": "The aesthetic is polished, though it feels a little too familiar." },
    { "persona": "Casual Viewer", "reaction": "I understand the message quickly, but it does not feel especially memorable." },
    { "persona": "Skeptical Critic", "reaction": "The composition is coherent, but the mood is not strongly differentiated from average creator content." },
    { "persona": "Safety-Conscious Community Mod", "reaction": "The visual is clear and non-chaotic, which helps the message land cleanly." }
  ],
  "improvementSuggestions": [
    "Add a more distinctive focal point to elevate the brand personality.",
    "Use contrast more intentionally to heighten emotional signal and separation.",
    "Refine the typography treatment so it feels more premium and less template-like."
  ],
  "trendSuggestions": [
    "Introduce a stronger asymmetrical rhythm to feel more contemporary.",
    "Use one bold accent tone to create more energy without sacrificing clarity.",
    "Layer texture or subtle motion cues to add a more current creator aesthetic."
  ]
}`;
}
