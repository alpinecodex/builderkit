import "@/styles/globals.css";
import "@/styles/prosemirror.css";

import { Metadata } from "next";
import { ReactNode } from "react";
import Providers from "./providers";
import Nav from "./navigation";

const title = "Builder Kit | AI Powered Copywriting Companion";
const description =
  "Builder Kit is a great place to write your content using artificial intelligence. Come on over and give it a try!";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
  },
  twitter: {
    title,
    description,
    card: "summary_large_image",
  },
  metadataBase: new URL("https://builderkit.io"),
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="relative grid h-screen w-screen overflow-hidden sm:grid-cols-[256px,1fr]">
        <Providers>
          <Nav />
          <main className="no-scrollbar overflow-y-auto">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
