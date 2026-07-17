// src/components/ToastContainer.tsx

import { createPortal } from "react-dom";
import { useToastStore } from "../stores/toast.store";

const variantStyles = {
  success: "bg-(--color-success) text-white",
  error: "bg-(--color-danger) text-white",
} as const;

export function ToastContainer() {
  const { toasts, dismissToast } = useToastStore();

  if (toasts.length === 0) return null;

  return createPortal(
    <div className="fixed bottom-4 end-4 z-[60] flex flex-col gap-2" role="region" aria-live="polite">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role="status"
          className={
            "flex items-center gap-3 rounded-md px-4 py-3 text-sm font-medium shadow-[var(--shadow-md)] " +
            variantStyles[toast.variant]
          }
        >
          <span>{toast.message}</span>
          <button
            type="button"
            onClick={() => dismissToast(toast.id)}
            aria-label="Dismiss notification"
            className="opacity-80 hover:opacity-100"
          >
            ✕
          </button>
        </div>
      ))}
    </div>,
    document.body
  );
}