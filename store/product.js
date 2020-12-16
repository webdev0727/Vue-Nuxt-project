import { product_special } from '@/api/product'
import { getCollection, getAdsProductLike, delCollect, doCollect } from '@/api/common'

export const state =()=>({
  recommend_products: [], 
  latest_products: [], 
  product_likes: [],
  my_collects:[]
})

export const mutations = {
 
  SET_SLIST: (state, items) => {
    if (items.recommend_products)
      state.recommend_products = items.recommend_products    
    if (items.latest_products)
      state.latest_products = items.latest_products   
    if (items.product_likes)
      state.product_likes = items.product_likes   
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
}

export const actions = {
  // get Total roles for admin add role  
  async getProductSList({ commit }, items=['latest_products', 'recommend_products']) { 
    const resp = await product_special(items)
    commit('SET_SLIST', resp)
  },  

  // "product_likes",
  // "product_hots_1",
  // "product_video",
  async getProductLike({ commit, rootState }) { 
    let data = {
      lists: ['product_likes']
    }
    if (rootState.auth) data.user_id = rootState.auth.id
    const resp = await getAdsProductLike(data)
    commit('SET_SLIST', resp)
  },  

  // all my product collect
  async getMyProductCollects({ commit }) {
    let qq = {
      page: 1,
      limit: 100000
    }
    const resp = await getCollection('product', qq)
    if (resp){
      // let ids =[]
      // resp.items.forEach(el => {
      //   ids.push({id: el.id, source_id: el.source_id})
      // });
      commit('SET_MY_COLLECTS', resp.items)
    }
  }, 

  async delMyProductCollect({ commit }, id) {  
    commit('common/SET_LOADING', true, { root: true })  
    const resp = await delCollect('product', id).finally(()=>{
      commit('common/SET_LOADING', false, { root: true })
    })
    if (resp)
      commit('SET_MY_COLLECTS_POP', id)
  },  

  async addMyProductCollect({ commit }, product_id) { 
    commit('common/SET_LOADING', true, { root: true }) 
    const resp = await doCollect('product', product_id).finally(()=>{
      commit('common/SET_LOADING', false, { root: true })
    })
    if (resp)
      commit('SET_MY_COLLECTS_PUSH', resp.collect)
  },  
}