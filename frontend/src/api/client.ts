import axios from 'axios'

function getCsrfToken(): string | null {
  return document
    .querySelector('meta[name="csrf-token"]')
    ?.getAttribute('content')
}

const api = axios.create({
  withCredentials: true, // IMPORTANT for cookies
})

api.interceptors.request.use((config) => {
  const token = getCsrfToken()
  if (token) {
    config.headers['X-CSRF-Token'] = token
  }
  return config
})

export default api
