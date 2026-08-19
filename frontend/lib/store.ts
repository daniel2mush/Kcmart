import { create } from 'zustand' // ✅ Correct import path
import { persist } from 'zustand/middleware'
import type { User } from '@/lib/types/UserTypes' // ✅ Import your User type

interface UserStore {
  user: User | null
  // Allow null so you can clear the user on logout
  setUser: (user: User | null) => void
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,

      setUser: (user) =>
        set({
          user,
        }),
    }),
    {
      name: 'user-storage',
    },
  ),
)