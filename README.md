# Lumen

Lumen is a general-purpose AI chat assistant. Ask it questions, brainstorm ideas, get help drafting writing, or ask
about the weather anywhere in the world — it streams responses in real time and can call tools (like live weather
lookup) as part of the conversation.

## Key technologies

- **TanStack Start** (React 19 + TanStack Router) for the app framework and file-based routing
- **TanStack AI** (`@tanstack/ai`) for streaming, multi-provider chat with tool calling
- **Tailwind CSS 4** for styling
- **Netlify AI Gateway** for zero-config access to Anthropic, OpenAI, and Gemini models once deployed

## Running locally

Install dependencies (already done during scaffolding):

```bash
pnpm install
```

Start the dev server:

```bash
pnpm dev
```

The app runs at `http://localhost:3000`. To get real AI responses locally (rather than falling back to a local Ollama
model), set one of these in your shell or a `.env` file before starting the server:

```
ANTHROPIC_API_KEY=...
OPENAI_API_KEY=...
GEMINI_API_KEY=...
```

On Netlify, no keys are needed — AI Gateway injects them automatically once the site has a production deploy.

## Project structure

See `AGENTS.md` for a full breakdown of the codebase, routing, and the AI provider fallback chain.
