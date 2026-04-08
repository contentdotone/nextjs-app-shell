"use client";

import { useZestySDK } from "@/hooks/useZestySDK";

const statusLabel: Record<string, string> = {
  idle: "Idle",
  initializing: "Connecting…",
  connected: "Connected",
  standalone: "Standalone",
  error: "Error",
};

const statusColor: Record<string, string> = {
  idle: "bg-zinc-400",
  initializing: "bg-yellow-400 animate-pulse",
  connected: "bg-green-500",
  standalone: "bg-zinc-400",
  error: "bg-red-500",
};

export default function Home() {
  const sdk = useZestySDK();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white dark:bg-black">
      <main className="flex flex-col items-center gap-6 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-black dark:text-white">
          Content.One App
        </h1>
        <p className="text-lg text-zinc-500 dark:text-zinc-400">Coming soon.</p>

        <div className="flex items-center gap-2 rounded-full border border-zinc-200 dark:border-zinc-800 px-4 py-2 text-sm text-zinc-600 dark:text-zinc-400">
          <span
            className={`h-2 w-2 rounded-full ${statusColor[sdk.status]}`}
          />
          <span>
            Zesty SDK&nbsp;&mdash;&nbsp;{statusLabel[sdk.status]}
            {sdk.status === "connected" && sdk.instanceZUID
              ? ` · ${sdk.instanceZUID}`
              : ""}
          </span>
        </div>
      </main>
    </div>
  );
}
