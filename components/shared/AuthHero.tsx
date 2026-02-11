"use client";

import DarkVeil from "@/components/DarkVeil";

export default function AuthHero() {
  return (
    <div className="relative hidden h-full w-full overflow-hidden lg:block">
      <DarkVeil
        hueShift={0}
        noiseIntensity={0}
        scanlineIntensity={0}
        speed={0.5}
        scanlineFrequency={0}
        warpAmount={0}
      />
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center pr-8">
        <h1 className="text-[20rem] font-bold tracking-tight text-background">Coral</h1>
      </div>
      <p className="absolute bottom-6 left-6 text-xs text-white/50">
        &copy; {new Date().getFullYear()} Coral Thread. All rights reserved.
      </p>
    </div>
  );
}
