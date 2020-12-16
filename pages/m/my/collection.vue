<template>
<div>
    <kuc-page-header :title="$t('collect_and_follow')" to="/my">
    </kuc-page-header>
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
    name: 'Layout_Collection',
    head() {
        return{
            title: this.$t('collect_and_follow')      
        }
    },
    data() {
        return {
            tab_items: [
                { id: 'company', name:  this.$t('enterprise')},
                { id: 'product', name: this.$t('products')},
                { id: 'headline', name:  this.$t('headline')},
                { id: 'author', name: this.$t('author') },
                { id: 'discovery', name:  this.$t('discovery')},
                { id: 'treasure', name: this.$t('purchase') },
                { id: 'event', name:  this.$t('event.i')},
                { id: 'video', name: this.$t('video')},
            ],
            activeTab: 'company',
        }
    },
    async asyncData({ params, route, redirect }) {        
        const router_name = route.name
        let kkk = router_name.split("-")
        var activeTab = 'company'
        if (kkk.length > 3) {
            activeTab = kkk[3]
        }else{
            redirect(`/my/collection/company`)
        }
        return {
            activeTab,
        }
    },
    computed: {},
    methods: {        
        handleTabChange(activeTab) {
            this.$router.push({ path: `/my/collection/${activeTab}`})
        },
    },
}
</script>

<style>

</style>
