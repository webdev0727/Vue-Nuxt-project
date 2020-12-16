<template>
<div>
    <kuc-page-header :title="$t('purchase.bao')"></kuc-page-header>
    <el-form ref="dataForm" label-position="left" label-width="0" v-if="info">
        <div class="bg-white mt-1 pb-2">
            <div class="p-2">
                <h3 class="mb-2">{{info.purchase.title}}</h3>
                <p>{{info.purchase.description}} </p>
                <div class="font-09 text-dark6">
                    <div class="d-flex my-2">
                        <p class="text-nowrap mr-1">{{$t('post.date')}}： </p>
                        <p>{{parseTime(info.purchase.created_at)}}</p>
                    </div>
                    <div class="d-flex my-2">
                        <p class="text-nowrap mr-1">{{$t('date.deadline')}}： </p>
                        <p> {{info.purchase.delivery_date || $t('source.long')}}</p>
                    </div>
                    <div class="d-flex my-2">
                        <p class="text-nowrap mr-1">{{$t('source.quantity')}}： </p>
                        <p>{{info.purchase.quantity}}{{gsv(['name', $i18n.locale], info.purchase.unit)}}</p>
                    </div>
                    <div class="d-flex my-2 align-items-center">
                        <p class="text-nowrap mr-1">{{$t('product.img')}}：</p>
                        <!-- <img :src="img.url" alt=" " width="60" height="60" class="rounded mr-2" v-for="img in info.purchase.assets" :key="img.id"> -->
                        <ku-media-box v-if="info.purchase.assets" :assets="info.purchase.assets"></ku-media-box>
                        <svg-icon name='no-data' width='100' height="50" v-else></svg-icon>
                    </div>
                </div>

                <div class="mt-4">
                    <h3>{{$t('buyer.info')}}</h3>

                    <div class="font-09 text-dark6">
                        <div class="d-flex my-2">
                            <p class="text-nowrap mr-1">{{$t('name')}}：</p>
                            <p>{{gsv(['name', $i18n.locale], info.purchase.user)}}</p>
                        </div>
                        <div class="d-flex my-2">
                            <p class="text-nowrap mr-1">{{$t('company')}}：</p>
                            <p>{{gsv(['company', 'name', $i18n.locale], info.purchase.user)}}</p>
                        </div>
                        <div class="d-flex my-2">
                            <p class="text-nowrap mr-1">{{$t('phone')}}：</p>
                            <p>{{gsv(['user', 'phone'], info.purchase)}}</p>
                        </div>
                        <div class="d-flex my-2">
                            <p class="text-nowrap mr-1">{{$t('mobile')}}：</p>
                            <p v-if="gsv(['user', 'phone'], info.purchase)">+{{gsv(['user', 'phone_prefix'], info.purchase)}}{{gsv(['user', 'phone'], info.purchase)}}</p>
                        </div>
                        <div class="d-flex my-2">
                            <p class="text-nowrap mr-1">{{$t('email')}}： </p>
                            <p>{{gsv(['user', 'email'], info.purchase)}}</p>
                        </div>

                    </div>
                </div>
                <div class="rounded text-center py-4" style="background-color: #F7F7F7">
                    <p class="text-dark6">{{leftDayEnd(info.purchase.delivery_date)}}</p>                    
                    <h3 class="my-2">{{$t('offer.price')}} <span class="text-danger">￥{{info.price}}</span> </h3>
                    <el-row class="mt-4">
                        <el-col :span="12">
                            <div>
                                <el-button type="primary" @click="handleUpdate" class="w-75" round>{{$t('offer.again')}}</el-button>
                            </div>
                        </el-col>
                        <el-col :span="12">
                            <div>
                                <el-button type="primary" @click="handleDel" class="w-75" round plain>{{$t('offer.cancel')}}</el-button>
                            </div>
                        </el-col>
                    </el-row>

                </div>
            </div>

        </div>

        <ku-title-line class="px-2">{{$t('quote.my.history')}}</ku-title-line>

        <div class="px-2 pt-2 bg-white">
            <div v-for="history in myHistory" :key="history.id">
                <div class="py-2">
                    <h4>报价未通过</h4>
                    <div class="d-flex mt-2">
                        <p class="text-dark6 mr-5">{{$t('quote.price')}}：<span class="text-danger">￥{{history.price}}</span></p>
                        <p class="text-dark9">{{parseTime(history.created_at)}}</p>
                    </div>
                </div>
                <ku-line />
            </div>
            <no-data v-if="!myHistory.length" />

        </div>

    </el-form>

</div>
</template>

<script>
import { offer_detail, offer_del } from '@/api/my_treasure'
const humanizeDuration = require('humanize-duration')
export default {
    name: "MyTreasureDetail",
    components: {},
    data() {
        return {
            info: '',
            temp: {},
        }
    },
    computed: {
        bidLeftTime: function () {
            let delivery_time = this.gsv(['delivery_date'], this.info.purchase) ? +new Date(this.info.purchase.delivery_date) : 0
            let bid_time = this.info.created_at ? +new Date(this.info.created_at) : 0
            let diff = parseInt((delivery_time - bid_time) / (3600000 * 24))
            return diff
        },        
        myHistory: function () {
            let histroy = this.gsv(['purchase', 'offers'], this.info) || []
            // return histroy.filter(xx => xx.user_id == this.$store.state.auth.id)
            return []
        }
    },
    methods: {
        leftDayEnd(deadline){
            var kk = this.$t('source.long')
            if (deadline){
                var sTimeSecond = deadline
                if(this.validDate(deadline)){
                    sTimeSecond = deadline + ' 23:59:59'
                }           
                const distance = +new Date(sTimeSecond) - new Date().getTime();
                const language = this.$i18n.locale=='en' ? 'en' : 'zh_CN'
                let day = ''
                if(distance>0)
                    day= humanizeDuration(distance, {
                        language,
                        round: true,
                        units: ['d']
                    })
                else
                    day = this.$t('duration.days', [0])
                kk = this.$t('deadline_left',[day])
            } 
            return kk
        },
        handleAdd() {
            this.$notify({
                title: this.$t('success'),
                message: this.$t('success.msg'),
                type: 'success'
            });
        },
        handleUpdate() {
            this.$router.push({ path: `/purchase/offer/create/${this.info.purchase_id}` })
        },
        handleDel() {
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
                offer_del([this.$route.params.id]).then(() => {
                    this.$notify({
                        title: this.$t('success'),
                        message: this.$t('success.del'),
                        type: 'success'

                    });
                    this.$router.push({ path: '/my/sell/treasure' })
                })
            }).catch(() => {})

        }

    },
    mounted() {
        offer_detail(this.$route.params.id).then(res => {
            this.info = res.offer
        })
    }

}
</script>