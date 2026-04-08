"use client";

import { useInstance } from "@/context/InstanceContext";
import { InstanceSwitcher } from "./InstanceSwitcher";

export function AppHeader() {
  const { isIframe } = useInstance();

  // When running inside the Zesty Manager shell, the shell owns the chrome.
  if (isIframe) return null;

  return (
    <header className="flex items-center justify-between px-4 h-12 shrink-0 bg-[var(--brand-600)]">
      <div className="flex items-center gap-3">
        <img
          src="/content-one-logo.svg"
          alt="Content.One"
          width={20}
          height={20}
          className="shrink-0"
        />
        <span className="text-sm font-semibold text-white tracking-tight">
          App
        </span>
      </div>

      <InstanceSwitcher />
    </header>
  );
}
