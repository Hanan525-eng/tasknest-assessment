// src/layouts/AuthLayout.tsx

import type { ReactNode } from "react";
import { FiClipboard } from "react-icons/fi";
import illustrationUrl from "../assets/illustrations/completed-tasks.svg";
import { LanguageToggle } from "../components/LanguageToggle";

interface AuthLayoutProps {
  children: ReactNode;
  caption?: string;
}

export function AuthLayout({
  children,
  caption = "Manage your tasks in an easy and more efficient way with TaskNest.",
}: AuthLayoutProps) {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-(--color-background) px-4">
      <div className="absolute top-4 end-4">
        <LanguageToggle />
      </div>

      <div className="grid w-full max-w-5xl overflow-hidden rounded-(--radius-lg) bg-(--color-surface) shadow-(--shadow-md) md:grid-cols-2">
        {/* Left: form panel */}
        <div className="flex flex-col justify-center px-8 py-10 sm:px-12">
          <div className="mb-8 flex items-center gap-2">
            <FiClipboard size={26} className="text-(--color-primary)" aria-hidden="true" />
            <span className="text-xl font-bold text-(--color-primary)">TaskNest</span>
          </div>

          {children}
        </div>

        {/* Right: illustration panel — hidden on mobile to keep the form full-width */}
        <div className="relative hidden flex-col items-center justify-center gap-8 bg-(--color-primary) p-10 md:flex">
          <img src={illustrationUrl} alt="" aria-hidden="true" className="w-full max-w-sm" />
          <p className="text-center text-sm font-medium italic text-white/90">{caption}</p>
        </div>
      </div>
    </div>
  );
}

