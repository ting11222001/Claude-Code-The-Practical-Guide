# CLAUDE.md

We're building the app described in @SPEC.MD. Read that file for general architectural tasks or to double-check the exact database structure, tech stack or application architecture.

Keep your replies extremely concise and focus on conveying the key information. No unnecessary fluff, no long code snippets.

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project status

This is a Next.js starter that is being built into the note-taking app described in `SPEC.MD`. Right now only the scaffold exists (`app/layout.tsx`, `app/page.tsx`). Treat `SPEC.MD` as the source of truth for features, the DB schema, file locations, API shapes, and security rules. Read the relevant section before you implement anything.

## Commands

Bun is the package manager and the runtime. The scripts run Next under Bun with `--bun`, which is required because the app uses Bun's built-in SQLite client (`bun:sqlite`).

```bash
bun install
bun run dev      # dev server at http://localhost:3000
bun run build
bun run start
bun run lint     # ESLint 9 flat config (eslint-config-next)
bun x tsc --noEmit   # type-check
```

## Tech stack

- **Next.js + React:** pages and API routes
- **TypeScript:** type safety
- **Tailwind CSS:** styling
- **Bun:** runtime and package manager
- **bun:sqlite:** database (built into Bun)

## Key dependencies

- **TipTap:** rich-text note editor
- **better-auth:** user sign-up and login
- **zod:** input validation
