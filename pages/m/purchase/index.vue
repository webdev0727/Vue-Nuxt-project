<template>
<div class="container">
    <!-- Top part -->
    <div class="bg-white">
        <kuc-page-header :title="$t('purchase.bao')" to="/">
            <nuxt-link to='/purchase/create' class="text-danger">
                <span v-if="$i18n.locale=='en'">{{$t('post')}}</span>
                <span v-else>{{$t('purchase.post')}}</span>
            </nuxt-link>
        </kuc-page-header>

        <div class="p-2 container-input-bg-dark9">
            <el-input :placeholder="$t('search')" v-model="listQuery.keyword" class="search-rounded" @change="handleFilter">
                <i slot="prefix" class="el-input__icon el-icon-search"></i>
            </el-input>
        </div>

        <!-- Filter -->
        <div class="p-2 filter-box d-flex">
            <div>
                <!-- <el-select v-model="listQuery.category_id" :placeholder="$t('cate.product')" @change="handleFilter">
                    <el-option key="cate-all" :label="$t('cate.product')" value="">{{$t('all')}}</el-option>
                    <el-option v-for="cate in categories" :key="cate.id" :label="cate.name[$i18n.locale]" :value="cate.id"></el-option>
                </el-select> -->
                <el-cascader v-model="category_id_arr" :options="cate2" :props="cate1_props" clearable class="flex-1" :show-all-levels="false" :placeholder="$t('cate.product')" @change="changeCate2"></el-cascader>

            </div>

            <div class="mx-1">
                <el-select v-model="listQuery.created_at" :placeholder="$t('cate.product')" @change="handleFilter">
                    <el-option key="cate-all" :label="$t('time.post')" value="">{{$t('all')}}</el-option>
                    <el-option v-for="item in created_ats" :key="item.id" :label="item.name[$i18n.locale]" :value="item.id"></el-option>
                </el-select>

            </div>

            <div class="mx-1">
                <!-- <div class="date-picker-text-right d-flex align-items-center justify-content-between">
                    <el-date-picker v-model="listQuery.delivery_date" type="date" format="yy.MM.dd" value-format="yyyy/M/d" :placeholder="$t('deadline')" prefix-icon='ee' :editable="false" :picker-options="pickerOptionsEnd" @change="handleFilter"></el-date-picker>
                    <span class=""><i class="el-icon-arrow-down"></i></span>
                </div> -->
                <el-select v-model="listQuery.delivery_date" :placeholder="$t('cate.product')" @change="handleFilter">
                    <el-option key="cate-all" :label="$t('deadline')" value="">{{$t('all')}}</el-option>
                    <el-option v-for="item in delivery_dates" :key="item.id" :label="item.name[$i18n.locale]" :value="item.id"></el-option>
                </el-select>
            </div>

            <div>
                <el-select v-model="listQuery.offer_count" :placeholder="$t('cate.product')" @change="handleFilter">
                    <el-option key="cate-all" :label="$t('applicants')" value="">{{$t('all')}}</el-option>
                    <el-option v-for="item in offers_option" :key="item.id" :label="item.name[$i18n.locale]" :value="item.id"></el-option>
                </el-select>
            </div>

        </div>
    </div>

    <div class="px-2 mb-1">
        <!--  list  -->
        <div class="mt-2 bg-white p-2 rounded" v-for="item in list" :key='item.id'>
            <nuxt-link :to="'/purchase/' + item.id" class="d-flex">
                <div class="flex-1">
                    <h3>
                        <span v-if="item.urgent" class="text-white bg-danger rounded px-1 urgent-status">{{$t('urgent')}}</span>
                        <span>{{item.title[$i18n.locale] || item.title}}</span>
                    </h3>
                    <p class="text-dark9 my-2">{{$t('applicants')}}: {{item.offers}} <span class="pl-3">{{$t('cate.product')}}: {{gsv(['name', $i18n.locale ],item.category)}}</span> </p>
                </div>
                <img :src="gsv([0, 'url'], item.assets)" width="50" height="50" alt="" class="rounded">
            </nuxt-link>
            <div class="p-2 bg-darkF7 mt-1 rounded text-dark9">
                <p>{{$t('source.quantity')}}: {{item.quantity}} {{gsv(['name', $i18n.locale], item.unit)}}</p>
                <p>{{$t('source.req')}}: {{item.requirement ? item.requirement : '无'}}</p>
            </div>
            <div class="d-flex align-items-center mt-2">
                <div class="flex-1">
                    <p class="text-dark9">{{$t('post.date')}}: {{parseTime(item.created_at, '{y}-{m}-{d} {h}:{i}')}}</p>
                    <h4 class="mt-1" v-if="item.delivery_date">
                        <span v-if="$i18n.locale=='zh'">{{$t('purchase.left_day')}}</span>
                        <TimerLeft :endTime="item.delivery_date" class="text-danger" :key="item.id" />
                        <span v-if="$i18n.locale=='en'">{{$t('purchase.left_day')}}</span>
                    </h4>
                    <h4 v-else>{{$t('source.long')}}</h4>
                </div>
                <div class="text-center">
                    <div :to="'/purchase/offer/create/' + item.id" @click="doBid(item)" v-if="getIsRunning(item.delivery_date)">
                        <p class="bg-danger text-white btn--link" :class="$store.getters.myId == item.user_id || !$store.state.auth ? 'btn-disabled': ''">{{$t('offer.now')}}</p>
                    </div>
                    <div v-else>
                        <p class="bg-dark text-white btn--link btn-disabled">{{$t('source.close')}}</p>
                    </div>
                </div>
            </div>
        </div>

        <ku-loading-no-data :active.sync="isLoading" :total="total"></ku-loading-no-data>

        <!-- secend block -->
        <!-- <div class="d-flex justify-content-between align-items-center mt-3">
            <h2>紧急采购</h2>
            <p class="text-dark9">{{$t('refresh1')}} <i class="el-icon-refresh"></i> </p>
        </div>
        <div class="mt-2 bg-white p-2 rounded" v-for="item in list" :key="'s'+item.id">
            <div class="d-flex">
                <div class="flex-1">
                    <h3>
                        <TimerLeft v-if="item.urgent" :endTime="item.exitTime" class="text-white bg-danger rounded px-1 urgent-status">{{getStatus(item.urgent, false)}}</TimerLeft>
                        <span>{{item.title}}</span>
                    </h3>
                    <p class="text-dark9 my-1">{{$t('applicants')}}: {{item.enrollment_num}} <span class="pl-3">{{$t('cate.product')}}: {{item.type}}</span> </p>
                </div>
                <img :src="item.img" width="50" height="50" alt="" class="rounded">
            </div>
            <div class="p-2 bg-light mt-1 rounded text-dark9">
                <p>{{item.content}}</p>
                <p>{{$t('source.quantity')}}: {{item.quantity}}</p>
                <p>{{$t('source.req')}}: {{item.requirement ? item.requirement : '无'}}</p>
            </div>
        </div> -->
    </div>

    <div class="text-center pagination-kuc mt-3 mb-5">
        <!-- <el-pagination background layout="prev, pager, next" :total="total" :pager-count=5 :prev-text="$t('page.pre')" :next-text="$t('page.next')" :page-size="listQuery.limit" :current-page.sync="listQuery.page" @current-change="getList" :hide-on-single-page='false'></el-pagination> -->
        <span class="px-3 py-2 text-dark6" v-if="list.length<total && list.length!=0" @click="handleGetMore">{{$t('more_load')}}</span>
    </div>

