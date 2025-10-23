import axios from 'axios'

// Instancia principal para API
const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api'
})

// Instancia separada para storage
export const storage = axios.create({
  baseURL: 'http://127.0.0.1:8000/storage'
})

// Interceptor solo para la API principal
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('apiToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => Promise.reject(error)
)

export default api