
import { getList, getGroup } from "~/api/message"
export const state =()=>({
  list: [],  
  total: 0,
  group:[]
})

export const mutations = {
  SET_D: (state, res) => {
    state.list = res.items
    state.total = res.total
  },   
  SET_GROUP: (state, da) => {
    state.group = da
  },   
}

export const actions = {
  // get Total roles for admin add role
  async getMessage({ commit }, query) {  
    commit('common/SET_LOADING', true, { root: true })
    const resp = await getList(query).finally(()=>{
      commit('common/SET_LOADING', false, { root: true })
    })
    if (resp)
      commit('SET_D', resp)
  },  
  async getMessageGroup({ commit }) {  
    const resp = await getGroup()
    if (resp)
      commit('SET_GROUP', resp.grouplist)
  },  
}