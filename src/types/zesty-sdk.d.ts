// Type declarations for the Zesty App SDK loaded via CDN script tag.
// Source: https://github.com/contentdotone/app-sdk-temp

interface ZestySDKInstance {
  /** Initialize the SDK. Resolves with { token } once authenticated.
   *  If running in an iframe (Zesty Manager shell), polls for a token from the parent.
   *  Pass initialToken to skip polling and verify immediately. */
  init(authUrl: string, initialToken?: string): Promise<{ token: string }>;

  /** Manually set the session token. */
  setToken(token: string): void;

  /** Returns the current session token. */
  getToken(): string;

  /** Returns all postMessages received from the parent window. */
  getMessages(): MessageEvent[];

  /** Authenticated fetch — auto-injects Authorization: Bearer header. */
  request(url: string, options?: RequestInit): Promise<unknown>;

  /** Verify a token against the auth service. Resolves true/false. */
  verifyToken(token: string): Promise<boolean>;

  /** Log out the current user and clear the token. */
  logout(): Promise<void>;

  /** Start periodic token verification (default 30s). Stops on invalid token. */
  startTokenKeepAlive(intervalMs?: number): void;

  /** Stop the keep-alive interval. */
  stopTokenKeepAlive(): void;

  /** Register a callback fired whenever a postMessage is received from the parent.
   *  Receives the full messages array. */
  setMessageReceivedCallback(callback: (messages: MessageEvent[]) => void): void;

  /** Open a popup for SSO login. Services: "google" | "github" | "azure". */
  initiateSSOAuthentication(service: "google" | "github" | "azure"): void;

  /** Register a callback for successful SSO. */
  setSSOSuccessCallback(callback: () => void): void;

  /** Register a callback for failed SSO. Receives error message string. */
  setSSOErrorCallback(callback: (errorMessage: string) => void): void;
}

declare global {
  interface Window {
    ZestySDK: ZestySDKInstance;
  }
}

export {};
