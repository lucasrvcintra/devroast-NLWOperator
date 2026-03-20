# OG Images para Roast Results — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Adicionar imagens OG dinâmicas para links compartilhados de roast results.

**Architecture:** API route em `/api/og/[id]` que usa Takumi para renderizar componente React em PNG. Dados buscam via tRPC caller existente. Metadata adicionada à página de resultados para crawlers sociais.

**Tech Stack:** Takumi (`@takumi-rs/image-response`), Next.js App Router, tRPC

---

## File Structure

```
src/
├── app/
│   └── api/
│       └── og/
│           └── [id]/
│               └── route.ts          # API handler
│       └── trpc/[trpc]/
│           └── route.ts               # MOD - adicionar API HTTP para OG
└── components/
    └── og/
        ├── roast-og-image.tsx         # Componente principal
        └── og-error.tsx               # Componente de erro 404
```

**Notes:**
- API route usa tRPC via `createCaller` (precisa expor endpoint HTTP acessível internamente)
- Fontes JetBrains Mono + IBM Plex Mono devem ser fetchadas ou bundled

---

## Task 1: Instalar Dependência Takumi

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Instalar @takumi-rs/image-response**

```bash
npm install @takumi-rs/image-response
```

---

## Task 2: Configurar Next.js para Takumi

**Files:**
- Modify: `next.config.ts`

- [ ] **Step 1: Adicionar serverExternalPackages**

```typescript
// next.config.ts
export const config = {
  serverExternalPackages: ["@takumi-rs/core"],
};
```

---

## Task 3: Criar Componente RoastOGImage

**Files:**
- Create: `src/components/og/roast-og-image.tsx`
- Create: `src/components/og/og-error.tsx`

- [ ] **Step 1: Criar roast-og-image.tsx**

```tsx
import { Roast } from "@/db/schema";

interface RoastOGImageProps {
  roast: Roast;
}

export function RoastOGImage({ roast }: RoastOGImageProps) {
  const verdictColors = {
    needs_serious_help: "#EF4444",
    rough_around_edges: "#F59E0B",
    decent_code: "#10B981",
    solid_work: "#10B981",
    exceptional: "#10B981",
  };

  const verdictLabels = {
    needs_serious_help: "needs_serious_help",
    rough_around_edges: "rough_around_edges",
    decent_code: "decent_code",
    solid_work: "solid_work",
    exceptional: "exceptional",
  };

  return (
    <div
      style={{
        width: 1200,
        height: 630,
        backgroundColor: "#0C0C0C",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 64,
        gap: 28,
      }}
    >
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ color: "#10B981", fontSize: 24, fontWeight: 700, fontFamily: "JetBrains Mono" }}>&gt;</span>
        <span style={{ color: "#E5E5E5", fontSize: 20, fontWeight: 500, fontFamily: "JetBrains Mono" }}>devroast</span>
      </div>

      {/* Score */}
      <div style={{ display: "flex", alignItems: "flex-end", gap: 4 }}>
        <span style={{ color: "#F59E0B", fontSize: 160, fontWeight: 900, fontFamily: "JetBrains Mono", lineHeight: 1 }}>
          {roast.score.toFixed(1)}
        </span>
        <span style={{ color: "#737373", fontSize: 56, fontFamily: "JetBrains Mono", lineHeight: 1 }}>/10</span>
      </div>

      {/* Verdict */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div
          style={{
            width: 12,
            height: 12,
            borderRadius: "50%",
            backgroundColor: verdictColors[roast.verdict],
          }}
        />
        <span style={{ color: verdictColors[roast.verdict], fontSize: 20, fontFamily: "JetBrains Mono" }}>
          {verdictLabels[roast.verdict]}
        </span>
      </div>

      {/* Lang Info */}
      <span style={{ color: "#737373", fontSize: 16, fontFamily: "JetBrains Mono" }}>
        lang: {roast.language} · {roast.lineCount} lines
      </span>

      {/* Quote */}
      <div style={{ maxWidth: "100%", textAlign: "center" }}>
        <span style={{ color: "#E5E5E5", fontSize: 22, fontFamily: "IBM Plex Mono", lineHeight: 1.5 }}>
          &quot;{roast.roastQuote}&quot;
        </span>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Criar og-error.tsx**

```tsx
export function OGError() {
  return (
    <div
      style={{
        width: 1200,
        height: 630,
        backgroundColor: "#0C0C0C",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 32,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ color: "#10B981", fontSize: 24, fontWeight: 700 }}>&gt;</span>
        <span style={{ color: "#E5E5E5", fontSize: 20, fontFamily: "JetBrains Mono" }}>devroast</span>
      </div>

      <span style={{ color: "#EF4444", fontSize: 32, fontWeight: 700 }}>404</span>
      <span style={{ color: "#737373", fontSize: 20, fontFamily: "JetBrains Mono" }}>Roast not found</span>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "12px 24px",
          borderRadius: 8,
          border: "1px solid #2A2A2A",
        }}
      >
        <span style={{ color: "#737373", fontSize: 14, fontFamily: "JetBrains Mono" }}>← Go to home</span>
      </div>
    </div>
  );
}
```

---

## Task 4: Criar Helper createCaller

**Files:**
- Modify: `src/trpc/server.tsx`

- [ ] **Step 1: Adicionar createCaller em server.tsx**

```typescript
import { appRouter } from "./routers/_app";

