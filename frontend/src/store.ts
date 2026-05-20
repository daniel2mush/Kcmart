import { create } from 'zustand/react'
import { persist } from 'zustand/middleware'

interface User {
  first_name: string
  last_name: string
  email: string
}

interface UserStore {
  user: User | null
  setUser: (user: User) => void
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
