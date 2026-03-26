import { create } from "zustand";

interface AuthState {
  access_token: string | null;
  setAccessToken: (token: string | null) => void;
  setRefreshTokenAction: (show: boolean, message?: string) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  access_token: null,
  setAccessToken: (token) => set({ access_token: token }),
  setRefreshTokenAction: (show, message) => {
    // Basic logic just logs it for now.
    // Replace with toast notification or routing logic if needed.
    console.warn(`RefreshTokenAction [${show}]: ${message || ""}`);
  },
}));
