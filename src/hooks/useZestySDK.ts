"use client";

import { useEffect, useState } from "react";

const AUTH_URL = "https://auth.api.zesty.io";

export type SDKStatus = "idle" | "initializing" | "connected" | "standalone" | "error";

export interface ZestySDKState {
  status: SDKStatus;
  token: string | null;
  error: string | null;
  instanceZUID: string | null;
}

/**
 * Initializes the Zesty App SDK (window.ZestySDK) and returns connection state.
 *
 * - When running inside the Zesty Manager shell (iframe), the SDK receives a
 *   session token via postMessage from the parent window.
 * - When running standalone (not in an iframe), status is set to "standalone"
 *   and no auth is attempted.
 *
 * The SDK script must be loaded before this hook runs — add it to layout.tsx
 * via next/script with strategy="beforeInteractive".
 */
export function useZestySDK(): ZestySDKState {
  const [state, setState] = useState<ZestySDKState>({
    status: "idle",
    token: null,
    error: null,
    instanceZUID: null,
  });

  useEffect(() => {
    const sdk = window.ZestySDK;
    if (!sdk) {
      setState((s) => ({ ...s, status: "error", error: "ZestySDK not loaded" }));
      return;
    }

    const isInIframe = window.self !== window.top;
    if (!isInIframe) {
      setState((s) => ({ ...s, status: "standalone" }));
      return;
    }

    setState((s) => ({ ...s, status: "initializing" }));

    sdk.setMessageReceivedCallback((messages) => {
      const latest = messages[messages.length - 1];
      const data = latest?.data as Record<string, unknown> | null;
      if (!data) return;

      const instanceZUID =
        (data.instance as { ZUID?: string } | undefined)?.ZUID ||
        (data.ZUID as string | undefined) ||
        null;

      setState((s) => ({
        ...s,
        instanceZUID: instanceZUID ?? s.instanceZUID,
      }));
    });

    sdk
      .init(AUTH_URL)
      .then(({ token }) => {
        setState((s) => ({ ...s, status: "connected", token }));
        sdk.startTokenKeepAlive();
      })
      .catch((err: Error) => {
        setState((s) => ({
          ...s,
          status: "standalone",
          error: err.message,
        }));
      });

    return () => {
      sdk.stopTokenKeepAlive();
    };
  }, []);

  return state;
}
