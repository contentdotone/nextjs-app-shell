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
