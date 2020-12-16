<template>
<div class="bg-white p-2">
    <div class="card-container-2col mt-1">
        <div v-for="vi in video" :key="vi.id">
            <card-video-c :title="vi.title" subTitle="" :poster="vi.poster" @click="handleVideoPlay(vi)"></card-video-c>
        </div>
    </div>
    <!-- <client-only>
        <light-box ref="lightbox" :showLightBox='false' :media="media" :disableScroll='false' class="ku-no-thumb-bar" :key = 'video_key'></light-box>
    </client-only> -->
    <client-only>
        <light-box ref="lightbox" :showLightBox='false' :media="media" :showThumbs='false' :disableScroll='false' :key="video_key"></light-box>
    </client-only>
</div>
</template>

<script>
export default {
    name: 'VideoRecommended',
    components: {},
    data() {
        return {
            video_key: "dd",
            video: [{
                    "id": 1,
                    "title": "一年一度的文具业界盛事，立足全球文具制造和贸易中心",
                    content_type: "video/mp4",
                    poster: "http://antway.oss-cn-hangzhou.aliyuncs.com/product/5f3ff3c4a1fff.png",
                    url: "http://antway.oss-cn-hangzhou.aliyuncs.com/company/5f3ff398ed421.mp4"

                },
                {
                    "id": 2,
                    "title": "一年一度的文具业界盛事，立足全球文具制造和贸易中心",
                    content_type: "video/mp4",
                    poster: "https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2058354034,4205898833&fm=26&gp=0.jpg",
                    url: "http://antway.oss-cn-hangzhou.aliyuncs.com/company/5f3ff274cf7ff.mp4"

                },
                {
                    "id": 3,
                    "title": "一年一度的文具业界盛事，立足全球文具制造和贸易中心",
                    content_type: "video/mp4",
                    poster: "https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=1488247720,2735220221&fm=15&gp=0.jpg",
                    url: "http://antway.oss-cn-hangzhou.aliyuncs.com/company/5f185d03cff75.mp4"

                },
                {
                    "id": 4,
                    "title": "一年一度的文具业界盛事，立足全球文具制造和贸易中心",
                    content_type: "video/mp4",
                    poster: "//g-search3.alicdn.com/img/bao/uploaded/i4/i3/638681994/O1CN01XFCdPW1QbILeKiSOw_!!638681994.jpg",
                    url: "http://antway.oss-cn-hangzhou.aliyuncs.com/company/5f3ff56ade6a2.mp4"

                },
                {
                    "id": 5,
                    "title": "一年一度的文具业界盛事，立足全球文具制造和贸易中心",
                    content_type: "video/mp4",
                    "poster": "https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=2450899924,55934102&fm=15&gp=0.jpg",
                    "url": "https://media.vued.vanthink.cn/sparkle_your_name_am720p.mp4",
                    "created_at": "2020.05.18"
                },
                {
                    "id": 6,
                    "title": "一年一度的文具业界盛事，立足全球文具制造和贸易中心",
                    content_type: "video/webm",
                    "poster": "https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2210503800,2303444037&fm=26&gp=0.jpg",
                    "url": "https://cdn.theguardian.tv/webM/2015/07/20/150716YesMen_synd_768k_vp8.webm",
                    "created_at": "2020.05.18"
                },

            ],
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
    methods: {
        handleTabChange() {

        },
        handleVideoPlay(item) {
            this.media[0]['sources'][0]["src"] = item['url']
            this.media[0]['sources'][0]["type"] = item['content_type']
            this.video_key = +new Date()
            setTimeout(() => {
                this.$refs.lightbox.showImage(0)
            }, 100)
        },
    }
}
</script>

<style lang="scss" scoped>

</style>
