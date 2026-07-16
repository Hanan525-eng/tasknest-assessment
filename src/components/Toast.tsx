// src/components/Toast.tsx

import { type ReactNode, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { FiCheckCircle, FiXCircle, FiInfo, FiX } from "react-icons/fi";

type ToastType = "success" | "error" | "info";

interface ToastProps {
  type: ToastType;
  message: string;
  duration?: number;
  onClose: () => void;
}

const toastStyles: Record<ToastType, string> = {
  success: "bg-green-50 border-green-500 text-green-800",
  error: "bg-red-50 border-red-500 text-red-800",
  info: "bg-blue-50 border-blue-500 text-blue-800",
};

const toastIcons: Record<ToastType, ReactNode> = {
  success: <FiCheckCircle size={20} aria-hidden="true" />,
  error: <FiXCircle size={20} aria-hidden="true" />,
  info: <FiInfo size={20} aria-hidden="true" />,
};

export function Toast({ type, message, duration = 3000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  return createPortal(
    <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-bottom-2 duration-300">
      <div
        className={`flex items-center gap-3 rounded-lg border-l-4 px-4 py-3 shadow-lg ${toastStyles[type]}`}
        role="alert"
      >
        {toastIcons[type]}
        <p className="text-sm font-medium">{message}</p>
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
          }}
          className="ml-2 text-gray-400 hover:text-gray-600"
          aria-label="Close toast"
        >
          <FiX size={16} aria-hidden="true" />
        </button>
      </div>
    </div>,
    document.body
  );
}