import Vue from 'vue'
import InfiniteLoading from 'vue-infinite-loading'
Vue.use(InfiniteLoading, {
    slots:{
        noMore: '没有更多数据',
        noResults:'没有数据'       
    }
})