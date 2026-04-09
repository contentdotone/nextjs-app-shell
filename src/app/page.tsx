"use client";

import { useInstance } from "@/context/InstanceContext";
import { useT } from "@/i18n";

export default function Home() {
  const { sdk, instanceName, instanceZUID, isIframe } = useInstance();
  const { t } = useT();

  const sdkStatusLabel: Record<string, string> = {
    idle: t("home.sdkIdle"),
    initializing: t("home.sdkInitializing"),
    connected: t("home.sdkConnected"),
    standalone: t("home.sdkStandalone"),
    error: t("home.sdkError"),
  };

  const sdkStatusColor: Record<string, string> = {
    idle: "bg-zinc-400",
    initializing: "bg-yellow-400 animate-pulse",
    connected: "bg-green-500",
    standalone: "bg-zinc-400",
    error: "bg-red-500",
  };

  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-white">
      <main className="flex flex-col items-center gap-6 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-[var(--fg-primary)]">
          {t("home.title")}
        </h1>

        {instanceName ? (
          <p className="text-lg text-[var(--fg-secondary)]">{instanceName}</p>
        ) : (
          <p className="text-lg text-[var(--fg-tertiary)]">{t("home.comingSoon")}</p>
        )}

        {instanceZUID && (
          <p className="text-xs font-mono text-[var(--fg-disabled)]">{instanceZUID}</p>
        )}

        <div className="flex items-center gap-2 rounded-full border border-[var(--border)] px-4 py-2 text-sm text-[var(--fg-tertiary)]">
          <span className={`h-2 w-2 rounded-full ${sdkStatusColor[sdk.status]}`} />
          <span>
            {t("home.sdkLabel")}&nbsp;&mdash;&nbsp;{sdkStatusLabel[sdk.status]}
            {isIframe
              ? ` · ${t("home.sdkIframe")}`
              : ` · ${t("home.sdkStandaloneMode")}`}
          </span>
        </div>
      </main>
    </div>
  );
}
