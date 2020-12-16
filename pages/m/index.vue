<template>
<div class="container">
    <!-- Top part -->
    <div class="bg-danger pb-5">
        <div class="d-flex justify-content-between p-2">
            <img src="/logo/logo.png" class="ku-ant-logo fit-contain">
            <header-menu></header-menu>
        </div>
        <div class="p-2">
            <div class="search-rounded-group mb-2">
                <el-input :placeholder="$t('search')" v-model="keyword" @keyup.enter.native="goSearch">
                    <div slot="prepend">
                        <el-select v-model="page_type" placeholder="" class="text-dark6">
                            <el-option v-for="item in page_type_list" :key="item" :label="$t(item)" :value="item">
                            </el-option>
                        </el-select>
                    </div>
                    <i slot="suffix" class="el-input__icon el-icon-search" @click="goSearch"></i>
                </el-input>
            </div>
        </div>
    </div>

    <!-- carousel -->
    <div class="px-2">
        <div class="conatiner-carousel mt-n5 mh-400" style="height: 40vw">
            <client-only>
                <el-carousel height="40vw">
                    <template v-if="banner_home.length">
                        <el-carousel-item v-for="item in banner_home" :key="item.id">
                            <div class="banner-container-div" :style="`background-image:url(${gsv([$i18n.locale, 'url'], item.assets)})`" @click="goTo(gsv([$i18n.locale, 'redirect_url'], item.assets))">
                            </div>
                        </el-carousel-item>
                    </template>
                    <template v-else>
                        <el-carousel-item v-for="item in banner_home_cookie" :key="item">
                            <div class="banner-container-div" :style="`background-image:url(${item})`"></div>
                        </el-carousel-item>
                    </template>
                </el-carousel>
            </client-only>
        </div>
    </div>
    <!-- menu -->
    <div class="d-flex justify-content-between home-menu-bar px-3 pt-3">

        <nuxt-link to='/purchase'>
            <div class="btn-menu rounded-circle bg-warning d-flex justify-content-center align-items-center">
                <svg-icon name="cart2" width="50%" height="50%" color="white"></svg-icon>
            </div>
            <p class="text-center">{{$t('purchase.bao')}}</p>
        </nuxt-link>

        <nuxt-link to='/product'>
            <div class="btn-menu rounded-circle bg-primary d-flex justify-content-center align-items-center">
                <svg-icon name="product" width="50%" height="50%" color="white"></svg-icon>
            </div>
            <p class="text-center">{{$t('products')}}</p>
        </nuxt-link>
        <nuxt-link to='/company'>
            <div class="btn-menu rounded-circle bg-orange d-flex justify-content-center align-items-center">
                <svg-icon name="enterprise" width="50%" height="50%" color="white"></svg-icon>
            </div>
            <p class="text-center">{{$t('enterprise')}}</p>
        </nuxt-link>

        <nuxt-link to="/headline">
            <!-- <img src="/images/icon/tab_ico01.png" alt=""> -->
            <div class="btn-menu rounded-circle d-flex justify-content-center align-items-center" style="background-color: #C46BFF">
                <svg-icon name="headline" width="50%" height="50%" color="white"></svg-icon>
            </div>
            <p class="text-center">{{$t('headline')}}</p>
        </nuxt-link>
    </div>
    <div class="d-flex justify-content-between home-menu-bar p-3">
        <nuxt-link to="/events">
            <!-- <img src="/images/icon/tab_ico05.png" alt=""> -->
            <div class="btn-menu rounded-circle d-flex justify-content-center align-items-center" style="background-color: #C46BFF">
                <svg-icon name="event" width="50%" height="50%" color="white"></svg-icon>
            </div>
            <p class="text-center">{{$t('event.i')}}</p>
        </nuxt-link>
        <nuxt-link to='/my/buy/participate'>
            <div class="btn-menu rounded-circle bg-orange d-flex justify-content-center align-items-center">
                <svg-icon name="eye-open" width="50%" height="50%" color="white"></svg-icon>
            </div>
            <p class="text-center">{{$t('want.visit')}}</p>
        </nuxt-link>
        <nuxt-link to='/my/sell/participate'>
            <div class="btn-menu rounded-circle bg-warning d-flex justify-content-center align-items-center">
                <svg-icon name="user-add" width="50%" height="50%" color="white"></svg-icon>
            </div>
            <p class="text-center">{{$t('want.expo')}}</p>
        </nuxt-link>
        <div to='/expo/cnise' class="menu-item" @click="goExpo">
            <div class="btn-menu rounded-circle bg-primary d-flex justify-content-center align-items-center">
                <svg-icon name="arrow-circle-right" width="50%" height="50%" color="white"></svg-icon>
            </div>
            <p class="text-center">进入展会</p>
        </div>
    </div>

    <div class="p-2 mb-5">
        <!-- notice -->
        <div class="bg-white p-2 d-flex justify-content-between align-items-center rounded">
            <img src="/icons/footer/h.png" alt="" width="40">
            <div class="notice-content">
                <ul class="pl-2" style="line-height: 1.5rem">
                    <li class="text-line-1" v-for="item in notice2" :key="item.id" @click="goNotice(item.id)">{{gsv(['title_'+$i18n.locale], item)}}</li>
                </ul>
            </div>
            <nuxt-link to="/notice" class="p-2">
                <i class="el-icon-arrow-right"></i>
            </nuxt-link>
        </div>
        <!-- 最新求购 recent buy -->
        <div class="bg-white rounded p-2 mt-2 overflow-hidden">
            <ku-title-left>{{$t('recent')}}{{$t('quotation')}}</ku-title-left>
            <div class="mt-1">
                <nuxt-link :to="'/purchase/' + purchase[item-1].id" v-for="item in Math.min(purchase.length, 5) " :key='item'>
                    <card-r :title='purchase[item-1].title' :subTitle="parseTime(purchase[item-1].created_at, '{y}-{m}-{d} {h}:{i}')" :poster="getImg1(purchase[item-1].assets) || '/images/ant404.png'" :bigIMG="false"></card-r>
                </nuxt-link>
                <no-data v-if="!purchase.length"></no-data>
            </div>
            <div class="text-center py-2" v-if="purchase.length">
                <nuxt-link to='/purchase' class="p-3 text-dark9">
                    {{$t('more')}}
                </nuxt-link>
            </div>
        </div>
        <!-- 发现 discovery  -->
        <div class="bg-white rounded py-2 pl-2 mt-2 overflow-hidden">
            <ku-title-left>{{$t('discovery')}}</ku-title-left>
            <div class="mt-1">
                <div v-for="ii in Math.min(discoveries.length, 4) " :key="discoveries[ii-1]['id']" @click="goDiscoverD(discoveries[ii-1])">
                    <card-r :subTitle="parseTime(discoveries[ii-1].created_at, '{y}-{m}-{d} {h}:{i}')" :poster="getImg1(discoveries[ii-1].covers) || '/images/ant404.png'" :bigIMG="false">
                        <p v-if="discoveries[ii-1]['tag']!='activity' && !discoveries[ii-1].covers.length" slot="img"></p>
                        <h3 slot="title" class="text-line-1 mb-2">{{gsv([$i18n.locale], discoveries[ii-1].title) || discoveries[ii-1].title || $t('title')}}</h3>
                    </card-r>
                </div>
                <no-data v-if="!discoveries.length"></no-data>
            </div>
            <div class="text-center py-2" v-if="discoveries.length">
                <nuxt-link to='/discovery' class="p-3 text-dark9">
                    {{$t('more')}}
                </nuxt-link>
            </div>
        </div>
        <!-- tab 业界动态, 行业观察, 政策法规  -->
        <!-- <div class="bg-white rounded mt-2">
            <div class="ml-2 pr-2 border-bottom">
                <ku-tab-line :list='tab_items' :activeTab.sync="activeTab" :activeTabBarWidth=30 @change="handleTabChange"></ku-tab-line>
            </div>
            <div class="px-2">
                <div>
                    <card-article v-for="item in articles_home[activeTab]" :key='item.id' :da='item' />
                    <div class="text-center py-2">
                        <nuxt-link to='/headline' class="p-3 text-dark9">
                            {{$t('more')}}
                        </nuxt-link>
                    </div>
                </div>
            </div>
        </div> -->

        <!-- article last  -->
        <div class="bg-white rounded py-2 pl-2 mt-2 overflow-hidden">
            <ku-title-left>{{$t('headline')}}</ku-title-left>
            <div class="mt-1">
                <card-article v-for="item in Math.min(cover_news.length, 4)" :key='item' :da='cover_news[item-1]' />
                <no-data v-if="!cover_news.length"></no-data>
            </div>
            <div class="text-center py-2" v-if="cover_news.length">
                <nuxt-link to='/headline' class="p-3 text-dark9">
                    {{$t('more')}}
                </nuxt-link>
            </div>
        </div>
        <!-- Mid section Banner center-->
        <div class="rounded p-2 mt-2 home-mid-section" v-if="banner_home_c.assets" :style="`background-image: url(${gsv(['assets', $i18n.locale, 'url'], banner_home_c)})`" @click="goTo(gsv(['assets', $i18n.locale, 'redirect_url'], banner_home_c))">
            <div class="d-flex align-items-center">
                <!-- m-auto -->
                <h2 class="text-white text-line-2 p-2" style="text-shadow: 0px 0px 3px #4e4c4c;">{{gsv(['description', $i18n.locale], banner_home_c)}}</h2>
                <!-- <p class="text-white">展设计_简简单单店</p> -->
                <!-- <nuxt-link :to="`/events/${gsv([0, 'id'], event)}`" class="mid-see-more bg-danger text-white p-2" style="border-radius:0">{{$t('more_see')}}</nuxt-link> -->

            </div>
        </div>

        <!-- 推荐产品 Recommended Products -->
        <div class="bg-white rounded p-2 mt-2">
            <div>
                <ku-title-left>{{$t('recom.product')}}</ku-title-left>
                <div class="card-recomm-container mt-1">
                    <div v-for="ii in Math.min(recommend_products.length, 4)" :key='ii'>
                        <card-price :productDa="recommend_products[ii-1]" :key="recommend_products[ii-1]['id']" :price="price_real(recommend_products[ii-1])"></card-price>
                    </div>
                </div>
                <no-data v-if="!recommend_products.length"></no-data>
            </div>
            <p class="text-center border-top mt-2 p-2" v-if="recommend_products.length">
                <nuxt-link to="/product"><span class="p-2 pt-4 text-dark9">{{$t('more')}}</span></nuxt-link>
            </p>
        </div>

        <!-- 推荐企业 Recommended company  -->
        <div class="bg-white rounded p-2 my-2 overflow-hidden">
            <ku-title-left>{{$t('recom.enterprise')}}</ku-title-left>
            <div class="mt-1">
                <CardCompany v-for="item in Math.min(5, recommend.length)" :key='item' :productDa='recommend[item-1]' />
                <no-data v-if="!recommend.length"></no-data>
            </div>
            <p class="text-center m-2" v-if="recommend.length">
                <nuxt-link to="/company"><span class="p-2 text-dark9">{{$t('more')}}</span></nuxt-link>
            </p>
        </div>

        <!-- Video  -->
        <div class="bg-white rounded p-2 my-2 overflow-hidden">
            <ku-title-left>{{$t('video.center')}}</ku-title-left>
            <div class="card-container-2col mt-1">
                <div v-for="ii in Math.min(recommend_video.length, 4)" :key="ii">
                    <card-video-c :title="gsv(['description', $i18n.locale], recommend_video[ii-1])" subTitle="" :poster="recommend_video[ii-1].poster" @click="handleVideoPlay(recommend_video[ii-1])"> </card-video-c>
                </div>
            </div>
            <no-data v-if="!recommend_video.length"></no-data>

            <div class="text-center py-2" v-if="recommend_video.length">
                <ku-line class="mb-2" />
                <nuxt-link to='/video' class="p-3 text-dark9">
                    {{$t('more')}}
                </nuxt-link>
            </div>
        </div>

    </div>

    <client-only>
        <light-box ref="lightbox" :showLightBox='false' :media="media" :showThumbs='false' :disableScroll='false' :key="video_key"></light-box>
    </client-only>

    <!-- Expo Select Dlg -->
    <el-dialog :visible.sync="dialogVisable" class="w-100 px-3 text-center m-auto m-max-width" width="100%">
        <h2 slot="title">{{$t('select')}}{{$t('expo.i')}}</h2>

        <!-- Expo List -->
        <div class="">
            <div v-for="item in running_expos" :key="item.id" class="d-flex mb-3 font-11" @click="goExpoPage(item.prefix)">
                {{gsv([$i18n.locale], item.name)}}
            </div>
        </div>
    </el-dialog>

    <br>
