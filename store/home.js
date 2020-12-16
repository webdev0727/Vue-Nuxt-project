
import { getList, getArticle } from '@/api/article'
import { getList as getListActivity } from '@/api/activity'
export const state =()=>({ 
  articles_home:{
    tab1: [],
    tab2: [],
    tab3: [],
  },
  cover_news: []
})

export const mutations = {
  SET_COVER_NEWS: (state, da) => {
    state.cover_news = da   
  },    
  SET_DA_ARTICLE: (state, da) => {
    state.articles_home[da.type] = da.items  
  }, 
}

export const actions = {
  // cover_news  
  async getCoverNews({ commit }) {     
    const resp = await getArticle('cover_news')
    if (resp.cover_news){
      commit('SET_COVER_NEWS', resp.cover_news)
    }
  },  

  // headline
  async getHomeArticle({ commit }, tab) { 
    let category_id = ''
    switch (tab) {
        case 'tab1':
            category_id = 11
            break;
        case 'tab2':
            category_id = 18
            break;

        case 'tab3':
            category_id = 36
            break;
        default:
            break;
    }
    let qq = { mode: 3, page: 1, limit: 3, category_id }
    const resp = await getList(qq)
    if (resp.items){
      resp.type = tab
      commit('SET_DA_ARTICLE', resp)
    }
  },   
}