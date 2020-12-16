<template>
<div class="">
    <div class="bg-white p-2">
        <ProcessBar3 :status=5 :items='process_items' class="mb-2" />
        <h3>{{$t('expo.trade_follows')}}</h3>
        <div class="bg-light mt-1 p-2 text-center">
            <strong class="mb2">{{$t('expo.profile')}}</strong>
            <h2 class="my-2">{{gsv(['expo', 'name', $i18n.locale], seller_step.expo_applicant_seller)}}</h2>
            <h2 class="font-13" v-if="seller_step.expo_applicant_seller">{{$t('expo.no_')}}：{{seller_step.expo_applicant_seller.halls.join(', ') || ''}}</h2>
            <div class="text-dark9 mt-2">
                <p>{{$t('expo.area')}}：{{gsv(['areas'], seller_step.expo_applicant_seller)}}{{$t('m2')}}</p>
                <p>{{$t('expo.price')}}：<span class="text-danger">￥{{gsv(['amount'], seller_step.expo_applicant_seller)}}</span> </p>
            </div>
        </div>
        <div class="my-3">
            <div v-html="$t('msg.html_paied', [gsv(['total'], seller_step.expo_applicant_seller) || 'xx'])"></div>
            <div v-html="$t('msg.html_contact_info', [gsv(['admin', 'name'], seller_step.expo_applicant_seller), gsv(['admin', 'phone'], seller_step.expo_applicant_seller)])"></div>

        </div>
    </div>

    <ku-title-line class="px-2">{{$t('expo.info')}}</ku-title-line>
    <div class="bg-white px-2" v-if="seller_step.applicants">
        <div class="py-2 border-bottom" v-for="his in seller_step.applicants" :key="his.id">
            <h3>{{gsv(['expo', 'name', $i18n.locale], his)}}</h3>
            <div class="text-dark9 mt-2">
                <p>{{$t('expo.no_')}}：{{his.halls.join(', ')}}</p>
                <p>{{$t('expo.area')}}：{{his.areas || 0}}m<sup>2</sup> </p>
                <p>{{$t('price_total')}}：{{his.amount || his.total || 0}}元</p>
                <p>{{$t('expo.status')}}：{{getStatus(his)}}</p>
            </div>
        </div>
    </div>
    <no-data class="bg-white px-2" v-else></no-data>

</div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import ProcessBar3 from "@/components/ProcessBar3"
export default {
    scrollToTop: true,
    name: "Participate_New_Step5_Completed",
    components: { ProcessBar3 },
    data() {
        return {
            process_items: [this.$t('info.fill'), this.$t('investigation'), this.$t('expo.book'), this.$t('expo.pay'), this.$t('step.complete')],
        }
    },
    computed: {
        ...mapState('expo', ["seller_step"]),
    },
    methods: {
        ...mapActions('expo', ['getSellerStatus']),
        
        handleRoute(step = 5) {
            let path = "/my/sell/participate/"

            if (this.seller_step.status) path = path + "step" + (parseInt(this.seller_step.status) + 1)

            if (this.seller_step.status == step) {
                // this.initDa()
            } else {
                this.$router.replace({ path })
            }
        },
        getStatus(item){            
            let st = this.$t('step.pending')
            if([5,6].includes(item.status)) st = this.$t('step.complete')
            else if(item.admin_checked == 2) st = this.$t('status.failed')
            return st
        }
    },
    async mounted() {

        if (this.seller_step.status == undefined) {
            await this.getSellerStatus()
        }
        this.handleRoute()
    }
}
</script>