// Adicionar esta função
export function createCaller() {
  return appRouter.createCaller({});
}
```

---

## Task 5: Criar API Route OG

**Files:**
- Create: `src/app/api/og/[id]/route.ts`

- [ ] **Step 1: Criar route.ts**

```typescript
import { ImageResponse } from "@takumi-rs/image-response";
import { RoastOGImage } from "@/components/og/roast-og-image";
import { OGError } from "@/components/og/og-error";
import { createCaller } from "@/trpc/server";

const width = 1200;
const height = 630;

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const caller = createCaller();

  try {
    const data = await caller.roast.getById({ id });
    const response = new ImageResponse(<RoastOGImage roast={data.roast} />, {
      width,
      height,
      format: "png",
    });

    response.headers.set("Cache-Control", "public, max-age=31536000, immutable");
    return response;
  } catch {
    const response = new ImageResponse(<OGError />, {
      width,
      height,
      format: "png",
    });

    response.headers.set("Cache-Control", "public, max-age=31536000, immutable");
    return response;
  }
}
```

---

## Task 6: Adicionar Metadata à Página de Resultados

**Files:**
- Modify: `src/app/roast/[id]/page.tsx`

- [ ] **Step 1: Adicionar generateMetadata e importar createCaller**

```typescript
import type { Metadata } from "next";
import { Suspense } from "react";
import { RoastResultSkeleton } from "@/components/roast-result-skeleton";
import { prefetch, trpc, createCaller } from "@/trpc/server";
import { RoastResult } from "./roast-result";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const caller = createCaller();

  try {
    const data = await caller.roast.getById({ id });

    return {
      title: `Roast Results | devroast`,
      description: `"${data.roast.roastQuote}" - Score: ${data.roast.score}/10`,
      openGraph: {
        title: `devroast | Score: ${data.roast.score}/10`,
        description: data.roast.roastQuote,
        images: [`/api/og/${id}`],
      },
      twitter: {
        card: "summary_large_image",
        images: [`/api/og/${id}`],
      },
    };
  } catch {
    return {
      title: "Roast Not Found | devroast",
    };
  }
}

export default async function RoastResultsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  void prefetch(trpc.roast.getById.queryOptions({ id }));

  return (
    <Suspense fallback={<RoastResultSkeleton />}>
      <RoastResult id={id} />
    </Suspense>
  );
}
```

---

## Task 7: Verificar Build

**Files:**
- (none - apenas verificação)

- [ ] **Step 1: Rodar build**

```bash
npm run build
```

Expected: Build completo sem erros

---

## Task 8: Testar OG Image

- [ ] **Step 1: Iniciar dev server e testar**

```bash
npm run dev
```

- [ ] **Step 2: Acessar `/api/og/[id-existente]`**

Verificar se imagem PNG é retornada com status 200

- [ ] **Step 3: Acessar `/api/og/[id-inexistente]`**

Verificar se imagem de erro 404 é retornada

---

## Resumo das Tasks

1. [ ] Task 1: Instalar Dependência Takumi
2. [ ] Task 2: Configurar Next.js para Takumi
3. [ ] Task 3: Criar Componente RoastOGImage
4. [ ] Task 4: Criar Helper createCaller
5. [ ] Task 5: Criar API Route OG
6. [ ] Task 6: Adicionar Metadata à Página
7. [ ] Task 7: Verificar Build
8. [ ] Task 8: Testar Manual
