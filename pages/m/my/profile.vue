<template>
<div>
    <kuc-page-header :title="$t('info.my')" to="/my">
        <!-- <nuxt-link to='/purchase/create' class="text-danger">{{$t('edit')}}</nuxt-link>         -->
    </kuc-page-header>
    <div class="px-2 bg-white border-bottom">
        <ku-tab-line :list='tab_items' :activeTab.sync="activeTab" @change="handleTabChange" :activeTabBarWidth=30></ku-tab-line>
    </div>   
    <nuxt-child class="mt-2"></nuxt-child>    
</div>
</template>

<script>

export default {
    middleware: 'authenticated',
    name: 'Layout_Profile',
    head() {
        return{
            title: this.$t('info.my')      
        }
    },
    data() {
        return {            
            tab_items: [
                {id: "index", name: this.$t('info.my')},
                {id: "pass", name: this.$t('recover.pass')}
            ],
            activeTab: 'index',
        }
    },    
    async asyncData({ params, route, redirect }) {        
        const router_name = route.name
        let kkk = router_name.split("-")
        var activeTab = 'index'
        if (kkk.length > 3) {
            activeTab = kkk[3]
        }
        return {
            activeTab,
        }
    },
    computed: {},
    methods: {        
        handleTabChange(activeTab) {
            if (activeTab=='index') activeTab= ''
            this.$router.push({ path: `/my/writer/${activeTab}`})
        },
    },
}
</script>