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
