<template>
<div>
    <kuc-page-header :title="$t('event.my')"></kuc-page-header>
    <div class="p-2">
        <div v-for="item in list" :key="item.id" class="rounded mb-2 card-container bg-white">
            <nuxt-link :to="'/article/' + item.id" :style="`background-image:url(${getImg1(item.covers)});`" class="card-image rounded">
                <span v-if="item.on_line" class="py-1 px-2 text-white" style="background:rgba(0,0,0,0.6);">{{$t('status.online')}}</span>
                <span v-else class="py-1 px-2 text-white" style="background:rgba(229,1,19,0.6);">{{$t('status.offline')}}</span>
                <p class="py-1 px-2 rounded">{{$t('status.baoming')}}{{item.signups}}人</p>
            </nuxt-link>
            <div class="p-2">
                <nuxt-link :to="'/article/' + item.id">
                    <h3 class="mb-2">
                        <span v-if="getIsRunning(item.enddate)" class="text-white bg-danger px-2 py-1 font-08 rounded font-weight-normal">进行中</span>
                        <span v-else class="text-white bg-darkC px-2 py-1 font-08 rounded font-weight-normal">{{$t('status.close')}}</span>
                        {{gsv([$i18n.locale], item.title)}}</h3>
                </nuxt-link>
                <div class="text-dark6 font-09">
                    <p class="text-line-1" v-if="item.overview">{{$t('intro.event')}}: {{item.overview}}</p>
                    <p class="text-line-1" v-else>{{$t('intro.event')}}: {{item.content | strippedContent}}</p>
                    <p>{{$t('date.event')}}: {{ parseTime(item.startdate, '{y}年{m}月{d}日') }}至{{ parseTime(item.enddate, '{m}月{d}日')}}</p>
                </div>
                <h4><span class="text-danger font-13">{{leftDay(item.startdate)}}</span> 后活动开始</h4>
                <!-- <h4>{{getTTT(item.enddate)}}</h4> -->
            </div>
        </div>
        <ku-loading-no-data :active="isLoading" :total="total" push />
        <div class="text-center pagination-kuc mt-3 mb-5">
            <span class="px-3 py-2 text-dark6" v-if="list.length<total && list.length!=0" @click="handleGetMore">{{$t('more_load')}}</span>
        </div>
    </div>
</div>
</template>

<script>
import { getMyEvents } from '@/api/activity'
const humanizeDuration = require('humanize-duration')
export default {
    middleware: 'authenticated',
    name: 'MyEvents',
    head() {
        return{
            title: this.$t('event.my')      
        }
    },
    data() {
        return {
            isLoading: true,
            list: [],
            total: 0,
            listQuery: {
                page: 1,
                keyword: ''
            },
        }
    },    
    methods: {
        getList() {
            this.isLoading = true;
            getMyEvents(this.listQuery).then(res => {
                this.list.push(...res.items)
                this.total = res.total
            }).finally(() => {
                this.isLoading = false
            })
        },
        handleGetMore() {
            this.listQuery.page += 1
            this.getList()
        },
        getIsRunning(endTime) {
            var endTimeSecond = endTime
            if(this.validDate(endTime)){
                endTimeSecond = endTime + ' 23:59:59'
            }
            if (new Date().getTime() > +new Date(endTimeSecond)) return false
            return true
        },
        getTTT(endTime) {
            let cur_time = +new Date() / 1000
            return [new Date().getTime(), cur_time,  +new Date(endTime)]
        },
        leftDay(sTime){ 
            var sTimeSecond = sTime
            if(this.validDate(sTime)){
                sTimeSecond = sTime + ' 00:00:00'
            }           
            const distance = +new Date(sTimeSecond) - new Date().getTime();
            const language = this.$i18n.locale=='en' ? 'en' : 'zh_CN'
            if(distance>0)
                return humanizeDuration(distance, {
                    language,
                    round: true,
                    units: ['d']
                })
            else
                return this.$t('duration.days', [0])
        }
    },
    mounted(){
        this.getList()
    }
}
</script>

<style lang="scss" scoped>
.card-container {
    overflow: hidden;

    .card-image {
        position: relative;
        display: inline-block;
        width: 100%;
        height: 40vw;
        background-size: cover;
        background-position: center;
        overflow: hidden;

        span {
            position: absolute;
        }

        p {
            position: absolute;
            bottom: 0.25rem;
            right: 0.25rem;
            color: white;
            background-color: rgba(0, 0, 0, 0.6);
        }
    }
}
</style>
