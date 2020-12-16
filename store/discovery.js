
import { getList } from '@/api/discovery'

export const state =()=>({
  items: [],  
  total: 0,  
})

export const mutations = {
  SET_DA: (state, da) => {
    if (da.page==1)
      state.items = da.items
    else
      state.items.push(...da.items)
    state.total = da.total
  },    
  RESET: (state) => {
    state.items = []
    state.total = 0
  },    
}

export const actions = {
  // get Total roles for admin add role
  async getDiscovery({ commit }, query={page: 1, limit: 4}) {  
    const resp = await getList(query)
    if(resp){
      resp.page = query.page
      commit('SET_DA', resp)
    }
    return resp
  },  
  clearDiscovery({ commit }) {  
    commit('RESET')    
  },  
}