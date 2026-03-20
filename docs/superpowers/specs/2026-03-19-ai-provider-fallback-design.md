# AI Provider Fallback — Specification

> Implement fallback between Gemini and OpenAI APIs when one fails or is unavailable.

## Contexto

O Devroast já tem integração com Gemini. Agora queremos adicionar suporte a OpenAI como backup, para caso o Gemini falhe (rate limit, quota exceeded) ou não esteja configurado.

## Decisões de Design

### 1. Environment Variables

```bash
GEMINI_API_KEY=<gemini-key>   # opcional
OPENAI_API_KEY=<openai-key>   # opcional
```

Pelo menos uma API key deve estar configurada.

### 2. Fallback Strategy

- Tentar Gemini primeiro (se configurado)
- Se Gemini falhar, tentar OpenAI (se configurado)
- Se ambas falharem, lançar erro
- Próximo passo: adicionar retry logic com exponential backoff

### 3. Arquitetura

```
generateContent(prompt, roastMode)
    │
    ├─→ try Gemini (se GEMINI_API_KEY existe)
    │       │
    │       ├─→ sucesso: retorna response
    │       └─→ erro 429/5xx/network: guarda erro, tenta próximo
    │                    erro 401/403: throw imediatamente (chave inválida)
    │
    └─→ catch → try OpenAI (se OPENAI_API_KEY existe)
                │
                ├─→ sucesso: retorna response
                └─→ catch → throw Error("All AI providers failed")
```

### 4. Error Handling por Tipo

| Error | Ação |
|---|---|
| 401/403 (auth) | Throw imediatamente - chave inválida não funcionará em nenhum provider |
| 429 (rate limit) | Fallback para próximo provider |
| 500/502/503 | Fallback para próximo provider |
| Network/timeout | Fallback para próximo provider |
| Unknown | Fallback após logging |

### 5. Provider Interface

```typescript
interface AIProvider {
  name: string;
  call(prompt: string, roastMode: boolean): Promise<string>;
}
```

Cada provider implementa sua própria lógica de chamada.

### 6. Environment Validation

- Verificar keys no momento da chamada (lazy), não no load do módulo
- Se nenhuma key configurada: throw Error com mensagem descritiva

### 7. OpenAI Model

Usar `gpt-4o-mini` (custo-benefício, rápido)

---

## Estrutura de Arquivos

```
src/lib/ai/
├── client.ts      # MOD - main entry point with fallback
├── gemini.ts      # EXTRACT - Gemini provider (from client.ts)
├── openai.ts      # NEW - OpenAI provider implementation
├── prompts.ts     # existing
└── analyzer.ts   # existing
```

---

## To-do de Implementação

- [ ] Extrair lógica do Gemini para `src/lib/ai/gemini.ts`
- [ ] Criar `src/lib/ai/openai.ts` — implementar OpenAI provider
- [ ] Modificar `src/lib/ai/client.ts` — adicionar fallback logic
- [ ] Testar fluxo completo
