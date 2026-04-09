"use client";

import { InstanceProvider } from "@/context/InstanceContext";
import { LanguageProvider } from "@/i18n";
import { AppHeader } from "./AppHeader";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <InstanceProvider>
        <AppHeader />
        {children}
      </InstanceProvider>
    </LanguageProvider>
  );
}
