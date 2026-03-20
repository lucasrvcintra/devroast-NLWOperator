# Open Graph Images para Roast Results — Specification

> Feature para gerar imagens OG dinâmicas quando links de roast são compartilhados no Twitter, LinkedIn, Discord, etc.

## Contexto

Quando um usuário compartilha o link de um roast (ex: `devroast.com/roast/abc-123`), é importante que a preview mostre:
- Score do código
- Verdict
- Quote do roast

Isso melhora significativamente a taxa de cliques em redes sociais.

## Decisões de Design

### 1. Geração Sob Demanda

```
GET /api/og/[id]
    │
    ▼
tRPC caller.roast.getById({ id })
    │
    ▼
ImageResponse(<RoastOGImage />, { width: 1200, height: 630 })
    │
    ▼
PNG image response
```

- Gera imagem quando o crawler/social bot acessa o link
- Não ocupa storage permanente
- Sem necessidade de job em background

### 2. Dados via tRPC

Usa o mesmo `caller.roast.getById()` já existente na página de resultados. Isso garante consistência de dados.

### 3. Componente OG

Baseado no frame `leftSide` do design pen:

| Elemento | Estilo |
|----------|--------|
| Background | `#0C0C0C` |
| Logo | `> devroast` com `>` em verde |
| Score | `X.X/10` com cor amber |
| Verdict | Dot colorido + texto |
| Lang info | `lang: javascript · N lines` |
| Quote | Aspas com texto do roast |

#### Verdicts e Cores

| Verdict | Cor |
|---------|-----|
| needs_serious_help | `#EF4444` (red) |
| rough_around_edges | `#F59E0B` (amber) |
| decent_code | `#10B981` (green) |
| solid_work | `#10B981` (green) |
| exceptional | `#10B981` (green) |

### 4. Imagem de Erro (404)

Quando o roast não é encontrado:

```
┌────────────────────────────────────┐
│  > devroast                        │
│                                    │
│         404                        │
│    Roast not found                 │
│                                    │
│    [ ← Go to home ]                │
└────────────────────────────────────┘
```

- Cache agressivo (mesmo TTL da imagem de sucesso)
- Botão decorativo apenas (não clicável na imagem)

### 5. Cache HTTP

```
Cache-Control: public, max-age=31536000, immutable
```

- Uma vez gerada, imagem nunca muda (roasts são imutáveis)
- Aggressive caching para melhor performance

### 6. Metadata na Página de Resultados

```tsx
// src/app/roast/[id]/page.tsx
export async function generateMetadata({ params }) {
  return {
    openGraph: {
      images: [`/api/og/${id}`],
    },
    twitter: {
      card: "summary_large_image",
      images: [`/api/og/${id}`],
    },
  };
}
```

### 7. Tech Stack

- **Takumi:** `@takumi-rs/image-response` para renderização JSX → PNG
- **Fontes:** JetBrains Mono + IBM Plex Mono (devem ser fetchadas ou bundled)

---

## Estrutura de Arquivos

```
src/
├── app/
│   └── api/
│       └── og/
│           └── [id]/
│               └── route.ts    # API handler
└── components/
    └── og/
        ├── roast-og-image.tsx  # Componente principal
        └── og-error.tsx         # Componente de erro 404
```

---

## To-do de Implementação

- [ ] Instalar `@takumi-rs/image-response`
- [ ] Configurar `serverExternalPackages` no next.config.ts
- [ ] Criar `src/components/og/roast-og-image.tsx`
- [ ] Criar `src/components/og/og-error.tsx`
- [ ] Criar `src/app/api/og/[id]/route.ts`
- [ ] Adicionar `generateMetadata` na página de resultados
- [ ] Rodar lint + typecheck
- [ ] Testar手动 (verificar preview em OG debugger)

---

## Notas

- Takumi usa sintaxe similar a Tailwind (`tw` prop) mas com `style` objects para maior compatibilidade
- Fontes precisam estar disponíveis no contexto server (fetch ou bundled)
- PNG é prioritário sobre WebP para melhor compatibilidade com crawlers antigos
