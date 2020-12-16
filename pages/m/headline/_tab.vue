<template>
<div class="container">
    <!-- Top part -->
    <div class="bg-white">
        <div class="d-flex">
            <div class="p-2 container-input-bg-dark9 flex-fill">
                <el-input :placeholder="$t('search')" v-model="listQuery.keyword" class="search-rounded" @keyup.enter.native="handleKeyword">
                    <i slot="prefix" class="el-input__icon el-icon-search" @click="handleKeyword"></i>
                </el-input>
            </div>
            <nuxt-link to="/my/article/new" class="p-2  pt-3" style="left:unset; right:0">
                <span class="text-danger text-nowrap">{{$t('article.want')}}</span>
            </nuxt-link>
        </div>
    </div>
    <!-- tab 业界动态, 行业观察, 政策法规  -->
    <div class="px-2 bg-white border-bottom" v-if="tab_headline.length">
        <ku-tab-line :list='tab_headline' :activeTab.sync="listQuery.category_id" :activeTabBarWidth=30 @change="handleTabChange"></ku-tab-line>
    </div>

    <div class="p-2 mb-5">
        <!-- carousel -->
        <div class="conatiner-carousel mh-400" v-if="!listQuery.category_id">
            <el-carousel height="40vw" v-if="banner_headline.length" class="mb-2">
                <el-carousel-item v-for="ii in Math.min(banner_headline.length, 3)" :key="ii">
                    <!-- <div class="banner-container-div rounded overflow-hidden" :style="`background-image:url(${gsv([$i18n.locale, 'url'], banners[ii-1].assets)})`">
                        <p class="px-2 text-white" style="background-color: rgba(0, 0, 0, 0.6); line-height: 2rem; width: max-content">{{$t('ads.i')}} {{gsv(['description', $i18n.locale, ], banners[ii-1])}}</p>
                    </div> -->
                    <a class="banner-container-div rounded d-block" 
                    :style="`background-image:url(${gsv([$i18n.locale, 'url'], banner_headline[ii-1].assets)})`"
                    :href="gsv([$i18n.locale, 'redirect_url'], banner_headline[ii-1].assets)"
                    target="_blank"
                    >
                    </a>
                </el-carousel-item>
            </el-carousel>
        </div>
        <div class="conatiner-carousel mh-400" v-else>
            <el-carousel height="40vw" v-if="banners.length" class="mb-2">
                <el-carousel-item v-for="ii in Math.min(banners.length, 3)" :key="ii">
                    <div class="banner-container-div rounded" v-if="gsv([0, 'url'], banners[ii-1].covers)" :style="`background-image:url(${gsv([0, 'url'], banners[ii-1].covers)})`"></div>
                </el-carousel-item>
            </el-carousel>
        </div>

        <!-- list -->
        <div class="bg-white rounded overflow-hidden pl-2">
            <card-article v-for="item in list" :key='item.id' :da='item' />
            <!-- <infinite-loading :identifier='infiniteId' @infinite="handleInfinite" class="m-3"> </infinite-loading> -->
            <ku-loading-no-data :active="isLoading" :total="total" push />
            <div class="text-center pagination-kuc mt-3 mb-5">
                <span class="px-3 py-2 text-dark6" v-if="list.length<total && list.length!=0" @click="handleGetMore">{{$t('more_load')}}</span>
            </div>
        </div>

    </div>
    <br>
</div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import { getList } from '@/api/article'

import CardArticle from '~/components/Card/CardArticle.vue'

export default {
    name: 'HeadLine',
    layout: 'main',
    components: {
        CardArticle
    },    
    data() {
        return {
            isLoading: true,
            listQuery: {
                page: 1,
                limit: 5,
                keyword: this.$route.query.keyword || '',
                category_id: 0,
                mode: 3,
            },
            list: [],
            total: 0,
            // infiniteId: +new Date()
        }
    },
    async asyncData({ store }) {
        if (!store.state.common.seo)
            await store.dispatch('common/downloadSeo').catch(err => {
                console.log('seo_err')
            })
    },
    head() {
        return {
            title: this.gsv(['www', this.seo_path, 'title'], this.$store.state.common.seo) || this.$t('headline'),
            meta: [{
                    hid: 'description',
                    name: 'description',
                    content: this.gsv(['www', this.seo_path, 'description'], this.$store.state.common.seo),
                },
                {
                    hid: 'keywords',
                    name: 'keywords',
                    content: this.gsv(['www', this.seo_path, 'keywords'], this.$store.state.common.seo),
                },
            ]
        }
    },
    computed: {
        ...mapState('banner', ['banner_headline']),
        ...mapState('article', ['tab_items']),
        ...mapState(['tab_headline']),
        banners: function () {
            const kkk = this.tab_items.find(rr => rr.id == this.listQuery.category_id)
            let banners = []
            if (kkk) {
                banners = kkk.articles.length ? kkk.articles : []
            }
            return banners
        },
        seo_path: function () {
            return this.$i18n.locale == 'en' ? '/en/headline' : '/headline'
        }
    },
    
    methods: {
        ...mapActions('banner', ['getHeadlineBanner']),
        ...mapActions('article', ['getTabListOfHeadline', 'getHomeBanner']),
        
        getList() {
            this.isLoading = true;
            let qq = Object.assign({}, this.listQuery)
            if (this.listQuery.category_id == 0) {
                qq.mode = 0
                delete qq.category_id                
            }             
            getList(qq).then(res => {
                this.list.push(...res.items)
                this.total = res.total
            }).finally(() => {
                this.isLoading = false
            })
        },

        handleFilter() {
            this.listQuery.page = 1;
            this.list = [];
            this.total = 0
            // this.infiniteId += 1;
            this.getList()
        },
        handleKeyword() {
            this.$router.replace({ name: this.$route.name, query: { keyword: this.listQuery.keyword } })
            this.handleFilter()
        },
        handleGetMore(){
            this.listQuery.page += 1
            this.getList()
        },
        
        handleTabChange(tab) {            
            this.handleFilter()
            // this.$router.replace({ name: this.$route.name, query: { tab } })
            history.replaceState({}, null, '/headline/' + (tab == 0 ? '' : tab))
        },              

    },    
    mounted() {
        this.listQuery.category_id = this.$route.params.tab != null && this.$route.params.tab != undefined ? parseInt(this.$route.params.tab) : 0
        if(!this.banner_headline.length) this.getHeadlineBanner()
        this.getList()
        this.getTabListOfHeadline()
    },
}
</script>
