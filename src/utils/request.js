import storage from 'store'
import store from '@/store'
import axios from 'axios'
import { Message } from 'element-ui'
import router from '@/router'

const request = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL,
  timeout: 6000
})

// 错误处理
const errorHandler = (err) => {
  Message.error({
    message: err.response.data.message
  })
  return Promise.reject(err)
}

// 请求处理
request.interceptors.request.use((config) => {
  const token = storage.get('token')
  const con = { ...config }
  if (token) {
    con.headers.Authorization = `Bearer ${token}`
  }
  return con
}, errorHandler)

// 数据返回处理
request.interceptors.response.use((response) => {
  if (response.data.resultCode === 1) {
    return Promise.resolve(response.data.data)
  } else if (response.data.resultCode === 5 || response.data.resultCode === 6) {
    store.dispatch('logout')
    router.replace('/login')
  }
  return Promise.reject(response.data.message)
}, errorHandler)

export default request
