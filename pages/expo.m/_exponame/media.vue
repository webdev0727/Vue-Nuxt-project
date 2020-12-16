<template>
<div>
    <div class="bg-white rounded mt-2">
        <div class="ml-2 border-bottom">
            <ku-tab-line :list='tab_items' :activeTab.sync="activeTab" :activeTabBarWidth=40 activeTabBarColor="bg-blue-2" @change="handleTabChange" class="mr-2"></ku-tab-line>
        </div>
        <div class="p-2">            
            <nuxt-child></nuxt-child>
        </div>

    </div>
</div>
</template>

<script>

export default {
    name: "ExhibitionMediaLayout",
    layout: 'expo',
    components: {},
    data() {
        return {
            activeTab: "expo_news",
        }
    },
    computed: {
        tab_items: function () {
            return [
                { id: 'expo_news', name: this.$t('expo.news') },
                { id: 'company_news', name: this.$t('expo.company_news') },
                { id: 'cooperative', name: this.$t('expo.co_media') },
            ]
        },        
    },
    async asyncData({ params, route, redirect }) {        
        let kkk = route.path.split("/").filter(rr=>rr)
        console.log(kkk)
        var activeTab = 'expo_news'
        if (kkk.length > 2) {
            activeTab = kkk[2]
        }
        return {
            activeTab
        }
    },
    methods: {        
        handleTabChange(activeTab) {                       
            const path = `/${this.$route.params.exponame}/media/${activeTab}`
            this.$router.replace({path})
        },
    },  
}
</script>

