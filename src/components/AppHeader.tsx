"use client";

import { useEffect, useRef, useState } from "react";
import { useInstance } from "@/context/InstanceContext";
import { useLanguage, useT, type Language } from "@/i18n";
import { InstanceSwitcher } from "./InstanceSwitcher";

// ─── Icons ───────────────────────────────────────────────────────────────────

function GlobeIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="shrink-0"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

function ChevronDown() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="shrink-0 opacity-60"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

// ─── Language Switcher ───────────────────────────────────────────────────────

const LANGUAGES: { code: Language; labelKey: "lang.en" | "lang.es" | "lang.nl" }[] = [
  { code: "en", labelKey: "lang.en" },
  { code: "es", labelKey: "lang.es" },
  { code: "nl", labelKey: "lang.nl" },
];

function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  const { t } = useT();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const currentLabel = t(LANGUAGES.find((l) => l.code === language)!.labelKey);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 rounded-lg border border-white/20 bg-white/10 hover:bg-white/20 px-2.5 py-1.5 text-sm font-medium text-white transition-colors"
        aria-label={t("lang.label")}
      >
        <GlobeIcon />
        <span className="hidden sm:inline">{currentLabel}</span>
        <ChevronDown />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 z-50 w-36 rounded-xl border border-[var(--border)] bg-white shadow-[var(--shadow-sm)] overflow-hidden py-1">
          {LANGUAGES.map(({ code, labelKey }) => (
            <button
              key={code}
              type="button"
              onClick={() => {
                setLanguage(code);
                setOpen(false);
              }}
              className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                language === code
                  ? "bg-[var(--brand-50)] text-[var(--brand-600)] font-semibold"
                  : "text-[var(--fg-primary)] hover:bg-[var(--bg-secondary)]"
              }`}
            >
              {t(labelKey)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── AppHeader ───────────────────────────────────────────────────────────────

export function AppHeader() {
  const { isIframe } = useInstance();
  const { t } = useT();

  if (isIframe) return null;

  return (
    <header className="flex items-center justify-between px-4 h-14 shrink-0 bg-[var(--brand-600)] border-b border-white/10">
      {/* Left: logo + app name */}
      <div className="flex items-center gap-3">
        <img
          src="/content-one-logo.svg"
          alt="Content.One"
          width={22}
          height={22}
          className="shrink-0"
        />
        <span className="text-sm font-semibold text-white tracking-tight">
          {t("header.appName")}
        </span>
      </div>

      {/* Right: language switcher + instance switcher */}
      <div className="flex items-center gap-2">
        <LanguageSwitcher />
        <InstanceSwitcher />
      </div>
    </header>
  );
}
