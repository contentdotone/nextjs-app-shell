import type { Metadata } from "next";
export const metadata: Metadata = { title: "Sign In — Content.One Workflows" };
export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
