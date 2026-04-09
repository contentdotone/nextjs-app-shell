export const en = {
  // Header
  "header.appName": "App",

  // Instance switcher
  "instance.switcherLabel": "Switch instance",
  "instance.loading": "Loading…",
  "instance.select": "Select instance",
  "instance.searchPlaceholder": "Search instances…",
  "instance.noMatches": "No matches",
  "instance.noInstances": "No instances found",
  "instance.count": "{count} instance",
  "instance.countPlural": "{count} instances",
  "instance.filteredCount": "{filtered} of {total} instances",

  // Language switcher
  "lang.label": "Language",
  "lang.en": "English",
  "lang.es": "Español",
  "lang.nl": "Nederlands",

  // Login page
  "login.title": "Content.One App",
  "login.subtitle": "Sign in to continue",
  "login.google": "Continue with Google",
  "login.github": "Continue with GitHub",
  "login.microsoft": "Continue with Microsoft",
  "login.or": "or",
  "login.manualTitle": "Manual login",
  "login.manualDescription": "Paste an APP_SID token to sign in directly",
  "login.tokenPlaceholder": "APP_SID token",
  "login.start": "Start",

  // Home page
  "home.title": "Content.One App",
  "home.comingSoon": "Coming soon.",
  "home.sdkIdle": "Idle",
  "home.sdkInitializing": "Connecting…",
  "home.sdkConnected": "Connected",
  "home.sdkStandalone": "Standalone",
  "home.sdkError": "Error",
  "home.sdkLabel": "Zesty SDK",
  "home.sdkIframe": "iframe",
  "home.sdkStandaloneMode": "standalone",
} as const;

export type TranslationKey = keyof typeof en;
