// Centralized API configuration
// Set VITE_API_BASE_URL in your .env for production
// In dev, Vite proxy handles /api/* → http://127.0.0.1:8000
const isDev = import.meta.env.DEV

export const API_BASE = isDev
  ? '' // use Vite proxy in dev (avoids CORS)
  : (import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000')

export const api = {
  post: async (path, body, options = {}) => {
    const res = await fetch(`${API_BASE}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: options.signal,
      body: JSON.stringify(body),
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Request failed' }))
      throw new Error(err.detail || `HTTP ${res.status}`)
    }
    return res.json()
  },

  postForm: async (path, formData, options = {}) => {
    const res = await fetch(`${API_BASE}${path}`, {
      method: 'POST',
      signal: options.signal,
      body: formData,
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Request failed' }))
      throw new Error(err.detail || `HTTP ${res.status}`)
    }
    return res.json()
  },

  get: async (path, options = {}) => {
    const res = await fetch(`${API_BASE}${path}`, {
      signal: options.signal,
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Request failed' }))
      throw new Error(err.detail || `HTTP ${res.status}`)
    }
    return res.json()
  },

  delete: async (path, options = {}) => {
    const res = await fetch(`${API_BASE}${path}`, {
      method: 'DELETE',
      signal: options.signal,
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Request failed' }))
      throw new Error(err.detail || `HTTP ${res.status}`)
    }
    return res.json()
  },
}
