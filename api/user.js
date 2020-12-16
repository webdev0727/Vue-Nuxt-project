import request from '@/utils/request'
import api from '@/utils/request'

export function login(data) {
  // console.log(data)
  return request({
    url: '/user/login',
    method: 'POST',
    data
  })
}
export function SMS(data) {
  // console.log(data)
  return request({
    url: '/user/sendcode',
    method: 'POST',
    data
  })
}

export function register(data) {
  return request({
    url: '/user/register',
    method: 'post',
    data
  })
}
export function updateUser(data) {
  return request({
    url: '/user',
    method: 'post',
    data
  })
}
export function forgotpassword(data) {
  return request({
    url: '/user/forgotpassword/confirm',
    method: 'post',
    data
  })
}
export function resetpassword(data) {
  return request({
    url: '/user/resetpassword',
    method: 'post',
    data
  })
}
export function pricing_list() {
  return request({
    url: '/user/vip',
    method: 'GET'
  })
}

export function userVerify(data) {
  return api({
    url: '/user/verify',
    method: 'POST',
    data
  })
}
export function userPricing(step, data) {
  return request({
    url: '/user/membership/' + step,
    method: 'POST',
    data
  })
}
export function userPay(data) {
  return request({
    url: '/user/payment',
    method: 'POST',
    data
  })
}
export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

export function getInfo(id) {
  return api.get('/user/info/'+id) 
}
export function getMyInfo() {
  return api.get('/user') 
}
export function getMyNumbers() {
  return api.get('/user/profile') 
}
export function userSearch(user_name) {
  return api.get('/user/search?name='+user_name) 
}

export function preferenceList() {
  return api.get('/user/profile/preference') 
}

export function setPreferenceList(categories) {
  return request({
    url: '/user/profile/preference',
    method: 'POST',
    data: { categories }
  })
}
export function doSubscribe(data) {
  return request({
    url: '/user/subscribe',
    method: 'POST',
    data
  })
}
export function getInviteData(expo_id, user_id) {
  return request({
    url: '/user/getinvite_details',
    method: 'POST',
    data:{ expo_id, user_id }
  })
}
