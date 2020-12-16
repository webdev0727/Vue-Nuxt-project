import axios from 'axios'
// import { MessageBox, Message } from 'element-ui'
import {getToken, getLang, removeAuth, removeToken} from '@/utils/cookie'

// create an axios instance
const service = axios.create({
  baseURL: process.env.BASE_API_URL, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 100000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // console.log("Request", config)
    config.headers['ClientType'] = 'mobile'  
    let lang = getLang()
    if (lang) {
      config.headers['X-localization'] = lang      
    }
    let token = getToken()
    if (token=='server') {
      // return false
    }else if (token) {
      config.headers['Authorization']=`Bearer ${token}`
    }
    return config
  },
  error => {
    // do something with request error
    return Promise.reject()
  }
)

// response interceptor
service.interceptors.response.use(response => {
        
  if (!response.data.status) {
      // Message({
      //   message: "Error",
      //   type: 'error',
      //   duration: 1000,
      //   showClose: true,
      // })
      const error_data = response.data.error ? response.data.error : (response.data.data || response.data)
      const code = response.data.code
      console.log('url:', response.config.url, ' code:', code, 'client:', process.client, "\n", error_data, )
      /* 
            400: token is invalid
            401: token is expired
            405: token is not found
       */
      if ([400, 401].includes(code)){
        if (process.client){
          removeAuth()
          removeToken()
          location.reload()
        }
      }

      return Promise.reject(error_data)
  } 
  const data = response.data.data || response.data
  return data
},
error => {
  if (error){
    // Message({
    //   message: error.message,
    //   type: 'error',
    //   duration: 1000,
    //   showClose: true,
    // })
  }
  return Promise.reject()
}
)

export default service
