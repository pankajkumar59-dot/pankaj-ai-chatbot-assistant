# AGENTS.md

This document provides an overview of the project structure for developers and AI agents working on this codebase.

## Project Overview

Lumen is a general-purpose AI chat assistant: a single-screen conversational UI that answers questions, brainstorms,
helps with writing, and can look up live weather for any city via a tool call. Built with TanStack Start and deployed
on Netlify.

### Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | TanStack Start |
| Frontend | React 19, TanStack Router v1 |
| Build | Vite 7 |
| Styling | Tailwind CSS 4 |
| AI | TanStack AI (`@tanstack/ai`) with multi-provider streaming chat |
| Language | TypeScript 5.9 (strict mode) |
| Deployment | Netlify (AI Gateway for model access) |

## Directory Structure

```
├── public/                      # Static assets (favicon, logos)
├── src
│   ├── lib
│   │   ├── ai-hook.ts            # useAIChat hook: wraps @tanstack/ai-react's useChat over SSE at /api/chat
│   │   └── weather-tools.ts      # `getWeather` tool definition + mock server implementation
│   ├── routes
│   │   ├── __root.tsx            # Root HTML shell, page title/meta, global styles
│   │   ├── api.chat.ts           # POST /api/chat — multi-provider streaming chat with tool calling
│   │   └── index.tsx             # The whole app: header, empty-state suggestions, message list, composer
│   ├── router.tsx                # TanStack Router instance
│   └── styles.css                # Tailwind entrypoint + highlight.js theme for code blocks
├── netlify.toml                  # Build command (vite build), publish dir (dist/client), dev server port
├── package.json
├── tsconfig.json                 # `@/*` path alias → `src/*`
└── vite.config.ts                # TanStack Start + React + Tailwind + Netlify plugins
```

## Key Concepts

### File-Based Routing (TanStack Router)

Routes are defined by files in `src/routes/`:

- `__root.tsx` - Root layout wrapping the page
- `index.tsx` - Route for `/`, the entire chat UI
- `api.chat.ts` - Server API endpoint at `/api/chat`

### AI Integration

`src/routes/api.chat.ts` picks the first available provider, in order:

1. Anthropic Claude (`claude-haiku-4-5`) — used if `ANTHROPIC_API_KEY` is set
2. OpenAI (`gpt-4o`) — used if `OPENAI_API_KEY` is set
3. Google Gemini (`gemini-2.5-flash`) — used if `GEMINI_API_KEY` is set
4. Ollama (`mistral:7b`, local) — fallback when no cloud key is present

On Netlify, these environment variables are injected automatically by **AI Gateway** once the site has a production
deploy — no manual API key setup is required. See the `netlify-ai-gateway` skill for details, and only use model IDs
from that skill's supported list when changing models.

**Tools available to the assistant:**
- `getWeather` (`src/lib/weather-tools.ts`) — returns temperature, condition, and humidity for a city. Currently mock
  data; swap the implementation for a real weather API if live data is needed.

### Streaming

Responses stream over Server-Sent Events: the server returns `toServerSentEventsResponse(...)` and the client consumes
it via `fetchServerSentEvents` in `src/lib/ai-hook.ts`. The `useAIChat` hook exposes `messages`, `sendMessage`,
`isLoading`, and `stop`.

## Conventions

- **Styling:** Tailwind utility classes only, no CSS modules. Indigo/violet is the accent color used throughout.
- **TypeScript:** strict mode; import paths use the `@/` alias; prefer `type` imports for types.
- **State:** local React state (`useState`) is sufficient for this single-screen app — no global store is in use.

## Non-obvious decisions

- The provider fallback chain (`api.chat.ts`) exists so the app degrades gracefully across environments: it works
  immediately on Netlify (via AI Gateway), and still works locally against Ollama with no keys configured at all.
- `getWeather` returns mocked data by design — it demonstrates the tool-calling loop without requiring a third-party
  weather API key. Replace it with a real API call if accurate weather data becomes a requirement.
