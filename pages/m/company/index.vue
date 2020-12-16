<template>
<div class="container">
    <!-- Top part -->
    <div class="bg-white">
        <kuc-page-header :title="$t('enterprise')" to="/">
            <p class="p-1 container-input-bg-dark9 header-search-bar">
                <el-input :placeholder="$t('search')" size="medium" v-model="keyword" class="search-rounded" @change="handleFilter">
                    <i slot="prefix" class="el-input__icon el-icon-search"></i>
                </el-input>
            </p>
        </kuc-page-header>
    </div>

    <div class="p-2">
        <!-- carousel -->
        <div class="conatiner-carousel mh-400" v-if="banner_company.length">
            <el-carousel height="40vw">
                <el-carousel-item v-for="item in banner_company" :key="item.id">
                    <a class="banner-container-div rounded d-block" :style="`background-image:url(${gsv([$i18n.locale, 'url'], item.assets)})`" :href="gsv([$i18n.locale, 'redirect_url'], item.assets)" target="_blank">
                    </a>
                </el-carousel-item>
            </el-carousel>
        </div>

        <!-- 推荐企业 -->
        <div class="mb-2 mt-2">
            <div class="d-flex justify-content-between">
                <h3 class="">{{$t('recom.enterprise')}}</h3>
                <nuxt-link to="/company/search" class="text-dark9"><span class="py-2 pl-2">{{$t('more')}}</span></nuxt-link>
            </div>
            <div class="scroll-container">
                <div class="mt-1 scroll-x-img-container">
                    <div class="scroll-x-img" v-for="item in recommend" :key='item.id' :style="`background-image:url(${gsv(['url'], item.cover)})`" @click="handleGoDetail(item)">
                        <div>
                            <div class="py-2">
                                <p class="text-white text-line-1 text-center">{{item.name[$i18n.locale]}}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <ku-loading-no-data :active="isLoading" :total="recommend.length" />
            </div>
        </div>

        <!-- 最新参展企业 -->
        <div class="mb-2">
            <div class="d-flex justify-content-between">
                <h3 class="">{{$t('company.new_expo')}}</h3>
                <nuxt-link to="/company/search" class="text-dark9"><span class="py-2 pl-2">{{$t('more')}}</span></nuxt-link>
            </div>
            <div class="scroll-container">
                <div class="mt-1 scroll-x-img-container">
                    <nuxt-link :to="getSeoCompany(item)" class="p-2 mb-1 scroll-x-img-2 bg-white rounded" v-for="item in latest" :key='item.id'>
                        <div class="d-flex">
                            <img :src="gsv(['url'], item.logo) || '/files/avatar.png'" alt="" width="55" height="55" class="rounded">
                            <div class="pl-2 d-flex justify-content-between flex-column flex-1">
                                <h4 class="pr-2 text-dark text-line-1">{{item.name[$i18n.locale]}}</h4>
                                <div class="d-flex justify-content-between text-dark9">
                                    <p class=" mt-1 flex-1 text-line-1">{{$t('expo.loc')}}: {{expoPositions(item)}}</p>
                                    <p @click="goSvgMap(item)">
                                        <!-- <svg-icon name="search"></svg-icon> -->
                                        <i class="el-icon-search"></i>
                                        {{$t('view.layout')}}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div class="text-dark9 mt-2 font-09">
                            <div class="d-flex">
                                <p class="text-nowrap mr-1">{{$t('main.product1')}}: </p>
                                <p class="text-line-1"> {{getNames(item.categories) }}</p>
                            </div>
                            <div class="d-flex">
                                <p class="text-nowrap mr-1">配喜产: </p>
                                <p>{{getNames(item.market)}}</p>
                            </div>
                        </div>
                    </nuxt-link>
                </div>
                <ku-loading-no-data :active="isLoading" :total="latest.length" />
            </div>
        </div>

        <!--  Maybe Like  -->

        <div class="my-2">
            <div class="d-flex justify-content-between">
                <h3 class="">{{$t('just_for_you')}}</h3>
                <nuxt-link to="/company/search" class="text-dark9"><span class="py-2 pl-2">{{$t('refresh1')}}</span></nuxt-link>
            </div>
            <div class="p-2 mb-1 scroll-x-img-2 bg-white rounded" v-for="item in recommend" :key='item.id'>
                <div class="d-flex">
                    <nuxt-link :to="getSeoCompany(item)">
                        <img :src="gsv(['url'], item.logo) || '/files/avatar.png'" alt="" width="55" height="55" class="rounded">
                    </nuxt-link>
                    <div class="pl-2 pb-2 d-flex justify-content-between flex-column flex-1">
                        <nuxt-link :to="getSeoCompany(item)">
                            <h4 class="pr-2 text-dark text-line-1">{{item.name[$i18n.locale]}}</h4>
                        </nuxt-link>
                        <div class="d-flex justify-content-between text-dark9">
                            <p class=" mt-1 flex-1 text-line-1">{{$t('expo.loc')}}: {{expoPositions(item)}}</p>
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
            <no-data v-if="!recommend.length" />
        </div>
    </div>

</div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
// import { doCollect } from "~/api/common"
// import { doVisitList } from "~/api/company"
import { toggleCollect } from "~/api/common"
import { toggleVisit } from "~/api/company"
export default {
    name: 'Company',
    components: {},
    data() {
        return {
            keyword: '',
            isLoading: false
        }
    },
    head() {
        return {
            title: this.$t('enterprise')
        }
    },
    computed: {
        ...mapState('banner', ['banner_company']),
        ...mapState('company', ['recommend', 'latest']),
    },
    methods: {
        ...mapActions('banner', ['getCompanyBanner']),
        ...mapActions('company', ['getSList']),
        handleFilter(e) {
            this.$router.push({
                path: "/company/search",
                query: {
                    keyword: this.keyword
                }
            })
        },

        handleGoDetail(item) {
            this.$router.push({ path: this.getSeoCompany(item) })
        },

        // ==================================
        // Inquiry, message
        // ==================================
        handleInquiry(item) {
            if (this.noMyCompany(item.id)) {
                const company_name = this.gsv([this.$i18n.locale], item.name)
                const company_user = this.gsv(['name', this.$i18n.locale], item.user) || ''
                this.$router.push({ path: `/inquiry/company/${item.id}?c_n=${company_name}&c_u=${company_user}` })
            }
            // else {
            //     this.$notify({
            //         title: this.$t('error'),
            //         message: this.$t('msg.no_order_yours'),
            //         type: 'error',
            //         duration: 2000

            //     });
            // }
        },

        handleContact(item) {
            if (this.noMyCompany(item.id)) {                
                const to = this.gsv(['phone'], item.user) || this.gsv(['email'], item.user)
                const name = this.gsv(['name', this.$i18n.locale], item.user)
                this.$router.push({ path: `/message/new`, query: { uid: item.user_id, to, name } }) 
            }
        },
        // ==================================
        // shoucang , for visit
        // ==================================

        getActive(id, tag, reverse = false) {
            const iii = this.recommend.findIndex(rr => rr.id == id)
            const old_status = this.recommend[iii][tag]
            if (reverse) this.recommend[iii][tag] = !this.recommend[iii][tag]
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

    mounted() {
        let qq = []
        if (!this.recommend.length) qq.push('recommend')
        if (!this.latest.length) qq.push('latest')
        if (qq.length) {
            this.isLoading = true
            this.getSList(qq).finally(() => {
                this.isLoading = false
            })
        }
        if (!this.banner_company.length) this.getCompanyBanner()
        // this.getList();
    },
}
</script>
