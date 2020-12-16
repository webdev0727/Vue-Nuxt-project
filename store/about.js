
import { getList } from "~/api/about"
export const state =()=>({
  abouts:{
    about_us: null,  
    contact_us: null,  
    join_us: null,  
    terms: null,  
    privacy_policy: null,  
    help: null,
  }
})

export const mutations = {
  SET_D: (state, res) => {
    state.abouts[res.type]= res.content
  },   
}

export const actions = {
  // type: {'about_us' | 'contact_us' | 'join_us' | 'terms' | privacy_policy' | 'help'}
  async getAbout({ commit }, type) {  
    commit('common/SET_LOADING', true, { root: true })
    const resp = await getList(type).finally(()=>{
      commit('common/SET_LOADING', false, { root: true })
    })
    if (resp){
      resp.type = type
      commit('SET_D', resp)
    }
  },  
}