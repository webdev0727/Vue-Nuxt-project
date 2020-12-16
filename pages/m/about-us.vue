<template>
<div>
    <!-- header -->
    <div class="bg-white">
        <kuc-page-header :title="$t('about_us')"></kuc-page-header>
        <div class="px-2 border-bottom">
            <ku-tab-line :list='tab_items' :activeTab.sync="activeTab" :activeTabBarWidth=30 @change="handleTabChange"></ku-tab-line>
        </div>
    </div>
    <!-- content -->
    <div class="bg-white mt-2 p-2">
        <div v-html="gsv([activeTab, lang_key], abouts)" :key="key_content" class="v-html"></div>
    </div>
</div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import { getList } from "@/api/about"
export default {
    name: "About-Us",
    data() {
        return {
            isLoading: true,
            tab_items: [
                { id: 'about_us', name: this.$t('about_antway') },
                { id: 'contact_us', name: this.$t('contact_us') },
                { id: 'join_us', name: this.$t('about_join') },
                { id: 'terms', name: this.$t('about_term_condition') },
                // { id: 'privacy_policy', name: this.$t('about_term_condition') },
                // { id: 'help', name: this.$t('about_term_condition') }
            ],
            activeTab: 'about_us',
            key_content: "key_content"
        }
    },
    computed: {
        ...mapState('about', ['abouts']),
        lang_key: function () {
            return "pc_" + this.$i18n.locale
        }
    },
    methods: {
        ...mapActions('about', ['getAbout']),
        handleTabChange(active_tab_name) {
            if (!this.abouts[active_tab_name]) {
                this.getAbout(active_tab_name).then(() => {
                    this.key_content = +new Date()
                })
            }
        },

    },
    created() {
        if (!this.abouts.about_us) this.getAbout('about_us')
    }
}
</script>
