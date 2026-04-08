"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// ─── Icons ───────────────────────────────────────────────────────────────────

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true" className="shrink-0">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4" />
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853" />
      <path d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z" fill="#FBBC05" />
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 6.293C4.672 4.166 6.656 3.58 9 3.58z" fill="#EA4335" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" className="shrink-0" fill="currentColor">
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

function MicrosoftIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 21 21" aria-hidden="true" className="shrink-0">
      <rect x="1" y="1" width="9" height="9" fill="#f25022" />
      <rect x="11" y="1" width="9" height="9" fill="#7fba00" />
      <rect x="1" y="11" width="9" height="9" fill="#00a4ef" />
      <rect x="11" y="11" width="9" height="9" fill="#ffb900" />
    </svg>
  );
}

// ─── SSO Button ───────────────────────────────────────────────────────────────

function SSOButton({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <a
      href={href}
      className="w-full flex items-center justify-center gap-3 rounded-lg border border-[var(--border)] bg-white hover:bg-[var(--bg-secondary)] px-4 py-2.5 text-sm font-medium text-[var(--fg-primary)] shadow-[var(--shadow-xs)] transition-colors"
    >
      {icon}
      {label}
    </a>
  );
}

// ─── Divider ─────────────────────────────────────────────────────────────────

function Divider() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-px bg-[var(--border)]" />
      <span className="text-xs text-[var(--fg-tertiary)]">or</span>
      <div className="flex-1 h-px bg-[var(--border)]" />
    </div>
  );
}

// ─── Manual Login ─────────────────────────────────────────────────────────────

function ManualLoginSection() {
  const router = useRouter();
  const [token, setToken] = useState("");

  function handleStart(e: React.FormEvent) {
    e.preventDefault();
    const val = token.trim();
    if (!val) return;
    document.cookie = `APP_SID=${val}; path=/; SameSite=Lax`;
    router.push("/");
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-0.5">
        <p className="text-xs font-semibold text-[var(--fg-secondary)] uppercase tracking-wide">
          Manual login
        </p>
        <p className="text-xs text-[var(--fg-tertiary)]">
          Paste an APP_SID token to sign in directly
        </p>
      </div>
      <form onSubmit={handleStart} className="flex gap-2">
        <input
          type="text"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="APP_SID token"
          className="flex-1 min-w-0 rounded-lg border border-[var(--border)] px-3 py-2 text-sm text-[var(--fg-primary)] placeholder:text-[var(--fg-disabled)] outline-none focus:ring-2 focus:ring-[var(--brand-600)] focus:border-transparent transition font-mono"
        />
        <button
          type="submit"
          disabled={!token.trim()}
          className="shrink-0 px-4 py-2 rounded-lg border border-[var(--border-strong)] bg-white shadow-[var(--shadow-xs)] ring-1 ring-black/[.06] ring-inset text-[var(--fg-secondary)] text-sm font-semibold hover:bg-[var(--bg-secondary)] transition-colors disabled:opacity-40"
        >
          Start
        </button>
      </form>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LoginPage() {
  const router = useRouter();

  // If running inside the Zesty Manager shell (iframe), skip login —
  // the ZestySDK handles auth via postMessage from the parent window.
  useEffect(() => {
    if (window.self !== window.top) {
      router.replace("/");
    }
  }, [router]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[var(--bg-secondary)] px-4">
      <div className="w-full max-w-sm">

        {/* Logo + heading */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-[var(--brand-600)] mb-4 p-3">
            <img src="/content-one-logo.svg" alt="Content.One" width={40} height={40} />
          </div>
          <h1 className="text-2xl font-semibold text-[var(--fg-primary)]">
            Content.One App
          </h1>
          <p className="text-sm text-[var(--fg-secondary)] mt-1">
            Sign in to continue
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-[var(--border)] shadow-[var(--shadow-sm)] p-8 flex flex-col gap-5">

          {/* SSO buttons */}
          <div className="flex flex-col gap-3">
            <SSOButton
              href="https://auth.api.zesty.io/google/login"
              icon={<GoogleIcon />}
              label="Continue with Google"
            />
            <SSOButton
              href="https://auth.api.zesty.io/github/login"
              icon={<GitHubIcon />}
              label="Continue with GitHub"
            />
            <SSOButton
              href="https://auth.api.zesty.io/azure/login"
              icon={<MicrosoftIcon />}
              label="Continue with Microsoft"
            />
          </div>

          <Divider />

          <ManualLoginSection />
        </div>
      </div>
    </main>
  );
}
