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
export const downloadStorageFile = async (storageUrl) => {
  const originalUrl = 'http://127.0.0.1:8000/storage/' + storageUrl
  const proxyUrl = `/proxy-file?url=${encodeURIComponent(originalUrl)}`
  
  const response = await api.get(proxyUrl, {
    responseType: 'blob'
  })
  
  const blob = response.data
  
  // Extraer nombre del archivo
  const urlPath = new URL(originalUrl).pathname
  const fileName = urlPath.substring(urlPath.lastIndexOf('/') + 1) || 'archivo_descargado'
  
  // Crear y retornar el File
  return new File([blob], fileName, { type: blob.type })
}
export default api