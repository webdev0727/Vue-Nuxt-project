import { getAdsBanner } from '@/api/ads'
export const state = () => ({
    banner_home: [],
    banner_home_c: {},
    banner_product: [],
    banner_company: [],
    banner_headline: [],
    banner_profile: [],
})

export const mutations = {
  SET_BANNER: (state, item) => {
    state[item.type] = item.ads
  },
}

export const getters = {

}
/* 
========== type: 
m_home_banner, 
m_home_center, 
m_product_banner, 
m_company_banner, 
m_article_banner, 
m_profile_center 
*/
export const actions = {
    async getHomeBanner({ commit, dispatch }) {
        let resp = await getAdsBanner('m_home_banner')
        if (resp && resp.ads) {
            resp.type = 'banner_home'
            commit('SET_BANNER', resp)
            dispatch("setBannerCookie", resp.ads, {root: true})
        }
    },
    async getHomeBannerC({ commit }) {
        let resp = await getAdsBanner('m_home_center')
        let kk={
            type: "banner_home_c"
        }
        if (resp && resp.ads) {
            if(resp.ads.length){
                kk.ads = resp.ads[0]
                commit('SET_BANNER', kk)
            } 
        }
    },
    async getProductBanner({ commit }) {
        let resp = await getAdsBanner('m_product_banner')        
        if (resp && resp.ads) {
            resp.type = 'banner_product'
            commit('SET_BANNER', resp)
        }
    },
    async getCompanyBanner({ commit }) {
        let resp = await getAdsBanner('m_company_banner')        
        if (resp && resp.ads) {
            resp.type = 'banner_company'
            commit('SET_BANNER', resp)
        }
    },
    async getHeadlineBanner({ commit }) {
        let resp = await getAdsBanner('m_article_banner')        
        if (resp && resp.ads) {
            resp.type = 'banner_headline'
            commit('SET_BANNER', resp)
        }
    },
    async getProfileBanner({ commit }) {
        let resp = await getAdsBanner('m_profile_center')        
        if (resp && resp.ads) {
            resp.type = 'banner_profile'
            commit('SET_BANNER', resp)
        }
    },
}
