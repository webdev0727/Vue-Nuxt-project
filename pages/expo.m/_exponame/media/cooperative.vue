<template>
<div v-if="expo_content['cooperative']" class="card-container-2col">
    <div class="mb-2 border d-flex align-items-center" v-for="item in expo_content['cooperative']" :key="item.id">
        <a class="p-2  d-block" :href="item.redirect_url" target="_blank">
            <img :src="item.url" alt=" " class="mw-100" style="max-height: 5rem;">
        </a>
        <!-- <p>{{gsv([$i18n.locale], item.description)}}</p> -->
    </div>
</div>
</template>

<script>
import {
    mapState,
    mapActions,
    mapGetters
} from 'vuex'

export default {
    name: "Expo-Media-Coop",
    data() {
        return {
            key_content: ''
        }
    },
    computed: {
        ...mapState('expo', ['expo_content']),
        expo_id: function () {
            return this.expo_content['common']['id']
        }
    },
    methods: {
        ...mapActions('expo', ['getExpoContent', 'getExpoInfoById', 'getExpoCommon']),
        getCoop() {
            const exponame = this.$route.params.exponame
            const expoid = this.expo_id
            if (expoid) {
                this.getExpoInfoById({
                    exponame,
                    expoid,
                    type: 'cooperative'
                }).then(() => {
                    this.key_content = +new Date()
                })
            }
        },
    },
    mounted(){
        this.getCoop()
    },
    watch: {        
        expo_id(to, from) {
            if (to) {
                this.getCoop()
            }
        }
    },
}
</script>
