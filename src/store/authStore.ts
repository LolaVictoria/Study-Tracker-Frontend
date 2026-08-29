import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  email: string | null;
  isAuthenticated: boolean;
  login: (email: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      email: null,
      isAuthenticated: false,
      login: (email) => set({ email, isAuthenticated: true }),
      logout: () => set({ email: null, isAuthenticated: false }),
    }),
    { name: 'lc-tracker-auth' }
  )
);