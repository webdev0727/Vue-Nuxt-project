<template>
<div class="bg-white rounded mt-2">
    网上交易会
</div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'

import { product_news, discovery } from '@/api/common'

export default {
    name: "ExhibitionOnlineFair",
    layout: 'expo',
    components: {},
    data() {
        return {
            keyword: '',
            RoomActiveTab: 'room',
            office_recomm: [],
        }
    },
    computed: {},
    methods: {}
}
</script>

<style lang="scss" scoped>
.drop-title {
    padding: 0.7rem 0;
}
</style>
