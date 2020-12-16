
import { getList } from '@/api/notice'
/* 
type:{ 
  "all", 
  "recommend", 
  "etc", 
  "company", 
  "product", 
  "activity", 
  "expo" } 
*/
export const state =()=>({ 
  notice2: [],
})

export const mutations = {
  SET_DA: (state, da) => {
    state.notice2 = da   
  },    
}

export const actions = {
  // get Total roles for admin add role   
  async getNotice2({ commit }){     
    const resp = await getList({ page:1, limit:2 })
    if (resp.items){
      commit('SET_DA', resp.items)
    }
  },  
}