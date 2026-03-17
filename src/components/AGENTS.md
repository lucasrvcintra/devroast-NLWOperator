# Componentes

## Estrutura

```
src/components/
├── ui/                    # Componentes UI reutilizáveis
│   ├── button.tsx
│   ├── card.tsx
│   └── ...
├── [feature]*.tsx         # Componentes específicos de feature
├── footer-stats.tsx
└── code-editor-wrapper.tsx
```

## Padrão: Componentes UI

Ver `src/components/ui/AGENTS.md` para detalhes completos.

Resumo:
- Named exports apenas
- forwardRef obrigatório
- Props estendem elemento HTML nativo
- Usar `tailwind-variants` para variantes
- Cores via classes canônicas (`bg-accent-green`, `text-text-primary`)

## Padrão: Server vs Client Components

### Server Components (default)
- Sem estado (`useState`)
- Sem efeitos (`useEffect`)
- Sem eventos (`onClick`)
- Dados do banco/server vindos diretamente

### Client Components
- `"use client"` no topo
- Estado, efeitos, eventos
- Wrappers para libs que dependem de browser (shiki, code editor)

## Wrappers Client

Quando um componente precisa de estado mas está em Server Component:

```tsx
// src/components/code-editor-wrapper.tsx
"use client";

import { useState } from "react";
import { CodeEditor } from "@/components/code-editor";

export function CodeEditorWrapper() {
  const [code, setCode] = useState("");
  return <CodeEditor value={code} onChange={setCode} />;
}
```

Uso:
```tsx
// src/app/page.tsx (Server Component)
import { CodeEditorWrapper } from "@/components/code-editor-wrapper";

export default async function Page() {
  return <CodeEditorWrapper />;
}
```

## Suspense + Skeleton

Para dados que vengam do banco/API:

```tsx
import { Suspense } from "react";
import { FooterStats } from "@/components/footer-stats";
import { prefetch, trpc } from "@/trpc/server";

export default async function Page() {
  void prefetch(trpc.roast.getStats.queryOptions());
  
  return (
    <Suspense fallback={<FooterStatsSkeleton />}>
      <FooterStats />
    </Suspense>
  );
}

function FooterStatsSkeleton() {
  return <div className="animate-pulse">Loading...</div>;
}
```
