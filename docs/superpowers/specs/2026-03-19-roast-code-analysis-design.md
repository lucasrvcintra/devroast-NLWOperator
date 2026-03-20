# Roast Code Analysis — Specification

> Feature para submeter código e receber análise via IA (Gemini), com opção de "roast mode" para feedback sarcástico.

## Contexto

O Devroast precisa da funcionalidade core: permitir que usuários enviem código, recebam análise da IA, e visualizem os resultados. O fluxo atual já tem o layout da página de resultados (`/roast/[id]`) com dados mockados. Falta implementar a integração real com IA e o fluxo completo de submit → redirect → results.

## Decisões de Design

### 1. Fluxo de Dados

```
User paste code → Submit → tRPC mutation (roast.create)
                                        │
                                        ▼
                              Gemini API call (normal ou roast)
                                        │
                                        ▼
                              Parse response → save to DB
                                        │
                                        ▼
                              Redirect to /roast/[id]
                                        │
                                        ▼
                              Fetch roast → Display results
```

### 2. AI Provider: Gemini

- **Pacote:** `@google/generative-ai`
- **Modelo:** `gemini-2.0-flash` (rápido, custo-benefício)
- **API Key:** `GEMINI_API_KEY` em `.env.local`

### 3. Roast Mode Toggle

- Toggle on/off no editor
- Só afeta o tom/wording da resposta (não a estrutura)
- Normal mode: feedback profissional, construtivo
- Roast mode: sarcástico, humorado (mas ainda útil)

### 4. Loading States

- **Botão:** Loading spinner no botão durante mutation
- **Resultados:** Navegação imediata para `/roast/[id]` + skeleton de loading na página

### 5. Estrutura de Resposta da IA

```typescript
interface RoastAnalysis {
  score: number;           // 0-10
  verdict: "needs_serious_help" | "rough_around_edges" | "decent_code" | "solid_work" | "exceptional";
  quote: string;           // Frase de impacto/roast
  analysis: Array<{
    severity: "critical" | "warning" | "good";
    title: string;
    description: string;
  }>;
  suggestedFix: Array<{    // Diff lines para o componente DiffLine
    type: "context" | "removed" | "added";
    content: string;
  }>;
}
```

### 6. Language Detection

- Usar `useLanguageDetection` hook existente (baseado em highlight.js)
- Language detectado é enviado junto com o código na mutation
- Display no results page: `lang: <language>`

### 7. tRPC Procedures

Usar queries existentes de `src/db/queries.ts`:

```typescript
// getById - usar getRoastWithAnalysis existente
export const roastRouter = createTRPCRouter({
  getById: baseProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      return getRoastWithAnalysis(input.id);
    }),

  create: baseProcedure
    .input(z.object({
      code: z.string().min(1).max(2000),
      language: z.string(),
      roastMode: z.boolean(),
    }))
    .mutation(async ({ ctx, input }) => {
      // 1. Chamar Gemini API
      // 2. Salvar roast + analysis items
      // 3. Retornar { id }
    }),
});
```

### 8. Error Handling

| Scenario | Behavior |
|---|---|
| AI API error | Show error toast, stay on editor |
| Invalid AI response | Throw error, show toast |
| Empty code | Disable submit button |
| Code exceeds limit | Show warning, disable submit |
| Rate limit hit | Retry with exponential backoff (max 3 attempts) |
| Request timeout | Fail after 30s, show error |

---

## Estrutura de Arquivos

```
src/
├── lib/ai/
│   ├── client.ts          # NEW - Gemini client setup
│   ├── prompts.ts         # NEW - System prompts (normal + roast)
│   └── analyzer.ts        # NEW - Parse Gemini response
├── components/
│   ├── code-editor-wrapper.tsx  # MOD - mutation + redirect
│   └── roast-result-skeleton.tsx  # NEW - Loading skeleton
├── trpc/
│   └── routers/roast.ts   # MOD - create mutation with AI
├── app/
│   └── roast/[id]/
│       ├── page.tsx       # MOD - fetch real data
│       └── roast-result.tsx  # NEW - Client component for data
```

---

## To-do de Implementação

- [ ] Instalar `@google/generative-ai`
- [ ] Criar `src/lib/ai/client.ts` — Gemini client setup
- [ ] Criar `src/lib/ai/prompts.ts` — System prompts (normal + roast mode)
- [ ] Criar `src/lib/ai/analyzer.ts` — Response parsing + Zod schema
- [ ] Modificar `src/trpc/routers/roast.ts` — Adicionar mutation `create` + query `getById`
- [ ] Criar `src/components/roast-result-skeleton.tsx` — Loading skeleton
- [ ] Modificar `src/components/code-editor-wrapper.tsx` — Add mutation + redirect
- [ ] Modificar `src/app/roast/[id]/page.tsx` — Fetch real data via tRPC
- [ ] Criar `src/app/roast/[id]/roast-result.tsx` — Client component
- [ ] Rodar lint + typecheck
- [ ] Testar fluxo completo
