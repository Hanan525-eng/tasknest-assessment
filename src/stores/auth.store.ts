// src/stores/auth.store.ts

import { create } from "zustand";
import type { User, LoginData, RegisterData } from "../types/auth.types";
import { authService } from "../services/auth.service";

type AuthStatus = "idle" | "loading" | "authenticated" | "unauthenticated";

interface AuthState {
  user: User | null;
  status: AuthStatus;
  error: string | null;

  login: (data: LoginData) => void;
  register: (data: RegisterData) => void;
  logout: () => void;
  restoreSession: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  status: "idle",
  error: null,

  login: (data) => {
    set({ status: "loading", error: null });
    try {
      const user = authService.login(data);
      set({ user, status: "authenticated", error: null });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "UNKNOWN_ERROR";
      set({ user: null, status: "unauthenticated", error: message });
    }
  },

  register: (data) => {
    set({ status: "loading", error: null });
    try {
      const user = authService.register(data);
      // Auto-login right after successful registration.
      authService.login({ email: data.email, password: data.password });
      set({ user, status: "authenticated", error: null });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "UNKNOWN_ERROR";
      set({ user: null, status: "unauthenticated", error: message });
    }
  },

  logout: () => {
    authService.logout();
    set({ user: null, status: "unauthenticated", error: null });
  },

  restoreSession: () => {
    const isAuthenticated = authService.isAuthenticated();
    const user = authService.getCurrentUser();

    if (isAuthenticated && user) {
      set({ user, status: "authenticated" });
    } else {
      set({ user: null, status: "unauthenticated" });
    }
  },

  clearError: () => set({ error: null }),
}));