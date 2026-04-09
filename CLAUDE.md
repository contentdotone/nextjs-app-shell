@AGENTS.md

# nextjs-app-shell — Project Reference

## What this is

A Next.js App Router starter template for building apps in the Content.One/Zesty.io ecosystem. Includes Zesty App SDK integration, SSO login, and a Cloud Run deployment pipeline. Clone this and customize it to build new Content.One apps.

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js (App Router, TypeScript) |
| Styling | Tailwind CSS |
| Auth | Zesty App SDK (iframe postMessage) + SSO (Google/GitHub/Microsoft) |
| Deployment | Docker → Google Cloud Run (`us-east4`) |

---

## Key Commands

```bash
npm run dev      # Local dev server (http://localhost:3000)
npm run build    # Production build
npm run lint     # ESLint
npm start        # Start production server locally

# Docker (port 8080 to match Cloud Run)
docker build -t nextjs-app-shell .
docker run -p 8080:8080 nextjs-app-shell
```

---

## Branching Strategy

| Branch | Purpose |
|---|---|
| `production` | Active. All current work goes here. |
| `stage` | Staging (mirrors production) |
| `dev` | Dev (mirrors production) |

Always commit and push to `production` **and** sync `stage` + `dev` unless told otherwise:
```bash
git push origin production stage dev
```

---

## Deployment Flow

Cloud Build (`cloudbuild.yaml`) triggers on push:
1. Docker build → tags `gcr.io/$PROJECT_ID/nextjs-app-shell:$COMMIT_SHA` + `:latest`
2. Push to Container Registry
3. Deploy to Cloud Run (`us-east4`, `--allow-unauthenticated`, `--port=8080`)

Update the service name in `cloudbuild.yaml` when customizing for a specific app.

---

## Project Structure

```
src/
  app/              # Next.js App Router pages and API routes
  components/       # Shared UI components (AppHeader, AppShell, InstanceSwitcher)
  context/          # React contexts (InstanceContext)
  hooks/            # Custom hooks (useZestySDK)
  i18n/             # Translations and LanguageProvider (en, es, nl)
  types/            # TypeScript type declarations
public/
  manifest.json     # App manifest for Content.One marketplace/installer
```

---

## Conventions

- **i18n**: Always use `const { t } = useT()` for user-facing strings. Never hardcode English text in components. Add new keys to `src/i18n/en.ts`, `es.ts`, and `nl.ts`.
- **Manifest**: Update `public/manifest.json` when customizing the shell for a specific app — name, description, icon, features, and repository must reflect the real app.
- **Strings**: All translatable strings are keyed in `src/i18n/en.ts`. The key format is `"section.key"` (e.g. `"header.appName"`, `"login.title"`).

---

## Auth

- **SSO**: Google, GitHub, and Microsoft via `https://auth.api.zesty.io`. Redirects set an `APP_SID` cookie.
- **Manual login**: Paste an `APP_SID` token directly at `/login` for dev/debug.
- **iframe mode**: When running inside Zesty Manager, the Zesty App SDK handles auth via `postMessage` from the parent shell. The login page is skipped entirely.

---

## Instance Switching

- `InstanceContext` (`src/context/InstanceContext.tsx`) provides `instanceZUID`, `instanceName`, `instances`, and `switchInstance`.
- `InstanceSwitcher` component renders a searchable dropdown in the header.
- Selected instance is persisted to `localStorage` (`lastInstance` key) and synced to the `?instance=` URL param.

---

## API Routes

| Route | Purpose |
|---|---|
| `/api/instances` | Proxies `GET /v1/instances` from accounts API, returns `[{ ZUID, name }]` |

Add new proxy routes under `src/app/api/` following the same pattern (read `APP_SID` cookie, proxy to Zesty API, return mapped data).

---

## Figma

Reference file for designs: `1IWlokFl7JGqOmfcxFufMe`

Use `mcp__figma-desktop__get_metadata` + `mcp__figma-desktop__get_design_context` to pull designs. The file must be open in Figma Desktop for the MCP tools to access it.
