"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { UploadCard, type UploadedRef } from "@/components/projects/upload-card";
import { projectCreateSchema } from "@/lib/validations/project";
import { Sparkles } from "lucide-react";

const ACCEPT_IMAGE = "image/jpeg,image/png,image/webp,image/gif";
const ACCEPT_VIDEO = "video/mp4,video/quicktime,video/webm";
const ACCEPT_AUDIO = "audio/mpeg,audio/wav,audio/mp4,audio/ogg,audio/webm";

const MAX_IMAGE = 10 * 1024 * 1024;
const MAX_VIDEO = 100 * 1024 * 1024;
const MAX_AUDIO = 25 * 1024 * 1024;

const LOADING_LINES = [
  "Reading visual cues",
  "Checking audience perception",
  "Measuring vibe alignment",
];

export function NewProjectForm() {
  const router = useRouter();

  // Form state
  const [title, setTitle] = useState("");
  const [intendedVibe, setIntendedVibe] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [platformContext, setPlatformContext] = useState("");
  const [captionContext, setCaptionContext] = useState("");

  // Upload state
  const [imageRef, setImageRef] = useState<UploadedRef | null>(null);
  const [videoRef, setVideoRef] = useState<UploadedRef | null>(null);
  const [audioRef, setAudioRef] = useState<UploadedRef | null>(null);

  // Errors
  const [formError, setFormError] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [videoError, setVideoError] = useState<string | null>(null);
  const [audioError, setAudioError] = useState<string | null>(null);

  // Submission state
  const [phase, setPhase] = useState<"idle" | "creating" | "analyzing">("idle");
  const [loadingLineIdx, setLoadingLineIdx] = useState(0);

  // Cycle loading lines while analyzing
  useEffect(() => {
    if (phase !== "analyzing") return;
    const handle = setInterval(() => {
      setLoadingLineIdx((i) => (i + 1) % LOADING_LINES.length);
    }, 1800);
    return () => clearInterval(handle);
  }, [phase]);

  const submitting = phase !== "idle";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);

    const parsed = projectCreateSchema.safeParse({
      title,
      intendedVibe,
      targetAudience,
      platformContext,
      captionContext,
    });
    if (!parsed.success) {
      setFormError(parsed.error.issues[0]?.message ?? "Check the form for errors.");
      return;
    }
    if (!imageRef) {
      setFormError("A primary image is required to run analysis.");
      return;
    }

    setPhase("creating");

    const media: Array<{
      type: "IMAGE" | "VIDEO" | "AUDIO";
      fileName: string;
      mimeType: string;
      filePath: string;
      fileUrl: string;
      sizeBytes: number;
    }> = [];

    media.push({ type: "IMAGE", ...stripKind(imageRef) });
    if (videoRef) media.push({ type: "VIDEO", ...stripKind(videoRef) });
    if (audioRef) media.push({ type: "AUDIO", ...stripKind(audioRef) });

    try {
      // 1) Create project
      const createRes = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...parsed.data, media }),
      });
      const createJson = await createRes.json().catch(() => ({}));
      if (!createRes.ok) {
        setFormError(createJson.error ?? "Could not create project.");
        setPhase("idle");
        return;
      }

      const projectId: string = createJson.id;

      // 2) Run analysis
      setPhase("analyzing");
      const analyzeRes = await fetch(`/api/projects/${projectId}/analyze`, {
        method: "POST",
      });
      const analyzeJson = await analyzeRes.json().catch(() => ({}));
      if (!analyzeRes.ok) {
        // The project was created, but analysis failed. Send to the detail page
        // so the user can retry from there.
        router.push(`/projects/${projectId}?analysisError=${encodeURIComponent(analyzeJson.error ?? "Analysis failed")}`);
        return;
      }

      // 3) Navigate to results
      router.push(`/projects/${projectId}`);
      router.refresh();
    } catch {
      setFormError("Network error. Try again.");
      setPhase("idle");
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main column */}
      <div className="lg:col-span-2 space-y-6">
        {/* Section A: Project Basics */}
        <Section
          title="Project basics"
          description="Name your project and describe the vibe you want it to communicate."
        >
          <div>
            <Label htmlFor="title" required>
              Project title
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Album cover — Round 1"
              maxLength={120}
              required
            />
          </div>
          <div>
            <Label htmlFor="intendedVibe" required>
              Intended vibe
            </Label>
            <Textarea
              id="intendedVibe"
              value={intendedVibe}
              onChange={(e) => setIntendedVibe(e.target.value)}
              placeholder="Cold, cinematic, late-night isolation. Slightly dystopian but romantic."
              maxLength={400}
              required
            />
            <p className="mt-1.5 text-xs text-text-tertiary">
              Be specific. The clearer your intent, the sharper the feedback.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="platformContext">Platform</Label>
              <Input
                id="platformContext"
                value={platformContext}
                onChange={(e) => setPlatformContext(e.target.value)}
                placeholder="Instagram, album art, poster…"
                maxLength={80}
              />
            </div>
            <div>
              <Label htmlFor="targetAudience">Target audience</Label>
              <Input
                id="targetAudience"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                placeholder="Indie listeners, 18–28"
                maxLength={200}
              />
            </div>
          </div>
        </Section>

        {/* Section B: Media Upload */}
        <Section
          title="Media"
          description="Upload the primary image. Video and audio are optional and reserved for upcoming pipelines."
        >
          <div className="space-y-4">
            <UploadCard
              kind="image"
              required
              accept={ACCEPT_IMAGE}
              maxBytes={MAX_IMAGE}
              value={imageRef}
              onChange={setImageRef}
              onError={setImageError}
            />
            {imageError && <FieldError msg={imageError} />}

            <UploadCard
              kind="video"
              accept={ACCEPT_VIDEO}
              maxBytes={MAX_VIDEO}
              value={videoRef}
              onChange={setVideoRef}
              onError={setVideoError}
              comingSoonNote="Video is stored alongside your project. Full motion analysis pipeline coming next."
            />
            {videoError && <FieldError msg={videoError} />}

            <UploadCard
              kind="audio"
              accept={ACCEPT_AUDIO}
              maxBytes={MAX_AUDIO}
              value={audioRef}
              onChange={setAudioRef}
              onError={setAudioError}
              comingSoonNote="Audio is stored alongside your project. Audio mood interpretation coming next."
            />
            {audioError && <FieldError msg={audioError} />}
          </div>
        </Section>

        {/* Section C: Context */}
        <Section
          title="Context"
          description="Optional notes that help shape the analysis."
        >
          <div>
            <Label htmlFor="captionContext">Caption or description</Label>
            <Textarea
              id="captionContext"
              value={captionContext}
              onChange={(e) => setCaptionContext(e.target.value)}
              placeholder="The caption or short description that will appear with this post."
              maxLength={800}
            />
          </div>
        </Section>
      </div>

      {/* Side column: Action panel */}
      <aside className="lg:col-span-1">
        <div className="sticky top-24 space-y-4">
          <div className="rounded-xl border border-border-default bg-bg-raised p-5">
            <h3 className="text-sm font-semibold tracking-tight">
              Ready to analyze?
            </h3>
            <p className="mt-1.5 text-xs text-text-secondary leading-relaxed">
              You&apos;ll get an alignment score, perceived vibe, six persona
              reactions, three insights, three improvements, and three trend
              suggestions.
            </p>

            {phase === "analyzing" ? (
              <div className="mt-5 rounded-lg border border-border-subtle bg-bg-elevated/60 p-4">
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse-soft" />
                  <span className="text-xs uppercase tracking-widest text-text-tertiary">
                    Analyzing creative signal
                  </span>
                </div>
                <p
                  key={loadingLineIdx}
                  className="mt-2 text-sm text-text-primary animate-fade-in"
                >
                  {LOADING_LINES[loadingLineIdx]}…
                </p>
              </div>
            ) : (
              <Button
                type="submit"
                size="lg"
                className="mt-5 w-full"
                disabled={submitting}
              >
                <Sparkles className="h-4 w-4" />
                {phase === "creating" ? "Saving project…" : "Analyze content"}
              </Button>
            )}

            {formError && (
              <div
                role="alert"
                className="mt-4 rounded-md border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger"
              >
                {formError}
              </div>
            )}
          </div>

          <div className="rounded-xl border border-border-subtle bg-bg-raised/40 p-5 text-xs text-text-tertiary leading-relaxed">
            Your media stays private and is only used to generate this
            analysis. You can re-run analysis on any project at any time.
          </div>
        </div>
      </aside>
    </form>
  );
}

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-border-default bg-bg-raised">
      <header className="border-b border-border-subtle px-6 py-4">
        <h2 className="text-sm font-semibold tracking-tight">{title}</h2>
        <p className="text-xs text-text-tertiary mt-0.5">{description}</p>
      </header>
      <div className="p-6 space-y-4">{children}</div>
    </section>
  );
}

function FieldError({ msg }: { msg: string }) {
  return (
    <div
      role="alert"
      className="rounded-md border border-danger/30 bg-danger/10 px-3 py-2 text-xs text-danger"
    >
      {msg}
    </div>
  );
}

function stripKind(ref: UploadedRef) {
  // Drop the local-only `kind` field before sending to the projects API
  const { kind: _kind, ...rest } = ref;
  void _kind;
  return rest;
}
