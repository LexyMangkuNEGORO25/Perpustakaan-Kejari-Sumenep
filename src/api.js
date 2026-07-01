import axios from 'axios'

export const BACKEND_URL = 'https://perpuskejaksaan.duckdns.org'

const API = axios.create({
  baseURL: `${BACKEND_URL}/api`,
})

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

export const resolveBackendFile = (filePath) => {
  if (!filePath) {
    return ''
  }

  if (/^https?:\/\//i.test(filePath) || filePath.startsWith('data:')) {
    return filePath
  }

  return `${BACKEND_URL}/${String(filePath).replace(/^\/+/, '')}`
}

export default API
