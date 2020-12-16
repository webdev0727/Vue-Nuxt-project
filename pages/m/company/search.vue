<template>
<div class="container">
    <!-- Top part -->
    <div class="bg-white">
        <kuc-page-header :title="$t('enterprise')">
            <p class="p-1 container-input-bg-dark9 header-search-bar">
                <el-input :placeholder="$t('search')" size="medium" v-model="listQuery.keyword" class="search-rounded" @change="handleKeyword">
                    <i slot="prefix" class="el-input__icon el-icon-search"></i>
                </el-input>
            </p>
        </kuc-page-header>

        <!-- Filter -->
        <div class="p-2 filter-box d-flex align-items-center">
            <div class="ml-1">
                <!-- <el-select v-model="listQuery.category_id" :placeholder="$t('cate.product')" @change="handleFilter">
                    <el-option key="cate-all" value="">{{$t('all')}}</el-option>
                    <el-option v-for="cate in categories" :key="cate.id" :label="cate.name[$i18n.locale]" :value="cate.id">
                    </el-option>
                </el-select> -->
                <el-cascader v-model="category_id_arr" :options="cate2" :props="cate1_props" clearable class="flex-1" :show-all-levels="false" :placeholder="$t('main.product')" @change="changeCate2"></el-cascader>

            </div>

            <div class="mx-1">
                <!-- <el-select v-model="listQuery.market_id" :placeholder="$t('region1')" @change="handleFilter">
                    <el-option key="market-all" value="">{{$t('all')}}</el-option>
                    <el-option v-for="item in markets" :key="'market_'+item.id" :label="item.name[$i18n.locale]" :value="item.id">
                    </el-option>
                </el-select> -->
                <ku-world-1 slot="prepend" :title="$t('country')+$t('region')" :country_id.sync="country_id" :country_code.sync='country_code' :region_id.sync="region_id" :show-all-levels="false" :key="region_id+'loc'" @changeCountry="handleRegionCountry" @changeCity="handleRegionCity" />
            </div>

            <div class="mx-1">
                <el-select v-model="listQuery.mgmodel_id" :placeholder="$t('business.mode')" @change="handleFilter">
                    <el-option key="mgmodel-all" value="">{{$t('all')}}</el-option>
                    <el-option v-for="mgmodel in mgmodels" :key="'model_'+mgmodel.id" :label="mgmodel.name[$i18n.locale]" :value="mgmodel.id">
                    </el-option>
                </el-select>
            </div>

            <div class="mr-1">
                <el-select v-model="listQuery.expo_year" :placeholder="$t('expo.years')" @change="handleFilter">
                    <el-option key="mgmodel-all" value="">{{$t('all')}}</el-option>
                    <el-option v-for="item in expo_years" :key="item.id" :label="item.name[$i18n.locale]" :value="item.id">
                    </el-option>
                </el-select>
            </div>

            <!-- <div class="p-2" @click="openDrawer">
                <svg-icon name='filter-o'></svg-icon>
            </div> -->

        </div>
    </div>

    <!-- searched list -->
    <div class="px-2">
        <div class="my-2">
            <div class="p-2 mb-1 scroll-x-img-2 bg-white rounded" v-for="item in list" :key='item.id'>
                <div class="d-flex">
                    <nuxt-link :to="getSeoCompany(item)">
                        <img :src="gsv(['url'], item.logo) || '/files/avatar.png'" alt="" width="55" height="55" class="rounded">
                    </nuxt-link>
                    <div class="pl-2 pb-2 d-flex justify-content-between flex-column flex-1">
                        <nuxt-link :to="getSeoCompany(item)">
                            <h4 class="pr-2 text-dark text-line-1">{{item.name[$i18n.locale]}}</h4>
                        </nuxt-link>
                        <div class="d-flex justify-content-between text-dark9">
                            <p class="mt-1 flex-1 text-line-1">{{$t('expo.loc')}}: {{expoPositions(item)}}</p>
                            <p @click="goSvgMap(item)">
                                <!-- <svg-icon name="search"></svg-icon> -->
                                <i class="el-icon-search"></i>
                                {{$t('view.layout')}}
                            </p>
                        </div>
                    </div>
                </div>
                <div class="text-dark9 my-2 font-09">
                    <div class="d-flex my-1">
                        <p class="text-nowrap mr-1">{{$t('main.product')}}: </p>
                        <p class="text-line-2"> {{getNames(item.categories) }}</p>
                    </div>
                    <div class="d-flex my-1">
                        <p class="text-nowrap mr-1">{{$t('business.mode')}}: </p>
                        <p>{{gsv(['name', $i18n.locale],item.mgmodel)}}</p>
                    </div>
                    <div class="d-flex my-1">
                        <p class="text-nowrap mr-1">{{$t('main.market')}}: </p>
                        <p>{{getNames(item.market)}}</p>
                    </div>
                    <div class="d-flex my-1">
                        <p class="text-nowrap mr-1">{{$t('company')}}{{$t('address')}}: </p>
                        <p>{{gsv([$i18n.locale], item.address)}}</p>
                    </div>
                </div>
                <div class="btn-container-m-s d-flex justify-content-between ">
                    <el-button @click="handleInquiry(item)" size="small">{{$t('want.xunpan')}}</el-button>
                    <el-button @click="handleContact(item)" size="small">{{$t('msg.s')}}</el-button>
                    <el-button @click="handleVisitToggle(item.id)" size="small" :class="item.is_for_visit ? 'border-danger text-danger': ''" :disabled="!gsv([0], item.cur_expos)">{{$t('want.visit')}}</el-button>
                    <el-button @click="handleShoucangToggle(item.id)" size="small" :class="item.is_collected ? 'border-danger text-danger': ''">{{item.is_collected ? $t('collect.done'): $t('collect')}}</el-button>
                </div>

            </div>
            <ku-loading-no-data :active="isLoading" :total="total" push/>
        </div>

        <div class="text-center pagination-kuc my-3">
            <el-pagination background layout="prev, pager, next" :total="total" :pager-count=5 :prev-text="$t('page.pre')" :next-text="$t('page.next')" :page-size="listQuery.limit" :current-page.sync="listQuery.page" @current-change="getList" hide-on-single-page></el-pagination>
        </div>

    </div>

