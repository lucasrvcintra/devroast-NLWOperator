# tRPC

## Estrutura

```
src/trpc/
├── init.ts              # initTRPC, context, baseProcedure
├── server.tsx           # Server helpers (trpc, prefetch, HydrateClient)
├── client.tsx           # Client provider (TRPCReactProvider, useTRPC)
├── query-client.ts      # QueryClient factory
└── routers/
    ├── _app.ts          # App router (merge de sub-routers)
    └── roast.ts         # Procedures de roast
```

## Criar nova procedure

### 1. Adicionar no router existente ou criar novo

```tsx
// src/trpc/routers/roast.ts
export const roastRouter = createTRPCRouter({
  getById: baseProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const [roast] = await ctx.db.select().from(roasts).where(eq(roasts.id, input.id));
      return roast;
    }),
});
```

### 2. Tipos sempre serializáveis

```tsx
// Converter tipos do Drizzle para primitivos
avgScore: Number(stats?.avgScore) ?? 0  // avg() retorna bigint ou similar
```

## Uso no Frontend

### Server Component com prefetch

```tsx
// src/app/page.tsx
import { HydrateClient, prefetch, trpc } from "@/trpc/server";

export default async function Page() {
  void prefetch(trpc.roast.getStats.queryOptions());
  
  return (
    <HydrateClient>
      <StatsComponent />
    </HydrateClient>
  );
}
```

### Client Component com hook

```tsx
// src/components/stats.tsx
"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

export function Stats() {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.roast.getStats.queryOptions());
  
  return <div>{data.totalRoasts}</div>;
}
```

## Regras

1. Sempre usar `useSuspenseQuery` (suporta Suspense)
2. Prefetch no server com `void prefetch()` (sem await para streaming)
3. Converter tipos não-serializáveis antes de retornar
4. Expor `db` via contexto para queries diretas
5. Usar `Promise.all` para queries independentes em Server Components

## Queries Paralelas

Quando precisar buscar múltiplos dados independentes, usar `Promise.all` com o `caller`:

```tsx
async function PageWithMultipleData() {
  const [stats, leaderboard] = await Promise.all([
    caller.roast.getStats(),
    caller.roast.getLeaderboard({ limit: 3 }),
  ]);
  
  return <Page stats={stats} leaderboard={leaderboard} />;
}
```