</div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'

import TimerLeft from '@/components/TimerLeft'
import { getList } from '@/api/treasure'

// import { scrollTo } from '@/utils/scroll-to'
// const st = process.client ? require('@/utils/scroll-to') : undefined
export default {
    name: 'Treasure',
    components: {
        TimerLeft
    },
    data() {
        return {
            isLoading: true,
            list: [],
            total: 0,
            listQuery: {
                page: 1,
                limit: 10,
                keyword: '',
                category_id: '',
                created_at: '',
                delivery_date: '',
                offer_count: '',
                "with": [
                    "category",
                ],
            },
            category_id_arr: [],
            cate1_props: {
                // multiple: true,
                checkStrictly: true,
                value: 'id',
                label: 'name_' + this.$i18n.locale,
                children: 'childs'
            },
            activeTabName: 'news',
            created_ats: [{
                    id: "week",
                    name: {
                        en: "in a week",
                        zh: "一周内",
                    }
                },
                {
                    id: "month",
                    name: {
                        en: "in a month",
                        zh: "一月内",
                    }
                },
                {
                    id: "3-month",
                    name: {
                        en: "in 3 months",
                        zh: "三月内",
                    }
                },
            ],
            delivery_dates: [{
                    id: "week",
                    name: {
                        en: "in a week",
                        zh: "一周内",
                    }
                },
                {
                    id: "month",
                    name: {
                        en: "in a month",
                        zh: "一月内",
                    }
                },
                {
                    id: "3-month",
                    name: {
                        en: "in 3 months",
                        zh: "三月内",
                    }
                },
                {
                    id: "no-limit",
                    name: {
                        en: "No limit",
                        zh: "长期",
                    }
                },
            ],
            offers_option: [{
                    id: 10,
                    name: {
                        en: "10 bids",
                        zh: "10人以内",
                    }
                },
                {
                    id: 30,
                    name: {
                        en: "30 bids",
                        zh: "30人以内",
                    }
                },
                {
                    id: 50,
                    name: {
                        en: "50 bids",
                        zh: "50人以内",
                    }
                },
                {
                    id: 100,
                    name: {
                        en: "100 bids",
                        zh: "100人以内",
                    }
                },
            ],
            // pickerOptions: {
            //     disabledDate(time) {
            //         return time.getTime() > Date.now();
            //     }
            // },
            // pickerOptionsEnd: {
            //     disabledDate(date) {
            //         return date < new Date();
            //     },
            // },
        }
    },
    async asyncData({store}){
        if (!store.state.common.seo)
            await store.dispatch('common/downloadSeo').catch(err=>{
                console.log('seo_err')
            })
    },
    computed: {
        ...mapGetters('common', ['cate2']),
        seo_path: function(){
            return this.$i18n.locale=='en' ? '/en/purchase' : '/purchase'
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
        ...mapActions('common', ['getUnitsList']),
        getList() {
            this.isLoading = true
            getList(this.listQuery).then(res => {
                this.total = res.total
                this.list.push(...res.items);
                // st.scrollTo(0, 800)
            }).finally(() => {
                this.isLoading = false
            })
        },
        handleFilter() {
            this.listQuery.page = 1;
            this.list = [];
            this.getList();
        },
        handleGetMore() {
            this.listQuery.page += 1
            this.getList()
        },
        doBid(item) {
            if (this.$store.state.auth) {
                if (this.$store.getters.userLevel == 5) {
                    this.$router.push({ path: `/purchase/offer/create/${item.id}` })
                } else {
                    const title = this.$t('warning')
                    const path = '/pricing?lev=5'
                    let content = this.$t('msg.permission_upgrade_wen')

                    this.$confirm(content, title, {
                        confirmButtonText: this.$t('confirm.ok'),
                        cancelButtonText: this.$t('confirm.cancle'),
                        type: 'warning',
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
            } else {
                this.$router.push({ path: "/login", query: { redirect: this.$route.path } })
            }
        },
        changeCate2() {
            this.listQuery.category_id = this.category_id_arr.length ? this.category_id_arr[this.category_id_arr.length - 1] : ''
            this.handleFilter()
        },
        getIsRunning(endTime) {
            var endTimeSecond = endTime
            var is_running = true
            if (endTime) {
                if (this.validDate(endTime)) {
                    endTimeSecond = endTime + ' 23:59:59'
                }
                if (new Date().getTime() > +new Date(endTimeSecond)) is_running = false
            }
            return is_running
        },
        // getStatus(code, isday = true) {
        //     if (code) {
        //         if (isday) return code + '天';
        //         else return '紧急'
        //     }
        //     return ''
        // }
    },
    mounted() {
        if (!this.cate2.length) {
            this.getUnitsList(['categories'])
        }
        this.getList()
    }
}
</script>

<style lang="scss" scoped>
.urgent-status {
    font-size: 0.8rem;
    padding: 2px;
}

.btn--link {
    border-radius: 10rem;
    display: inline;
    vertical-align: middle;
    padding: 0.5rem 1.5rem;
}
</style>
