
import { getCountry, getCity } from "@/api/world"

export const state = () => ({
  countries: [],  
  CHN: [],
  is_loading_c: false,
  is_loading_p: false,
})

export const mutations = {
  SET_COUNTRIES: (state, res) => {
    state.countries = res   
  },  
  SET_PROVINCES: (state, res) => {
    state.CHN = res   
  },  
  SET_LOADING_C: (state, st) => {
    state.is_loading_c = st   
  },  
  SET_LOADING_P: (state, st) => {
    state.is_loading_p = st   
  },  
}

export const actions = {
  // get Total roles for admin add role  
  async getCountry({commit}) {
    if (process.client){
      commit('SET_LOADING_C', true)          
      const resp = await getCountry()
      commit('SET_LOADING_C', false)          
      if (resp)
        commit('SET_COUNTRIES', resp.data)
    }
  },
  async getProvince({commit}) {
    if (process.client){
      commit('SET_LOADING_P', true)  
      const resp = await getCity('CHN')    
      commit('SET_LOADING_P', false)  
      if (resp.data.length) {
        commit('SET_PROVINCES', resp.data)      
      }      
    }
  },
}
