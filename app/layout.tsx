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
    icon: "/favicon.ico",
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
