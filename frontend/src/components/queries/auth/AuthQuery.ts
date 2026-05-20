import type { RegistrationTypes } from '#/types/ProductTypes'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'

type LoginPayload = {
  email: string
  password: string
}

type ApiErrorBody = {
  detail?: string
  message?: string
}

const isHtmlFallback = (value: unknown) =>
  typeof value === 'string' && value.trim().startsWith('<!DOCTYPE html>')

const getErrorMessage = (
  error: unknown,
  fallbackMessage: string,
): string => {
  if (axios.isAxiosError(error)) {
    const responseData = error.response?.data

    if (typeof responseData === 'string' && responseData.trim()) {
      return responseData
    }

    if (responseData && typeof responseData === 'object') {
      const body = responseData as ApiErrorBody
      return body.detail || body.message || fallbackMessage
    }

    return fallbackMessage
  }

  if (error instanceof Error) {
    return error.message || fallbackMessage
  }

  return fallbackMessage
}

const requestAuth = async <TResponse, TPayload = unknown>(
  path: '/api/auth/login' | '/api/auth/register' | '/api/auth/logout',
  payload?: TPayload,
  fallbackMessage = 'An unexpected error occurred',
) => {
  const res = await fetch(path, {
    method: 'POST',
    headers: payload ? { 'Content-Type': 'application/json' } : undefined,
    credentials: 'include',
    body: payload ? JSON.stringify(payload) : undefined,
  })

  const text = await res.text()

  if (isHtmlFallback(text)) {
    throw new Error('Backend is down or unreachable.')
  }

  const data = text ? (JSON.parse(text) as TResponse) : null

  if (!res.ok) {
    const message =
      typeof data === 'string'
        ? data
        : getErrorMessage(data, fallbackMessage)
    throw new Error(message)
  }

  return data
}

export const useLogin = () => {
  return useMutation({
    mutationFn: async (data: LoginPayload) =>
      requestAuth('/api/auth/login', data, 'An error occurred during login'),
  })
}

export const UseRegister = () => {
  return useMutation({
    mutationFn: async (data: RegistrationTypes) =>
      requestAuth(
        '/api/auth/register',
        data,
        'An error occurred during registration',
      ),
  })
}

export const useLogout = () => {
  return useMutation({
    mutationFn: async () =>
      requestAuth('/api/auth/logout', undefined, 'An error occurred during logout'),
  })
}
