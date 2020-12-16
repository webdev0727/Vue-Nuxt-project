<template>
<div>
    <kuc-page-header :title="$t('info.company')" to="/my/sell"></kuc-page-header>
    <div class="px-2 bg-white mb-2 border-bottom">
        <ku-tab-line :list='tab_items' :activeTab.sync="activeTab" @change="handleTabChange"></ku-tab-line>
    </div>
    <el-alert v-if="company_status" :title="$t(company_status)" type="warning" show-icon ></el-alert>
    <nuxt-child />
</div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
export default {
    name: "CompanyInfomationLayout",
    middleware: ['authenticated', 'member_2'],
    head() {
        return {
            title: this.$t('info.company')
        }
    },
    data() {
        return {
            tab_items: [
                { id: 'index', name: this.$t('info.basic') },
                { id: 'detail', name: this.$t('company.detail') },
                { id: 'vip', name: this.$t('member.vip_assign') },
            ],
            activeTab: "index",
        }
    },
    async asyncData({ params, route, redirect }) {
        const router_name = route.name
        let kkk = router_name.split("-")
        var activeTab = 'index'
        if (kkk.length > 4) {
            activeTab = kkk[4]
        }
        return {
            activeTab,
        }
    },
    computed: {  
        ...mapGetters(['company_status'])      
    },
    methods: {
        handleTabChange(activeTab) {
            if (activeTab == 'index') activeTab = ''
            this.$router.push({ path: `/my/sell/company_info/${activeTab}` })
        },
    },
    mounted() {
        console.log('slsl')
    }
}
</script>
