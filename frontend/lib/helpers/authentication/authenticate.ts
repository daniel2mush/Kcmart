'use server'

import { redirect } from 'next/navigation'
import {serverApi} from "@/components/client/serverAxiosClient";



export async function getIsAuthenticated() {
  try {
    const res = await serverApi.get('/users/me')
    return res.data
  } catch {
    return null
  }
}

export async function requireAuth() {
  const user = await getIsAuthenticated()

  if (!user) {
    redirect('/login')
  }

  return user
}

export async function requireGuest() {
  const user = await getIsAuthenticated()

  if (user) {
    redirect('/dashboard')
  }

  return null
}

export async function alreadyAuthenticated() {
  const user = await getIsAuthenticated()
  return user ?? null
}