</div>
</template>

<script>
const st = process.client ? require('@/utils/scroll-to') : undefined
import { mapState, mapActions, mapGetters } from 'vuex'
import KuWorld1 from "~/components/KuWorld1"
import { toggleCollect } from "~/api/common"
import { getList, toggleVisit } from "~/api/company"

export default {
    name: 'Company',
    components: { KuWorld1 },
    data() {
        return {
            isLoading: true,
            list: [],
            total: 0,
            listQuery: {
                page: 1,
                limit: 10,
                keyword: this.$route.query.keyword || '',
                filter_mode: "",
                category_id: "",
                market_id: "",
                mgmodel_id: "",
                expo_year: "",
                place_id: ''
            },
            category_id_arr: [],
            expo_years: [{
                    id: 1,
                    name: {
                        zh: '新参展企业',
                        en: 'New Exhibitors'
                    }
                },
                {
                    id: 2,
                    name: {
                        zh: '多届参展企业',
                        en: 'Multi-Session Exhibitors'
                    }
                }
            ],
            country_code: "CHN",
            region_id: "",
            country_id: "",
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
        ...mapState('common', {
            categories: state => state.list.categories,
            mgmodels: state => state.list.mgmodels,
            markets: state => state.list.markets,
        }),
        ...mapGetters('common', ['cate2']),
    },
    head() {
        return {
            title: this.$t('enterprise')
        }
    },
    methods: {
        ...mapActions('common', ['getUnitsList']),
        getList() {
            this.isLoading = true
            getList(this.listQuery).then(res => {
                this.list = res.items;
                this.total = res.total
                if (process.client) {
                    st.scrollTo(0)
                }
            }).finally(() => {
                this.isLoading = false
            })
        },
        handleFilter() {
            this.listQuery.page = 1;
            this.list = [];
            this.total = 0
            this.getList();
        },
        handleKeyword() {
            this.$router.replace({ name: this.$route.name, query: { keyword: this.listQuery.keyword } })
            this.handleFilter()
        },
        getStatus(code, isday = true) {
            if (code) {
                if (isday) return code + '天';
                else return '紧急'
            }
            return ''
        },
        expoPositions(item) {
            var name_arr = []
            const array = item.cur_expos
            if (array) {
                if (typeof array == 'object') {
                    for (let index = 0; index < array.length; index++) {
                        const element = array[index]['halls'];
                        if (element)
                            name_arr.push(...element)
                    }
                }
            }
            return name_arr.join(', ')
        },
        // ********************************************
        //              Filter
        // ********************************************
        changeCate2() {
            this.listQuery.category_id = this.category_id_arr.length ? this.category_id_arr[this.category_id_arr.length - 1] : ''
            this.handleFilter()
        },
        handleRegionCountry() {
            this.listQuery.place_id = this.country_id
            this.handleFilter()
        },
        handleRegionCity() {
            this.listQuery.place_id = this.region_id || this.country_id
            this.handleFilter()
        },
        // ==================================
        // Inquiry, message
        // ==================================
        handleInquiry(item) {
            const company_name = this.gsv([this.$i18n.locale], item.name)
            const company_user = this.gsv(['name', this.$i18n.locale], item.user)
            this.$router.push({ path: `/inquiry/company/${item.id}?c_n=${company_name}&c_u=${company_user}` })
            if (this.noMyCompany(item.id)) {
                const company_name = this.gsv([this.$i18n.locale], item.name)
                const company_user = this.gsv(['name', this.$i18n.locale], item.user) || ''
                this.$router.push({ path: `/inquiry/company/${item.id}?c_n=${company_name}&c_u=${company_user}` })
            } else {
                this.$notify({
                    title: this.$t('error'),
                    message: this.$t('msg.no_order_yours'),
                    type: 'error',
                    duration: 2000

                });
            }
        },

        handleContact(item) {
            if (this.noMyCompany(item.id)) {
                const to = this.gsv(['phone'], item.user) || this.gsv(['email'], item.user)
                const name = this.gsv(['name', this.$i18n.locale], item.user)
                this.$router.push({ path: `/message/new`, query: { uid: item.user_id, to, name } }) 
            } else {
                this.$notify({
                    title: this.$t('error'),
                    message: this.$t('msg.no_order_yours'),
                    type: 'error',
                    duration: 2000
                });
            }
        },

        // ==================================
        // shoucang , for visit
        // ==================================             
        getActive(id, tag, reverse = false) {
            const iii = this.list.findIndex(rr => rr.id == id)
            const old_status = this.list[iii][tag]
            if (reverse) this.list[iii][tag] = !this.list[iii][tag]
            return old_status
        },
        handleShoucangToggle(id) {
            if (this.$store.state.auth) {
                if (this.noMyCompany(id)) {
                    toggleCollect('company', id).then(() => {
                        let old_status = this.getActive(id, 'is_collected', true)
                        if (!old_status) {

                            const title = this.$t('msg.shoucang_thanks')
                            const view_path = `“${this.$t('mine')}- ${this.$t('collect.my')}”`
                            const path = '/my/collection/company'
                            let content = ''
                            if (this.$i18n.locale == 'zh')
                                content = `<p class="font-11">可进入<span class="text-danger">${view_path}</span>查看</p>`
                            else
                                content = `<p class="font-11">Visit <span class="text-danger">${view_path}</span> to manage your favorites</p>`

                            this.$confirm(content, title, {
                                confirmButtonText: this.$t('btn.go_to_view'),
                                cancelButtonText: this.$t('confirm.cancle'),
                                showClose: false,                
                                showCancelButton: true,
                                confirmButtonClass: 'text-danger',
                                cancelButtonClass: 'border-right',
                                customClass: 'ku-confirm',
                                dangerouslyUseHTMLString: true,
                                center: true,
                            }).then(() => {
                                this.$router.push({ path })
                            }).catch(() => {})
                        }
                    })
                }
            } else {
                this.$router.replace({ path: '/login', query: { redirect: this.$route.path } })
            }
        },
        handleVisitToggle(id) {
            if (this.$store.state.auth) {
                if (this.noMyCompany(id)) {
                    // const cur_status = this.getActive(id, 'is_for_visit')
                    // if (cur_status) return
                    toggleVisit(id).then(() => {
                        const old_status = this.getActive(id, 'is_for_visit', true)
                        if (!old_status) {

                            const title = '感谢您的关注，已发送邀约，届时请莅临参观'
                            const view_path = `“${this.$t('mine')}-${this.$t('want.buy')}-${this.$t('my_exhibitor')}”`
                            const path = '/my/buy/company'
                            let content = ''
                            if (this.$i18n.locale == 'zh')
                                content = `<p class="font-11">可进入<span class="text-danger">${view_path}</span>查看</p>`
                            else
                                content = `<p class="font-11">Visit <span class="text-danger">${view_path}</span> to manage </p>`

                            this.$confirm(content, title, {
                                confirmButtonText: this.$t('btn.go_to_view'),
                                cancelButtonText: this.$t('confirm.cancle'),
                                showClose: false,                
                                showCancelButton: true,
                                confirmButtonClass: 'text-danger',
                                cancelButtonClass: 'border-right',
                                customClass: 'ku-confirm',
                                dangerouslyUseHTMLString: true,
                                center: true,
                            }).then(() => {
                                this.$router.push({ path })
                            }).catch(() => {})
                        }
                    })
                }
                // else {
                //     this.$notify({
                //         title: this.$t('error'),
                //         message: this.$t('msg.no_order_yours'),
                //         type: 'error',
                //         duration: 2000

                //     });
                // }
            } else {
                this.$router.replace({ path: '/login', query: { redirect: this.$route.path } })
            }
        },
        openDrawer() {
            // this.drawer = true
            // this.temp = Object.assign({}, this.listQuery)
        },
        goSvgMap(company) {
            const first_expo = this.gsv([0], company.cur_expos)
            if (first_expo) {
                const expo_name = this.gsv(['prefix'], first_expo)
                const hall_id = this.gsv(['hall_ids', 0], first_expo)
                const position_id = this.gsv(['halls', 0], first_expo)
                if (expo_name && hall_id && position_id) {
                    const map_url = `${process.env.M_EXPO_URL}${expo_name.toLowerCase()}/search?h=${hall_id}&p=${position_id}`
                    // console.log(map_url)
                    window.open(map_url, '_blank')
                }
            }
        },
    },
    // async fetch() {

    // },
    created() {
        let param = []
        if (!this.categories.length) {
            param.push("categories")
        }
        if (!this.mgmodels.length) {
            param.push("mgmodels")
        }
        if (!this.markets.length) {
            param.push("markets")
        }
        if (param.length)
            this.getUnitsList(param)
        this.getList();
    },
}
</script>