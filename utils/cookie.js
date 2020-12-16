import Cookies from 'js-cookie'

const TokenKey = 'token'
const domain  = '.antway.cn'
// token
export function getToken() {
  let token = process.client ? Cookies.get(TokenKey, {domain}) : "server"
  return  token
}

export function setToken(token) {
  return Cookies.set(TokenKey, token, {domain})
}

export function removeToken() {
  return Cookies.remove(TokenKey, {domain})
}
export function removeAuth() {
  return Cookies.remove('auth', {domain})
}

// lang
export function getLang() {
  return Cookies.get('lang', {domain})
}
export function setLang(lang) {
  return Cookies.set('lang', lang, {domain})
}

