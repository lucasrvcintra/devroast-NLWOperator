"use client";

import { useState } from "react";
import { CodeEditor } from "@/components/code-editor";
import type { LanguageId } from "@/lib/languages";

export function CodeEditorWrapper() {
  const [code, setCode] = useState("");
  const [roastMode, setRoastMode] = useState(false);
  const [language, setLanguage] = useState<LanguageId | undefined>(undefined);

  return (
    <CodeEditor
      value={code}
      onChange={setCode}
      language={language}
      onLanguageChange={setLanguage}
      roastMode={roastMode}
      onRoastModeChange={setRoastMode}
    />
  );
}
