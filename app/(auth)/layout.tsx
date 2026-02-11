import { ClerkProvider } from "@clerk/nextjs";
import { Outfit } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import "../globals.css";

export const metadata = {
  title: "Coral Thread — Auth",
  description: "Sign in or create your Coral Thread account.",
};

const outfit = Outfit({ subsets: ["latin"] });

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={outfit.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            themes={["light", "dark"]}
          >
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
