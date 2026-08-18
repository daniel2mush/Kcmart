// src/lib/authentication/authenticate.ts
import { createServerFn } from '@tanstack/react-start'
// Import directly from TanStack's server utilities:
import { getRequestHeaders } from '@tanstack/react-start/server'
import axios from 'axios'
import { redirect } from '@tanstack/react-router'

export const getIsAuthenticated = createServerFn({
  method: 'GET',
}).handler(async () => {
  try {
    const headers = getRequestHeaders()
    const cookie = headers.get('cookie') || ''

    if (!cookie) {
      return null
    }

    const res = await axios.get(`${process.env.VITE_PUBLIC_API}users/me`, {
      headers: {
        Cookie: cookie,
      },
    })

    return res.data
  } catch (error) {
    return null
  }
})

export async function requireAuth() {
  const user = await getIsAuthenticated()

  if (!user) {
    throw redirect({
      to: '/signin',
    })
  }

  return user
}

export async function requireGuest() {
  const user = await getIsAuthenticated()

  if (user) {
    throw redirect({
      to: '/dashboard',
    })
  }
}

export async function alreadyAuthenticated() {
  const user = await getIsAuthenticated()
  if (user) {
    return user
  }
  return null
}
