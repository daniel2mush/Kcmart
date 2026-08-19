'use server'

import axios from 'axios'
import { cookies } from 'next/headers'

const API_URL = process.env.API_URL || 'https://kcmart.fastapicloud.dev'

// Server-only axios instance (no TanStack interceptors)
export const serverApi = axios.create({
  baseURL: API_URL,
  headers: { 'Accept': 'application/json' },
})

// Interceptor that reads cookies from Next.js headers
serverApi.interceptors.request.use(async (config) => {
  const cookieStore = await cookies()
  const authCookie = cookieStore.get('fastapiusersauth')

  if (authCookie) {
    config.headers.set('Cookie', `fastapiusersauth=${authCookie.value}`)
  }

  return config
})