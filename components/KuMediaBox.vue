<template>
<div>
    <img :src="assets[ind-1]['url']" alt=" " width="50" height="50" class="rounded mr-2" v-for="ind in r_limit" :key="ind" @click="handlePictureView(ind-1)">

    <client-only>
        <light-box ref="lightbox" :showLightBox='false' :media="media" :showThumbs='false' :disableScroll='false' :key="show_key"></light-box>
    </client-only>
</div>
</template>

<script>
export default {
    name: "KuMediaBox",
    props: {
        assets: {
            type: [Array],
            default: []
        },
        limit: {
            type: Number,
            default: 0
        }
    },
    computed: {        
    },
    data() {
        return {
            r_limit: this.limit || this.assets.length,
            media: [{}],
            show_key: "show_key"
        }
    },
    methods: {
        handlePictureView(ind) {
            let mmm = []           
            for (let index = 0; index < this.r_limit; index++) {
                const el = this.assets[index];
                mmm.push({ src: el.url })
            }
            this.media = mmm
            this.show_key = +new Date()
            setTimeout(() => {
                this.$refs.lightbox.showImage(ind)
            }, 100)
        }
    },
}
</script>
