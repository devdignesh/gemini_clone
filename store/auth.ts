import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  phone: string;
  isAuthenticated: boolean;
  setPhone: (val: string) => void;
  setAuth: (val: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      phone: "",
      isAuthenticated: false,
      setPhone: (val) => set({ phone: val }),
      setAuth: (val) => set({ isAuthenticated: val }),
    }),
    {
      name: "auth-storage",
    }
  )
);