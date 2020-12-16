<template>
<div>
    <div class="bg-white p-2">        
        <div v-for="item in list.items" :key='item.id'>
            <card-video-r :id='item.id' :poster="item.url" :title="item.name" :bigIMG="false" :showPlayIcon="false" @delete="handleDelete">
                <strong slot="subTitle" class="text-danger font-09 mb-1">Treasure</strong>
            </card-video-r>
        </div>
        <ku-loading-no-data :active="is_loading" :total="list.total" />
    </div>
</div>
</template>

<script>
import { getCollection } from "~/api/user"
export default {
    scrollToTop: true,
    name: 'Collection_Treasure',
    components: {},
    data() {
        return {
            is_loading:false,
            list: {
                items: [],
                total: 0
            },
            listQuery: {
                page: 1,
                keyword: ''
            },
            activeTabName: 'all',
        }
    },
    // async asyncData({ params }) {
    //     const all_infos = await getCollection(params)
    //     return {
    //         list: all_infos,
    //     }
    // },
    methods: {
        handleDelete() {

        },
        handleJoin(id) {

        },
        // getIsDissable(endTime) {
        //     let cur_time = +new Date() / 1000
        //     if (cur_time > endTime) return true
        //     return false
        // }
    }
}
</script>

<style>

</style>
