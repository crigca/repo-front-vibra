# Repository Guidelines

## Project Structure & Module Organization
- `src/` hosts the React + TypeScript app; entry `main.tsx`, global styles in `index.css`, shared tokens in `styles/variables.css`.
- Features live under `components/` with co-located CSS; layout shells sit in `components/layouts`.
- Shared state and data access live in `context/`, `hooks/`, and `services/` (axios setup in `services/api`); domain types in `types/`, helpers in `utils/`, and static data in `data/`.
- Static assets are served from `public/`; documentation assets land in `docs/static_page`.

## Build, Test, and Development Commands
- `npm install` once to fetch dependencies (npm is preferred because `package-lock.json` is tracked).
- `npm run dev` starts the Vite dev server with HMR for local development.
- `npm run build` type-checks with `tsc -b` then builds the production bundle to `dist/`.
- `npm run preview` serves the built bundle to validate the production output.
- `npm run lint` runs ESLint with React Hooks rules and TypeScript recommendations.

## Coding Style & Naming Conventions
- Use TypeScript, functional components, and hooks; components and files are PascalCase (`MusicPlayer.tsx`, `Profile.tsx`); hooks are prefixed with `use`.
- Keep indentation at 2 spaces and prefer single quotes, matching the existing codebase; co-locate CSS as `<Component>.css`.
- Route all HTTP calls through `src/services` and the shared axios instance in `services/api/axiosInstance.ts` to keep headers/interceptors consistent.

## Testing Guidelines
- No automated suite is checked in yet; when adding tests, prefer Vitest with Testing Library to stay aligned with Vite + React.
- Place tests alongside code (`Component.test.tsx`) or under `src/__tests__/`; mirror names after the component or hook under test.
- Cover error handling in `utils/errorHandler.ts` and async flows in hooks such as `useMusic` and `usePlaylists`.

## Commit & Pull Request Guidelines
- Keep commit messages short and imperative as in history (e.g., `Refactor MusicPlayer visuals`); avoid multi-topic commits.
- Use feature-scoped branches and link issues/tickets in the PR description.
- PRs should include: what changed, why, screenshots/GIFs for UI changes, reproduction steps, and a checklist showing `npm run lint` and `npm run build` (or `npm run preview`) were exercised.
- Never commit secrets; use `.env.example` as the template and keep real values only in your local `.env`.
