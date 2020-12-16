<template>
<div class="bg-white mt-2">
    <div class="px-2">
        <ku-tab-line v-if="menu_exhibitor.length" :list='menu_exhibitor' :activeTab.sync="activeTab" :activeTabBarWidth=40 activeTabBarColor="bg-blue-2" _key='category_id' @change="handleTabChange" class="border-bottom"></ku-tab-line>
    </div>
    <div class="p-2">
        <div v-html="gsv([activeTab, lang_key], expo_content)" :key="key_content" style="overflow-x: auto" class="v-html"></div>
        <div v-if="url_external">
            <div class="p-4">
                <div class="bg-blue-2 btn-sm border p-2 text-center text-white" @click="goExternal">
                    {{btn_name}}
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
export default {
    name: "Expo_Exhibitor",
    layout: 'expo',
    data() {
        return {
            // tab_items: [
            //     { id: 'expo_overview', name: this.$t('expo.about') },
            //     { id: 'seller_notice', name: this.$t('expo.notice') },
            //     { id: 'expo_signup', name: this.$t('expo.book_booth') },
            //     { id: 'charge', name: this.$t('expo.booth_charge') },
            //     { id: 'pavilion_distribution', name: this.$t('expo.hall_distribution') },
            //     { id: 'special_construction', name: this.$t('expo.booth_decoration') },
            //     { id: 'expo_login', name: this.$t('expo.sign_in') },
            //     { id: 'seller_terms', name: this.$t('expo.terms') },
            // ],
            activeTab: "",
            key_content: "key_content",
            url_external: null,
            btn_name: this.$t('btn.apply')
        }
    },
    computed: {
        ...mapState(['lang']),
        ...mapState('expo', ['expo_content']),
        ...mapGetters('expo', ['menu_exhibitor']),
        lang_key: function () {
            return "pc_" + this.$i18n.locale
        }
    },
    methods: {
        ...mapActions('expo', ['getExpoContent']),
        getContent(activeTab) {
            const cate_info = this.menu_exhibitor.find(rr => rr.category_id == activeTab)

            if (this.isExternal(cate_info.url_m)) {
                console.log(cate_info.url_m)
                this.url_external = cate_info.url_m
                if (cate_info.id == 80)
                    this.btn_name = this.$t('want.expo')
                else
                    this.btn_name = this.gsv(['name', this.$i18n.locale], cate_info)
            }
            const exponame = this.$route.params.exponame
            if (!this.expo_content || !this.expo_content[activeTab]) {
                this.getExpoContent({ exponame, expo_type: activeTab }).then(() => {
                    this.key_content = +new Date()
                })
            } else {
                this.key_content = +new Date()
            }

        },
        handleTabChange(activeTab) {
            this.url_external = null
            this.getContent(activeTab)
            if (this.$route.params.tab != activeTab) {
                history.replaceState({}, null, `/${this.$route.params.exponame}/content/${activeTab}`)
            }
        },
        goExternal() {
            window.open(this.url_external, '_blank')
        }

    },
    created() {
        this.activeTab = this.$route.params.tab || ''
        if (this.menu_exhibitor.length) {
            this.activeTab = this.menu_exhibitor[0]['category_id']
            this.getContent(this.activeTab)
        }
    },
    watch: {
        menu_exhibitor(to) {
            if (to) {
                const cate_id = to[0]['category_id']
                this.getContent(cate_id)
            }
        },
    }
}
</script>
