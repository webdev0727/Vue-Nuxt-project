<template>
<div>
    <kuc-page-header :title="$t('company.pic')+'/'+$t('videos')" to="/my/sell"></kuc-page-header>
    <div class="">
        <div class="px-2 bg-white mb-2 border-bottom">
            <ku-tab-line :list='tab_items' :activeTab.sync="activeTab" @change="handleTabChange"></ku-tab-line>
        </div>
        <nuxt-child />
    </div>
</div>
</template>

<script>
export default {
    name: "CompanyFileLayout",
    middleware: ['authenticated', 'member_2'],
    head() {
        return {
            title: this.$t('company.pic')
        }
    },
    data() {
        return {
            tab_items: [
                { id: 'image', name: this.$t('company.pic') },
                { id: 'video', name: this.$t('company.video') }
            ],
            activeTab: 'image1',
        }
    },
    async asyncData({ params, route }) {
        const router_name = route.name
        var activeTab = 'image'
        switch (router_name) {
            case 'my-sell-company_file-video':
                activeTab = 'video'
                break;
            default:
                activeTab = 'image'
                break;
        }
        return {
            activeTab,
        }
    },
    computed: {},
    methods: {
        handleTabChange(active_tab_name) {
            this.$router.push({ path: '/my/sell/company_file/' + active_tab_name })
        },
    },
    created() {}
}
</script>