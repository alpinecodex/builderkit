"use client";

import { ReactNode } from "react";
import { Toaster } from "sonner";
import useLocalStorage from "@/lib/hooks/use-local-storage";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@/ui/theme-provider";

const ToasterProvider = () => {
  return <Toaster position="top-center" />;
};

export default function Providers({ children }: { children: ReactNode }) {
  const [font, setFont] = useLocalStorage<string>("novel__font", "Default");

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <SessionProvider>
        {children}
        <ToasterProvider />
      </SessionProvider>
    </ThemeProvider>
  );
}
