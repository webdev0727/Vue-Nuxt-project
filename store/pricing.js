
import {pricing_list} from "@/api/user"

export const state = () => ({
  permissions: [],
  pricing_cate: []
})

export const mutations = {
  SET_PRICING: (state, res) => {
    state.permissions = res.permissions
    state.pricing_cate = res.vips
  },  
}

export const actions = {
  // get Total roles for admin add role  
  async getPricingList({
    commit
  }) {
    const resp = await pricing_list()
    if (resp)
      commit('SET_PRICING', resp)          
  },
}
