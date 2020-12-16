<template>
<div>
    <div class="d-flex py-2" :class="{'big-img': bigIMG}">
        <div class="mr-2 img-container1" :class="buildClass" :style="`background-image: url(${poster})`" @click="handleClickImg">
            <img v-if="showPlayIcon" src="/icons/player_icon.png" alt="" class="play-icon">
        </div>
        <div class="d-flex flex-column justify-content-between flex-1">
            <h4 v-if="!hasTitle" :class="bigIMG ? 'text-line-2' : 'text-line-1'" @click="handleClickImg">{{title}}</h4>
            <p v-if="!hasSubTitle" class="text-dark9 font-09" @click="handleClickImg">{{subTitle}}</p>
            <slot name="title"></slot>
            <slot name="subTitle"></slot>
        </div>
        <div v-if="showBtnDel" class="d-flex align-items-center">
            <slot name="r"></slot>
            <p class="p-2 text-dark9 font-12" @click="handleDelete"><i class="el-icon-delete"></i></p>
        </div>
    </div>
    <ku-line v-if="!nl"/>
</div>
</template>

<script>
export default {
    name: 'CardVideoR',
    props: {
        id: [Number, String],
        poster: String,
        title: [Number, String],
        subTitle: [Number, String],
        showPlayIcon: {
            type: Boolean,
            default: true
        },
        showBtnDel: {
            type: Boolean,
            default: true
        },
        bigIMG: {
            type: Boolean,
            default: true
        },
        imgCircle: {
            type: Boolean,
            default: false
        },
        nl: {
            type: Boolean,
            default: false
        },
        classImg:{
            type: String,
            default: "video-img"
        }

    },
    data() {
        return {           
        }
    },
    computed: {
        hasTitle: function () {
            return !!this.$slots['title']
        },
        hasSubTitle: function () {
            return !!this.$slots['subTitle']
        },
        buildClass: function(){
            let className= this.classImg
            if (this.imgCircle)  className += " rounded-circle"
            return className
        }
    },
    methods: {
        handleDelete() {
            this.$emit('delete', this.id)
        },
        handleClickImg() {
            this.$emit('show', { id: this.id, src: this.poster })
        },
    }
}
</script>

<style lang="scss" scoped>
.video-img {
    background-repeat: no-repeat;
    background-size: cover;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 17vw;
    max-height: 10rem;
    width: 17vw;
    min-width: 17vw;
    border-radius: 0.3rem;

    img {
        width: 3rem;
    }

    &:active {
        img {
            width: 3.5rem;
        }
    }
}

.big-img {
    .img-container1 {
        width: 30vw !important;
        min-width: 30vw !important;
        height: 24vw !important;
        border-radius: unset !important
    }
}
.img-fit {
    @extend .video-img;
    background-size: contain;    
    background-position: center;
    border: 1px solid #f9f6f6;    
}
</style>
