"use client";

import { Dispatch, ReactNode, SetStateAction, createContext } from "react";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/react";
import { displayFontMapper, defaultFontMapper } from "@/styles/fonts";
import useLocalStorage from "@/lib/hooks/use-local-storage";
import { cn } from "@/lib/utils";
import { SessionProvider } from "next-auth/react";

export const AppContext = createContext<{
  font: string;
  setFont: Dispatch<SetStateAction<string>>;
}>({
  font: "Default",
  setFont: () => {},
});

const ToasterProvider = () => {
  return <Toaster position="top-center" />;
};

export default function Providers({ children }: { children: ReactNode }) {
  const [font, setFont] = useLocalStorage<string>("novel__font", "Default");

  return (
    <AppContext.Provider
      value={{
        font,
        setFont,
      }}
    >
      <SessionProvider>
        <ToasterProvider />
        <div className={cn(displayFontMapper[font], defaultFontMapper[font])}>
          {children}
        </div>
        <Analytics />
      </SessionProvider>
    </AppContext.Provider>
  );
}
