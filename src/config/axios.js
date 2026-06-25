import axios from 'axios'

export const BASE_URL = 'http://localhost:8080/api/v1'

const api = axios.create({
  baseURL: BASE_URL
})

api.interceptors.request.use((config) => {
  const salvo = localStorage.getItem('usuario')
  if (salvo) {
    const { token } = JSON.parse(salvo)
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api