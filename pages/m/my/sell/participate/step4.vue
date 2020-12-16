<template>
<div class="bg-white p-2">

    <ProcessBar3 v-if="$store.state.auth.company.count_expos" :status=4 :items="[$t('info.fill'), $t('investigation'), $t('expo.book'), $t('submit.success')]" class="mb-2" />

    <ProcessBar3 v-else :status=3 :items="[$t('info.fill'), $t('investigation'), $t('submit.success')]" class="mb-2" />

    <div class="text-center">
        <SuccessIcon />
        <div class="text-dark9 text-center">
            <h2 class="px-3 text-dark28 mb-3">{{$t('msg.submit_success')}}</h2>
            <p>{{$t('msg.will_contact_soon')}}</p>
            <p>{{$t('msg.thanks_antway')}}</p>

            <p class="mt-4">{{$t('msg.contact_procedure')}}</p>
            <p>{{$t('msg.contact_address')}}</p>
            <p>{{$t('tel:')}}+86-574-87254009</p>
            <p>{{$t('fax')}}：+86-574-87254017</p>
        </div>
        <div class="my-3">
            <img src="/files/qr.png" alt="" width="180" @click="handleTemp">
        </div>
    </div>

</div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import SuccessIcon from "@/components/successIcon"
import ProcessBar3 from "@/components/ProcessBar3"

export default {
    scrollToTop: true,
    name: "Participate_New_Step3_Wait",
    components: { ProcessBar3, SuccessIcon },
    data() {
        return {}
    },

    computed: {
        ...mapState('expo', ["seller_step"]),
    },
    methods: {
        ...mapActions('expo', ['getSellerStatus']),
        async handleTemp() {
            await this.getSellerStatus()
            this.$router.push({ path: '/my/sell/participate/step3' })
        },

        handleRoute(step = 3) {
            let path = "/my/sell/participate/"

            if (this.seller_step.status) path = path + "step" + (parseInt(this.seller_step.status) + 1)

            if (this.seller_step.status == step) {
                // this.initDa()
            } else {
                this.$router.replace({ path })
            }
        },
    },
    async mounted() {

        if (this.seller_step.status == undefined) {
            await this.getSellerStatus()
        }
        this.handleRoute()
    }
}
</script>
