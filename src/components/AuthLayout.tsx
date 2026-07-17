// src/components/AuthLayout.tsx

import type { ReactNode } from "react";
import { FiClipboard } from "react-icons/fi";
import illustrationUrl from "../assets/illustrations/completed-tasks.svg";

interface AuthLayoutProps {
  children: ReactNode;
  caption?: string;
}

export function AuthLayout({
  children,
  caption = "Manage your tasks in an easy and more efficient way with TaskNest.",
}: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-background)] p-4">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[var(--radius-lg)] bg-[var(--color-surface)] shadow-[var(--shadow-md)] md:grid-cols-2">
        {/* Left: form panel */}
        <div className="flex flex-col justify-center px-8 py-10 sm:px-12">
          <div className="mb-8 flex items-center gap-2">
            <FiClipboard size={26} className="text-[var(--color-primary)]" aria-hidden="true" />
            <span className="text-xl font-bold text-[var(--color-primary)]">TaskNest</span>
          </div>

          {children}
        </div>

        {/* Right: illustration panel — hidden on mobile to keep the form full-width */}
        <div className="relative hidden flex-col items-center justify-center gap-8 bg-[var(--color-primary)] p-10 md:flex">
          <img src={illustrationUrl} alt="" aria-hidden="true" className="w-full max-w-sm" />
          <p className="text-center text-sm font-medium italic text-white/90">{caption}</p>
        </div>
      </div>
    </div>
  );
}