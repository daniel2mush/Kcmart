// src/lib/authentication/authenticate.ts
import { createServerFn } from '@tanstack/react-start'
// Import directly from TanStack's server utilities:
import { getRequestHeaders } from '@tanstack/react-start/server'
import axios from 'axios'

export const getIsAuthenticated = createServerFn({
  method: 'GET',
}).handler(async () => {
  try {
    // Grab the headers from the incoming browser request
    const headers = getRequestHeaders()
    const cookie = headers.get('cookie') || ''

    if (!cookie) return null

    const res = await axios.get(`${process.env.VITE_PUBLIC_API}users/me`, {
      headers: { Cookie: cookie },
    })

    return res.data
  } catch (error) {
    return null
  }
})
