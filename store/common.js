import { buildQuery } from '@/utils'
import { getCategory, getUnits} from '@/api/common'
import { myCate } from '@/api/product'
import { getListForGuest } from '@/api/treasure'
import { getAdsBanner } from '@/api/ads'
import axios from 'axios'

export const state = () => ({
  isRootLoading: false,  
  category: [],  
  list: {
    categories: [],
    product_custom_categories: [],
    mgmodels: [],
    markets: [],
    product_units: [],
    newscategories: [],
    news_tag: [],
    countries: [],
    old_expos: [],
    halls: [],
    running_expos: [],
    cny_usd: 0.14,
    usd_cny: 7.1,
  },
  purchase:[],    
  promotion_invitation_money: 0,
  seo: null
})

export const mutations = {
  SET_LOADING: (state, value) => {
    state.isRootLoading = value
  },  
  SET_CATE: (state, itmes) => {
    state.category = itmes
  },
  SET_CATE_ME: (state, itmes) => {
    state.list.product_custom_categories = itmes
  },
  SET_UNITS: (state, itmes) => {
    // state.list = itmes
    for (const key in itmes) {
      if (itmes.hasOwnProperty(key)) {
        const element = itmes[key];
        state.list[key] = element
      }
    }
  },
  SET_PRICE_INVITE: (state, da) => {
    state.promotion_invitation_money = da
  },
  SET_PURCHASE: (state, da) => {
    state.purchase = da
  }, 
  SET_SEO: (state, da) => {
    state.seo = da
  }, 
  
}

export const getters = {
  cate3 (state) {
    let items= JSON.parse(JSON.stringify(state.list.categories))
    items.forEach((cc, ii) => {
      items[ii] = buildQuery(cc)
      if (cc['childs'] && cc['childs'].length) {
        cc['childs'].forEach((cc1, ii1) => {
          items[ii]['childs'][ii1] = buildQuery(cc1)
          if (cc1['childs'] && cc1['childs'].length) {
            cc1['childs'].forEach((cc2, ii2) => {
              items[ii]['childs'][ii1]['childs'][ii2] = buildQuery(cc2)
              if (cc2['childs'] && cc2['childs'].length) {
            
              } else delete items[ii]['childs'][ii1]['childs'][ii2]['childs']
            });
          } else {
            delete items[ii]['childs'][ii1]['childs']
          }
        });
      } else {
        delete items[ii]['childs']
      }
    });
    return items  
  },      
  cate2 (state) {
    let items= JSON.parse(JSON.stringify(state.list.categories))
    items.forEach((cc, ii) => {
      items[ii] = buildQuery(cc)
      if (cc['childs'] && cc['childs'].length) {
        cc['childs'].forEach((cc1, ii1) => {
          items[ii]['childs'][ii1] = buildQuery(cc1)
          if (cc1['childs'] && cc1['childs'].length) {            
            delete items[ii]['childs'][ii1]['childs']
          } else {
            delete items[ii]['childs'][ii1]['childs']
          }
        });
      } else {
        delete items[ii]['childs']
      }
    });    
    return items
  },
  cate_postable(state){
    return state.list.newscategories.filter(rr=>rr.is_postable)
  }      
}

export const actions = {
  setLoading({ commit }, value=true) {  
    commit('SET_LOADING', value)
  },  
  async getCategory({commit}) {
    const resp = await getCategory()
    commit('SET_CATE', resp.data)
  },
  async getCategoryMe({commit}) {
    const resp = await myCate()
    commit('SET_CATE_ME', resp.items)
  },
  async getUnitsList({rootState,commit}, lists = ['categories', 'product_custom_categories', 'mgmodels', 'markets', 'product_units', 'newscategories', "news_tag", "countries", "old_expos", "halls", "running_expos", 'inquiry_items']) {
    let param = {lists}
    if (rootState.auth) param.company_id = rootState.auth.company_id
    const resp = await getUnits(param)
    commit('SET_UNITS', resp)
  },
  async getCommonPurchase({ commit }) {  
    const resp = await getListForGuest()
    commit('SET_PURCHASE', resp.items)
  }, 
  
  async getHomeBaner({ commit }, id) {  
    commit('SET_LOADING', true)
    const resp = await getAdsBanner('m_home_banner')
    commit('SET_LOADING', false)
    if (resp.hall){      
      commit('SET_HALL', resp.hall)
    }
  }, 
  async downloadSeo({commit}) {
    const url = `${process.env.M_URL}/files/seo.json`
    return new Promise((resolve, reject) => {      
      axios.get(url).then(resp => {
        if (resp) {
          commit('SET_SEO', resp.data)
        }
        resolve()
      }).catch(error => {
        reject(error)
      })
    })    
  },
}
