import type { PersonaName } from "@/lib/validations/analysis";
import {
  Flame,
  Briefcase,
  Palette,
  User,
  ShieldAlert,
  Shield,
} from "lucide-react";

const PERSONA_ICONS: Record<PersonaName, React.ComponentType<{ className?: string }>> = {
  "Gen Z Trend Chaser": Flame,
  "Brand Marketer": Briefcase,
  "Indie Artist": Palette,
  "Casual Viewer": User,
  "Skeptical Critic": ShieldAlert,
  "Safety-Conscious Community Mod": Shield,
};

const PERSONA_BLURBS: Record<PersonaName, string> = {
  "Gen Z Trend Chaser": "Tracks what's currently moving online",
  "Brand Marketer": "Thinks in audiences, conversions, and clarity",
  "Indie Artist": "Looks for authenticity and craft",
  "Casual Viewer": "Reads it the way most people will",
  "Skeptical Critic": "Pushes back on what doesn't land",
  "Safety-Conscious Community Mod": "Flags concerns for broad audiences",
};

interface PersonaCardProps {
  persona: PersonaName;
  reaction: string;
}

export function PersonaCard({ persona, reaction }: PersonaCardProps) {
  const Icon = PERSONA_ICONS[persona];

  return (
    <div className="rounded-xl border border-border-default bg-bg-raised p-5 flex flex-col">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-bg-elevated border border-border-subtle text-accent shrink-0">
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <h4 className="text-sm font-semibold tracking-tight text-text-primary">
            {persona}
          </h4>
          <p className="text-xs text-text-tertiary mt-0.5">
            {PERSONA_BLURBS[persona]}
          </p>
        </div>
      </div>
      <p className="mt-4 text-sm text-text-secondary leading-relaxed">
        {reaction}
      </p>
    </div>
  );
}
