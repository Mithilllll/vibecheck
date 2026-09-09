export type {
  VibeAnalysis,
  PersonaName,
  PersonaReaction,
} from "@/lib/validations/analysis";

export interface ApiError {
  error: string;
  details?: unknown;
}
