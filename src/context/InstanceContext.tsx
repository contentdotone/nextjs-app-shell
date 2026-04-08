"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useZestySDK, type ZestySDKState } from "@/hooks/useZestySDK";

export interface Instance {
  ZUID: string;
  name: string;
}

interface InstanceContextValue {
  instanceZUID: string | null;
  instanceName: string | null;
  instances: Instance[];
  loadingInstances: boolean;
  isIframe: boolean;
  sdk: ZestySDKState;
  switchInstance: (zuidzuid: string, name: string) => void;
}

const InstanceContext = createContext<InstanceContextValue>({
  instanceZUID: null,
  instanceName: null,
  instances: [],
  loadingInstances: false,
  isIframe: false,
  sdk: { status: "idle", token: null, error: null, instanceZUID: null },
  switchInstance: () => {},
});

const STORAGE_KEY = "lastInstance";

export function InstanceProvider({ children }: { children: React.ReactNode }) {
  const sdk = useZestySDK();

  const [isIframe, setIsIframe] = useState(false);
  const [instanceZUID, setInstanceZUID] = useState<string | null>(null);
  const [instanceName, setInstanceName] = useState<string | null>(null);
  const [instances, setInstances] = useState<Instance[]>([]);
  const [loadingInstances, setLoadingInstances] = useState(false);
  const fetchedRef = useRef(false);

  // Detect iframe once on mount
  useEffect(() => {
    setIsIframe(window.self !== window.top);
  }, []);

  // Standalone: read from URL query param or localStorage
  useEffect(() => {
    if (isIframe) return;
    const params = new URLSearchParams(window.location.search);
    const fromUrl = params.get("instance");
    const fromStorage = localStorage.getItem(STORAGE_KEY);
    const initial = fromUrl || fromStorage;
    if (initial) setInstanceZUID(initial);
  }, [isIframe]);

  // Iframe: auto-select instanceZUID received via SDK postMessage
  useEffect(() => {
    if (!sdk.instanceZUID) return;
    setInstanceZUID(sdk.instanceZUID);
  }, [sdk.instanceZUID]);

  // When SDK connects in iframe mode, store the token as APP_SID cookie
  // so the /api/instances proxy can read it server-side.
  useEffect(() => {
    if (sdk.status === "connected" && sdk.token) {
      document.cookie = `APP_SID=${sdk.token}; path=/; SameSite=Lax`;
    }
  }, [sdk.status, sdk.token]);

  // Fetch instances once we know auth state
  useEffect(() => {
    const ready = sdk.status === "connected" || sdk.status === "standalone";
    if (!ready || fetchedRef.current) return;
    fetchedRef.current = true;

    setLoadingInstances(true);
    fetch("/api/instances")
      .then((r) => {
        if (r.status === 401) return []; // not logged in
        return r.json();
      })
      .then((data: Instance[]) => {
        setInstances(data);
      })
      .catch(console.error)
      .finally(() => setLoadingInstances(false));
  }, [sdk.status]);

  // Keep instance name in sync whenever the ZUIDZUID or list changes
  useEffect(() => {
    if (!instanceZUID || !instances.length) return;
    const match = instances.find((i) => i.ZUID === instanceZUID);
    if (match) setInstanceName(match.name);
  }, [instanceZUID, instances]);

  function switchInstance(zuidzuid: string, name: string) {
    setInstanceZUID(zuidzuid);
    setInstanceName(name);
    localStorage.setItem(STORAGE_KEY, zuidzuid);
    // Reflect in URL query param without full navigation
    const params = new URLSearchParams(window.location.search);
    params.set("instance", zuidzuid);
    window.history.replaceState({}, "", `?${params.toString()}`);
  }

  return (
    <InstanceContext.Provider
      value={{
        instanceZUID,
        instanceName,
        instances,
        loadingInstances,
        isIframe,
        sdk,
        switchInstance,
      }}
    >
      {children}
    </InstanceContext.Provider>
  );
}

export function useInstance() {
  return useContext(InstanceContext);
}
