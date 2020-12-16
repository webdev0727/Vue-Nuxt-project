<template>
<div>
    <kuc-page-header :title="$t('comment.my')" to="/my"></kuc-page-header>
    <div class="px-2 bg-white border-bottom">
        <ku-tab-line :list='tab_items' :activeTab.sync="activeTab" @change="handleTabChange" :activeTabBarWidth=30></ku-tab-line>
    </div>
    <div class="mt-2 bg-white min-vh-100 px-2 pt-2">
        <nuxt-child></nuxt-child>
    </div>
</div>
</template>

<script>
export default {
    middleware: 'authenticated',
    name: 'Layout_Comment',
    head() {
        return{
            title: this.$t('comment.my')      
        }
    },
    data() {
        return {
            tab_items: [
                { id: 'headline', name: this.$t('headline') },
                { id: 'discovery', name: this.$t('discovery') },
                { id: 'products', name: this.$t('products') },
            ],
            activeTab: 'headline',
        }
    },
    async asyncData({ params, route, redirect }) {
        const router_name = route.name
        let kkk = router_name.split("-")
        var activeTab = 'headline'
        if (kkk.length > 3) {
            activeTab = kkk[3]
        } else {
            redirect('/my/comment/headline')
        }
        return {
            activeTab,
        }
    },
    computed: {},
    methods: {
        handleTabChange(activeTab) {
            this.$router.push({ path: `/my/comment/${activeTab}` })
        },
    },
}
</script>

<style>

</style>
