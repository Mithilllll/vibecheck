"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw } from "lucide-react";

interface ReanalyzeButtonProps {
  projectId: string;
}

export function ReanalyzeButton({ projectId }: ReanalyzeButtonProps) {
  const router = useRouter();
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function run() {
    setRunning(true);
    setError(null);
    try {
      const res = await fetch(`/api/projects/${projectId}/analyze`, {
        method: "POST",
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(json.error ?? "Analysis failed.");
        setRunning(false);
        return;
      }
      router.refresh();
      setRunning(false);
    } catch {
      setError("Network error. Try again.");
      setRunning(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <Button onClick={run} disabled={running} variant="secondary">
        {running ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Re-running…
          </>
        ) : (
          <>
            <RefreshCw className="h-4 w-4" />
            Re-run analysis
          </>
        )}
      </Button>
      {error && (
        <p className="text-xs text-danger" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
