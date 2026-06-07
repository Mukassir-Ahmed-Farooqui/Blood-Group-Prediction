import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export const predictFull = async (file) => {
  const formData = new FormData()
  formData.append('file', file)

  const response = await axios.post(`${API_URL}/predict-full`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })

  return response.data
}

export const healthCheck = async () => {
  const response = await axios.get(`${API_URL}/health`)
  return response.data
}

export const getModelsInfo = async () => {
  const response = await axios.get(`${API_URL}/models/info`)
  return response.data
}