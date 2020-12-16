<template>
<div class="bg-white p-2">
    <div class="mt-2" v-for="(item, ind) in list" :key="item.id">
        <h3>{{gsv([$i18n.locale], item.expo.name)}}</h3>
        <div class="text-dark9 py-2">
            <p>{{$t('expo.no_')}}：{{hallIds(item.halls)}}</p>
            <p>{{$t('expo.area')}}：{{item.areas || 0}}m<sup>2</sup></p>
            <p>{{$t('price_total')}}：{{item.amount || item.total || 0}}元</p>
            <p>{{$t('expo.status')}}：{{getStatus(item)}}</p>
        </div>
        <ku-line v-if="ind<(list.length-1)"></ku-line>
    </div>

    <ku-loading-no-data :active="isLoading" :total="list.length" />

</div>
</template>

<script>
import { myExpo } from "@/api/expo"
export default {
    name: "Participate_Complete",
    components: {},
    data() {
        return {
            isLoading: true,
            list: []
        }
    },
    computed: {},
    methods: {
        hallIds(halls) {
            let hall_ids = []
            if (halls) {
                halls.forEach(element => {
                    const nnn = typeof element == 'object' ? this.gsv([this.$i18n.locale], element) : element
                    hall_ids.push(nnn)
                });
            }
            return hall_ids.join(', ')
        },
        getStatus(item){            
            let st = this.$t('step.pending')
            if([5,6].includes(item.status)) st = this.$t('step.complete')
            else if(item.admin_checked == 2) st = this.$t('status.failed')
            return st
        }
    },
    mounted() {
        myExpo().then(res => {
            this.list = res.expo_applicant_sellers
        }).finally(() => {
            this.isLoading = false
        })
    }
}
</script>
