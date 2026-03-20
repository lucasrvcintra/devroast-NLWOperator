"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CodeEditor } from "@/components/code-editor";
import { ErrorDisplayRoot } from "@/components/ui/error-display";
import { useLanguageDetection } from "@/hooks/use-language-detection";
import type { LanguageId } from "@/lib/languages";
import { useTRPC } from "@/trpc/client";

export function CodeEditorWrapper() {
  const router = useRouter();
  const trpc = useTRPC();
  const [code, setCode] = useState("");
  const [roastMode, setRoastMode] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { detectedLanguage } = useLanguageDetection(code, true);
  const language: LanguageId = (detectedLanguage as LanguageId) ?? "javascript";

  const createMutation = useMutation(
    trpc.roast.create.mutationOptions({
      onSuccess: (data) => {
        router.push(`/roast/${data.id}`);
      },
      onError: (error) => {
        console.error("Failed to create roast:", error);
        if (error.message?.includes("generate analysis")) {
          setErrorMessage(
            "Ops! A IA não conseguiu analisar seu código. Tente novamente.",
          );
        } else {
          setErrorMessage("Algo deu errado. Tente novamente.");
        }
      },
    }),
  );

  const handleSubmit = () => {
    if (!code.trim()) return;
    setErrorMessage(null);
    createMutation.mutate({
      code,
      language,
      roastMode,
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <CodeEditor
        value={code}
        onChange={setCode}
        language={language}
        roastMode={roastMode}
        onRoastModeChange={setRoastMode}
        onSubmit={handleSubmit}
        isSubmitting={createMutation.isPending}
      />
      {errorMessage && (
        <ErrorDisplayRoot
          code={500}
          title="Erro na análise"
          description={errorMessage}
          variant="error"
          size="inline"
          showRedirect={false}
        />
      )}
    </div>
  );
}
