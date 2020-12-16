<template>
<div class="min-vh-100">
    <kuc-page-header :title="title"></kuc-page-header>
    <div class="p-2 mt-1">
        <div class="bg-white rounded px-2 pt-2" style="padding-bottom: 5rem">
            <div class="search-rounded-group mb-2">
                <el-input :placeholder="$t('search')" v-model="keyword" @keyup.enter.native="handleSearch">
                    <div slot="prepend">
                        <el-select v-model="hall_id" placeholder="馆" @change="hChangeGuan">
                            <el-option v-for="item in expo_content['halls']" :key="item.id" :label="gsv([$i18n.locale], item.name)" :value="item.id">
                            </el-option>
                        </el-select>
                    </div>
                    <i slot="suffix" class="el-input__icon el-icon-search" @click="handleSearch"></i>
                </el-input>
            </div>

            <div v-if="map_data" style="height: 100vw; max-height: 30rem">
                <ku-svg-map :map="map_data" radio v-model="p" :bg_url="bg_url" @change="mapChange" />
            </div>

            <div class="p-2">
                <h2 class="text-blue-2">{{$t('expo.no_')}}: {{p_temp.join(', ')}}</h2>
                <h2 class="my-3">{{gsv(['name', $i18n.locale], details)}}</h2>
                <div class="d-flex my-2">
                    <p class="text-nowrap mr-1 text-dark9">{{$t('main.product')}}: </p>
                    <p>{{getNames(details.categories)}}</p>
                </div>
                <div class="d-flex my-2">
                    <p class="text-nowrap mr-1 text-dark9">{{$t('business.mode')}}: </p>
                    <p>{{gsv(['name', $i18n.locale], details.mgmodel)}}</p>
                </div>
                <div class="d-flex my-2">
                    <p class="text-nowrap mr-1 text-dark9">{{$t('main.market')}}: </p>
                    <p>{{getNames(details.market)}}</p>
                </div>
                <div class="d-flex my-2">
                    <p class="text-nowrap mr-1 text-dark9">{{$t('company')}}{{$t('address')}}: </p>
                    <p> {{gsv([$i18n.locale], details.address) || details.address}}</p>
                </div>
                <div class="d-flex my-2">
                    <p class="text-nowrap mr-1 text-dark9">{{$t('company')}}{{$t('phone')}}： </p>
                    <a class="text-blue-2" :href="'tel:'+details.phone"> {{details.phone}}</a>
                </div>
                <div class="d-flex my-2">
                    <p class="text-nowrap mr-1 text-dark9">{{$t('e_mail')}}: </p>
                    <a class="text-blue-2" :href="'mailto:'+details.contact_email"> {{details.contact_email}}</a>
                </div>
                <div class="d-flex my-2">
                    <p class="text-nowrap mr-1 text-dark9">{{$t('company.www')}}: </p>
                    <a class="text-blue-2" :href="details.website" target='_blank'> {{details.website}}</a>
                </div>
            </div>
            <div class="text-center my-3">
                <div class="px-4" @click="goIwantVisit">
                    <h3 class="bg-blue-2 text-white btn--link w-100">{{$t('want.visit')}}</h3>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import KuSvgMap from "@/components/k-svg-map"
