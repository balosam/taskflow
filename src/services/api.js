import axios from 'axios'

const api = axios.create({
  baseURL: 'https://taskflow-api-kmsw.onrender.com'
})

export default api