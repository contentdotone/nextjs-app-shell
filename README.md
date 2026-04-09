# nextjs-app-shell

A Next.js starter template for building apps inside the Content.One/Zesty.io ecosystem. Clone this repo to get a fully wired-up shell: App SDK integration, SSO login, Dockerfile, and Cloud Run deployment — ready to customize.

---

## What's Included

| Feature | Details |
|---|---|
| **Next.js App Router** | TypeScript, server components, `app/` directory |
| **Tailwind CSS** | v4, configured via PostCSS |
| **Zesty App SDK** | iframe postMessage handshake, auth token lifecycle, authenticated requests |
| **SSO Login** | Google, GitHub, Microsoft via `auth.api.zesty.io` |
| **Manual login** | Paste an `APP_SID` token directly (dev/debug) |
| **Dockerfile** | Multi-stage build, Node 20 Alpine, port 8080 |
| **cloudbuild.yaml** | Cloud Build CI/CD → Container Registry → Cloud Run |

---

## How the App SDK Works

Content.One apps run as iframes inside the Zesty Manager shell. The App SDK handles the auth handshake between your iframe and the parent shell.

### iframe mode (inside Zesty Manager)

1. The Zesty Manager shell loads your app in an iframe.
2. `window.ZestySDK.init(authUrl)` sends a postMessage to the parent window requesting a session token.
3. The parent shell responds with a signed token.
4. The SDK resolves with `{ token }` — store it and use it for API calls.
5. `sdk.startTokenKeepAlive()` runs a periodic check (default 30s) to detect expired sessions.
6. The parent also sends postMessages with instance metadata (e.g., `instance.ZUID`). Register a callback via `sdk.setMessageReceivedCallback` to receive them.

### Standalone mode (direct URL, not in iframe)

When the app is opened directly (not in an iframe), the SDK sets status to `"standalone"` and skips the postMessage flow. In this case, the user is redirected to `/login` to authenticate via SSO.

The login page detects `window.self !== window.top` and skips login if running inside an iframe.

### Authenticated API requests

```ts
// Auto-injects Authorization: Bearer <token>
const data = await window.ZestySDK.request("https://your-api.zesty.io/endpoint");
```

Or manually:

```ts
const token = window.ZestySDK.getToken();
fetch("https://your-api.zesty.io/endpoint", {
  headers: { Authorization: `Bearer ${token}` },
});
```

---

## File Structure

```
src/
  app/
    layout.tsx          # Root layout — loads App SDK script, sets metadata
    page.tsx            # Home page — reads SDK status, shows connection state
    globals.css         # Global styles + CSS variables
    login/
      page.tsx          # SSO login page (shown when running standalone)
      layout.tsx        # Login layout
  hooks/
    useZestySDK.ts      # React hook — initializes SDK, returns status/token/instanceZUID
  types/
    zesty-sdk.d.ts      # TypeScript types for window.ZestySDK
```

---

## Environment Variables

No required env vars for the shell itself. Add your own to `.env.local` for development and configure them as Cloud Run environment variables for production.

| Variable | Purpose |
|---|---|
| _(none required)_ | The App SDK auth URL is hardcoded to `https://auth.api.zesty.io` |

---

## How to Use This Template

### 1. Clone and install

```bash
git clone https://github.com/contentdotone/nextjs-app-shell.git my-app
cd my-app
npm install
```

### 2. Rename for your app

- `package.json` → change `"name"`
- `cloudbuild.yaml` → replace `nextjs-app-shell` with your service name (appears 5 times)
- `src/app/layout.tsx` → update `metadata.title` and `metadata.description`
- `src/app/page.tsx` → replace the placeholder UI with your app
- `src/app/login/page.tsx` → update the heading if needed

### 3. Develop locally

```bash
npm run dev
# http://localhost:3000

# Production build (type-check + compile)
npm run build
npm start
```

