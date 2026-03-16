"use client";

import hljs from "highlight.js/lib/core";
import bash from "highlight.js/lib/languages/bash";
import c from "highlight.js/lib/languages/c";
import cpp from "highlight.js/lib/languages/cpp";
import csharp from "highlight.js/lib/languages/csharp";
import css from "highlight.js/lib/languages/css";
import dart from "highlight.js/lib/languages/dart";
import go from "highlight.js/lib/languages/go";
import java from "highlight.js/lib/languages/java";
import javascript from "highlight.js/lib/languages/javascript";
import json from "highlight.js/lib/languages/json";
import kotlin from "highlight.js/lib/languages/kotlin";
import markdown from "highlight.js/lib/languages/markdown";
import php from "highlight.js/lib/languages/php";
import plaintext from "highlight.js/lib/languages/plaintext";
import python from "highlight.js/lib/languages/python";
import ruby from "highlight.js/lib/languages/ruby";
import rust from "highlight.js/lib/languages/rust";
import sql from "highlight.js/lib/languages/sql";
import swift from "highlight.js/lib/languages/swift";
import typescript from "highlight.js/lib/languages/typescript";
import xml from "highlight.js/lib/languages/xml";
import yaml from "highlight.js/lib/languages/yaml";
import { useCallback, useEffect, useRef, useState } from "react";

hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("typescript", typescript);
hljs.registerLanguage("python", python);
hljs.registerLanguage("go", go);
hljs.registerLanguage("rust", rust);
hljs.registerLanguage("java", java);
hljs.registerLanguage("ruby", ruby);
hljs.registerLanguage("php", php);
hljs.registerLanguage("sql", sql);
hljs.registerLanguage("bash", bash);
hljs.registerLanguage("shell", bash);
hljs.registerLanguage("xml", xml);
hljs.registerLanguage("html", xml);
hljs.registerLanguage("css", css);
hljs.registerLanguage("json", json);
hljs.registerLanguage("yaml", yaml);
hljs.registerLanguage("markdown", markdown);
hljs.registerLanguage("c", c);
hljs.registerLanguage("cpp", cpp);
hljs.registerLanguage("csharp", csharp);
hljs.registerLanguage("swift", swift);
hljs.registerLanguage("kotlin", kotlin);
hljs.registerLanguage("dart", dart);
hljs.registerLanguage("plaintext", plaintext);

const DETECTION_THRESHOLD = 5;

interface DetectionResult {
  language: string | null;
  confidence: number;
}

export function useLanguageDetection(code: string, autoDetect: boolean = true) {
  const [detectedLanguage, setDetectedLanguage] = useState<string | null>(null);
  const [confidence, setConfidence] = useState(0);

  const detectLanguage = useCallback(
    (codeToDetect: string): DetectionResult => {
      if (!codeToDetect || codeToDetect.trim().length < 3) {
        return { language: null, confidence: 0 };
      }

      const result = hljs.highlightAuto(codeToDetect);

      if (!result.language || result.relevance < DETECTION_THRESHOLD) {
        return { language: null, confidence: 0 };
      }

      return {
        language: result.language,
        confidence: result.relevance,
      };
    },
    [],
  );

  useEffect(() => {
    if (!autoDetect) {
      return;
    }

    const result = detectLanguage(code);
    setDetectedLanguage(result.language);
    setConfidence(result.confidence);
  }, [code, autoDetect, detectLanguage]);

  return {
    detectedLanguage,
    confidence,
    isReliable: confidence >= DETECTION_THRESHOLD,
  };
}
