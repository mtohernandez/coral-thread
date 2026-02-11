import Image from "next/image"
import { Waves } from "lucide-react"

import { SignupForm } from "@/components/forms/SignupForm"
import { ThemeToggle } from "@/components/ui/theme-toggle"

export default function SignUpPage() {
  return (
    <div className="bg-background grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <div className="flex items-center gap-2 font-medium text-foreground">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <Waves className="size-4" />
            </div>
            Coral Thread
          </div>
          <div className="ml-auto">
            <ThemeToggle />
          </div>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <SignupForm />
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <Image
          src="/assets/auth-hero.svg"
          alt="Coral Thread hero"
          fill
          className="object-cover"
          priority
        />
      </div>
    </div>
  )
}
