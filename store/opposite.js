
import { getGroupList, getList} from '@/api/opposite'

export const state =()=>({
  group_for_seller: [],  
  group_for_buyer: [],
  my_buyers:[],
  my_sellers:[],
})

export const mutations = {
  SET_G_SELLER: (state, item) => {
    state.group_for_seller = item
  },   
  SET_G_BUYER: (state, item) => {
    state.group_for_buyer = item
  },  
  SET_MY_SELLERS (state, da) {
    state.my_sellers = da    
  }, 
  SET_MY_BUYERS (state, da) {
    state.my_buyers = da    
  }, 
  
}
export const getters = {
  hasSellerGroup (state) {
    return !!state.group_for_seller.length
  },     
  hasBuyerGroup (state) {
    return !!state.group_for_buyer.length
  },
  my_suppliers(state){
    var list = []
    list = state.my_sellers.map(rr=>rr.opposite_id)
    return list
  },
  my_buyer(state){
    var list = []
    list = state.my_buyers.map(rr=>rr.opposite_id)
    return list
  },
}

export const actions = {
  // get Total roles for admin add role
  async getSellerGroup({ commit }) {  
    commit('common/SET_LOADING', true, { root: true })
    const resp = await getGroupList('buyer').finally(()=>{
      commit('common/SET_LOADING', false, { root: true })
    })
    if (resp)
      commit('SET_G_SELLER', resp.oppositegroup)
  },
  async getBuyerGroup({ commit }) {  
    commit('common/SET_LOADING', true, { root: true })
    const resp = await getGroupList('seller').finally(()=>{
      commit('common/SET_LOADING', false, { root: true })
    })
    if (resp)
      commit('SET_G_BUYER', resp.oppositegroup)
  },
  async getMySuppliers({commit}){  
    const res = await getList('buyer', {page:1, limit:1000})
    if (res)
      commit('SET_MY_SELLERS', res.items) 
  },
  async getMyBuyers({commit}){  
    const res = await getList('seller', {page:1, limit:1000})
    if (res)
      commit('SET_MY_BUYERS', res.items) 
  },
}