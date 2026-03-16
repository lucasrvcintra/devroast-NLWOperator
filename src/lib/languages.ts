export const LANGUAGES = {
  javascript: {
    name: "JavaScript",
    shikiId: "javascript",
    hljsId: "javascript",
    aliases: ["js", "jsx"],
    eager: true,
  },
  typescript: {
    name: "TypeScript",
    shikiId: "typescript",
    hljsId: "typescript",
    aliases: ["ts", "tsx"],
    eager: true,
  },
  python: {
    name: "Python",
    shikiId: "python",
    hljsId: "python",
    aliases: ["py"],
    eager: false,
  },
  go: {
    name: "Go",
    shikiId: "go",
    hljsId: "go",
    aliases: ["golang"],
    eager: false,
  },
  rust: {
    name: "Rust",
    shikiId: "rust",
    hljsId: "rust",
    aliases: ["rs"],
    eager: false,
  },
  java: {
    name: "Java",
    shikiId: "java",
    hljsId: "java",
    aliases: [],
    eager: false,
  },
  ruby: {
    name: "Ruby",
    shikiId: "ruby",
    hljsId: "ruby",
    aliases: ["rb"],
    eager: false,
  },
  php: {
    name: "PHP",
    shikiId: "php",
    hljsId: "php",
    aliases: [],
    eager: false,
  },
  sql: {
    name: "SQL",
    shikiId: "sql",
    hljsId: "sql",
    aliases: [],
    eager: false,
  },
  bash: {
    name: "Bash",
    shikiId: "bash",
    hljsId: "bash",
    aliases: ["shell", "sh", "zsh"],
    eager: false,
  },
  html: {
    name: "HTML",
    shikiId: "html",
    hljsId: "xml",
    aliases: [],
    eager: false,
  },
  css: {
    name: "CSS",
    shikiId: "css",
    hljsId: "css",
    aliases: [],
    eager: false,
  },
  json: {
    name: "JSON",
    shikiId: "json",
    hljsId: "json",
    aliases: [],
    eager: false,
  },
  yaml: {
    name: "YAML",
    shikiId: "yaml",
    hljsId: "yaml",
    aliases: ["yml"],
    eager: false,
  },
  markdown: {
    name: "Markdown",
    shikiId: "markdown",
    hljsId: "markdown",
    aliases: ["md"],
    eager: false,
  },
  c: {
    name: "C",
    shikiId: "c",
    hljsId: "c",
    aliases: [],
    eager: false,
  },
  cpp: {
    name: "C++",
    shikiId: "cpp",
    hljsId: "cpp",
    aliases: ["c++"],
    eager: false,
  },
  csharp: {
    name: "C#",
    shikiId: "csharp",
    hljsId: "csharp",
    aliases: ["cs", "c#"],
    eager: false,
  },
  swift: {
    name: "Swift",
    shikiId: "swift",
    hljsId: "swift",
    aliases: [],
    eager: false,
  },
  kotlin: {
    name: "Kotlin",
    shikiId: "kotlin",
    hljsId: "kotlin",
    aliases: ["kt"],
    eager: false,
  },
  dart: {
    name: "Dart",
    shikiId: "dart",
    hljsId: "dart",
    aliases: [],
    eager: false,
  },
  plaintext: {
    name: "Plain Text",
    shikiId: "text",
    hljsId: "plaintext",
    aliases: ["text", "txt"],
    eager: true,
  },
} as const;

export type LanguageId = keyof typeof LANGUAGES;

export const LANGUAGE_LIST = Object.values(LANGUAGES);

export function getLanguageByHljsId(hljsId: string): LanguageId | null {
  const lang = LANGUAGE_LIST.find(
    (l) =>
      l.hljsId === hljsId || (l.aliases as readonly string[]).includes(hljsId),
  );
  return lang ? (lang.shikiId as LanguageId) : null;
}

export function getLanguageByShikiId(shikiId: string): LanguageId | null {
  const lang = LANGUAGE_LIST.find((l) => l.shikiId === shikiId);
  return lang ? (lang.shikiId as LanguageId) : null;
}
