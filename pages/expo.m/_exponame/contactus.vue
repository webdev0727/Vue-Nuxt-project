<template>
<div class="rounded bg-white mt-2">
    <div class="ml-2 border-bottom">
        <ku-tab-line :list="[{'id': 'about', name: $t('contact_us')}]" activeTab="about" :activeTabBarWidth=50 activeTabBarColor="bg-blue-2" class="mr-2"></ku-tab-line>
    </div>
    <div class="p-2">
        <div v-html="gsv([expo_type, lang_key], expo_content)" :key="key_content"></div>
        <!-- <div class="info-container">
            <div class="d-flex my-2">
                <p class="text-nowrap mr-1 text-dark9">{{$t('country')+$t('region')}}: </p>
                <p> {{exhibition_contact_detail.a_province}}{{exhibition_contact_detail.a_city}} </p>
            </div>
            <div class="d-flex my-2">
                <p class="text-nowrap mr-1 text-dark9">{{$t('company')}}地址: </p>
                <p> {{exhibition_contact_detail.address}}</p>
            </div>
            <div class="d-flex my-2">
                <p class="text-nowrap mr-1 text-dark9">{{$t('postal_code')}}: </p>
                <p> {{exhibition_contact_detail.postal_code}}</p>
            </div>
            <div class="d-flex my-2">
                <p class="text-nowrap mr-1 text-dark9">{{$t('e_mail')}}: </p>
                <a :href="'mailto:'+exhibition_contact_detail.contact_email"> {{exhibition_contact_detail.contact_email}}</a>
            </div>
            <div class="d-flex my-2">
                <p class="text-nowrap mr-1 text-dark9">{{$t('contact')}}{{$t('phone')}}: </p>
                <a :href="'tel:'+exhibition_contact_detail.contact_phone"> {{exhibition_contact_detail.contact_phone}}</a>
            </div>
            <div class="d-flex my-2">
                <p class="text-nowrap mr-1 text-dark9">{{$t('fax')}}: </p>
                <p> {{exhibition_contact_detail.contact_fax}}</p>
            </div>
            <div class="d-flex my-2">
                <p class="text-nowrap mr-1 text-dark9">{{$t('company.www')}}: </p>
                <a :href="exhibition_contact_detail.website" target='_blank'> {{exhibition_contact_detail.website}}</a>
            </div>
        </div> -->
        <div class="">
            <client-only>
                <baidu-map :center="position" :zoom="zoom" style="height:40vw; max-height: 300px" :scroll-wheel-zoom='true'>
                    <bm-marker :position="position" animation="BMAP_ANIMATION_BOUNCE">
                    </bm-marker>
                </baidu-map>
            </client-only>
        </div>
    </div>
</div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
const expo_type = 57
// import company_detail from "@/json/company_detail.json"

export default {
    name: "ExhibitionAboutUs",
    layout: 'expo',
    components: {

    },
    data() {
        return {
            zoom: 13,
            key_content: "key_content",
            expo_type
        }
    },

    computed: {
        ...mapState('expo', ['expo_content']),
        lang_key: function () {
            return "pc_" + this.$i18n.locale
        },
        position: function () {
            var position = {
                "lng": 109.45744048529967,
                "lat": 36.49771311230842
            }
            if (this.expo_content['common']['lat'] && this.expo_content['common']['lng']) {
                position = {
                    lng: this.expo_content['common']['lng'],
                    lat: this.expo_content['common']['lat']
                }
            }
            return position
        }
    },
    methods: {
        ...mapActions('expo', ['getExpoContent', 'getExpoCommon']),
    },

    created() {
        const exponame = this.$route.params.exponame
        if (!this.expo_content[expo_type]) {
            this.getExpoContent({ exponame, expo_type }).then(() => {
                this.key_content = +new Date()
            })
        }
    }
}
</script>
