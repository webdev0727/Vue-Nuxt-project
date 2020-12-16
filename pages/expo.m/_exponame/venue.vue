<template>
<div class="p-2">
    <div class="bg-white rounded overflow-hidden">
        <div class="bg-white rounded p-2">
            <div class="search-rounded-group mb-2">
                <el-input :placeholder="$t('search')" v-model="keyword" @keyup.enter.native="handleSearch">
                    <div slot="prepend">
                        <el-select v-model="hall_id" placeholder="馆" @change="handleHall" class="text-blue-2">
                            <el-option v-for="item in expo_content['halls']" :key="item.id" :label="gsv([$i18n.locale], item.name)" :value="item.id">
                            </el-option>
                        </el-select>
                    </div>
                    <i slot="suffix" class="el-input__icon el-icon-search" @click="handleSearch"></i>
                </el-input>
            </div>

            <!-- <ku-svg-map :bg="bg_url" :raw_data="map_data" @click="mapChange" style="height: 80vw" /> -->
            <div v-if="map_data" style="height: 50vh; max-height: 32rem">
                <ku-svg-map :map="map_data" v-model="seat_id" radio :bg_url="bg_url" @change="mapChange" />
            </div>


            <div class="rounded bg-white mt-2" v-if="map_id && map_id != 'all'">
                <p v-if="$i18n.locale == 'zh'">共有<span class="text-blue-2 mb-2">{{total}}</span>位展商</p>
                <p v-else>Total <span class="text-blue-2 mb-2">{{total}}</span></p>
                <ku-line />
                <div>
                    <div class="my-2" v-for="item in list" :key='item.id'>
                        <div class="d-flex">
                            <img :src="gsv(['url'], item.company.logo)" alt="" width="55" height="55" class="rounded">
                            <div class="pl-2 flex-1">
                                <h3 class="pr-2 text-dark text-line-1">{{item.company.name[$i18n.locale]}}</h3>
                                <div class="d-flex justify-content-between align-itmes-center" @click="goDetailSearch(item.halls)">
                                    <div class="text-dark9 mt-1 d-flex flex-1">
                                        <p>{{$t('expo.loc')}}: </p>
                                        <p class="flex-1 text-line-3">{{hallIds(item.halls)}}</p>
                                    </div>
                                    <p class="text-blue-2">
                                        <!-- <svg-icon name="search"></svg-icon> -->
                                        <i class="el-icon-search"></i>
                                        <span>{{$t('view.layout')}}</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div class="text-dark9 mt-2">
                            <div class="d-flex">
                                <p class="text-nowrap mr-1">{{$t('main.product1')}}: </p>
                                <p> {{getNames(item.company.categories) }}</p>
                            </div>
                            <div class="d-flex">
                                <p class="text-nowrap mr-1">{{$t('main.market')}}: </p>
                                <p>{{getNames(item.company.market)}}</p>
                            </div>
                        </div>
                        <ku-line />
                    </div>
                    <ku-loading-no-data :active="is_loading" :total="total" />
                </div>

                <div class="text-center pagination-kuc my-2">
                    <el-pagination background layout="prev, pager, next" :total="total" :pager-count=5 :prev-text="$t('page.pre')" :next-text="$t('page.next')" :page-size="listQuery.limit" :current-page.sync="listQuery.page" @current-change="getCompanies" hide-on-single-page></el-pagination>
                </div>
            </div>

        </div>

    </div>
</div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'

import { product_news, discovery } from '@/api/common'
import { getExpo, getExpoCompany } from '@/api/expo'
import KuSvgMap from "@/components/k-svg-map"

