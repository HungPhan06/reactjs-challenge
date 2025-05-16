import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      force_open_login: false,
      login: (user, token) => {
        set({ user, token })
      },
      logout: () => set({ user: null, token: null }),
      setOpenLogin: (e) => set({ force_open_login: e })
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
);
