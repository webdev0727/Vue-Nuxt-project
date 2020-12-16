<template>
<div class="container mb-5">
    <!-- Top part -->
    <div class="bg-white">
        <div class="p-2 container-input-bg-dark9">
            <el-input :placeholder="$t('search')" v-model="keyword" class="search-rounded" @keyup.enter.native="handleFilter">
                <i slot="prefix" class="el-input__icon el-icon-search"></i>
            </el-input>
        </div>
    </div>

    <div class="p-2">
        <!-- carousel 40vmin-->
        <div class="conatiner-carousel mh-400" v-if="banner_product.length">
            <el-carousel height="40vw">
                <el-carousel-item v-for="item in banner_product" :key="item.id">
                    <a class="banner-container-div rounded d-block" :style="`background-image:url(${gsv([$i18n.locale, 'url'], item.assets)})`" :href="gsv([$i18n.locale, 'redirect_url'], item.assets)" target="_blank">
                    </a>
                </el-carousel-item>
            </el-carousel>
        </div>

        <!-- 推荐产品  -->
        <div class="rounded py-2">
            <div class="d-flex justify-content-between">
                <h3 class="">{{$t('recom.product')}}</h3>
                <nuxt-link to="/product/search" class="text-dark9"><span class="py-2 pl-2">{{$t('more')}}</span></nuxt-link>
            </div>

            <div class="scroll-container">
                <div class="mt-1 scroll-x-img-container">
                    <nuxt-link :to="getSeoProduct(item)" class="scroll-x-img" v-for="item in recommend_products" :key='item.id' :style="`background-image:url(${getImg1(item.assets)})`">
                        <div>
                            <div class="py-2">
                                <p class="text-white text-line-1 text-center">{{gsv([$i18n.locale], item.name)}}</p>
                            </div>
                        </div>
                    </nuxt-link>
                </div>
                <ku-loading-no-data :active="is_loading" :total="recommend_products.length"></ku-loading-no-data>

            </div>
        </div>

        <!-- 最新产品  -->
        <div>
            <div class="rounded py-2">
                <div class="d-flex justify-content-between">
                    <h3 class="">{{$t('product.latest')}}</h3>
                    <nuxt-link to="/product/search" class="text-dark9"><span class="py-2 pl-2">{{$t('more')}}</span> </nuxt-link>
                </div>
                <div class="scroll-container">
                    <div class="mt-1 scroll-x-img-container">
                        <nuxt-link :to="getSeoProduct(item)" class="scroll-x-img" v-for="item in latest_products" :key='item.id' :style="`background-image:url(${getImg1(item.assets)})`">
                            <div>
                                <div class="py-2">
                                    <p class="text-white text-line-1 text-center">{{gsv([$i18n.locale], item.name)}}</p>
                                </div>
                            </div>
                        </nuxt-link>
                    </div>
                    <ku-loading-no-data :active="is_loading" :total="latest_products.length"></ku-loading-no-data>
                </div>
            </div>
        </div>
        <!-- Likes -->
        <div>
            <div class="d-flex justify-content-between mt-2">
                <h3 class="">{{$t('just_for_you_p')}}</h3>
                <nuxt-link to="/product/search" class="text-dark9"><span class="py-2 pl-2">{{$t('refresh1')}}</span></nuxt-link>
            </div>
            <div class="bg-white rounded p-2 mt-2">
                <template v-if="product_likes.length">
                    <div class="card-recomm-container mt-1">
                        <div v-for="item in product_likes" :key='item.id'>
                            <card-price :productDa="item" :price="price_real(item)"></card-price>
                        </div>
                    </div>
                    <div class="text-center border-top">
                        <p class="p-2 text-dark6">{{$t('more')}}</p>
                    </div>
                </template>
                <div v-else>
                    <no-data></no-data>
                </div>
            </div>
        </div>
    </div>
    <!-- <div class="text-center pagination-kuc">
        <el-pagination background layout="prev, pager, next" :total="total" :pager-count=5 :prev-text="$t('page.pre')" :next-text="$t('page.next')" :page-size=4 :current-page.sync="listQuery.page" @current-change="getList" :hide-on-single-page='false'></el-pagination>
    </div> -->
    <br>
</div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import CardPrice from '~/components/Card/CardPrice.vue'
import { product } from '@/api/common'

export default {
    layout: 'main',
    components: { CardPrice },
    data() {
        return {
            keyword: "",
            list: [],
            is_loading: true

        }
    },
    async asyncData({store}){
        if (!store.state.common.seo)
            await store.dispatch('common/downloadSeo').catch(err=>{
                console.log('seo_err')
            })
    },
    computed: {
        ...mapState('banner', ['banner_product']),
        ...mapState('product', ['recommend_products', 'latest_products', 'product_likes']),
        ...mapGetters('opposite', ['my_suppliers']),
        ...mapGetters(['userLevel']),
        seo_path: function(){
            return this.$i18n.locale=='en' ? '/en/product' : '/product'
        }
    },
    head() {
        return {
            title: this.gsv(['www', this.seo_path, 'title'], this.$store.state.common.seo),
            meta: [
                {
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
    methods: {
        ...mapActions('product', ['getProductSList', 'getProductLike']),
        ...mapActions('opposite', ['getMySuppliers']),
        ...mapActions('banner', ['getProductBanner']),
        handleFilter(e) {
            this.$router.push({
                path: "/product/search",
                query: {
                    keyword: this.keyword
                }
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
    mounted() {
        let qq = []
        if (!this.latest_products.length) qq.push('latest_products')
        if (!this.recommend_products.length) qq.push('recommend_products')
        if (qq.length) {
            this.getProductSList(qq).finally(() => {
                this.is_loading = false
            });
        }

        if (this.$store.state.auth) {
            if(!this.product_likes.length) this.getProductLike();
        }
        if (this.userLevel) {
            if (!this.my_suppliers.length) this.getMySuppliers()
        }
        if (!this.banner_product.length) this.getProductBanner()

    },
}
</script>

<style lang="scss" scoped>
.card-recomm-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;

    >div {
        width: calc(50% - 5px);
    }
}
</style>
