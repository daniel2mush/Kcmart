import axios from 'axios'
import { getRequestHeaders } from '@tanstack/react-start/server'

const DEFAULT_BASE_URL = 'http://127.0.0.1:8000/'
const BASE_URL = import.meta.env.VITE_API_URL ?? DEFAULT_BASE_URL

export const axiosClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

axiosClient.interceptors.request.use(async (config) => {
  const headers = getRequestHeaders()

  const cookie = headers.get('cookie') || ''

  config.headers.set('Cookie', cookie)

  return config
})

export default axiosClient
