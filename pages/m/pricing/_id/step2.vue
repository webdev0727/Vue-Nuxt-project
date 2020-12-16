<template>
<div>
    <kuc-page-header :title="$t('member.apply')"></kuc-page-header>
    <div class="bg-white mt-2 pb-2 text-center">
        <div class="px-3 py-3 mb-2">
            <ProcessBar3 :status='processIndex' />
        </div>
        <div v-if="processIndex==2">
            <success-icon></success-icon>
            <h2 class="px-3">您的认证信息您的<span class="text-danger">提交成功</span> 认证信息您的认证信息您的认证信息</h2>
            <el-button type="primary" @click="dialogVisable = true" round class="w-75 my-4" v-if="processIndex==2 && $route.params.id!=3">{{$t('btn.pay')}}</el-button>
            <!-- <el-button type="primary" size="default" @click="saveTransaction">saveTransaction</el-button> -->
        </div>
        <div v-else class="py-4">
            <el-button type="primary" class="w-50" size="default" round @click="handleRedirect">{{$t('step.complete')}}</el-button>
        </div>

        <div class="p-2">
            <!-- yuen renmenbi ￥ -->
            <div class="rounded bg-light py-3 px-2">
                <h3>订单信息</h3>
                <h2 class="my-3">{{memberShipObj ? memberShipObj.name[$i18n.locale] : ''}}{{$t('member.apply')}}</h2>
                <p class="text-dark6 font-09">{{$t('time.membership')}}：{{parseTime(+new Date, '{y}年{m}月{d}日')}} - {{parseTime(+new Date + 31536000000, '{y}年{m}月{d}日')}}</p>
                <p class="text-dark6 font-09">{{$t('memebership')}}：<strong class="text-danger font-12">￥{{memberShip}}</strong></p>
            </div>
        </div>
    </div>

    <ku-pay-modal :visible.sync="dialogVisable" :amount="memberShip" @success="TansactionSuccess" title="memebership" :alipay_subject="gsv(['name', 'zh'], memberShipObj) + '会员价格'">
    </ku-pay-modal>

</div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import ProcessBar3 from "@/components/ProcessBar3"
import SuccessIcon from "@/components/successIcon"
import KuPayModal from "@/components/KuPayModal"
import { getAlipay } from "@/api/pay"
import { userPricing, getMyInfo } from "@/api/user"
import Echo from 'laravel-echo'

export default {
    middleware: 'authenticated',
    name: "PricingStep2Payment",
    components: { ProcessBar3, SuccessIcon, KuPayModal },
    head() {
        return {
            title: this.$t('member.apply')
        }
    },
    data() {
        return {
            processIndex: 2,
            dialogVisable: false,
        }
    },
    computed: {
        ...mapState('pricing', ['pricing_cate']),
        memberShipObj: function () {
            let ll = null
            if (this.pricing_cate.length) {
                ll = this.pricing_cate.find(re => re.id == this.$route.params.id)
            }
            return ll
        },
        memberShip: function () {
            let price = 0
            if (this.memberShipObj) {
                price = this.memberShipObj.price
            }
            return price
        },

    },

    methods: {
        ...mapActions('pricing', ['getPricingList']),
        TansactionSuccess(transaction_data) {
            transaction_data.vip_id = this.$route.params.id
            this.$store.dispatch("common/setLoading")
            userPricing(2, transaction_data).then(res => {
                if (res.user) {
                    this.$store.dispatch('setToken', res.token)
                    this.$store.dispatch('setUserAuth', res.user)
                }
                this.processIndex = 3
                this.dialogVisable = false

            }).catch(() => {

            }).finally(() => {
                this.$store.dispatch("common/setLoading", false)
            })
        },

        // ===================================================================================================
        //  Route correction
        // ===================================================================================================
        handleRedirect() {
            this.dialogVisable = false
            this.processIndex = 3
            const path = localStorage.getItem('mAntway_redirect') || '/my'
            localStorage.removeItem('mAntway_redirect')
            this.$router.replace({ path })
        },
    },
    mounted() {
        const vip_id_want = this.$route.params.id ? parseInt(this.$route.params.id) : null
        // if vip you want is pendeng
        if (vip_id_want <= this.$store.state.auth.vip_id) {
            this.$router.replace({ path: `/pricing` })
        } else {
            if (!this.pricing_cate.length) this.getPricingList()

            getMyInfo().then(response => {
                this.$store.dispatch('setUserAuth', response.user).then(() => {
                    if (vip_id_want == 3) {
                        if (this.$store.state.auth.status_verified == 0) {
                            this.$router.replace({ path: `/pricing/${this.$route.params.id}/step1`})
                        } else {
                            this.processIndex = 3
                        }
                    }
                    else if ([4, 5].includes(vip_id_want)) {
                        if (this.$store.state.auth.vip_id == vip_id_want) {
                            this.handleRedirect()
                        } else {
                            if (vip_id_want != this.$store.state.auth.vip_id_pending) {
                                this.$notify({
                                    title: this.$t('error'),
                                    message: this.$t('status.failed'),
                                    type: 'error'
                                });
                                setTimeout(() => {
                                    this.$router.replace({ name: 'pricing-id-step1', params: { id: vip_id_want } })
                                }, 2000);
                            } else {
                                // in case paid
                                if (this.$store.state.auth.vip_transaction_id) this.processIndex = 3
                            }
                        }
                    }
                })
            })
        }
    }

}
</script>
