import { sList } from '@/api/company'
import { collect_list, getList } from '@/api/my_company'
import { delCollect, doCollect } from '@/api/common'
import { getDetail, getHistory, toggleVisit } from '@/api/company'
export const state =()=>({
  recommend: [], 
  latest: [],
  my_collects:[],
  my_company_info: null,
  detail:{}
})

export const mutations = {
 
  SET_SLIST: (state, itmes) => {
    // state.list = itmes
    for (const key in itmes) {
      if (itmes.hasOwnProperty(key)) {
        const element = itmes[key];
        state[key] = element
      }
    }
  },  
  SET_MY_COMPANY:(state, da)=>{
    state.my_company_info = da    
  },

  SET_MY_COLLECTS: (state, ids) => {
    state.my_collects = ids
  },
  SET_MY_COLLECTS_PUSH: (state, item) => {
      state.my_collects.push(item)
  },
  SET_MY_COLLECTS_POP: (state, id) => {
    const ind = state.my_collects.findIndex(rr=>rr.id == id)
    if (ind > -1){
      state.my_collects.splice(ind, 1)
    } 
  },
  SET_COMPANY_DETAIL: (state, da) => {
    state.detail[da.company.id] = da     
  },
}

export const actions = {
  // get Total roles for admin add role  
  async getSList({ commit }, lists=['recommend', 'latest']) { 
    const resp = await sList({lists})
    commit('SET_SLIST', resp)
  },  
  setMyCompanyInfo({ commit, dispatch }, data) { 
    commit('SET_MY_COMPANY', data)
    if (data.user)
      dispatch('setUserAuth', data.user, {root: true})
  },
  async getMyCompanyInfo({ dispatch }) { 
    const resp = await getList()
    dispatch('setMyCompanyInfo', resp)
    return resp
  },

  // all my collects
  async getMyCompanyCollects({ commit }) {
    let qq = {
      page: 1,
      limit: 100000
    }
    const resp = await collect_list(qq)
    if (resp){
      // let ids =[]
      // resp.items.forEach(el => {
      //   ids.push({id: el.id, source_id: el.source_id})
      // });
      commit('SET_MY_COLLECTS', resp.items)
    }
  }, 

  // del- collect
  async delMyCompanyCollect({ commit }, id) {  
    commit('common/SET_LOADING', true, { root: true })  
    const resp = await delCollect('company', id).finally(()=>{
      commit('common/SET_LOADING', false, { root: true })
    })
    if (resp)
      commit('SET_MY_COLLECTS_POP', id)
  }, 

  // add - collect
  async addMyCompanyCollect({ commit }, s_id) { 
    commit('common/SET_LOADING', true, { root: true }) 
    const resp = await doCollect('company', s_id).finally(()=>{
      commit('common/SET_LOADING', false, { root: true })
    })
    if (resp)
      commit('SET_MY_COLLECTS_PUSH', resp.collect)
  }, 
  
  // get Company detail
  async getCompanyDetail({ commit }, qq) { 
    const resp = await getDetail(qq.id, qq.qq).finally(()=>{
    })
    if (resp)
      commit('SET_COMPANY_DETAIL', resp)
  }, 

}