<template>
<div>
    <kuc-page-header :title="$t('want.expo')" to="/my/sell"></kuc-page-header>
    <div class="px-2 bg-white mb-2 border-bottom">
        <ku-tab-line :list='tab_items' :activeTab.sync="activeTabName" @change="handleTabChange"></ku-tab-line>
    </div>
    <nuxt-child />

</div>
</template>

<script>
// import { getStep } from "@/api/expo"
export default {
    middleware: ['authenticated'],
    name: "ParticipateLayout",
    components: {},
    head(){
        return {
            title: this.$t('want.expo')
        }
    },
    data() {
        return {
            tab_items: [
                { id: 'new', name: this.$t('expo.apply') },
                { id: 'history', name: this.$t('expo.pre') },
                { id: 'completed', name: this.$t('expo.done') },
            ],
            activeTabName: 'new',
        }
    },
    computed: {},
    methods: {
        // handelRouterWithStatus() {
        //     getStep().then(res => {
        //         let path = "/my/sell/participate/"
        //         switch (res.status) {
        //             case -1:
        //                 break;
        //             case 1:
        //                 path = "/my/sell/participate/" + "step2"
        //                 break;
        //             case 2:
        //                 path = "/my/sell/participate/" + "step3"
        //                 break;
        //             case 3:
        //                 path = "/my/sell/participate/" + "step4"
        //                 break;
        //             default:                        
        //                 break;
        //         }
        //         this.$router.push({ path })
        //     })
        // },
        handleTabChange(active_tab_name) {
            console.log(active_tab_name)
            if (active_tab_name == 'new') {
                // this.handelRouterWithStatus()
                this.$router.push({ path: '/my/sell/participate/'})
            } else {
                this.$router.push({ path: '/my/sell/participate/' + active_tab_name })
            }
        },
    },
    mounted() {
        switch (this.$route.name) {
            case 'm-my-sell-participate-history':
                this.activeTabName = 'history'
                break;
            case 'm-my-sell-participate-completed':
                this.activeTabName = 'completed'
                break;
            default:
                // this.handleTabChange('new')
        }
    }
}
</script>
