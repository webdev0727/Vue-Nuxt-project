<template>
<div class="bg-white p-3 min-vh-100">

    <ProcessBar3 :status=4 :items='process_items' />

    <div class="text-center">
        <div class="my-3 container-buyer-card">
            <img :src="step_buyer.card_url" alt="" class="w-100">
            <div class="bar-content">
                <p class="pb-1 text-glow">{{$t('company')}}: {{gsv(['company'], step_buyer.expo_applicant_buyer)}}</p>
                <p class="pb-2 text-glow">{{$t('name')}}: {{gsv(['name'], step_buyer.expo_applicant_buyer)}}</p>
                <img :src="step_buyer.card_qr" alt="" class="buyer-qr">
                <img :src="step_buyer.card_bar" alt="" class="buyer-bar w-100 mt-3" style="max-height: 4rem">
                <p class="pt-2 text-glow">{{$t('sn1')}}: {{gsv(['cert_code'], step_buyer.expo_applicant_buyer)}}</p>
            </div>
        </div>        
        <div class="text-dark9 text-center">
            <h2 class="px-3 text-dark28 mb-3">{{$t('msg.print_register_info')}}</h2>
            <p>{{$t('msg.you_may_print')}}</p>
        </div>

        <h2 class="my-3">{{$t('msg.Apply_badge_for_your_Colleague')}}</h2>
        <div class="px-4 mb-5">
            <el-button type="primary" @click="goFriend" class="w-100" round>{{$t('btn.apply')}}</el-button>
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
    name: "BuyParticipate_Step4",
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
        goFriend(){
            this.$router.push({ path: '/my/buy/participate/card/' + this.step_buyer.expo_applicant_buyer.id})
        },
        // handleSubmit() {
        //     applyStep('buyer', 3, { expo_applicant_buyer_id: this.step_buyer.expo_applicant_buyer.id }).then(async (re) => {
        //         await this.getBuyerStatus(this.$route.params.id)
        //         this.$router.replace({ path: '/my/buy/participate' })
        //     })
        // }
    }
}
</script>
<style lang="scss" scoped>
    .container-buyer-card{
        position: relative;
    }
    .bar-content{
        position: absolute;
        top: 50%;
        width: 75%;
        left: 50%;
        transform: translate(-50%, -50%);  
        text-align: left;
    }
    .buyer-qr{
        width: 40%;
    }
    .text-glow{
        text-shadow: 0px 0px 3px white;
    }
</style>