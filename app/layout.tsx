/**
 * @file app/layout.tsx
 * @description Root layout component with metadata and app-level providers
 * @authors Ryan Smith <rysmith2113@gmail.com>
 *          Kenneth Tran <kwtran09@gmail.com>
 *          Simon Ramsey <ramsey2005s@gmail.com>
 *          Obed Mavungu <obedmavungu1@gmail.com>
 * @created March 29, 2026
 * @copyright 2026 Syllabyte Team
 */

import "./globals.css";
import { Metadata, Viewport } from "next";

import { Providers } from "./providers";

import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/penn-state-shield.jpg",
  },
};

export const viewport: Viewport = {
  themeColor: { color: "white" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en" className="light" style={{ colorScheme: "light" }}>
      <head />
      <body
        className={
          `min-h-screen text-slate-900 bg-slate-50 font-sans antialiased
          ${fontSans.variable}`
        }
      >
        <Providers themeProps={{ attribute: "class", defaultTheme: "light", enableSystem: false }}>
          {children}
        </Providers>
      </body>
    </html>
  );
}
