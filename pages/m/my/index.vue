<template>
<div>
    <!-- Top part -->
    <div class="bg-danger bg-container text-white pb-5" v-if="auth">
        <div class="top-header">
            <div class="p-1" style="position: absolute;" @click="LogOut">&nbsp;&nbsp;&nbsp;</div>
            <h2 class="text-center p-2">{{$t('mine')}}</h2>
            <nuxt-link to="/my/message" class="p-2">
                <svg-icon name='message' width='25' height='25' color='#fff'></svg-icon>
            </nuxt-link>
        </div>

        <div class="d-flex pl-2 align-items-center justify-content-between my-1">
            <div class="d-flex align-items-center" @click="$router.push({path: '/my/profile'})">
                <img :src="auth.avatar.url || '/files/avatar.png'" alt="" class="rounded-circle fit-cover mr-2" style="width:4.5rem; height:4.5rem;">
                <div>
                    <p class="font-13 mb-2">{{auth.name[$i18n.locale] || auth.user_name}} <span class="font-1" v-if="user_level">{{user_level}}</span> </p>
                    <nuxt-link to="/my/profile" class="font-08 text-white py-2">{{$t('info.imp')}} <i class="el-icon-arrow-right"></i> </nuxt-link>
                </div>
            </div>
            <div v-if="user_level_next" class="d-flex align-items-center right-turn-btn bg-white text-dark p-2 pl-3" @click="goVipMember">
                <img src="/icons/my_member.png" alt="" width="13">
                <p class="ml-1">{{user_level_next}}</p>
            </div>
        </div>
        <el-row class="px-3">
            <el-col :span="12">
                <nuxt-link to="/my/collection" class="text-white">
                    <p class="font-12">{{auth.collections || 0}}</p>
                    <p class="font-08">{{$t('collect.my')}}</p>
                </nuxt-link>
            </el-col>
            <el-col :span="12">
                <nuxt-link to="/my/income" class="text-white">
                    <p class="font-12">{{auth.balance || 0}}</p>
                    <p class="font-08" s>{{$t('income.my')}}(元)</p>
                </nuxt-link>
            </el-col>
        </el-row>

    </div>
    <!-- <svg-icon name='bottom_round' color="#E50113" width="100%" height="100%"></svg-icon> -->

    <div class="p-2 mb-5 mt-n5" style="position:relative">
        <!-- notice -->
        <div class="bg-white p-2 d-flex justify-content-between align-items-center rounded">
            <div class="notice-content">
                <ul class="pl-2">
                    <li class="text-line-1" @click="goNotice(gsv(['notice', 'id'], auth_numbers))">{{gsv(['notice', lang_key_title], auth_numbers) || $t('no_data')}}</li>
                    <p class="text-dark9 pl-3 mt-1" v-if="notice_date">{{parseTime(notice_date, '{y}-{m}-{d}')}}</p>
                </ul>
            </div>
            <nuxt-link to="/notice" class="p-2">
                <i class="el-icon-arrow-right"></i>
            </nuxt-link>
        </div>
        <!-- Mid section -->

        <!-- carousel -->
        <div class="conatiner-carousel mb-2 mt-2 mh-300">
            <el-carousel height="30vw">
                <el-carousel-item  v-for="item in banner_profile" :key="item.id">
                    <!-- <div class="banner-container-div rounded home-mid-section" :style="`background-image:url(${gsv(['assets', $i18n.locale, 'url'], auth_numbers.ad)})`" @click="goEvent(auth_numbers.ad.id)">
                        <div style="bottom: 2.5rem">
                            <h3 class="text-white m-auto text-line-1 px-2">{{gsv(['description', $i18n.locale], auth_numbers.ad)}}</h3>
                        </div>                        
                    </div> -->
                    <a class="banner-container-div rounded d-block home-mid-section" 
                        :style="`background-image:url(${gsv([$i18n.locale, 'url'], item.assets)})`"
                        :href="gsv([$i18n.locale, 'redirect_url'], item.assets)"
                        target="_blank"
                        >
                        <div style="bottom: 2.5rem">
                            <h3 class="text-white m-auto text-line-1 px-2">{{gsv(['description', $i18n.locale], item)}}</h3>
                        </div> 
                    </a>
                </el-carousel-item>
            </el-carousel>
        </div>        

        <!-- menu -->
        <div class="home-menu-bar mt-2 p-3 bg-white rounded">
            <div class="d-flex justify-content-between">
                <nuxt-link to="/my/event">
                    <img src="/images/icon/tab_ico05.png" alt="">
                    <p class="text-center text-nowrap">{{$t('my')}}{{$t('event.i')}}</p>
                </nuxt-link>
                <nuxt-link to='/my/comment'>
                    <div class="btn-menu rounded-circle d-flex bg-primary justify-content-center align-items-center">
                        <svg-icon name="message1" width="50%" height="50%" color="white"></svg-icon>
                    </div>
                    <p class="text-center text-nowrap">{{$t('comment.my')}}</p>
                </nuxt-link>

                <nuxt-link to='/my/promotion'>
                    <div class="btn-menu rounded-circle bg-orange d-flex justify-content-center align-items-center">
                        <svg-icon name="arrow-circle-right" width="50%" height="50%" color="white"></svg-icon>
                    </div>
                    <p class="text-center text-nowrap">{{$t('promotion.my')}}</p>
                </nuxt-link>

            </div>
            <div class="d-flex justify-content-between mt-2">
                <nuxt-link to='/my/article'>
                    <div class="btn-menu rounded-circle bg-orange d-flex justify-content-center align-items-center">
                        <svg-icon name="contribute" width="50%" height="50%" color="white"></svg-icon>
                    </div>
                    <p class="text-center">{{$t('article.cont')}}</p>
                </nuxt-link>

                <nuxt-link to='/my/profile'>
                    <div class="btn-menu rounded-circle bg-warning d-flex justify-content-center align-items-center">
                        <svg-icon name="verify" width="50%" height="50%" color="white"></svg-icon>
                    </div>
                    <p class="text-center text-nowrap">{{$t('info.my')}}</p>
                </nuxt-link>

                <nuxt-link to='/my/env'>
                    <div class="btn-menu rounded-circle bg-primary d-flex justify-content-center align-items-center">
                        <svg-icon name="product" width="50%" height="50%" color="white"></svg-icon>
                    </div>
                    <p class="text-center">{{$t('preference')}}</p>
                </nuxt-link>

            </div>
        </div>
        <!-- menu 2 -->
        <div class="home-menu-bar mt-2 p-2 bg-white rounded">
            <div class="d-flex justify-content-between mb-2">
                <h3>{{$t('want.buy')}}</h3>
                <nuxt-link to='/my/buy' class="align-items-end">
                    <p class="text-dark9">{{$t('enter')}}<i class="el-icon-arrow-right"></i></p>
                </nuxt-link>
            </div>
            <div class="d-flex justify-content-between">
                <nuxt-link to='/my/buy/pindan'>
                    <!-- <div class="btn-menu rounded-circle bg-warning d-flex justify-content-center align-items-center">
                        <svg-icon name="order" width="50%" height="50%" color="white"></svg-icon>
                    </div> -->
                    <h3 class="text-danger">{{auth_numbers.buyer_pindan_count}}</h3>
                    <p class="text-center">{{$t('pin.my')}}</p>
                </nuxt-link>
                <nuxt-link to='/my/buy/treasure'>
                    <h3 class="text-danger">{{auth_numbers.buyer_purchase_count}}</h3>
                    <p class="text-center">{{$t('purchase.post')}}</p>
                </nuxt-link>

                <nuxt-link to='/my/buy/inquiry'>
                    <!-- <div class="btn-menu rounded-circle bg-danger d-flex justify-content-center align-items-center">
                        <svg-icon name="message2" width="50%" height="50%" color="white"></svg-icon>
                    </div> -->
                    <h3 class="text-danger">{{auth_numbers.buyer_inquery_count}}</h3>
                    <p class="text-center">{{$t('xunpan.my')}}</p>
                </nuxt-link>
                <nuxt-link to='/my/buy/company'>
                    <!-- <div class="btn-menu rounded-circle bg-orange d-flex justify-content-center align-items-center">
                        <svg-icon name="eye-open" width="50%" height="50%" color="white"></svg-icon>
                    </div> -->
                    <h3 class="text-danger">{{auth_numbers.buyer_company_visit_count}}</h3>
                    <p class="text-center">{{$t('want.visit1')}}</p>
                </nuxt-link>

            </div>
        </div>

        <!-- menu 3 -->
        <div class="home-menu-bar mt-2 p-2 bg-white rounded">
            <div class="d-flex justify-content-between mb-2">
                <h3>{{$t('want.sell')}}</h3>
                <nuxt-link to='/my/sell' class="align-items-end">
                    <p class="text-dark9">{{$t('enter')}}<i class="el-icon-arrow-right"></i></p>
                </nuxt-link>
            </div>
            <div class="d-flex justify-content-between">

                <nuxt-link to='/product_manage'>
                    <!-- <div class="btn-menu rounded-circle bg-orange d-flex justify-content-center align-items-center">
                        <svg-icon name="release" width="50%" height="50%" color="white"></svg-icon>
                    </div> -->
                    <h3 class="text-danger">{{auth_numbers.seller_product_count}}</h3>
                    <p class="text-center">{{$t('product.post')}}</p>
                </nuxt-link>
                <nuxt-link to='/my/sell/inquiry'>
                    <!-- <div class="btn-menu rounded-circle bg-danger d-flex justify-content-center align-items-center">
                        <svg-icon name="message2" width="50%" height="50%" color="white"></svg-icon>
                    </div> -->
                    <h3 class="text-danger">{{auth_numbers.seller_inquery_count}}</h3>
                    <p class="text-center">{{$t('xunpan.my')}}</p>
                </nuxt-link>
                <nuxt-link to='/my/sell/treasure'>
                    <!-- <div class="btn-menu rounded-circle bg-primary d-flex justify-content-center align-items-center">
                        <svg-icon name="yuen" width="50%" height="50%" color="white"></svg-icon>
                    </div> -->
                    <h3 class="text-danger">{{auth_numbers.seller_purchase_offer_count}}</h3>
                    <p class="text-center">{{$t('quote.my')}}</p>
                </nuxt-link>
                <nuxt-link to='/my/sell/pindan'>
                    <!-- <div class="btn-menu rounded-circle bg-warning d-flex justify-content-center align-items-center">
                        <svg-icon name="user-add" width="50%" height="50%" color="white"></svg-icon>
                    </div> -->
                    <h3 class="text-danger">{{auth_numbers.seller_pindan_count}}</h3>
                    <p class="text-center">{{$t('pin.bao')}}</p>
                </nuxt-link>

            </div>
        </div>

        <div class="mt-2 p-2 bg-white rounded overflow-hidden">
            <div class="d-flex justify-content-between align-items-center">
                <h3 class="py-1">{{$t('buyer.news')}}</h3>
                <p class="text-dark6" @click="handleRefreshTr">{{$t('refresh')}}</p>
            </div>
            <div v-for="item in purchase" :key="item.id">
                <nuxt-link :to="'/purchase/'+item.id">
                    <p class="text-line-2 pt-2">{{item.title}}</p>
                    <p class="text-dark9 font-08 mt-2 pb-2">{{parseTime(item.created_at, '{y}-{m}-{d} {h}:{i}')}}</p>
                </nuxt-link>
                <ku-line />
            </div>
            <no-data v-if="!purchase.length"></no-data>
            <div class="text-center mt-2 pb-1" v-if="purchase.length">
                <nuxt-link to='/purchase' class="p-3 text-dark9">{{$t('more')}}</nuxt-link>
            </div>
        </div>

        <div class="mt-2 p-2 bg-white rounded overflow-hidden">
            <div class="d-flex justify-content-between align-items-center">
                <h3 class="py-1">{{$t('recom.product')}}</h3>
                <p class="text-dark6" @click="handleRefreshProduct">{{$t('refresh')}}</p>
            </div>
            <div class="card-container-2col my-2 bg-white rounded">
                <div v-for="ii in Math.min(recommend_products.length, 4)" :key='ii'>
                    <card-price :productDa="recommend_products[ii-1]" :key="recommend_products[ii-1]['id']" :price="price_real(recommend_products[ii-1])"></card-price>
                </div>
            </div>
            <no-data v-if="!recommend_products.length"></no-data>
            <div class="text-center mt-2 pb-1" v-if="recommend_products.length">
                <ku-line class="mb-2" />
                <nuxt-link to="/product"><span class="p-2 pt-4 text-dark9">{{$t('more')}}</span></nuxt-link>
            </div>

        </div>

    </div>
    <br>
