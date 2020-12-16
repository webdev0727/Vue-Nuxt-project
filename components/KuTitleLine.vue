<template>
<div class="py-1 mt-2 ku-title-line" @click="handleC">
    <h3 :style="active ? '' : 'font-size: 1rem;'">
        <slot></slot>
    </h3>
    <div class="under-line-bar" :class="{active: active}" style="`width:${width}`"></div>
</div>
</template>

<script>
export default {
    props: {
        width: {
            type: String,
            default: '2rem'
        },
        active: {
            type: Boolean,
            default: true
        }
    },
    methods:{
        handleC(){
            this.$emit('click')
        }
    }
}
</script>

<style lang="scss" scoped>
@import "@/assets/scss/config/_variables.scss";
.ku-title-line{
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    white-space: nowrap;
}
.under-line-bar {
    height: 4px;
    width: 2rem;
    background: transparent;
    &.active{        
        background: $red;
    }
}
</style>
