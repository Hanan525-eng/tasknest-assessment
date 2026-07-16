// src/routes/ProtectedRoute.tsx  
import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../stores/auth.store";

/**
 * ProtectedRoute
 * -----------------------------------------------------------------------
 * Wraps routes that require authentication.
 *
 * `status` starts as "idle" until `restoreSession()` runs once on app
 * boot (see App.tsx). We deliberately render nothing while "idle" instead
 * of redirecting immediately — otherwise a logged-in user would flash a
 * redirect to /auth/login for a split second before their session is
 * restored from localStorage.
 * -----------------------------------------------------------------------
 */

interface ProtectedRouteProps {
  children: ReactNode;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const status = useAuthStore((s) => s.status);

  if (status === "idle") {
    return null;
  }

  if (status !== "authenticated") {
    return <Navigate to="/auth/login" replace />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;