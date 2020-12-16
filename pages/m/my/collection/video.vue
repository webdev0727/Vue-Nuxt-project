<template>
<div class="bg-white p-2">
    <div v-for="item in list.items" :key='item.id'>
        <card-video-r :id='item.id' :poster="item.url" :title="item.name" @delete="handleDelete" @show="handleVideoPlay">
            <span slot="subTitle" class="text-dark9 font-09 mb-1">12:25</span>
        </card-video-r>
    </div>
    <ku-loading-no-data :active="is_loading" :total="list.total" />
    <client-only>
        <light-box ref="lightbox" :showLightBox='false' :media="media" :disableScroll='false' class="ku-no-thumb-bar"></light-box>
    </client-only>
</div>
</template>

<script>
import { getCollection } from "~/api/user"
export default {
    scrollToTop: true,
    name: 'Collection_Video',
    components: {},
    data() {
        return {
            is_loading: false,
            list: {
                items: [],
                total: 0
            },
            listQuery: {
                page: 1,
                keyword: ''
            },
            activeTabName: 'all',
            media: [{
                thumb: "https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=894098678,72275648&fm=15&gp=0.jpg",
                sources: [{
                    src: "https://cdn.theguardian.tv/webM/2015/07/20/150716YesMen_synd_768k_vp8.webm",
                    type: 'video/webm'
                }],
                type: 'video',
                width: '100%',
                height: 'auto',
                autoplay: true
            }]
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
        handleVideoPlay(id) {
            this.$refs.lightbox.showImage(0)
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
