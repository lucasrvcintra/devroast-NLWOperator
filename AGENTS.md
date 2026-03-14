# AGENTS.md

## Stack

- Next.js 16, React 19, Tailwind CSS v4
- `@` alias para `/src`

## Componentes UI

- Local: `src/components/ui/`
- Padrão: named exports, forwardRef, tailwind-variants
- Composição: `Card` + `CardTitle` + `CardDescription`, `TableRow` + cells

## Padrões

```tsx
// Props estendem elemento HTML nativo
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

// Tailwind variants
const btn = tv({ base: "...", variants: {...} })

// forwardRef obrigatório
const Button = forwardRef<HTMLButtonElement, ButtonProps>(...)
```

## Comandos

- `npm run dev` - Desenvolvimento
- `npm run build` - Build produção
