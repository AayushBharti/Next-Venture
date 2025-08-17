"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { PropsWithChildren } from "react";

const queryClient = new QueryClient();

export function Providers({ children }: PropsWithChildren) {
  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <NextThemesProvider
          attribute="class"
          defaultTheme="system"
          disableTransitionOnChange
          enableColorScheme
          enableSystem
        >
          {children}
        </NextThemesProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
}