</div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import { product } from '@/api/common'
import { getInfo } from '@/api/user'
import CardPrice from '~/components/Card/CardPrice.vue'

export default {
    middleware: 'authenticated',
    name: 'MyHome',
    layout: 'main',
    components: { CardPrice },
    head() {
        return {
            title: this.$t('mine')
        }
    },
    data() {
        return {
            keyword: '',
            activeTabName: 'news',
            info: [],
            next_level: 0
        }
    },
    computed: {
        ...mapState(['auth', 'auth_numbers']),
        ...mapState('banner', ['banner_profile']),
        ...mapState('pricing', ['pricing_cate']),
        ...mapState('common', ['purchase']),
        ...mapState('product', ['recommend_products']),
        // ...mapState('home', ['event']),
        ...mapGetters('opposite', ['my_suppliers']),
        ...mapGetters(['userLevel']),
        user_level: function () {
            let txt = ''
            switch (this.userLevel) {
                case 2:
                    txt = this.$t('member.reg')
                    break;
                case 3:
                    txt = this.$t('member.certified')
                    break;
                case 4:
                    txt = this.$t('member.vip')
                    break;
                case 5:
                    txt = this.$t('member.w')
                    break;
                default:
                    break;
            }
            return txt
        },
        user_level_next: function () {
            let txt = ''
            this.next_level = this.userLevel + 1
            switch (this.next_level) {
                case 3:
                    txt = this.$t('member.certified')
                    break;
                case 4:
                    txt = this.$t('member.vip')
                    break;
                case 5:
                    txt = this.$t('member.w')
                    break;
                default:
                    this.next_level = ''
                    break;
            }
            return txt
        },
        lang_key_title: function () {
            return 'title_' + this.$i18n.locale
        },
        notice_date: function () {
            return this.gsv(['notice', 'created_at'], this.auth_numbers)
        }
    },
    methods: {
        ...mapActions('banner', ['getProfileBanner']),
        ...mapActions('common', ['getCommonPurchase']),
        ...mapActions('product', ['getProductSList']),
        ...mapActions('pricing', ['getPricingList']),
        // ...mapActions('home', ['getHomeEvent']),
        ...mapActions('opposite', ['getMySuppliers']),

        handleRefreshTr() {
            this.getCommonPurchase();
        },
        handleRefreshProduct() {
            this.getProductSList(['recommend_products']);
        },
        handleNextNotice() {

        },
        goVipMember() {
            this.$router.push({ path: "/pricing", query: { lev: this.next_level } })
        },
        // goEvent(id) {
        //     // this.$router.push({ path: `/events/${id}` })
        // },
        goNotice(id) {
            if (id)
                this.$router.push({ path: `/notice/${id}` })
        },
        LogOut() {
            this.$store.dispatch('logout').then(() => {
                this.$router.replace({ path: "/" })
            })
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
    // async fetch() {},
    mounted() {
        this.$store.dispatch('getMyInfo')
        // if (!this.event.length) this.getHomeEvent()
        if (!this.recommend_products.length) this.getProductSList(['recommend_products']);
        if (!this.purchase.length) this.getCommonPurchase()
        if (!this.pricing_cate.length) this.getPricingList()
        if (!this.my_suppliers.length) this.getMySuppliers()
        if(!this.banner_profile.length) this.getProfileBanner()
        
    },
}
</script>

<style lang="scss" scoped>
@import "@/assets/scss/config/_variables.scss";

.bg-container {
    position: relative;
    border-radius: 0 0 1rem 1rem;

    .top-header {
        position: relative;

        a {
            position: absolute;
            top: 0;
            right: 0;
        }
    }

}

.home-mid-section {
    background-image: url('/upload/mid1.png');
    background-size: cover;
    height: 100%;
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
        bottom: 0;
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
.right-turn-btn {
    border-radius: 2rem 0rem 0rem 2rem;
}
</style>