The SDK will report `"standalone"` status when running outside an iframe. Use the manual login on `/login` to paste an `APP_SID` token for testing authenticated requests locally.

### 4. Build and test with Docker

```bash
docker build -t my-app .
docker run -p 8080:8080 my-app
# http://localhost:8080
```

---

## How Auth Works

### In the Zesty Manager shell (iframe)

```
Manager shell
  └─ iframe: your app
       └─ useZestySDK()
            └─ window.ZestySDK.init("https://auth.api.zesty.io")
                 └─ postMessage → parent shell → returns token
                      └─ status: "connected", token available
```

The `useZestySDK` hook in `src/hooks/useZestySDK.ts` manages this lifecycle. Import it anywhere in your client components.

### Standalone (direct URL)

```
User opens app URL directly
  └─ not in iframe → status: "standalone"
       └─ redirect to /login
            └─ SSO via Google / GitHub / Microsoft
                 └─ sets APP_SID cookie → redirects to /
```

The `APP_SID` cookie is set after successful SSO and can be used to authenticate subsequent requests.

---

## Deploy to Cloud Run

### Prerequisites

- Google Cloud project with Cloud Build and Cloud Run APIs enabled
- A Cloud Build trigger connected to your repo

### Setup

1. Update `cloudbuild.yaml` — replace `nextjs-app-shell` with your service name.
2. Push to your branch. Cloud Build will:
   - Build the Docker image
   - Push to `gcr.io/$PROJECT_ID/<service-name>`
   - Deploy to Cloud Run in `us-east4`

### Manual deploy (gcloud)

```bash
gcloud run deploy my-app \
  --image gcr.io/YOUR_PROJECT/my-app:latest \
  --region us-east4 \
  --platform managed \
  --allow-unauthenticated \
  --port 8080
```

---

## App Manifest

The shell includes a `public/manifest.json` that describes the app to the Content.One/Zesty.io ecosystem. It is served at `/manifest.json` with no authentication required and is used by the marketplace and app installer to display app metadata.

**When you customize this template, update `public/manifest.json` with your app's real values before deploying.**

### Fields

| Field | Description |
|---|---|
| `name` | Full display name of the app |
| `short_name` | Short name for compact display |
| `description` | What the app does — shown in the marketplace |
| `version` | Semver version string (e.g. `"1.0.0"`) |
| `author` | Individual or team who built the app |
| `publisher` | Organization publishing the app |
| `target_audience` | Who the app is intended for |
| `cost` | Pricing (e.g. `"Free"`) |
| `icon` | URL to the app icon (SVG or PNG, publicly accessible) |
| `docs_url` | Path or URL to the app's documentation |
| `app_url` | Root path of the app (usually `"/"`) |
| `login_url` | Path to the login page (usually `"/login"`) |
| `screenshots` | Array of `{ src, label, description }` objects for marketplace display |
| `features` | Array of feature strings describing what the app does |
| `integrations` | Object describing SDK usage, SSO providers, and deployment target |
| `repository` | GitHub (or other) repo URL |

### Example

```json
{
  "name": "My App",
  "short_name": "MyApp",
  "description": "Does something useful for Zesty.io content teams.",
  "version": "1.0.0",
  "author": "Your Name",
  "publisher": "Your Org",
  "target_audience": "Content editors",
  "cost": "Free",
  "icon": "https://example.com/icon.svg",
  "docs_url": "/docs",
  "app_url": "/",
  "login_url": "/login",
  "screenshots": [
    { "src": "/screenshots/home.jpg", "label": "Home", "description": "Main dashboard" }
  ],
  "features": ["Feature one", "Feature two"],
  "integrations": {
    "zesty_app_sdk": true,
    "sso_providers": ["google", "github", "microsoft"],
    "deployment": "google_cloud_run"
  },
  "repository": "https://github.com/your-org/your-app"
}
```

---

## Branch Strategy

| Branch | Purpose |
|---|---|
| `production` | Live production |
| `stage` | Staging |
| `dev` | Development |
