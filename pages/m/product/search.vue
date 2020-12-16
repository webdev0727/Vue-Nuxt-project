<template>
<div class="container mb-5">
    <!-- Top part -->
    <div class="bg-white pt-2">
        <kuc-page-header>
            <div class="pr-2 container-input-bg-dark9 ml-4 text-left" slot="title">
                <el-input :placeholder="$t('search')" v-model="listQuery.keyword" class="search-rounded" @change="handleKeyword">
                    <i slot="prefix" class="el-input__icon el-icon-search"></i>
                </el-input>
            </div>
        </kuc-page-header>
        <div class="p-2 d-flex filter-box">
            <div>
                <el-select v-model="listQuery.new_products" :placeholder="$t('product.kind')" @change="handleFilter">
                    <el-option :label="$t('product.kind')" value="">{{$t('all_product')}}</el-option>
                    <el-option :label="$t('product.new')" :value="true"></el-option>                    
                </el-select>
            </div>
            <div>
                <!-- <el-select v-model="listQuery.category_id" :placeholder="$t('cate.product')" @change="handleFilter">
                    <el-option key="cate-all" :label="$t('cate.product')" value="">{{$t('all')}}</el-option>
                    <el-option v-for="cate in categories" :key="cate.id" :label="cate.name[$i18n.locale]" :value="cate.id">
                    </el-option>
                </el-select> -->
                <el-cascader v-model="category_id_arr" :options="cate2" :props="cate1_props" clearable class="flex-1" :show-all-levels="false" :placeholder="$t('cate.product')" @change="changeCate2"></el-cascader>
            </div>
            <div>
                <el-select v-model="listQuery.price" placeholder="价格" @change="handleFilter">
                    <el-option key="price_all" :label="$t('price')" value="">{{$t('all')}}</el-option>
                    <el-option v-for="item in options_price" :key="item.id" :label="item.name" :value="item.id">
                    </el-option>
                </el-select>
            </div>

            <div>
                <el-select v-model="listQuery.min_quantity" :placeholder="$t('moq')" @change="handleFilter">
                    <el-option key="moq_all" :label="$t('moq')" value="">{{$t('all')}}</el-option>
                    <el-option v-for="item in options_moq" :key="item.id" :label="item.name" :value="item.id">
                    </el-option>
                </el-select>
            </div>

            <div class="py-2 pl-2" @click="openDrawer">
                <svg-icon name='filter-o' width="1.1rem" height="1.1rem"></svg-icon>
            </div>
        </div>
    </div>

    <div class="bg-white rounded p-2 mt-2">

        <div class="card-container-2col mt-1">
            <div v-for="li in list" :key="li.id">
                <card-video-c :poster="getImg1(li.assets)" :showPlayIcon="false" @click="handleDetail(li)">
                    <h4 slot="title" class="text-line-1 mt-1">
                        <text-highlight :queries="listQuery.keyword">{{gsv([$i18n.locale], li.name)}}</text-highlight>
                    </h4>
                    <div slot="subTitle">
                        <p class="text-danger">￥{{price_real(li)}}</p>
                        <p class="text-line-1 text-dark9">{{gsv(['company', 'name', $i18n.locale], li)}}</p>
                    </div>
                </card-video-c>
            </div>
        </div>

        <ku-loading-no-data :active="isLoading" :total="total" push></ku-loading-no-data>
        <div class="text-center pagination-kuc mt-3 mb-5">
            <span class="px-3 py-2 text-dark6" v-if="list.length<total && list.length!=0" @click="handleGetMore">{{$t('more_load')}}</span>
        </div>
    </div>

    <!-- <div class="text-center pagination-kuc">
        <el-pagination background layout="prev, pager, next" :total="total" :pager-count=5 :prev-text="$t('page.pre')" :next-text="$t('page.next')" :page-size=4 :current-page.sync="listQuery.page" @current-change="getList" :hide-on-single-page='false'></el-pagination>
    </div> -->

    <br>
    <el-drawer title="I am the title" :visible.sync="drawer" :with-header="false" :before-close="handleFilterCancle" size="85%" class="">
        <div class="pl-2">
            <div class="mt-3">
                <el-checkbox v-model="listQuery.is_pindan" class="my-2">{{$t('is.pin')}}</el-checkbox>
            </div>
            <el-collapse>
                <el-collapse-item name="2">

                    <template slot="title">
                        {{$t('product.new')}} &nbsp; <span class="font-weight-normal text-danger">{{ listQuery.new_products ? $t('product.new') : ''}}</span>
                    </template>
                    <div class="px-2">
                        <el-radio-group v-model="listQuery.new_products" size="medium" class="radio-button-container">
                            <el-radio-button label="">{{$t('all')}}</el-radio-button>
                            <el-radio-button :label="true">{{$t('product.new')}}</el-radio-button>
                            <!-- <el-radio-button v-for="item in options_type" :key="item.id" :label="item.id">{{item.name}}</el-radio-button> -->
                        </el-radio-group>
                    </div>
                </el-collapse-item>
                <el-collapse-item name="3">
                    <template slot="title">
                        {{$t('category')}} &nbsp; <span class="font-weight-normal text-danger"> {{txt_selectd_cate}}</span>
                    </template>
                    <div class="px-2">
                        <!-- <el-radio-group v-model="listQuery.category_id" size="medium" class="radio-button-container">
                            <el-radio-button key="all-category" label="">{{$t('all')}}</el-radio-button>
                            <el-radio-button v-for="item in categories" :key="'cate_'+ item.id" :label="item.id">{{item.name[$i18n.locale]}}</el-radio-button>
                        </el-radio-group> -->
                        <el-cascader-panel v-model="category_id_arr" :options="cate2" :props="cate1_props" clearable class="flex-1" :placeholder="$t('cate.product')" @change="changeCate2Drawer"></el-cascader-panel>

                    </div>
                </el-collapse-item>
                <el-collapse-item name="4">
                    <template slot="title">
                        {{$t('price')}} &nbsp; <span class="font-weight-normal text-danger"> {{txt_selectd_price}}</span>
                    </template>
                    <div class="px-2">
                        <el-radio-group v-model="listQuery.price" size="medium" class="radio-button-container">
                            <el-radio-button key="all-price" label="">{{$t('all')}}</el-radio-button>
                            <el-radio-button v-for="item in options_price" :key="item.id" :label="item.name">{{item.name}}</el-radio-button>
                        </el-radio-group>
                    </div>
                </el-collapse-item>
                <el-collapse-item name="5">
                    <template slot="title">
                        {{$t('moq')}} &nbsp; <span class="font-weight-normal text-danger"> {{txt_selectd_moq}}</span>
                    </template>
                    <div class="px-2">
                        <el-radio-group v-model="listQuery.min_quantity" size="medium" class="radio-button-container">
                            <el-radio-button key="all-moq" label="">{{$t('all')}}</el-radio-button>
                            <el-radio-button v-for="item in options_moq" :key="item.id" :label="item.id">{{item.name}}</el-radio-button>
                        </el-radio-group>
                    </div>
                </el-collapse-item>

                <el-collapse-item name="6">
                    <template slot="title">
                        {{$t('business.mode')}} &nbsp; <span class="font-weight-normal text-danger"> {{txt_selectd_business}}</span>
                    </template>
                    <div class="px-2">
                        <el-radio-group v-model="listQuery.mgmodel_id" size="medium" class="radio-button-container">
                            <el-radio-button key="mgmodel-moq" label="">{{$t('all')}}</el-radio-button>
                            <el-radio-button v-for="mgmodel in mgmodels" :key="mgmodel.id" :label="mgmodel.id">{{mgmodel.name[$i18n.locale]}}</el-radio-button>
                        </el-radio-group>
                    </div>
                </el-collapse-item>
                <el-collapse-item title="地区" name="7">
                    <template slot="title">
                        {{$t('country')}}{{$t('region')}} &nbsp; <span class="font-weight-normal text-danger"> {{txt_selectd_market}}</span>
                        <span class="font-weight-normal text-danger"> {{txt_loc}}</span>
                    </template>
                    <!-- <div class="px-2">
                        <el-radio-group v-model="listQuery.market_id" size="medium" class="radio-button-container">
                            <el-radio-button key="market_all" label="">{{$t('all')}}</el-radio-button>
                            <el-radio-button v-for="item in markets" :key="'market_'+item.id" :label="item.id">{{item.name[$i18n.locale]}}</el-radio-button>
                        </el-radio-group>
                    </div> -->
                    <div class="px-2">
                        <el-tabs v-model="activeTabArea" class="tab-container-small-font">
                            <el-tab-pane :label="$t('country')" name="country">
                                <el-radio-group v-model="loc.country" size="medium" class="radio-button-container" @change="handleCountry">
                                    <el-radio-button :label="0">{{$t('all')}}</el-radio-button>
                                    <!-- <el-radio-button v-for="item in countries" :key="item.countryNameCn" :label="item.countryNameCn">{{item.countryNameCn}}</el-radio-button> -->
                                    <el-radio-button v-for="item in countries" :key="item.id" :label="item.id">{{item.name}}</el-radio-button>
                                </el-radio-group>
                            </el-tab-pane>
                            <el-tab-pane :label="$t('province')" name="province">
                                <el-radio-group v-model="loc.province" size="medium" class="radio-button-container" @change="handleRegion">
                                    <el-radio-button :label="0">{{$t('all')}}</el-radio-button>
                                    <template v-if="loc.country==1">
                                        <!-- <el-radio-button v-for="item in cn_province" :key="item.region_id" :label="item.region_name">{{item.region_name}}</el-radio-button> -->
                                        <el-radio-button v-for="item in CHN" :key="item.id" :label="item.id">{{item.name}}</el-radio-button>
                                    </template>
                                </el-radio-group>
                            </el-tab-pane>
                            <el-tab-pane :label="$t('city')" name="city">
                                <el-radio-group v-model="loc.city" size="medium" class="radio-button-container">
                                    <el-radio-button :label="0">{{$t('all')}}</el-radio-button>
                                    <!-- <el-radio-button v-for="item in cities" :key="item.region_id" :label="item.region_name">{{item.region_name}}</el-radio-button> -->
                                    <template v-if="loc.country==1">
                                        <el-radio-button v-for="item in cities" :key="item.id" :label="item.id">{{item.name}}</el-radio-button>
                                    </template>
                                </el-radio-group>
                            </el-tab-pane>
                        </el-tabs>
                    </div>

                </el-collapse-item>

            </el-collapse>
        </div>

        <div class="fixed-bottom" style="width:85%; left:unset">
            <el-row>
                <el-col :span="12">
                    <div class="text-center p-2 text-danger" style="background-color: #FFE4E6" @click="handleFilterReset()">{{$t('btn.reset')}}</div>
                </el-col>
                <el-col :span="12">
                    <div class="bg-danger text-white text-center p-2" @click="handleFilter()">{{$t('btn.ok')}}</div>
                </el-col>
            </el-row>
        </div>
    </el-drawer>
