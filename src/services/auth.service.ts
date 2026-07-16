// 📄 src/services/auth.service.ts

import type { User, UserRecord, LoginData, RegisterData } from "../types/auth.types";

/**
 * auth.service.ts
 * -----------------------------------------------------------------------
 * Mock authentication service backed by localStorage.
 *
 * Why a service layer instead of calling localStorage directly from
 * components/store?
 * If this project later moves to a real backend, only this file changes
 * (e.g. swapping localStorage calls for `api.post("/login", ...)`).
 * Nothing above this layer (store, pages, components) needs to know how
 * authentication is actually implemented.
 * -----------------------------------------------------------------------
 */

const USERS_KEY = "tasknest_users";
const TOKEN_KEY = "tasknest_token";
const CURRENT_USER_KEY = "tasknest_current_user";

// ---------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------

function getStoredUsers(): UserRecord[] {
  const raw = localStorage.getItem(USERS_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as UserRecord[];
  } catch {
    return [];
  }
}

function saveStoredUsers(users: UserRecord[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function toPublicUser(record: UserRecord): User {
  // Strips the password before the user object leaves the service layer.
  const { password: _password, ...publicUser } = record;
  return publicUser;
}

function generateId(): string {
  return crypto.randomUUID();
}

function generateToken(): string {
  // Mock token — not a real JWT, just enough to simulate a session.
  return `mock_${crypto.randomUUID()}`;
}

// ---------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------

export const authService = {
  register(data: RegisterData): User {
    const users = getStoredUsers();

    const emailTaken = users.some(
      (u) => u.email.toLowerCase() === data.email.toLowerCase()
    );
    if (emailTaken) {
      throw new Error("EMAIL_ALREADY_EXISTS");
    }

    const newUser: UserRecord = {
      id: generateId(),
      name: data.name,
      email: data.email,
      password: data.password, // NOTE: plain-text mock only — never do this with a real backend.
    };

    saveStoredUsers([...users, newUser]);

    return toPublicUser(newUser);
  },

  login(data: LoginData): User {
    const users = getStoredUsers();

    const match = users.find(
      (u) => u.email.toLowerCase() === data.email.toLowerCase()
    );

    if (!match || match.password !== data.password) {
      throw new Error("INVALID_CREDENTIALS");
    }

    const publicUser = toPublicUser(match);

    localStorage.setItem(TOKEN_KEY, generateToken());
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(publicUser));

    return publicUser;
  },

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(CURRENT_USER_KEY);
  },

  getCurrentUser(): User | null {
    const raw = localStorage.getItem(CURRENT_USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as User;
    } catch {
      return null;
    }
  },

  isAuthenticated(): boolean {
    return Boolean(localStorage.getItem(TOKEN_KEY));
  },
};