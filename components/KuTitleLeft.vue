<template>
<h2 class="card-title font-13" :class="{'card-title-bar-blue':blue}">
    <slot></slot>
</h2>
</template>

<script>
export default {
    props: {
        blue: {
            type: Boolean,
            default: false
        }        
    },
}
</script>

<style lang="scss" scoped>
.card-title {
    color: #282828;
    padding-bottom: 5px;
    display: flex;
    align-items: center;

    &::before {
        content: '';
        width: 5px;
        height: 1.2rem;
        background-color: red;
        top: 0.2rem;
        margin-right: 0.4rem;
        border-radius: 10px;
    }
}

.card-title-bar-blue::before {
    background-color: #0060B0;
}
</style>