</div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'

import CardCompany from '~/components/Card/CardCompany.vue'
import CardPrice from '~/components/Card/CardPrice.vue'
import HeaderMenu from '~/components/HeaderMenu.vue'
import CardArticle from '~/components/Card/CardArticle.vue'

export default {
    name: 'Home',
    layout: 'main',
    components: {
        CardCompany,
        CardPrice,
        HeaderMenu,
        CardArticle
    },
    data() {
        return {
            video_key: "kk",
            keyword: '',
            activeTab: 'tab1',
            media: [{
                thumb: "https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=894098678,72275648&fm=15&gp=0.jpg",
                sources: [{
                    src: "https://cdn.theguardian.tv/webM/2015/07/20/150716YesMen_synd_768k_vp8.webm",
                    type: 'video/webm'
                }],
                type: 'video',
                width: '100%',
                height: 'auto',
                autoplay: true
            }],
            articles: {
                tab1: [],
                tab2: [],
                tab3: [],
            },
            page_type: "product",
            page_type_list: ['product', 'company', 'headline'],
            dialogVisable: false
        }
    },
    async asyncData({ store }) {
        if (!store.state.common.seo)
            await store.dispatch('common/downloadSeo').catch(err => {
                console.log(err, 'err')
            })

    },
    computed: {
        ...mapState(['lang', 'banner_home_cookie']),
        ...mapState('banner', ['banner_home', 'banner_home_c']),
        ...mapState('common', { running_expos: (state) => state.list.running_expos, purchase: (state) => state.purchase }),
        ...mapState('company', ['recommend']),
        ...mapState('notice', ['notice2']),
        ...mapState('home', ['cover_news']),
        // ...mapState('article', ['articles_home', 'latest_articles']),
        ...mapState('video', ['recommend_video']),
        ...mapState('product', ['recommend_products']),
        ...mapState('discovery', { "discoveries": state => state.items }),
        ...mapGetters('opposite', ['my_suppliers']),
        ...mapGetters(['userLevel']),
        tab_items: function () {
            return [
                { id: 'tab1', name: this.$t('company.news') },
                { id: 'tab2', name: this.$t('company.interview') },
                { id: 'tab3', name: this.$t('regulation') },
            ]
        },
        seo_path: function () {
            return this.$i18n.locale == 'en' ? '/en' : '/'
        }
    },
    head() {
        return {
            title: this.gsv(['www', this.seo_path, 'title'], this.$store.state.common.seo),
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
    watch: {
        lang(to, from) {
            this.getDiscovery()
            this.getCoverNews()
            // this.getArticleLast()
        }
    },
    methods: {
        ...mapActions('common', ['getBanner', 'getCommonPurchase', 'productRecomm', 'productNews', 'officeRecomm', 'getUnitsList']),
        ...mapActions('company', ['getSList']),
        ...mapActions('home', ['getCoverNews']),
        ...mapActions('notice', ['getNotice2']),
        ...mapActions('video', ['getVideoRecom']),
        ...mapActions('product', ['getProductSList']),
        ...mapActions('discovery', ['getDiscovery']),
        // ...mapActions('article', ['getHomeArticle', 'getArticleLast']),
        ...mapActions('opposite', ['getMySuppliers']),
        ...mapActions('banner', ['getHomeBanner', 'getHomeBannerC']),
        handleTabClick() {

        },
        // handleTabChange(activeTab) {
        //     if (!this.articles_home[activeTab].length) {
        //         this.getHomeArticle(activeTab)
        //     }
        // },
        handleVideoPlay(item) {
            this.media[0]['sources'][0]["src"] = item['url']
            this.media[0]['sources'][0]["type"] = item['content_type']
            this.video_key = +new Date()
            setTimeout(() => {
                this.$refs.lightbox.showImage(0)
            }, 100)
        },
        goDiscoverD(da) {
            if (da.tag == 'activity')
                this.$router.push({ path: `/events/${da.id}` })
            else
                this.$router.push({ path: `/article/${da.id}` })
        },
        goExpoPage(expo_name) {
            if (expo_name)
                window.open(process.env.M_EXPO_URL + expo_name.toLowerCase())
            this.dialogVisable = false
        },
        goExpo() {
            if (this.running_expos.length > 1) this.dialogVisable = true
            else {
                const expo_name = this.gsv([0, 'prefix'], this.running_expos) || 'cnise'
                this.goExpoPage(expo_name)
            }
        },
        goNotice(id) {
            this.$router.push({ path: `/notice/${id}` })
        },
        goTo(url) {
            if (url)
                window.open(url)
        },
        goSearch() {
            const keyword = this.keyword
            if (keyword) {
                const path = this.page_type != 'headline' ? `/${this.page_type}/search` : '/' + this.page_type
                this.$router.push({ path, query: { keyword } })
            }
        },
        price_real(info) {
            let ppp = 'xxx'
            if (this.userLevel) {
                if (info.is_only_buyer) {
                    if (this.my_suppliers.includes(info.user_id)) {
                        ppp = info.price
                    }
                } else {
                    ppp = info.price
                }
                if (info.user_id == this.$store.state.auth.id) ppp = info.price
            }
            return ppp
        }
    },
    mounted() {
        if (!this.banner_home.length) this.getHomeBanner()
        if (!this.banner_home_c.id) this.getHomeBannerC()
        if (!this.notice2.length) this.getNotice2()
        if (!this.purchase.length) this.getCommonPurchase()
        if (!this.discoveries.length) this.getDiscovery()
        if (!this.recommend.length) this.getSList(['recommend']);
        if (!this.recommend_products.length) this.getProductSList(['recommend_products']);
        if (!this.recommend_video.length) this.getVideoRecom()
        if (!this.cover_news.length) this.getCoverNews()
        if (!this.running_expos.length) this.getUnitsList(['running_expos'])
        if (this.userLevel) {
            if (!this.my_suppliers.length) this.getMySuppliers()
        }        
    },

}
</script>

<style lang="scss" scoped>
.conatiner-carousel {
    border-radius: 0.5rem;
    overflow: hidden;
    background: white;
}

.home-mid-section {
    background-image: url('/upload/mid1.png');
    background-size: cover;
    height: 9rem;
    position: relative;
    overflow: hidden;

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-image: linear-gradient(to top, black, transparent, transparent);
        opacity: 0.5;
        z-index: 1;
    }

    >div {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        z-index: 2;
    }

    .mid-see-more {
        position: absolute;
        right: 1rem;
        bottom: 1rem;
    }

    p {
        position: absolute;
        bottom: 2rem;
        left: 1rem;
    }
}

.card-recomm-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;

    >div {
        width: calc(50% - 5px);
    }
}
</style>
