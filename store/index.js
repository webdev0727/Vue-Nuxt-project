import { login, logout, getInfo, register, resetpassword, getMyNumbers } from '@/api/user'
import { register as register_weixin } from '@/api/weixin'
import { getUserInfo } from '@/utils'

const cookieparser = process.server ? require('cookieparser') : undefined
const Cookie = process.client ? require('js-cookie') : undefined
// const domain  = ("."+ process.env.DOMAIN ) || '.m.antway.cn'
const domain  = ".antway.cn"
export const state = () => {
  return {
    auth: null,
    auth_numbers:{
      buyer_company_visit_count:0,
      buyer_inquery_count:0,
      buyer_pindan_count:0,
      buyer_purchase_count:0,
      purchases: [],
      recommend_products: [],
      seller_product_count:0,
      seller_company_visit_count:0,
      seller_inquery_count:0,
      seller_pindan_count:0,
      seller_purchase_offer_count:0,
      subscribe: null
    },
    lang: 'zh',   
    token: null,
    tab_headline: [],
    banner_home_cookie: []
  }
}
export const mutations = {
  setAuth (state, auth) {
    state.auth = auth    
  },
  setToken (state, token) {
    state.token = token    
  },
  SET_LANGUAGE: (state, language) => {
    let lang = language ? language: 'zh'
    state.lang = lang
  },
  SET_MY_NUMBERS: (state, res) => {
    state.auth_numbers = res
  },
  SET_TAB_HEADLINE: (state, res) => {
    state.tab_headline = res
  },
  SET_BANNER_HOME: (state, res) => {
    state.banner_home_cookie = res
  },
}
export const getters = {  
  // status           0:No verified 1:Pending 2:Verified
  // status_active    0:Active 1:Warn 2:Suspended
  company_status(state){
    let ttt = ''
    if (state.auth.company.status_active == 1) ttt='status.company_warning'
    else if (state.auth.company.status_active == 2) ttt='status.company_suspend'
    else if (state.auth.company.status == 1) ttt='status.company_pending'
    return ttt
  }  ,
  /* 
    0: not auth
    1: 
    2: registered member
    3: 认证会员
    4: VIP会员
    5: 文具通会员->展贸通
  */
  userLevel(state){
    var level = 0
    if (state.auth){      
      if (!state.auth.vip_id) {
          if (state.auth.status_verified==2) {
            level = 3
          }else{
            level = 2
          }
      } else {
          level = state.auth.vip_id        
      }
    }
    return level
  },
  myId(state){
    var my_id = null
    if (state.auth){      
      my_id = state.auth.id      
    }
    return my_id
  },
}
export const actions = {
  nuxtServerInit ({ commit }, { app, req }) {
    // console.log("store i--------------->")
		let auth = null
		let lang = null
    let token = null
    let tab_headline = []
    let banner_home = []
    if (process.server){
      if (req.headers.cookie) {
        const parsed = cookieparser.parse(req.headers.cookie)
        try {
          // auth = parsed.auth
          token = parsed.token
          lang = parsed.lang
          auth = JSON.parse(parsed.user)
          tab_headline = JSON.parse(parsed.tab_headline)
          banner_home = JSON.parse(parsed.banner_home)
          // console.log("store totken--", token)
        } catch (err) {
          // No valid cookie found
        }
      }
      commit('setAuth', auth)
      commit('setToken', token)
      commit('SET_LANGUAGE', lang)
      commit('SET_TAB_HEADLINE', tab_headline)
      commit('SET_BANNER_HOME', banner_home)
    }
  },
  setUserAuth({commit}, response){
    let auth_info = getUserInfo(response)
    commit('setAuth', auth_info)  
    Cookie.set('user', auth_info, {domain})   
  },
  setToken({commit}, token){
    commit('setToken', token)
    Cookie.set('token', token, {domain})    
  },
  login({commit, dispatch}, param){
    return new Promise((resolve, reject) => {      
      login(param).then(response => {
        dispatch('setUserAuth', response.user)           
        Cookie.set('token', response.token, {domain})
        commit('setToken', response.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  logout({commit}){
    Cookie.remove('user', {domain})   
    Cookie.remove('token', {domain})
    commit('setAuth', null)
    commit('setToken', null)
  },
  userUpdate({commit}, param){
    // console.log(response)  
    commit('setAuth', param)
    Cookie.set('user', param, {domain})  
  },
  register({commit, dispatch}, param){
    return new Promise((resolve, reject) => {      
      register(param).then(response => {
        dispatch('setUserAuth', response.user)          
        Cookie.set('token', response.token, {domain})    
        commit('setToken', response.token)        
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  register_weixin({commit, dispatch}, param){
    return new Promise((resolve, reject) => {      
      register_weixin(param).then(response => {
        dispatch('setUserAuth', response.user)          
        Cookie.set('token', response.token, {domain})
        commit('setToken', response.token)        
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  async getMyInfo({commit, dispatch, state}){  
      const res = await getMyNumbers()
      if (res)
        commit('SET_MY_NUMBERS', res)  
        if (res.user){
          if (state.token)
            dispatch('setUserAuth', res.user)
          // dispatch('setUserAuth', response.user)      
        }
        
      // const response = await getInfo(state.auth.id)
  },
  resetPass({commit, dispatch}, param){
    return new Promise((resolve, reject) => {      
      resetpassword(param).then(response => {
        dispatch('setUserAuth', response.user)
        Cookie.set('token', response.token, {domain})     
        commit('setToken', response.token)       
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  setLanguage({ commit }, language) {
    commit('SET_LANGUAGE', language)
    Cookie.set('lang', language, {domain})
  },
  setBannerCookie({ commit }, banner_da) {
    let banners = banner_da.map(rr=>rr.assets.zh.url)    
    commit('SET_BANNER_HOME', banners)
    Cookie.set('banner_home', banners, {domain})
  },
}
