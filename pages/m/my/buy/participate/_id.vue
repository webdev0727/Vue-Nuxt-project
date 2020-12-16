<template>
<div>
    <kuc-page-header :title="$t('want.visit')" class="mb-2" disabled @back="goToBack('/my/buy/participate')"></kuc-page-header>
    <nuxt-child></nuxt-child>
</div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
export default {
    middleware: 'authenticated',
    name: "BuyParticipate_Layout",
    head(){
        return {
            title: this.$t('want.visit')
        }
    },
    computed: {
        ...mapState('expo', ["step_buyer"]),
    },
    methods: {
        ...mapActions('expo', ['getBuyerStatus']),
        goToBack(path){
            localStorage.removeItem('mAntway_draft_buy')
            this.$router.push({path})
        },
        controlRoute(cur_route) {
            let path = '/my/buy/participate/' + this.$route.params.id + '/step1'
            switch (this.step_buyer.status) {
                case 0:
                    path = '/my/buy/participate/' + this.$route.params.id + '/step1'
                    break;
                case 1:
                    path = '/my/buy/participate/' + this.$route.params.id + '/step2'
                    break;
                case 2:
                    path = '/my/buy/participate/' + this.$route.params.id + '/step3'
                    break;
                case 3:
                    path = '/my/buy/participate/' + this.$route.params.id + '/step4'
                    break;
                case 4:
                    path = '/my/buy/participate/' + this.$route.params.id + '/step4'
                    break;
                default:
                    break;
            }
            if (cur_route.path != path)
                this.$router.replace({ path })
        }
    },    
    watch: {
        $route(to, from) {
            this.controlRoute(to)
        }
    },
    mounted() {
        this.getBuyerStatus(this.$route.params.id).then(() => {
            this.controlRoute(this.$route)
        })
    }
}
</script>