</div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'

import CardPrice from '~/components/Card/CardPrice.vue'
// import cn_province from "@/json/cn_province.json"
// import countries from "@/json/country_phone.json"
import { getList } from '@/api/product'
import { getRegionsById } from "@/api/world"

export default {
    name: "ProductSearch",
    layout: 'main',
    components: {
        CardPrice,
    },
    head() {
        return {
            title: this.$t('product')
        }
    },
    data() {
        return {
            isLoading: true,
            list: [],
            total: 0,
            // cn_province,
            // countries,
            cities: [],
            drawer: false,
            category_id_arr: [],
            listQuery: {
                page: 1,
                limit: 10,
                keyword: this.$route.query.keyword || '',
                new_products: '',
                category_id: '',
                price: '',
                min_quantity: '',
                mgmodel_id: '',
                market_id: '',
                is_pindan: 0,
                place_id: '',
                // country: '中国',
                // province: '全部',
                // city: '全部',
            },
            temp: {},
            loc: {
                country: 0,
                province: 0,
                city: 0,
            },
            activeTabArea: "country",
            // activeTabName: 'news',
            // infiniteId: +new Date(),
            // options_area: product_area,            
            options_moq: [
                { id: 1, name: this.$t('cate.moq_asc') },
                { id: -1, name: this.$t('cate.moq_desc') },
            ],
            options_price: [
                { id: 1, name: this.$t('cate.price_asc') },
                { id: -1, name: this.$t('cate.price_desc') },
            ],
            cate1_props: {
                // multiple: true,
                checkStrictly: true,
                value: 'id',
                label: 'name_' + this.$i18n.locale,
                children: 'childs'
            },
        }
    },

    computed: {
        ...mapState('world', ['countries', 'CHN']),
        ...mapState('common', {
            categories: state => state.list.categories,
            mgmodels: state => state.list.mgmodels,
            markets: state => state.list.markets,
        }),
        ...mapGetters('common', ['cate2']),
        ...mapGetters('opposite', ['my_suppliers']),
        ...mapGetters(['userLevel']),

        txt_selectd_cate: function () {
            // const ff = this.categories.find(r => r.id == this.listQuery.category_id)
            // if (ff) {
            //     return ff['name'][this.$i18n.locale]
            // }
            // return ''
            var txt = ''
            if (this.category_id_arr.length) {
                const ff = this.cate2.find(r => r.id == this.category_id_arr[0])
                txt = ff['name'][this.$i18n.locale]
                if (this.category_id_arr.length > 1) {
                    const ff1 = ff.childs.find(r => r.id == this.category_id_arr[1])
                    txt += " - " + ff1['name'][this.$i18n.locale]
                }
            }
            return txt
        },
        txt_selectd_moq: function () {
            const ff = this.options_moq.find(r => r.id == this.listQuery.min_quantity)
            if (ff) {
                return ff['name']
            }
            return ''
        },
        txt_selectd_price: function () {
            const ff = this.options_price.find(r => r.id == this.listQuery.price)
            if (ff) {
                return ff['name']
            }
        },
        txt_selectd_business: function () {
            const ff = this.mgmodels.find(r => r.id == this.listQuery.mgmodel_id)
            if (ff) {
                return ff['name'][this.$i18n.locale]
            }
        },
        txt_selectd_market: function () {
            const ff = this.markets.find(r => r.id == this.listQuery.market_id)
            if (ff) {
                return ff['name'][this.$i18n.locale]
            }
        },
        // cn_counties: function () {
        //     const ff = this.cn_province.filter(r => r.region_name == this.listQuery.province)
        //     // console.log(ff)
        //     if (ff.length) {
        //         return ff[0]['county']
        //     }
        //     return []
        // },
        txt_loc: function () {
            let txt = ''
            const country = this.countries.find(rr => rr.id == this.loc.country)
            if (country)
                txt = country.name
            if (this.loc.province) {
                const ppp = this.CHN.find(rr => rr.id == this.loc.province)
                if (ppp) txt += " " + ppp.name
            }
            if (this.loc.city) {
                const ccc = this.cities.find(rr => rr.id == this.loc.city)
                if (ccc) txt += " " + ccc.name
            }
            return txt
        }
    },
    methods: {
        ...mapActions('common', ['getUnitsList']),
        ...mapActions('world', ['getCountry', 'getProvince']),
        ...mapActions('opposite', ['getMySuppliers']),
        getList() {
            this.isLoading = true;
            getList(this.listQuery).then(res => {
                this.list.push(...res.products)
                this.total = res.total
            }).finally(() => {
                this.isLoading = false
            })
        },

        handleGetMore() {
            this.listQuery.page += 1
            this.getList()
        },
        openDrawer() {
            this.drawer = true
            this.temp = Object.assign({}, this.listQuery)
        },
        handleFilterCancle() {
            this.drawer = false
            this.listQuery = this.temp
        },
        handleFilter() {
            // console.log('Filter working..', this.listQuery)
            this.listQuery.page = 1;
            this.drawer = false
            this.list = [];
            this.total = 0
            this.listQuery.place_id = this.loc.city || this.loc.province || this.loc.country
            this.getList()
        },
        changeCate2() {
            this.listQuery.category_id = this.category_id_arr.length ? this.category_id_arr[this.category_id_arr.length - 1] : ''
            this.handleFilter()
        },
        changeCate2Drawer() {
            this.listQuery.category_id = this.category_id_arr.length ? this.category_id_arr[this.category_id_arr.length - 1] : ''
        },
        handleKeyword() {
            this.$router.replace({ name: this.$route.name, query: { keyword: this.listQuery.keyword } })
            this.handleFilter()
        },
        handleFilterReset() {
            this.listQuery = {
                page: 1,
                keyword: "",
                type: '',
                category_id: '',
                price: '',
                min_quantity: '',
                mgmodel_id: '',
                market_id: '',
                is_pindan: 0,
                place_id: ''
            }
            this.loc = {
                    country: 0,
                    province: 0,
                    city: 0,
                },
            this.category_id_arr = []
            this.handleFilter()
        },
        handleDetail(item) {
            this.$router.push({ path: this.getSeoProduct(item) })
        },
        handleCountry(id) {
            if (id != 1) {
                this.loc.province = 0
                this.loc.city = 0
            }
        },
        handleRegion(id) {
            this.loc.city = 0
            this.cities = []
            getRegionsById(id).then(res => {
                this.cities = res.data
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
        if (!this.categories.length || !this.mgmodels.length || !this.markets.length) {
            this.getUnitsList(['categories', 'mgmodels', "markets"])
        }
        this.getList();

        if (!this.countries.length)
            this.getCountry()

        if (!this.CHN.length)
            this.getProvince()
        if (this.userLevel) {
            if (!this.my_suppliers.length) this.getMySuppliers()
        }
    },
}
</script>