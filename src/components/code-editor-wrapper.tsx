"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CodeEditor } from "@/components/code-editor";
import { useLanguageDetection } from "@/hooks/use-language-detection";
import type { LanguageId } from "@/lib/languages";
import { useTRPC } from "@/trpc/client";

export function CodeEditorWrapper() {
  const router = useRouter();
  const trpc = useTRPC();
  const [code, setCode] = useState("");
  const [roastMode, setRoastMode] = useState(false);

  const { detectedLanguage } = useLanguageDetection(code, true);
  const language: LanguageId = (detectedLanguage as LanguageId) ?? "javascript";

  const createMutation = useMutation(
    trpc.roast.create.mutationOptions({
      onSuccess: (data) => {
        router.push(`/roast/${data.id}`);
      },
      onError: (error) => {
        console.error("Failed to create roast:", error);
        const searchParams = new URLSearchParams({
          code: "500",
          title: "Analysis failed",
          message: error.message || "Failed to analyze code. Please try again.",
        });
        router.push(`/error?${searchParams.toString()}`);
      },
    }),
  );

  const handleSubmit = () => {
    if (!code.trim()) return;
    createMutation.mutate({
      code,
      language,
      roastMode,
    });
  };

  return (
    <CodeEditor
      value={code}
      onChange={setCode}
      language={language}
      roastMode={roastMode}
      onRoastModeChange={setRoastMode}
      onSubmit={handleSubmit}
      isSubmitting={createMutation.isPending}
    />
  );
}
