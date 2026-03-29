/**
 * @file app/providers.tsx
 * @description Application-level providers wrapper (theme, etc.)
 * @authors Ryan Smith <rysmith2113@gmail.com>
 *          Kenneth Tran <kwtran09@gmail.com>
 *          Simon Ramsey <ramsey2005s@gmail.com>
 *          Obed Mavungu <obedmavungu1@gmail.com>
 * @created March 29, 2026
 * @copyright 2026 Syllabyte Team
 */

"use client";

import type { ThemeProviderProps } from "next-themes";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

export function Providers({ children, themeProps }: ProvidersProps) {
  const defaultThemeProps: ThemeProviderProps = {
    attribute: "class",
    defaultTheme: "light",
    enableSystem: false,
  };

  return (
    <NextThemesProvider {...defaultThemeProps} {...themeProps}>
      {children}
    </NextThemesProvider>
  );
}
