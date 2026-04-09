import type { TranslationKey } from "./en";

export const es: Record<TranslationKey, string> = {
  // Header
  "header.appName": "App",

  // Instance switcher
  "instance.switcherLabel": "Cambiar instancia",
  "instance.loading": "Cargando…",
  "instance.select": "Seleccionar instancia",
  "instance.searchPlaceholder": "Buscar instancias…",
  "instance.noMatches": "Sin resultados",
  "instance.noInstances": "No se encontraron instancias",
  "instance.count": "{count} instancia",
  "instance.countPlural": "{count} instancias",
  "instance.filteredCount": "{filtered} de {total} instancias",

  // Language switcher
  "lang.label": "Idioma",
  "lang.en": "English",
  "lang.es": "Español",
  "lang.nl": "Nederlands",

  // Login page
  "login.title": "Content.One App",
  "login.subtitle": "Inicia sesión para continuar",
  "login.google": "Continuar con Google",
  "login.github": "Continuar con GitHub",
  "login.microsoft": "Continuar con Microsoft",
  "login.or": "o",
  "login.manualTitle": "Inicio de sesión manual",
  "login.manualDescription": "Pega un token APP_SID para iniciar sesión directamente",
  "login.tokenPlaceholder": "Token APP_SID",
  "login.start": "Iniciar",

  // Home page
  "home.title": "Content.One App",
  "home.comingSoon": "Próximamente.",
  "home.sdkIdle": "Inactivo",
  "home.sdkInitializing": "Conectando…",
  "home.sdkConnected": "Conectado",
  "home.sdkStandalone": "Independiente",
  "home.sdkError": "Error",
  "home.sdkLabel": "Zesty SDK",
  "home.sdkIframe": "iframe",
  "home.sdkStandaloneMode": "independiente",
};
