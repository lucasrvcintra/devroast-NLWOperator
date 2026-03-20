# DevRoast

Cole seu código. Receba uma análise implacável.

## Funcionalidades

- **Análise de Código**: Envie qualquer código e receba feedback sobre qualidade, performance e boas práticas
- **Roast Mode**: Modo com análises sarcásticas e bem-humoradas
- **Leaderboard**: Veja os piores seus piores códigos ranqueados por vergonha
- **Interface Minimalista**: Design focado no essencial com experiência fluida

## Tecnologias

- Next.js 16
- React 19
- Tailwind CSS v4
- Drizzle ORM
- PostgreSQL

## Pré-requisitos

- Node.js 20+
- Docker (opcional)

## Configuração

1. Clone o repositório
2. Copie o arquivo de exemplo:
   ```bash
   cp .env.example .env.local
   ```
3. Configure as variáveis de ambiente no `.env.local`

## Como Executar (Sem Docker)

```bash
# Instalar dependências
npm install

# Configurar o banco de dados
npm run db:generate
npm run db:push

# Popular o banco com dados de exemplo
npm run db:seed

# Iniciar o servidor de desenvolvimento
npm run dev
```

Acesse http://localhost:3000

## Como Executar (Com Docker)

### Iniciar o banco de dados

```bash
# Iniciar o container PostgreSQL
docker-compose up -d

# Verificar se o container está rodando
docker-compose ps
```

### Configurar o banco

```bash
# Copiar variáveis de ambiente
cp .env.example .env.local

# Gerar migrations
npm run db:generate

# Executar migrations
npm run db:push

# Popular o banco (opcional)
npm run db:seed

# Iniciar a aplicação
npm run dev
```

## Comandos Úteis

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Iniciar desenvolvimento |
| `npm run build` | Build de produção |
| `npm run db:generate` | Gerar migrations |
| `npm run db:push` | Executar migrations no banco |
| `npm run db:seed` | Popular banco com dados exemplos |
| `npm run db:studio` | Abrir Drizzle Studio |

---

Desenvolvido durante o **NLW da Rocketseat** - Evento Next Level Week.
