<template>
<div>
    <div class="border-bottom py-2 card-big-container" v-for="da in news_list" :key='da.id' @click="goNewsDetail(da)">
        <div class="d-flex" v-if="da.covers.length==1">
            <img :src="gsv(['url'], da.covers[0]) " alt="" class="product-img rounded">
            <div class="pl-2 pb-1 d-flex justify-content-between flex-column flex-1">
                <h4 class="pr-2 text-line-3 text-dark">{{gsv([$i18n.locale], da.title) || da.title || $t('title')}}</h4>
                <div class="d-flex align-items-center justify-content-between text-dark9">
                    <p>
                        <span>{{formatTime(da.created_at)}}·{{da.tag == 'activity' ? $t('event.i') : $t('headline')}}</span>
                    </p>
                    <p class="ml-2 text-nowrap"><span>{{$t('view.count')}} {{da.views}}</span></p>
                </div>
            </div>
        </div>
        <div v-else class="">
            <h4 class="pr-2 text-dark mb-1">{{gsv([$i18n.locale], da.title) || da.title || $t('title')}}</h4>
            <div class="card-recomm-container mb-2">
                <div v-for="ii in Math.min(3, da.covers.length)" :key="da.id+'kk'+ii">
                    <img :src="gsv(['url'], da.covers[ii-1])" alt=" " :key="da.id+'k'+gsv(['url'], da.covers[ii-1])" class="rounded fit-cover">
                </div>
            </div>
            <div class="d-flex align-items-center justify-content-between text-dark9">
                <p>
                    <span>{{formatTime(da.created_at)}}·{{da.tag == 'activity' ? $t('event.i') : $t('headline')}}</span>
                </p>
                <p class="ml-2 text-nowrap"><span>{{$t('view.count')}} {{da.views}}</span></p>
            </div>
        </div>
    </div>
    <ku-loading-no-data :active="is_loading" :total="total" />
    <div class="text-center pagination-kuc my-2">
        <el-pagination background layout="prev, pager, next" :total="total" :pager-count=5 :prev-text="$t('page.pre')" :next-text="$t('page.next')" :page-size="listQuery.limit" :current-page.sync="listQuery.page" @current-change="getList" hide-on-single-page></el-pagination>
    </div>
</div>
</template>

<script>
import {
    mapState,
    mapActions,
    mapGetters
} from 'vuex'
import {
    getExpoNewsList
} from "@/api/expo"
export default {
    data() {
        return {
            // cooperation_companies: exhibition_co.data.items,
            is_loading: true,
            news_list: [],
            total: 0,
            listQuery: {
                page: 1,
                limit: 5
            }
        }
    },
    computed: {
        ...mapState('expo', ['expo_content']),
        expo_id: function () {
            return this.expo_content['common']['id']
        }
    },
    methods: {
        getList() {
            if (!this.expo_id) return
            this.list = []
            this.is_loading = true
            getExpoNewsList(this.expo_id, this.listQuery).then(res => {
                if (res) {
                    this.news_list = res.items
                    this.total = res.total
                }
            }).finally(() => {
                this.is_loading = false
            })
        },
        goNewsDetail(da) {
            if (da.tag == 'activity')
                window.open(process.env.M_URL + `/events/${da.id}`, '_blank')
            else
                window.open(process.env.M_URL + `/article/${da.id}`, '_blank')
        },
    },
    mounted() {
        this.getList()
    },
    watch: {        
        expo_id(to, from) {
            if (to) {
                this.getList(this.activeTab)
            }
        }
    },
}
</script>

<style lang="scss" scoped>
.card-big-container {
    span {
        font-size: 0.9rem;
    }
}

.product-img {
    object-fit: cover;
    width: 28vw;
    height: 25vw;
    max-height: 160px;
    min-height: 7rem;
    max-width: 16rem;
    min-width: 8rem;
}
.card-recomm-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;

    >div {
        flex: 1;
        padding-left: 0.25rem;
        padding-right: 0.25rem;

        img {
            width: 100%;
            height: 100%;
            max-height: 35vw;
        }
    }
}
</style>