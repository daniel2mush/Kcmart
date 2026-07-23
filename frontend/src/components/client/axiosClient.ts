import axios, { AxiosHeaders } from 'axios'
import type { InternalAxiosRequestConfig } from 'axios'
import {
  getCookie,
  setCookie,
  getRequestHeaders,
} from '@tanstack/react-start/server'

declare module 'axios' {
  export interface AxiosRequestConfig {
    skipAuth?: boolean
    skipAuthRefresh?: boolean
  }

  export interface InternalAxiosRequestConfig {
    _retry?: boolean
  }
}

const DEFAULT_BASE_URL = 'http://127.0.0.1:8000/api/v1/'
const BASE_URL = import.meta.env.VITE_API_URL ?? DEFAULT_BASE_URL

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean
}

export const axiosClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

axiosClient.interceptors.request.use(async (config) => {
  const headers = getRequestHeaders()

  Object.entries(headers).forEach(([key, value]) => {
    if (value) {
      config.headers.set(key, value)
    }
  })

  const requestConfig = config as RetryableRequestConfig
  const accessToken = getCookie('access_token')

  if (
    !requestConfig.skipAuth &&
    accessToken &&
    !config.headers.has('Authorization')
  ) {
    config.headers.set('Authorization', `Bearer ${accessToken}`)
  }

  return config
})

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest.skipAuthRefresh &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true

      try {
        const refreshToken = getCookie('refresh_token')
        const requestHeaders = getRequestHeaders()
        const cookieHeader = requestHeaders.get('cookie')

        if (!refreshToken) {
          return Promise.reject(error)
        }

        const response = await axios.post(
          'user/token/refresh/',
          {},
          {
            baseURL: BASE_URL,
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json',
              ...(cookieHeader ? { Cookie: cookieHeader } : {}),
            },
          },
        )

        const newAccessToken = response.data?.access_token

        if (!newAccessToken) {
          return Promise.reject(error)
        }

        setCookie('access_token', newAccessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
        })

        const setCookieHeaders = response.headers['set-cookie']

        if (setCookieHeaders) {
          const refreshTokenCookie = setCookieHeaders.toString().split(' ')[0]

          if (refreshTokenCookie) {
            const tokenValue = refreshTokenCookie.split(';')[0].split('=')[1]

            setCookie('refresh_token', tokenValue, {
              httpOnly: true,
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'lax',
              path: '/',
            })
          }
        }

        originalRequest.headers = AxiosHeaders.from(originalRequest.headers)
        originalRequest.headers.set('Authorization', `Bearer ${newAccessToken}`)

        return axiosClient(originalRequest)
      } catch (refreshError) {
        console.error('Token rotation failed:', refreshError)
        localStorage.clear()

        return Promise.reject(error)
      }
    }

    return Promise.reject(error)
  },
)

export default axiosClient
