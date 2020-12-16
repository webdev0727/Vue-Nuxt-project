<template>
<div class="container">
    <div style="margin-bottom: 5rem">
        <!-- Top part -->
        <div class="bg-blue-2 bg-container">
            <div class="d-flex justify-content-between align-items-center p-2">
                <div @click="goHome" class="ku-ant-logo">
                    <img :src="gsv(['common', lang_key, 'url'], expo_content) || ''" class="ku-ant-logo" />
                </div>
                <header-menu></header-menu>
            </div>
        </div>
        <div class="bg-blue-2 px-2">
            <ku-tab-line :list="tab_items" :activeTab.sync="activeTab" :activeTabBarWidth="30" activeTabBarColor="bg-white" @change="handleTabChange" class="text-white" bigFont></ku-tab-line>
        </div>
        <nuxt />
    </div>
    <loading :active.sync="isRootLoading" color="#F15A24"></loading>
    <Footer />
</div>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
import Footer from "~/components/Footer.vue";
import Loading from "vue-loading-overlay";
import HeaderMenu from "~/components/HeaderMenu.vue";

export default {
    name: "ExpoLayout",
    components: { Footer, Loading, HeaderMenu },
    data() {
        return {
            activeTab: "home",
        };
    },
    // async asyncData({ params, route, store }) {
    //     let route_name_arr = route.name.split("-")
    //     var activeTab = 'home'
    //     if (route_name_arr.length > 1) {
    //         activeTab = route_name_arr[1]
    //     }
    //     let exponame = params.exponame || 'cnise'

    //     await store.dispatch('expo/getExpoCommon', exponame)
    //     await store.dispatch('expo/getBanner', exponame)
    //     await store.dispatch('expo/getMenu', exponame)
    //     return {
    //         activeTab
    //     }

    // },
    computed: {
        ...mapState(["lang"]),
        ...mapState("expo", ["menu", "expo_content"]),
        ...mapState("common", ["isRootLoading"]),
        lang_key: function () {
            return "logo_mobile_" + this.$i18n.locale;
        },
        tab_items: function () {
            let menus = [
                { id: "home", name: this.$t("homepage") },
                { id: "content", name: this.$t("expo.m") },
                { id: "visitor", name: this.$t("visitor") },
                { id: "media", name: this.$t("media") },
                { id: "venue", name: this.$t("venue") },
                { id: "online", name: this.$t("expo.online") },
                { id: "contactus", name: this.$t("contact_us") },
            ];
            if (this.menu.length) {
                for (let index = 0; index < this.menu.length; index++) {
                    const element = this.menu[index];
                    if (element.id == 61) {
                        menus[1] = { id: "content", name: element.name };
                    } else if (element.id == 86) {
                        menus[2] = { id: "visitor", name: element.name };
                    }
                }
            }
            return menus;
        },
    },
    methods: {
        ...mapActions("expo", ["getMenu", "getExpoCommon"]),
        goHome() {
            location.replace(process.env.M_URL);
        },
        handleTabChange(activeTab) {
            if (activeTab == "home") activeTab = "";
            if (activeTab == "online") this.goHome();
            else
                this.$router.push({
                    path: `/${this.$route.params.exponame}/${activeTab}`,
                });
        },
    },
    watch: {        
        "$route.path"(to, from) {
            if (to == this.activeTab) return false;
            let kkk = to.split("/").filter((rr) => rr);
            var activeTab = "home";
            if (kkk.length > 1) {
                activeTab = kkk[1];
            }
            this.activeTab = activeTab;
        },
    },
    async mounted() {
        let exponame = this.$route.params.exponame || "cnise";
        const router_name = this.$route.path;
        let kkk = router_name.split("/").filter((rr) => rr);
        var activeTab = "home";
        if (kkk.length > 1) {
            activeTab = kkk[1];
        }
        this.activeTab = activeTab;
        await this.$store.dispatch("expo/getExpoCommon", exponame);
        await this.$store.dispatch("expo/getBanner", exponame);
        await this.$store.dispatch("expo/getMenu", exponame);
    },
};
</script>
