"use client";

import { SignedIn, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { Waves } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";

function Topbar() {
  return (
    <nav className="topbar">
      <div className="flex items-center justify-between w-full max-w-4xl ml-auto mr-auto">
        <Link href="/" className="flex items-center gap-2">
          <Waves className="size-6 text-primary" />
          <p className="text-heading3-bold text-foreground max-xs:hidden">
            Coral
          </p>
        </Link>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <div className="block">
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Topbar;
