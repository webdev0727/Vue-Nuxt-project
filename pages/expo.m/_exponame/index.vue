<template>
<div>
    <!-- carousel -->
    <div class="w-100 mh-400" style="height:40vw; ">
        <el-carousel height="40vw">
            <el-carousel-item v-for="item in banners" :key="item.id">
                <!-- <div class="banner-container-div" :style="`background-image:url(${item.url})`"></div> -->
                <a class="banner-container-div d-block" 
                    :style="`background-image:url(${item.url})`"
                    :href="item.redirect_url"
                    target="_blank"
                    >
                </a>
            </el-carousel-item>
        </el-carousel>

    </div>
    <!-- Introduce -->
    <div class="p-2">
        <div class="rounded bg-white">
            <div class="p-2" v-html="gsv([expo_type, lang_key], expo_content)" :key="key_content" v-if="gsv([expo_type, lang_key], expo_content)"></div>
        </div>
        <!-- 新闻资讯 -->
        <div class="p-2 rounded bg-white mt-2 overflow-hidden"  v-if="news.length">
            <ku-title-left>{{$t('news_l')}}</ku-title-left>
            <div class="mt-2">
                <card-r v-for="ii in Math.min(5, news.length)" :key='ii' :poster="gsv([0, 'url'], news[ii-1].covers)" :title="gsv([$i18n.locale], news[ii-1].title) || news[ii-1].title" @click.native="goNewsDetail(news[ii-1])">
                    <div class="d-flex justify-content-between text-dark9 font-08">
                        <p>
                            <span>{{news[ii-1].comments}}</span>{{$t('comment')}}⋅<span>{{formatTime(news[ii-1].created_at)}}</span>
                        </p>
                        <p class="ml-2 text-nowrap">{{$t('view.count')}} {{news[ii-1].views}}</p>
                    </div>
                </card-r>
            </div>
            <!-- <no-data v-if="!news.length"></no-data> -->
            <div class="text-center mt-1 p-2" v-if="news.length">
                <p><span class="p-2 pt-4 text-dark9" @click="goNewsMore">{{$t('more')}}</span></p>
            </div>
        </div>
        <!-- 最新参展 -->
        <div class="p-2 rounded bg-white mt-2 overflow-hidden" v-if="company.length">
            <ku-title-left>{{$t('expo.new')}}</ku-title-left>
            <div class="mt-2">
                <div v-for="item in company" :key='item.id' @click="goCompanyDetail(item.id)">
                    <div class="py-2 mb-1">
                        <div :to="'/company/' + item.id" class="d-flex">
                            <img :src="gsv(['url'], item.logo)" alt="" width="55" height="55" class="rounded">
                            <div class="pl-2 card-body-content">
                                <h4 class="pr-2 text-dark text-line-1">{{item.name[$i18n.locale]}}</h4>
                                <p class="text-dark9 mt-1">{{$t('expo.i')}}: {{gsv([0, $i18n.locale], item.cur_expos)}}</p>
                            </div>
                        </div>
                        <div class="text-dark9 mt-2">
                            <div class="d-flex">
                                <p class="text-nowrap mr-1">{{$t('main.product1')}}: </p>
                                <p> {{getNames(item.categories) }}</p>
                            </div>
                            <div class="d-flex">
                                <p class="text-nowrap mr-1">{{$t('main.market')}}: </p>
                                <p>{{getNames(item.market)}}</p>
                            </div>
                        </div>
                    </div>
                    <ku-line />
                </div>
                <!-- <no-data v-if="!company.length"></no-data> -->
            </div>
            <div class="text-center mt-1 p-2" v-if="company.length">
                <p @click="goCompanyMore"><span class="p-2 pt-4 text-dark9">{{$t('more')}}</span></p>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'

const expo_type = 55

export default {
    name: "Expo_Index",
    layout: 'expo',
    components: {},
    data() {
        return {
            exhibition_info: {},
            key_content: +new Date(),
            expo_type,
            expo_id: ''
        }
    },
    // async asyncData({ params, route, redirect, store }) {
        
    //     let exponame = params.exponame || 'cnise'        
    //     // const kk = await store.dispatch('expo/getBanner', exponame)        
    // },
    computed: {
        ...mapState('expo', ['expo_content', 'banners', 'news', 'company']),
        lang_key: function () {
            return "pc_" + this.$i18n.locale
        }
    },
    methods: {
        ...mapActions('expo', ['getExpoContent', 'getBanner', 'getExpoCommon', 'getExpoType']),
        getSList() {
            this.expo_id = this.expo_content['common']['id']
            if (this.expo_id){
                this.getExpoType({ expoid: this.expo_id, type: 'news' })
                this.getExpoType({ expoid: this.expo_id, type: 'company' })
            }
        },
        goNewsDetail(da) {
            if (da.tag == 'activity')
                window.open(process.env.M_URL + `/events/${da.id}`, '_blank')
            else
                window.open(process.env.M_URL + `/article/${da.id}`, '_blank')
        },
        goNewsMore() {
            this.$router.replace({path: `/${this.$route.params.exponame}/media/expo_news`})
        },
        goCompanyDetail(id) {
            window.open(process.env.M_URL + `/company/${id}`, '_blank')
        },
        goCompanyMore() {
            window.open(process.env.M_URL + `/company`, '_blank')
        }
    },
    mounted() {
        const exponame = this.$route.params.exponame || 'cnise'
        if (!this.expo_content[expo_type]) {
            this.getExpoContent({ exponame, expo_type }).then(() => {
                this.key_content = +new Date()
            })
        }
        // this.getBanner(exponame)

        if (!this.expo_content['common'].length) {
            this.getExpoCommon(exponame).then(() => {
                this.getSList()
            })
        } else {
            this.getSList()
        }
    }
}
</script>
