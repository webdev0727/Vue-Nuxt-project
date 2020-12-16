import { getStep,  myExpoList, getContent, getExpo, getHallDetail } from '@/api/expo'
import axios from 'axios'

export const state = () => ({
  seller_step: {},
  step_buyer: {},
  my_expo_list: [],
  banners: [],
  my_expo_office_id: '',
  expo_content: {
    common: {},
    cooperative: [],
    halls: []
  },
  menu:[],
  news:[],
  company:[],
  activity:[],
})
export const getters = {
  expo_ids(state) {
    let expo_hall_selelced = []
    state.my_expo_list.forEach(el => {
      expo_hall_selelced.push(el.expo_id)
    })
    return expo_hall_selelced
  },
  menu_exhibitor(state){
    const kk = state.menu.find(rr=>rr.id==61)
    return kk ? kk.childs : []
  },
  menu_visitor(state){
    const kk = state.menu.find(rr=>rr.id==86)
    return kk ? kk.childs : []
  },
  myExpoListOfHistory (state) {
    var newL = []
    for (let index = 0; index < state.my_expo_list.length; index++) {
      const element = state.my_expo_list[index];
      // if (element.expo.status==2){
        newL.push({
          id: element.id,
          name: element.expo_name
        })
      // }
    }
    return newL
  }      
}
export const mutations = {
  SET_EXPO_STEP_S: (state, item) => {
    state.seller_step = item
  },
  SET_EXPO_STEP_B: (state, item) => {
    state.step_buyer = item
  },
  SET_EXPO_LIST: (state, item) => {
    state.my_expo_list = item
  },
  SET_EXPO_OFFICE_ID: (state, item) => {
    state.my_expo_office_id = item
  },
  SET_EXPO_CONTENT: (state, item) => {    
    state.expo_content[item.type] = item.content
  },
  SET_BANNER: (state, item) => {
    state.banners = item
  },
  SET_MENU: (state, item) => {
    state.menu = item
  },
  SET_TYPE: (state, res) => {
    state[res.type] = res.items
  },
  SET_SVG: (state, res) => {
    if (state.seller_step.halls){
      const ind =  state.seller_step.halls.findIndex(xx => xx.id == res.id)
      if (ind!=-1) state.seller_step.halls[ind]['svg']= res
    }
    const ind1 = state.expo_content.halls.findIndex(xx => xx.id == res.id)
    if (ind1!=-1) state.expo_content.halls[ind1]['svg']= res

  },
  SET_HALL: (state, res) => {
    const ind =  state.seller_step.halls.findIndex(xx => xx.id == res.id)
    if (ind!=-1) state.seller_step.halls[ind]['children']= res.children
  }, 
}

export const actions = {
  // get Total roles for admin add role
  async getSellerStatus({commit}, step='') {
    const resp = await getStep('seller', step)
    commit('SET_EXPO_STEP_S', resp)
    return resp.status
  },
  async getBuyerStatus({commit}, expo_id) {
    let data = expo_id ? {expo_id} : {}
    const resp = await getStep('buyer', -1, data)
    commit('SET_EXPO_STEP_B', resp)
  },
  async getMyExpoList({commit}) {
    const resp = await myExpoList()
    let list = resp.expo_applicant_sellers
    if (resp) {
      list.forEach((exx, ind) => {
        list[ind]["expo_name"] = exx.expo.name
      });

    }
    commit('SET_EXPO_LIST', list)
    if (list[0])
      commit('SET_EXPO_OFFICE_ID', list[0]['expo_id'])
  },
  setExpoId({commit}, id) {
    commit('SET_EXPO_OFFICE_ID', id)
  },
  async getExpoContent({commit}, {exponame, expo_type}) {
    commit('common/SET_LOADING', true, {root: true})
    let resp = await getContent(exponame, expo_type)
    commit('common/SET_LOADING', false, {root: true})
    if (resp.content) {
      resp.type = expo_type
      commit('SET_EXPO_CONTENT', resp)
    }
  },
  /* 
    expo_type
    expo: main info
    expos: past expos
  */
  async getExpoCommon({
    commit
  }, exponame) {
    commit('common/SET_LOADING', true, {root: true})
    let resp = await getExpo(exponame)
    commit('common/SET_LOADING', false, {root: true})
    if (resp['expo']) {
      resp.type = "common"
      resp.content = resp['expo']
      commit('SET_EXPO_CONTENT', resp)
      return resp['expo']
    }
  },
  async getExpoOld({commit}, exponame) {
    commit('common/SET_LOADING', true, {
      root: true
    })
    let resp = await getExpo(`old/${exponame}`)
    commit('common/SET_LOADING', false, {
      root: true
    })
    if (resp['expos']) {
      resp.type = "old_expos"
      resp.content = resp['expos']
      commit('SET_EXPO_CONTENT', resp)
    }
  },

  /* 
    cooperative, halls
  */
  async getExpoInfoById({commit}, {exponame,expoid,type}) {
    commit('common/SET_LOADING', true, {root: true})
    let resp = await getExpo(`${type}/${expoid}`)
    commit('common/SET_LOADING', false, {root: true})
    let key = 'items'
    if (type == 'halls') key = 'halls'
    if (resp[key]) {
      resp.type = type
      resp.content = resp[key]
      commit('SET_EXPO_CONTENT', resp)
    }
  },
  async getBanner({commit}, exponame) {
    let resp = await getExpo(`dashboard/${exponame}`)
    if (resp['items'] && resp['items'].length) {
      commit('SET_BANNER', resp['items'])
    }
  },
  async getMenu({commit}, exponame) {
    let resp = await getExpo(`menu/${exponame}`)
    if (resp['items'] && resp['items'].length) {
      const why_2_items = resp['items'].filter(rr=>rr.id==61 || rr.id==86)
      commit('SET_MENU', why_2_items)
    }
  },
  /* 
    expo/news/3
    expo/company/3
  */

  async getExpoType({commit}, {expoid, type}) {
    let resp = await getExpo(`${type}/${expoid}`)
    if (resp['items'] && resp['items'].length) {
      resp['type'] = type
      commit('SET_TYPE', resp)
    }
  },
  async downloadExpoSVG({commit}, halldata) {
    const url = halldata.json_url 
    return new Promise((resolve, reject) => {      
      if (!url) reject()
      axios.get("/" + url).then(resp => {
        // console.log(resp)
        if (resp) {
          resp.data.id = halldata.id
          commit('SET_SVG', resp.data)
        }
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
    
  },
  async getExpoHallDetail({ commit }, id) {  
    const resp = await getHallDetail(id)
    if (resp.hall){      
      commit('SET_HALL', resp.hall)
    }
  }, 
  
}
