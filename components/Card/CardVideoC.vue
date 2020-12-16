<template>
<div>
    <div class="bg-white rounded mb-2" @click="handleClickImg">
        <div :class="classImg" :style="poster ? `background-image: url(${poster})`: ''">
            <div class="player-icon-c" v-if="showPlayIcon">
                <img src="/icons/player_icon.png" alt="">
            </div>
        </div>
        <div class="px-2 pb-2">
            <h4 v-if="title" class="text-line-1 mt-1">{{title}}</h4>
            <p v-if="subTitle" class="text-dark9 font-09">{{subTitle}}</p>
            <slot name="title"></slot>
            <slot name="subTitle"></slot>
        </div>
    </div>
</div>
</template>

<script>
export default {
    name: 'CardVideoC',
    props: {
        id: [Number, String],
        poster: String,
        title: [Number, String],
        subTitle: [Number, String],
        showPlayIcon: {
            type: Boolean,
            default: true
        },
        classImg:{
            type: String,
            default: "video-img"
        }
    },
    data() {
        return {
            currentValue: this.value
        }
    },
    computed: {},
    methods: {
        handleDelete() {
            this.$emit('delete', this.id)
        },
        handleClickImg() {
            this.$emit('click', { id: this.id, src: this.poster })
        }
    }
}
</script>

<style lang="scss" scoped>

.video-img {
    background-repeat: no-repeat;
    background-size: cover;
    width: 100%; 
    height: 40vw; 
    max-height: 400px;  
    display: flex;
    justify-content: center;
    align-items: center;
    background-image: url(/images/ant404.png);
    background-position: center;
    .player-icon-c{
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.1);
        position: relative;
        img {
            width: 3rem;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
        }
    }

    &:active {
        img {
            width: 3.5rem;
        }
    }
}
.img-fit {
    @extend .video-img;
    background-size: contain;    
    background-position: center;
    border: 1px solid #f9f6f6;    
}

</style>
