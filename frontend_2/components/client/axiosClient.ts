import axios from 'axios'
import { getRequestHeaders } from '@tanstack/react-start/server'

const DEFAULT_BASE_URL = 'https://kcmart.fastapicloud.dev/'
const BASE_URL =
  import.meta.env.API_URL ?? import.meta.env.VITE_API_URL ?? DEFAULT_BASE_URL

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
