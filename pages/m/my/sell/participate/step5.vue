<template>
<div class="bg-white p-2">
    <ProcessBar3 :status=4 :items='process_items' class="mb-2" />
    <el-form ref="dataForm" label-position="left" label-width="0" class="text-center min-vh-100">
        <SuccessIcon />
        <div v-html="$t('msg.html_booth_success')"></div>
        <div class="text-center pt-2 mt-2">
            <el-button type="primary" @click="handleSubmit" class="w-75" round="">{{$t('btn.pay')}}</el-button>
        </div>
        <div class="mt-4 bg-light p-2">
            <h3 class="mb2">{{$t('expo.profile')}}</h3>
            <h2 class="font-13 my-3">{{$t('expo.no_')}}：{{seller_step.expo_applicant_seller ? seller_step.expo_applicant_seller.halls.join(', '): ''}}</h2>
            <div class="text-dark9 mt-2">
                <p>{{$t('expo.area')}}：{{gsv(['areas'], seller_step.expo_applicant_seller)}}{{$t('m2')}}</p>
                <p>{{$t('expo.price')}}：<strong class="text-danger font-11">￥{{gsv(['total_amount'], seller_step)}}</strong> </p>
            </div>
        </div>
    </el-form>
    
    <ku-pay-modal :visible.sync="dialogVisable" 
        :amount="gsv(['total_amount'], seller_step) || 0" 
        @success="TansactionSuccess" title="expo.price"
        :alipay_subject="$t('expo.price') + '-' + gsv(['expo', 'name', $i18n.locale], seller_step.expo_applicant_seller)">        
    </ku-pay-modal>
    

</div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import ProcessBar3 from "@/components/ProcessBar3"
import SuccessIcon from "@/components/successIcon"
import KuPayModal from "@/components/KuPayModal"
import { userPay } from "@/api/user"
import { applyStep } from "@/api/expo"

export default {
    scrollToTop: true,
    name: "Participate_New_Step4_Pay",
    components: { ProcessBar3, SuccessIcon, KuPayModal },
    data() {
        return {
            dialogVisable: false,
            process_items: [this.$t('info.fill'), this.$t('investigation'), this.$t('expo.book'), this.$t('expo.pay'), this.$t('step.complete')],
        }
    },
    computed: {
        ...mapState('expo', ["seller_step"]),
    },
    methods: {
        ...mapActions('expo', ['getSellerStatus']),
        handleSubmit() {
            this.dialogVisable = true
            // applyStep('seller', 4, { expo_applicant_seller_id: this.seller_step.expo_applicant_seller.id }).then(async (res) => {
                // await this.getSellerStatus()                
            // })
        }, 
        handleRoute(step = 4) {
            let path = "/my/sell/participate/"

            if (this.seller_step.status) path = path + "step" + (parseInt(this.seller_step.status) + 1)

            if (this.seller_step.status == step) {
                // this.initDa()
            } else {
                this.$router.replace({ path })
            }
        },
        TansactionSuccess(transaction_data){
            transaction_data.expo_seller_id = this.gsv(['expo_applicant_seller', 'id'], this.seller_step)
            transaction_data.payment_type = "SELLER_APPLICANT"
            transaction_data.payment_description = this.$t('expo.apply') + `(${this.gsv(['expo', 'name', this.$i18n.locale], this.seller_step.expo_applicant_seller)})`
            this.$store.dispatch("common/setLoading")
            userPay(transaction_data).then(async res => {                
                this.dialogVisable = false
                await this.getSellerStatus()
                this.handleRoute()
            }).catch(() => {

            }).finally(() => {
                this.$store.dispatch("common/setLoading", false)
            })
        }
    },
    async mounted() {

        if (this.seller_step.status==undefined) {
            await this.getSellerStatus()
        }
        this.handleRoute()
    }
}
</script>