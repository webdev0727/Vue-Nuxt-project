
import { getList, getArticle } from '@/api/article'
import { getCollection, getAdsProductLike, delCollect, doCollect } from '@/api/common'
const Cookie = process.client ? require('js-cookie') : undefined
const domain  = '.antway.cn'
const tab_home = {
  id: 0, 
  name: {
    en: "Headline",
    zh: "头条"
  },
  articles:[],  
}

export const state =()=>({ 
  tab_items: [],
  articles_home:{
    tab1: [],
    tab2: [],
    tab3: [],
  },
  latest_articles:[],
  my_collects:[]
})

export const mutations = {
  SET_TABS: (state, da) => {
    state.tab_items = da   
  },    
  SET_ARTICLE: (state, da) => {
    state.articles_home[da.type] = da.items  
  },    
  SET_DA: (state, da) => {
    state[da.type] = da.items  
  },    
  SET_HOME_BANNER: (state, da) => {
    if (!state.tab_items.length){
      state.tab_items.push(tab_home)
    }
    state.tab_items[0]['articles'] = da
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
  async getTabListOfHeadline({ commit }) { 
    const param = {     
      mode: 2,
      page: -1,
    } 
    const resp = await getList(param)
    let tab_items = resp.categories   
    tab_items.unshift(tab_home) 
    let tab_items_local = []
    tab_items.forEach(element => {
      tab_items_local.push({
        id: element.id,
        name: element.name
      })
    });
    // localStorage.setItem('mAntway_headline_tabs', JSON.stringify(tab_items_local))
    commit('SET_TAB_HEADLINE', tab_items_local, {root: true})
    Cookie.set('tab_headline', tab_items_local, {domain}) 
    commit('SET_TABS', tab_items)    
  },  
  // async getHomeArticle({ commit }, tab) { 
  //   let category_id = ''
  //   switch (tab) {
  //       case 'tab1':
  //           category_id = 11
  //           break;
  //       case 'tab2':
  //           category_id = 18
  //           break;

  //       case 'tab3':
  //           category_id = 36
  //           break;
  //       default:
  //           break;
  //   }
  //   let qq = { mode: 3, page: 1, limit: 3, category_id }
  //   const resp = await getList(qq)
  //   if (resp.items){
  //     resp.type = tab
  //     commit('SET_ARTICLE', resp)
  //   }
  // },
  // async getArticleLast({ commit }) {
  //   const resp = await getArticle('latest_articles')
  //   if (resp.latest_articles){
  //     commit('SET_DA', {type: 'latest_articles', items: resp.latest_articles})
  //   }
  // },   
  async getHomeBanner({ commit }) {
    const resp = await getArticle('banner_news')
    if (resp.banner_news){
      commit('SET_HOME_BANNER', resp.banner_news)
    }
  },  
  
  // all my collects
  async getMyArticleCollects({ commit }) {
    let qq = {
      page: 1,
      limit: 100000
    }
    const resp = await getCollection('article', qq)
    if (resp){      
      commit('SET_MY_COLLECTS', resp.items)
    }
  }, 

  // del- collect
  async delMyArticleCollect({ commit }, id) {  
    commit('common/SET_LOADING', true, { root: true })  
    const resp = await delCollect('article', id).finally(()=>{
      commit('common/SET_LOADING', false, { root: true })
    })
    if (resp)
      commit('SET_MY_COLLECTS_POP', id)
  }, 

  // add - collect
  async addMyArticleCollect({ commit }, s_id) { 
    commit('common/SET_LOADING', true, { root: true }) 
    const resp = await doCollect('article', s_id).finally(()=>{
      commit('common/SET_LOADING', false, { root: true })
    })
    if (resp)
      commit('SET_MY_COLLECTS_PUSH', resp.collect)
  }, 
}