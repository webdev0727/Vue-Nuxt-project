<template>
<div>
    <kuc-page-header :title="$t('purchase.bao')"></kuc-page-header>
    <el-form ref="dataForm" label-position="left" label-width="0" v-if="info.id">
        <div class="bg-white mt-1 pb-2">
            <div class="p-2">
                <div class="d-flex">
                    <img :src="getImg1(info.assets) " alt=" " width="60" height="60" class="rounded fit-cover">
                    <div class="ml-2">
                        <h3>{{info.title}}</h3>
                        <div class="text-dark6">
                            <p class="py-1">{{info.description}}</p>
                            <div class="d-flex justify-content-between">
                                <p class="text-nowrap mr-3">{{$t('source.quantity')}}：{{info.quantity || '面议'}}</p>
                                <p class="text-nowrap">{{$t('source.req')}}：{{info.urgent ? $t('urgent') : '无'}}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="rounded text-center mt-3 py-3" style="background-color: #F7F7F7">
                    <p class="text-dark6">{{$t('post.date')}}：{{parseTime(info.created_at)}}</p>
                    <!-- <h3 v-if="info.is_done">{{$t('status.close')}}</h3> -->
                    <div v-if="info.delivery_date">
                        <h3 class="my-2" v-if="$i18n.locale=='en'">
                            <TimerLeft class="text-danger" :endTime="info.delivery_date" @ended="info.is_done=1" />
                            {{$t('purchase.left_day')}}</h3>
                        <h3 class="my-2" v-else>
                            {{$t('purchase.left_day')}}
                            <TimerLeft class="text-danger" :endTime="info.delivery_date" @ended="info.is_done=1" />
                        </h3>
                    </div>
                    <h3 v-else>{{$t('source.long')}}</h3>
                    <el-row class="mt-4">
                        <el-col :span="12">
                            <div>
                                <el-button type="primary" @click="handleClose" class="w-75" round :disabled="!!info.is_done">{{info.is_done ? $t('status.close') :$t('source.close')}}</el-button>
                            </div>
                        </el-col>
                        <el-col :span="12">
                            <div>
                                <el-button type="primary" @click="handleDelete" class="w-75" round plain>{{$t('source.del')}}</el-button>
                            </div>
                        </el-col>
                    </el-row>

                </div>
            </div>

        </div>

        <ku-title-line class="px-2">{{$t('bidder')}}（{{info.offers.length}}）</ku-title-line>

        <div class="px-2 pt-2 bg-white">
            <div v-for="item in info.offers" :key="item.id">
                <div class="py-2 d-flex justify-content-between align-items-center">
                    <div class="flex-1" @click="handleBidDetail(item.id)">
                        <h4>{{gsv(['name', $i18n.locale], item.user)}}, (+{{item.user.phone_prefix}}){{item.user.phone}}</h4>
                        <div class="py-2 d-flex flex-wrap">
                            <span class="mr-2 rounded bg-darkF7 px-2 py-1 font-09 mb-1" v-if="item.in_stock">{{$t('is_in_stock_yes')}}</span>
                            <span class="mr-2 rounded bg-darkF7 px-2 py-1 font-09 mb-1" v-if="item.can_provide_sample">{{$t('can_provide_sample_yes')}}</span>
                            <span class="mr-2 rounded bg-darkF7 px-2 py-1 font-09">{{ item.is_oem ? 'OEM': 'ODM'}}</span>
                        </div>
                        <div class="d-flex">
                            <p class="text-dark6 mr-5">{{$t('offer.i')}}：<span class="text-danger">￥{{item.price}}</span></p>
                            <p class="text-dark9">{{parseTime(item.created_at, '{y}-{m}-{d} {h}:{i}')}}</p>
                        </div>
                    </div>
                    <div>
                        <span class="bg-danger text-white px-3 py-2 rounded  font-09" @click="handleContact(item)">{{$t('msg.send_ta')}}</span>
                    </div>
                </div>
                <ku-line />
            </div>
            <no-data v-if="!info.offers.length"></no-data>

        </div>

    </el-form>

</div>
</template>

<script>
import { getDetail, del, myofferDone } from '@/api/my_treasure'
import TimerLeft from '@/components/TimerLeft'
export default {
    name: "MyTreasureDetail",
    components: { TimerLeft },
    data() {
        return {
            info: {},
        }
    },
    methods: {
        getIsRunning(endTime) {
            if (!endTime) return true
            var endTimeSecond = endTime
            if (this.validDate(endTime)) {
                endTimeSecond = endTime + ' 23:59:59'
            }
            if (new Date().getTime() > +new Date(endTimeSecond)) {
                this.info.is_done = 1
                return false
            }
            return true
        },
        handleClose() {
            // this.$router.push({ path: "/my/buy/treasure" })
            if (!this.info.is_done) {
                this.$confirm(this.$t('source.close') + "?", this.$t('warning'), {
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
                    myofferDone(this.$route.params.id).then(() => {
                        this.info.is_done = 1
                        this.$notify({
                            title: this.$t('success'),
                            message: this.$t('source.close'),
                            type: 'success'

                        });
                    })
                }).catch(() => {})
            }
        },
        handleDelete() {
            this.$confirm(this.$t('confirm.msg_del'), this.$t('warning'), {
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
                del([this.$route.params.id]).then(() => {
                    this.$notify({
                        title: this.$t('success'),
                        message: this.$t('success.del'),
                        type: 'success'

                    });
                    this.$router.push({ path: "/my/buy/treasure" })
                })
            }).catch(() => {})
        },
        handleContact(bidder) {
            const to = this.gsv(['user', 'phone'], bidder) || this.gsv(['user', 'email'], bidder)            
            const name = this.gsv(['user', 'name', this.$i18n.locale], bidder) || ''
            const uid = bidder.user_id            
            this.$router.push({ path: `/message/new`, query: { uid, to, name } }) 
        },
        handleBidDetail(bid_id) {
            this.$router.push({ path: "/purchase/offer/" + bid_id })
        }
    },
    mounted() {
        getDetail(this.$route.params.id).then(({ purchase }) => {
            this.info = purchase
        })
    }

}
</script>