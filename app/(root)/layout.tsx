import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/theme-provider";

import "../globals.css";

import Topbar from "@/components/shared/Topbar";
import Bottombar from "@/components/shared/Bottombar";
import { ReduxProvider } from "@/context/provider";
import { ThreadDialogProvider } from "@/context/thread-dialog-context";
import CreateThreadDialog from "@/components/forms/UploadThread";

const outfit = Outfit({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Coral Thread",
  description: "Share threads with anyone, anywhere.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <ReduxProvider>
        <html lang="en" suppressHydrationWarning>
          <body className={outfit.className}>
            <ThemeProvider attribute="class" defaultTheme="dark" themes={["light", "dark"]}>
              <ThreadDialogProvider>
                <Topbar />

                <main className="mt-14">
                  <section className="main-container">
                    <div className="w-full max-w-4xl">{children}</div>
                  </section>
                </main>

                <Bottombar />
                <CreateThreadDialog />
              </ThreadDialogProvider>
            </ThemeProvider>
          </body>
        </html>
      </ReduxProvider>
    </ClerkProvider>
  );
}
