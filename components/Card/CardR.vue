<template>
<div class="card-container">
    <div class="d-flex py-2" :class="{'big-img': bigIMG}">
        <el-image v-if="!hasIMG" :src="poster" class="img-left" fit="cover" lazy>
            <div slot="error" class="image-slot">
                <img src="/images/ant404.png" alt="" class="w-100 fit-cover">
            </div>
        </el-image>
        <slot name="img"></slot>
        <div class="d-flex flex-column justify-content-between flex-1 pl-2">
            <h3 v-if="!hasTitle" :class="bigIMG ? 'text-line-2' : 'text-line-1'">{{title}}</h3>
            <slot name="title"></slot>
            <p v-if="!hasSubTitle" class="text-dark9 font-09">{{subTitle}}</p>
            <slot></slot>
        </div>
    </div>
    <ku-line v-if="!nl" />
</div>
</template>

<script>
export default {
    name: 'CardR',
    props: {
        poster: String,
        title: [Number, String, Object],
        subTitle: [Number, String],
        bigIMG: {
            type: Boolean,
            default: true
        },
        nl: {
            type: Boolean,
            default: false
        },

    },
    data() {
        return {
            currentValue: this.value
        }
    },
    computed: {
        hasIMG: function () {
            return !!this.$slots['img']
        },
        hasTitle: function () {
            return !!this.$slots['title']
        },
        hasSubTitle: function () {
            return !!this.$slots.default
        },
    },
    methods: {}
}
</script>

<style lang="scss" scoped>
.card-container {

    .img-left {
        object-fit: cover;
        max-height: 10rem;
        width: 13vw;
        height: 13vw;
        border-radius: 0.3rem;
    }

    .big-img .img-left {
        width: 30vw;
        height: 24vw;
        max-width: 11rem;
        max-height: 8rem;
        border-radius: unset
    }
}
</style>
