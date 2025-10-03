import { TempoInit } from "@/components/tempo-init";
import { PreferencesProvider } from "@/contexts/PreferencesProvider";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AMSync - Asset Management System",
  description: "AMSync Build Scaffold - Sprint 1 Users, Claims & Preferences",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* <Script src="https://api.tempo.build/proxy-asset?url=https://storage.googleapis.com/tempo-public-assets/error-handling.js" /> [deprecated] */}
      <body className={inter.className}>
        <PreferencesProvider orgId="demo-org-id">
          {children}
        </PreferencesProvider>
        <TempoInit />
      </body>
    </html>
  );
}