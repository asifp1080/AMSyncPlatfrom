import { AuthProvider } from "@/contexts/AuthProvider";

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthProvider>{children}</AuthProvider>;
}