export default {
    name: "ExhibitionVenue",
    layout: 'expo',
    components: {KuSvgMap},
    data() {
        return {
            // =========
            hall_id: "",
            map_id: '',
            // =========
            map_data: null,
            bg_url: '',
            // =========
            seat_id: "",
            list: [],
            total: 0,
            listQuery: {
                limit: 5,
                page: 1,
                keyword: ''
            },
            is_loading: true,
            // search
            keyword: '',
            keyword_old: '',
            searched_halls: [],
            searched_index: 0
        }
    },
    computed: {
        ...mapState('expo', ['expo_content']),
        expo_id: function () {
            return this.expo_content['common']['id']
        }
    },
    methods: {
        ...mapActions('expo', ['getExpoInfoById', "downloadExpoSVG"]),

        getCompanies() {
            this.list = []
            this.is_loading = true
            // this.total = 0
            if (this.map_id && this.map_id != 'all') {
                getExpoCompany(this.expo_id, this.map_id, this.listQuery).then(({ items, total }) => {
                    this.list = items
                    this.total = total
                }).finally(() => {
                    this.is_loading = false
                })
            }
        },
        handleFilter() {
            this.listQuery.page = 1
            this.getCompanies()
        },
        async handleHall() {
            let hall_cur = this.expo_content['halls'].find(rr=>rr.id == this.hall_id)
            if (hall_cur){
                if (!hall_cur.svg) {
                    if (hall_cur.bg_url){
                        await this.downloadExpoSVG(hall_cur) 
                        hall_cur = this.expo_content['halls'].find(rr=>rr.id == this.hall_id)                       
                    }
                }
                
            }
            this.seat_id = ''
            this.bg_url = hall_cur.bg_url
            this.map_data = hall_cur.svg
            this.map_id = hall_cur.map_id                
            this.listQuery.page = 1
            this.getCompanies()
            // getExpo(`hall/${this.expo_id}/${this.hall_id}`).then(res => {
            // })
        },
        setFirstGuan() {
            this.hall_id = this.gsv(['halls', 0, 'id'], this.expo_content)
            if (this.hall_id)
                this.handleHall()
        },
        getGuanList() {
            const exponame = this.$route.params.exponame
            const expoid = this.expo_id
            if (expoid) {
                this.getExpoInfoById({ exponame, expoid, type: 'halls' }).then(() => {
                    this.setFirstGuan()
                })
            }
        },
        goDetailSearch(da) {
            console.log(da)
            // this.$router.push({ name: 'exponame-search', params: { exponame: this.$route.params.exponame }, query: { h: this.hall_id, p: da[0] } })
            this.$router.push({ path: `/${this.$route.params.exponame}/search`,  query: { h: this.hall_id, p: da[0] }} )
        },
        mapChange(id) {
            console.log(id)
            
            const exist_hall_in_list = this.expo_content['halls'].find(rr => rr.map_id == id)
            if (exist_hall_in_list) {
                // for map_id == 'all'
                this.hall_id = exist_hall_in_list.id
                this.handleHall()
            } else {
                // const is_no_seat = id.search(/hall?/g)
                // if (is_no_seat == 0) return
                // this.$router.push({ name: 'exponame-search', params: { exponame: this.$route.params.exponame }, query: { h: this.hall_id, p: id } })
                // console.log(id, "map Id ")
                // console.log()

            }
        },
        hallIds(halls) {
            let hall_ids = []
            if (halls) {
                halls.forEach(element => {
                    const nnn = typeof element == 'object' ? this.gsv([this.$i18n.locale], element) : element
                    hall_ids.push(nnn)
                });
            }
            return hall_ids.join(', ')
        },
        handleSearch() {
            if (!this.map_data) return false
            if(this.keyword == ''){
                this.searched_halls = []
                this.seat_id = ''
                return
            }
            if (this.keyword_old != this.keyword) {
                const all_position_ids = this.map_data.shapes ? Object.keys(this.map_data.shapes) : []
                const reg = new RegExp(this.keyword, 'gi')
                this.searched_halls = all_position_ids.filter(rr => reg.test(rr)).sort()
                this.searched_index =  0
                this.seat_id = this.searched_halls[0] || ''  
                this.keyword_old = this.keyword
            } else {
                if(this.searched_index < (this.searched_halls.length-1) ){
                    this.searched_index ++
                    this.seat_id = this.searched_halls[this.searched_index]
                }else{
                    this.keyword_old = ''
                }
            }
        }
    },
    mounted() {
        const exponame = this.$route.params.exponame
        if (!this.expo_content['halls'].length) {
            this.getGuanList()
        } else {
            this.setFirstGuan()
        }
    },
    watch: {
        expo_id(to, from) {
            if (to) {
                this.getGuanList()
            }
        }
    },
}
</script>

<style lang="scss" scoped>
.drop-title {
    padding: 0.7rem 0;
}

.map_container {
    overflow: scroll;
    width: 100%;
}
</style>
