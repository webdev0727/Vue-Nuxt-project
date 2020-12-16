<template>
<div>
    <kuc-page-header :title="$t('expo.manage')" to="/my/sell"></kuc-page-header>
    <div class="mt-1">
        <div class="bg-white px-2">            
            <el-select v-model="activeExpo" placeholder="" class="w-100" @change="handleExpo">
                <el-option v-for="item in my_expo_list" :key="item.id" :label="gsv([$i18n.locale], item.expo_name)" :value="item.expo_id"></el-option>
            </el-select>
            <ku-line />

            <el-select v-model="activeTabName" placeholder="" class="w-100" @change="handleTabChange" :disabled="!my_expo_office_id">
                <el-option v-for="item in tab_items" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
            <ku-line />

        </div>
        <nuxt-child />
    </div>
</div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
export default {
    middleware: 'authenticated',
    name: "ExpoDutyMngLayout",
    head() {
        return {
            title: this.$t('expo.manage')
        }
    },
    data() {
        return {
            tab_items: [
                { id: "index", name: this.$t('expo.m_badge_apply') },
                { id: "construct", name: this.$t('expo.m_construct') },
                { id: "tool", name: this.$t('expo.m_tool') },
                { id: "power", name: this.$t('expo.m_water_power') },
                { id: "fascia", name: this.$t('expo.m_fascia') },
                { id: "j_info", name: this.$t('expo.m_j_info') },
                { id: "special", name: this.$t('expo.m_special') },
                { id: "ads", name: this.$t('expo.m_ads') },
                { id: "end", name: this.$t('expo.m_end') },
            ],
            activeTabName: 'index',
            // activeExpo: ""
        }
    },
    async asyncData({ params, route }) {
        const router_name = route.name
        let kkk = router_name.split("-")
        var activeTabName = 'index'
        if (kkk.length > 2) {
            activeTabName = kkk[2]
        }
        return {
            activeTabName,
        }
    },
    computed: {
        ...mapState('expo', ["my_expo_list", "my_expo_office_id"]),
        ...mapGetters('expo', ["expo_ids"]),
        activeExpo: {
            get() {
                return this.$store.state.expo.my_expo_office_id;
            },
            set(value) {
                this.$store.dispatch('expo/setExpoId', value);
            },
        },
    },
    methods: {
        ...mapActions('expo', ['getMyExpoList']),
        handleTabChange(active_tab_name) {
            // console.log(active_tab_name)
            if (active_tab_name == "index") active_tab_name = ''
            this.$router.push({ path: `/expo_duty/${active_tab_name}` })
            // this.$router.push({ path: `/expo_duty/${active_tab_name}`, query: { id: this.activeExpo } })
        },
        handleExpo(active_expo) {
            // this.$router.push({ query: { id: active_expo } })
        },
        handleRedirect() {
            let path = this.$route.path
            let query = { id: this.my_expo_office_id }
            if (this.$route.query['id']) {
                let iid = parseInt(this.$route.query['id'])
                if (this.expo_ids.includes(iid)) {
                    query = this.$route.query
                    this.$store.commit('expo/SET_EXPO_OFFICE_ID', iid);
                }
            }
            console.log(path, query, this.my_expo_office_id)
            this.$router.push({ path, query })
        }
    },
    mounted() {
        if (!this.my_expo_list.length) {
            this.getMyExpoList()
        }
    }
}
</script>
