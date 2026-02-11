import { Waves } from "lucide-react";

import { LoginForm } from "@/components/forms/LoginForm";
import AuthHero from "@/components/shared/AuthHero";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function SignInPage() {
  return (
    <div className="bg-background grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <div className="flex items-center gap-1.5 font-medium text-foreground">
            <Waves className="size-5 text-primary" />
            Coral
          </div>
          <div className="ml-auto">
            <ThemeToggle />
          </div>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
      <AuthHero />
    </div>
  );
}
