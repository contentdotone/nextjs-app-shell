"use client";

import { InstanceProvider } from "@/context/InstanceContext";
import { AppHeader } from "./AppHeader";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <InstanceProvider>
      <AppHeader />
      {children}
    </InstanceProvider>
  );
}
