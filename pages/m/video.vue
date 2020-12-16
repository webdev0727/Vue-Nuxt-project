<template>
<div>
    <kuc-page-header :title="$t('video.center')" to="/"></kuc-page-header>
    <div class="px-2 bg-white mb-2 border-bottom">
        <ku-tab-line :list='tab_items' :activeTab.sync="activeTab" :activeTabBarWidth=30 :tabPadding=15 @change="handleTabChange"></ku-tab-line>
    </div>
    <div class="bg-white p-2">
        <div class="card-container-2col mt-1">
            <div v-for="item in list" :key="item.id">
                <card-video-c :title="gsv(['description', $i18n.locale], item)" subTitle="" :poster="item.poster" @click="handleVideoPlay(item)"></card-video-c>
            </div>
        </div>
        <infinite-loading spinner="spiral" :identifier='infiniteId' @infinite="handleInfinite" class="m-3"> </infinite-loading>
    </div>
    <client-only>
        <light-box ref="lightbox" :showLightBox='false' :media="media" :showThumbs='false' :disableScroll='false' :key="video_key"></light-box>
    </client-only>
</div>
</template>

<script>
import { getVideo } from "@/api/video"
export default {
    name: 'VideoLayout',
    head() {
        return {
            title: this.$t('video.center')
        }
    },
    data() {
        return {
            tab_items: [{
                    id: "recommend",
                    name: this.$t('recomm')
                },
                {
                    id: "company",
                    name: this.$t('enterprise')
                },
                {
                    id: "product",
                    name: this.$t('product')
                },
                {
                    id: "expo",
                    name: this.$t('expo.i')
                },
                {
                    id: "activity",
                    name: this.$t('event.i')
                },
                {
                    id: "etc",
                    name: this.$t('etc')
                },
            ],
            activeTab: 'recommend',
            video_key: "video_key",
            media: [{
                sources: [{
                    src: "",
                    type: ''
                }],
                type: 'video',
                width: '100%',
                height: 'auto',
                autoplay: true
            }],
            infiniteId: 1,
            list: [],
            total: 0,
            listQuery: {
                page: 1,
                limit: 10
            },
        }
    },
    methods: {
        handleInfinite($state) {            
            getVideo(this.activeTab, this.listQuery).then(res => {
                if (res.items.length) {
                    this.listQuery.page += 1;
                    this.list.push(...res.items)
                    this.total = res.total
                    $state.loaded()
                    if (this.list.length >= this.total) {
                        $state.complete();
                    }
                } else {
                    $state.complete();
                }
            })
        },
        handleTabChange(activeTab) {
            this.list = []
            this.total = 0,
            this.listQuery.page = 1
            this.infiniteId += 1;
        },
        handleVideoPlay(item) {
            this.media[0]['sources'][0]["src"] = item['url']
            this.media[0]['sources'][0]["type"] = item['content_type']
            this.video_key = +new Date()
            setTimeout(() => {
                this.$refs.lightbox.showImage(0)
            }, 100)
        },
    },
    created(){
        // this.getList()
    }
}
</script>