import { getExpo } from '@/api/expo'
export default {
    name: 'ExpoSearch',
    layout: 'main',
    components: { KuSvgMap },
    data() {
        return {
            hall_id: '',
            bg_url: '',
            map_id: '',
            map_data: null,
            details: {},
            p: this.$route.query.p || '',
            p_temp: [],
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
        },
        title: function () {
            const kk = this.expo_content['halls'].find(rr => rr.id == this.hall_id)
            return this.gsv(['name', this.$i18n.locale], kk) || '...'
        }
    },
    methods: {
        ...mapActions('expo', ['getExpoCommon', 'getExpoInfoById', 'downloadExpoSVG']),

        handleFilter() {
            this.listQuery.page = 1
            this.getCompanies()
        },
        hChangeGuan() {
            this.getMap(true)
        },
        async getMap(clear_position = false) {
            let hall_cur = this.expo_content['halls'].find(rr => rr.id == this.hall_id)
            if (hall_cur) {
                if (!hall_cur.svg) {
                    if (hall_cur.bg_url) {
                        await this.downloadExpoSVG(hall_cur)
                        hall_cur = this.expo_content['halls'].find(rr => rr.id == this.hall_id)
                    }
                }

            }
            this.bg_url = hall_cur.bg_url
            this.map_data = hall_cur.svg
            // this.map_id = hall_cur.map_id   
            if (clear_position) {
                this.p = ''
                this.p_temp = []
                this.$router.replace({ path: this.$route.path, query: { h: this.hall_id, p: '' } })
            } else {
                this.$router.replace({ path: this.$route.path, query: { ...this.$route.query, ...{ h: this.hall_id } } })
            }
            this.details = {}
            // getExpo(`hall/${this.expo_id}/${this.hall_id}`).then(res => {
            //     this.map_id = res.hall.map_id
            //     this.bg_url = res.hall.map
            //     this.map_data = res.hall.svg
            // })
        },

        setFirstGuan() {
            this.hall_id = this.hall_id || this.gsv(['halls', 0, 'id'], this.expo_content)
            if (this.hall_id)
                this.getMap()
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

        mapChange(id) {
            // console.log(id, "id")
            // const len_arr = position_arr.length
            // const id = len_arr ? position_arr[len_arr-1] : ''
            const exist_hall_in_list = this.expo_content['halls'].find(rr => rr.map_id == id)
            if (exist_hall_in_list) {
                // for map_id == 'all'
                this.hall_id = exist_hall_in_list.id
                this.getMap()
            } else {
                // const is_no_seat = id.search(/hall?/g)
                // if (is_no_seat == 0) return
                if (id != this.$route.query.p) {
                    this.p = id
                    this.$router.replace({ path: this.$route.path, query: { ...this.$route.query, ...{ p: id } } })
                }

                if (this.p_temp.includes(id)) {
                    return false
                }
                if (id) {
                    this.$store.dispatch("common/setLoading")
                    getExpo(`hall/${this.expo_id}/${id}`).then(res => {
                        this.details = res.hall.company || {}
                        this.p_temp = this.gsv(['expo_applicant_seller', 'halls'], res.seller_hall) || [id]
                    }).finally(() => {
                        this.$store.dispatch("common/setLoading", false)
                    })
                }
            }
        },
        goIwantVisit() {
            window.open(`${process.env.M_URL}/my/buy/participate/${this.expo_id}/step1`, '_blank')
        },
        handleSearch() {
            if (!this.map_data) return false
            if(this.keyword == ''){
                this.searched_halls = []
                this.p = ''
                return
            }
            if (this.keyword_old != this.keyword) {
                const all_position_ids = this.map_data.shapes ? Object.keys(this.map_data.shapes) : []
                const reg = new RegExp(this.keyword, 'gi')
                this.searched_halls = all_position_ids.filter(rr => reg.test(rr)).sort()
                this.searched_index =  0
                this.p = this.searched_halls[0] || ''  
                this.keyword_old = this.keyword
            } else {
                if(this.searched_index < (this.searched_halls.length-1) ){
                    this.searched_index ++
                    this.p = this.searched_halls[this.searched_index]
                }else{
                    this.keyword_old = ''
                }
            }
        }
    },
    async created() {
        const exponame = this.$route.params.exponame

        if (this.$route.query.h) {
            this.hall_id = parseInt(this.$route.query.h)
        }
        if (!this.expo_content['common']['id']) await this.getExpoCommon(exponame)

        if (!this.expo_content['halls'].length) {
            this.getGuanList()
        } else {
            this.getMap()
        }
        this.mapChange(this.p)
    },

}
</script>

<style lang="scss" scoped>
.btn--link {
    border-radius: 10rem;
    // display: inline;
    vertical-align: middle;
    padding: 0.7rem;
}
</style>
