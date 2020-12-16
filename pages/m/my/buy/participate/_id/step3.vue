<template>
<div class="bg-white p-3 min-vh-100">
    <ProcessBar3 :status=3 :items='process_items' />
    <div class="text-center">
        <SuccessIcon />
        <div class="text-dark9 text-center">
            <!-- 。 -->
            <h2 class="px-3 text-dark28 mb-3">{{$t('msg.thanks_register')}}{{gsv(['expo', 'name', $i18n.locale], step_buyer.expo_applicant_buyer)}}</h2>
            <p>{{$t('msg.will_check_soon')}}</p>

            <p class="mt-4">{{$t('msg.follow_on_wechat')}}</p>
            <p>{{$t('wechat:')}}：CNISE-FAIR</p>
        </div>
        <div class="my-3">
            <img src="/files/gongzhonghao.png" alt="" width="180" @click="handleTemp">
        </div>
    </div>

</div>
</template>

<script>
import ProcessBar3 from "@/components/ProcessBar3"
import SuccessIcon from "@/components/successIcon"
import { mapState, mapActions, mapGetters } from 'vuex'
import { applyStep } from "@/api/expo"

export default {
    scrollToTop: true,
    name: "BuyParticipate_Step3",
    components: { ProcessBar3, SuccessIcon },
    data() {
        return {
            process_items: [this.$t('step.info'), this.$t('investigation'), this.$t('step.auditing'), this.$t('badge_apply')],
        }
    },   
    
    computed: {
        ...mapState('expo', ["step_buyer"]),        
    },
    methods: {
        ...mapActions('expo', ['getBuyerStatus']),
        handleTemp() {
            // applyStep('buyer', 2, {expo_applicant_buyer_id: this.step_buyer.expo_applicant_buyer.id}).then(async (re) => {
            //     await this.getBuyerStatus(this.$route.params.id)
            //     this.$router.push({ path: '/my/buy/participate/' + this.$route.params.id + '/step4' })
            // })
        }
    }
}
</script>

<style lang="scss" scoped>

</style>
